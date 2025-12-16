from cohere import Client
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os

load_dotenv()
cohere_api_key = os.getenv("COHERE_API_KEY")
qdrant_api_key = os.getenv("QDRANT_API_KEY")
cohere_client = Client(cohere_api_key)


# Connect to Qdrant
qdrant = QdrantClient(
    url="https://0be15939-2f39-4ed6-8b02-a4230bf16349.us-east4-0.gcp.cloud.qdrant.io",
    api_key=qdrant_api_key
)

def get_embedding(text):
    """Get embedding vector from Cohere Embed v3"""
    response = cohere_client.embed(
        model="embed-english-v3.0",
        input_type="search_query",  # Use search_query for queries
        texts=[text],
    )
    return response.embeddings[0]  # Return the first embedding
