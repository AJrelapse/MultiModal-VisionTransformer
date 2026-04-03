import pandas as pd
import os
import torch
import pickle
from tqdm import tqdm


def load_captions(captions_file):
    records = []

    with open(captions_file, encoding="utf-8") as f:
        next(f)
        for line in f:
            img, caption = line.strip().split(",", 1)
            records.append({
                "image": img,
                "caption": caption
            })

    df = pd.DataFrame(records)
    return df


def compute_text_embeddings(model, tokenizer, df):

    model.eval()

    text_embeddings = []
    captions = []

    for caption in tqdm(df["caption"], desc="Text Embeddings"):

        tokens = tokenizer(
            caption,
            padding="max_length",
            truncation=True,
            max_length=32,
            return_tensors="pt"
        )

        with torch.no_grad():
            emb = model.encode_text(
                tokens["input_ids"],
                tokens["attention_mask"]
            )

        text_embeddings.append(emb)
        captions.append(caption)

    text_embeddings = torch.cat(text_embeddings)

    return text_embeddings, captions


def load_or_create_text_embeddings(model, tokenizer, captions_file):

    # ✅ FIX: Use absolute path (VERY IMPORTANT)
    base_dir = os.path.dirname(__file__)
    cache_path = os.path.join(base_dir, "text_embeddings.pkl")

    # ✅ Load cached embeddings if exists
    if os.path.exists(cache_path):
        print("⚡ Loading cached text embeddings...")
        with open(cache_path, "rb") as f:
            data = pickle.load(f)
        return data["embeddings"], data["captions"]

    # ⏳ Compute only once
    print("⏳ Computing text embeddings...")
    df = load_captions(captions_file)

    embeddings, captions = compute_text_embeddings(model, tokenizer, df)

    # 💾 Save to cache
    with open(cache_path, "wb") as f:
        pickle.dump({
            "embeddings": embeddings,
            "captions": captions
        }, f)

    print("✅ Text embeddings saved")

    return embeddings, captions