import os
import torch
import pickle
from PIL import Image
from torchvision import transforms
from tqdm import tqdm

# SAME transform as training
image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5, 0.5, 0.5],
        std=[0.5, 0.5, 0.5]
    )
])


def compute_embeddings(model, image_folder):
    model.eval()

    image_embeddings = []
    image_paths = []

    for img_name in tqdm(os.listdir(image_folder)):
        try:
            path = os.path.join(image_folder, img_name)

            image = Image.open(path).convert("RGB")
            image = image_transform(image).unsqueeze(0)

            with torch.no_grad():
                emb = model.encode_image(image)

            image_embeddings.append(emb)
            image_paths.append(img_name)  # only filename (IMPORTANT)

        except:
            continue

    image_embeddings = torch.cat(image_embeddings)

    return image_embeddings, image_paths


def load_or_create_embeddings(model, image_folder):

    if os.path.exists("embeddings.pkl"):
        print("Loading cached embeddings...")
        with open("embeddings.pkl", "rb") as f:
            data = pickle.load(f)
        return data["embeddings"], data["paths"]

    print("Computing embeddings (first time only)...")
    embeddings, paths = compute_embeddings(model, image_folder)

    with open("embeddings.pkl", "wb") as f:
        pickle.dump({
            "embeddings": embeddings,
            "paths": paths
        }, f)

    print("Embeddings saved")

    return embeddings, paths