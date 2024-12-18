import requests
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from jose import jwt, JWTError
import httpx


app = FastAPI()
NHOST_GRAPHQL_URL = "https://cpvalekhjrcimaqjmszy.hasura.ap-south-1.nhost.run/v1/graphql"
ADMIN_SECRET = ":BnVkUT*tM+7KTAi274cLGuJtBbNgTvx"


NHOST_AUTH_URL = "https://cpvalekhjrcimaqjmszy.hasura.ap-south-1.nhost.run/v1/auth/signin/email-password"


@app.get("/users")
async def get_posts():
    query = {
        "query": "query { User { Id } }"
    }
    headers = {
        "x-hasura-admin-secret": ADMIN_SECRET,
        "Content-Type": "application/json"
    }
    response = requests.post(NHOST_GRAPHQL_URL, json=query, headers=headers)
    return response.json()


@app.get("/posts")
async def get_posts():
    query = {
        "query": "query { Posts { id title content author_id } }"
    }
    headers = {
        "x-hasura-admin-secret": ADMIN_SECRET,
        "Content-Type": "application/json"
    }
    response = requests.post(NHOST_GRAPHQL_URL, json=query, headers=headers)
    return response.json()

# Pydantic Model for Insert Post Request
class InsertPostRequest(BaseModel):
    title: str
    content: str
    author_id: str

# Pydantic Model for Insert Post Response
class InsertPostResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str
    created_at: str
    updated_at: str

class InsertPostResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str
    created_at: str
    updated_at: str
