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


@app.post("/insert_post", response_model=InsertPostResponse)
async def insert_post(request: InsertPostRequest):
    """
    Inserts a new post into the Posts table via Hasura GraphQL API.
    """
    async with httpx.AsyncClient() as client:
        try:
            # GraphQL mutation query to insert a post
            graphql_mutation = {
                "query": """
                    mutation InsertPost($title: String!, $content: String!, $author_id: uuid!) {
                        insert_Posts_one(object: { title: $title, content: $content, author_id: $author_id }) {
                            id
                            title
                            content
                            author_id
                        }
                    }
                """,
                "variables": {
                    "title": request.title,
                    "content": request.content,
                    "author_id": request.author_id
                }
            }

            # Set up headers
            headers = {
                "x-hasura-admin-secret": ADMIN_SECRET,
                "Content-Type": "application/json"
            }

            # Send POST request to Hasura GraphQL endpoint
            response = await client.post(NHOST_GRAPHQL_URL, json=graphql_mutation, headers=headers)

            # Handle response errors
            if response.status_code != 200 or "errors" in response.json():
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to insert post: {response.json().get('errors')}"
                )

            # Extract the inserted post data
            data = response.json()["data"]["insert_Posts_one"]

            # Return the response
            return InsertPostResponse(
                id=data["id"],
                title=data["title"],
                content=data["content"],
                author_id=data["author_id"]
            )

        except Exception as e:
            # Handle unexpected errors
            raise HTTPException(status_code=500, detail=str(e))