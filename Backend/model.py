import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel

class CLIPModel(nn.Module):
    def __init__(self):
        super().__init__()

        self.image_encoder = AutoModel.from_pretrained(
            "google/vit-base-patch16-224"
        )

        self.text_encoder = AutoModel.from_pretrained(
            "distilbert-base-uncased"
        )

        self.image_proj = nn.Sequential(
            nn.Linear(768,768),
            nn.GELU(),
            nn.LayerNorm(768),
            nn.Linear(768,256)
        )

        self.text_proj = nn.Sequential(
            nn.Linear(768,768),
            nn.GELU(),
            nn.LayerNorm(768),
            nn.Linear(768,256)
        )

        self.logit_scale = nn.Parameter(
            torch.ones([]) * torch.log(torch.tensor(1/0.07))
        )

    def encode_image(self, image):
        outputs = self.image_encoder(pixel_values=image)
        features = outputs.last_hidden_state[:,0,:]
        embeds = self.image_proj(features)
        return F.normalize(embeds, dim=1)

    def encode_text(self, input_ids, attention_mask):
        outputs = self.text_encoder(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        features = outputs.last_hidden_state[:,0,:]
        embeds = self.text_proj(features)
        return F.normalize(embeds, dim=1)