from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from PIL import Image
import torch
import io
import os

from torchvision import transforms
from transformers import AutoTokenizer

from model import CLIPModel
from retrieval import load_or_create_embeddings
from captions import load_or_create_text_embeddings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="images"), name="images")

device = "cpu"

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

model = CLIPModel()
model.load_state_dict(torch.load("best_model.pt", map_location=device))
model.eval()

IMAGE_FOLDER = "images"

print("Preparing embeddings...")
image_embeddings, image_paths = load_or_create_embeddings(model, IMAGE_FOLDER)
print("Ready!")

image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5, 0.5, 0.5],
        std=[0.5, 0.5, 0.5]
    )
])

CAPTIONS_FILE = "captions.txt"

print("Preparing text embeddings...")
text_embeddings, captions_list = load_or_create_text_embeddings(
    model, tokenizer, CAPTIONS_FILE
)
print("Text embeddings ready!")

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}


@app.post("/predict")
async def predict(file: UploadFile = File(...), text: str = Form(...)):

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image_transform(image).unsqueeze(0)

    tokens = tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=32,
        return_tensors="pt"
    )

    with torch.no_grad():
        img_emb = model.encode_image(image)
        txt_emb = model.encode_text(
            tokens["input_ids"],
            tokens["attention_mask"]
        )

        similarity = (img_emb @ txt_emb.T).item()
        confidence = (similarity + 1) / 2 * 100

    return {
        "similarity_score": similarity,
        "confidence": f"{confidence:.2f}%"
    }


@app.post("/text-to-image")
async def text_to_image(text: str = Form(...)):

    tokens = tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=32,
        return_tensors="pt"
    )

    with torch.no_grad():
        txt_emb = model.encode_text(
            tokens["input_ids"],
            tokens["attention_mask"]
        )

        sims = image_embeddings @ txt_emb.T
        topk = sims.squeeze().topk(3).indices

    results = []

    for idx in topk:
        filename = image_paths[idx]
        results.append(f"/images/{filename}")

    return {
        "images": results
    }

@app.post("/image-to-text")
async def image_to_text(file: UploadFile = File(...)):

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    image = image_transform(image).unsqueeze(0)

    with torch.no_grad():
        img_emb = model.encode_image(image)

        sims = text_embeddings @ img_emb.T
        topk = sims.squeeze().topk(3).indices

    results = []

    for idx in topk:
        results.append(captions_list[idx])

    return {
        "captions": results
    }