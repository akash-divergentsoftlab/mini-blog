import requests
from fastapi import FastAPI

app = FastAPI()
NHOST_GRAPHQL_URL = "https://cpvalekhjrcimaqmszy.nhost.run/v1/graphql"

@app.get("/posts")
async def get_posts():
    query = {
        "query": "query { posts { id title content } }"
    }
    response = requests.post(NHOST_GRAPHQL_URL, json=query)
    return response.json()
