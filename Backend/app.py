from fastapi import FastAPI, File, UploadFile, Form
from PIL import Image
import torch
import io
from torchvision import transforms
from transformers import AutoTokenizer

from model import CLIPModel

app = FastAPI()

device = "cpu"

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

# Load model
model = CLIPModel()
model.load_state_dict(torch.load("best_model.pt", map_location=device))
model.eval()

# Image transform (SAME as training)
image_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5,0.5,0.5],
        std=[0.5,0.5,0.5]
    )
])

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

@app.post("/predict")
async def predict(file: UploadFile = File(...), text: str = Form(...)):

    # Load image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    image = image_transform(image).unsqueeze(0)

    # Tokenize text
    tokens = tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=32,
        return_tensors="pt"
    )

    input_ids = tokens["input_ids"]
    attention_mask = tokens["attention_mask"]

    with torch.no_grad():
        img_emb = model.encode_image(image)
        txt_emb = model.encode_text(input_ids, attention_mask)

        similarity = (img_emb @ txt_emb.T).item()
        confidence = (similarity + 1) / 2 * 100

    return {
        "similarity_score": similarity,
        "confidence": f"{confidence:.2f}%"
    }