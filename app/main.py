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

# for getting all the posts
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


# for inserting the post
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

# for updating the post
# Pydantic Model for Update Post Request
class UpdatePostRequest(BaseModel):
    id: str
    title: str
    content: str

# Pydantic Model for Update Post Response
class UpdatePostResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str


@app.post("/update_post", response_model=UpdatePostResponse)
async def update_post(request: UpdatePostRequest):
    """
    Updates an existing post in the Posts table via Hasura GraphQL API.
    """
    async with httpx.AsyncClient() as client:
        try:
            # GraphQL mutation query to update a post
            graphql_mutation = {
                "query": """
                    mutation UpdatePost($id: uuid!, $title: String!, $content: String!) {
                        update_Posts_by_pk(
                            pk_columns: { id: $id },
                            _set: { title: $title, content: $content }
                        ) {
                            id
                            title
                            content
                            author_id
                        }
                    }
                """,
                "variables": {
                    "id": request.id,
                    "title": request.title,
                    "content": request.content
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
                    detail=f"Failed to update post: {response.json().get('errors')}"
                )

            # Extract the updated post data
            data = response.json()["data"]["update_Posts_by_pk"]

            # Return the response
            return UpdatePostResponse(
                id=data["id"],
                title=data["title"],
                content=data["content"],
                author_id=data["author_id"]
            )

        except Exception as e:
            # Handle unexpected errors
            raise HTTPException(status_code=500, detail=str(e))

from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
import httpx

app = FastAPI()
NHOST_GRAPHQL_URL = "https://cpvalekhjrcimaqjmszy.hasura.ap-south-1.nhost.run/v1/graphql"
ADMIN_SECRET = ":BnVkUT*tM+7KTAi274cLGuJtBbNgTvx"

# Pydantic Model for Update Post Request
class UpdatePostRequest(BaseModel):
    id: str
    title: str
    content: str

# Pydantic Model for Update Post Response
class UpdatePostResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str

@app.post("/update_post", response_model=UpdatePostResponse)
async def update_post(request: UpdatePostRequest):
    """
    Updates an existing post in the Posts table via Hasura GraphQL API.
    """
    async with httpx.AsyncClient() as client:
        try:
            # GraphQL mutation query to update a post
            graphql_mutation = {
                "query": """
                    mutation UpdatePost($id: uuid!, $title: String!, $content: String!) {
                        update_Posts_by_pk(
                            pk_columns: { id: $id },
                            _set: { title: $title, content: $content }
                        ) {
                            id
                            title
                            content
                            author_id
                        }
                    }
                """,
                "variables": {
                    "id": request.id,
                    "title": request.title,
                    "content": request.content
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
                    detail=f"Failed to update post: {response.json().get('errors')}"
                )

            # Extract the updated post data
            data = response.json()["data"]["update_Posts_by_pk"]

            # Return the response
            return UpdatePostResponse(
                id=data["id"],
                title=data["title"],
                content=data["content"],
                author_id=data["author_id"]
            )

        except Exception as e:
            # Handle unexpected errors
            raise HTTPException(status_code=500, detail=str(e))

# Pydantic Model for Delete Post Request
class DeletePostRequest(BaseModel):
    id: str

# Pydantic Model for Delete Post Response
class DeletePostResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str

@app.delete("/delete_post", response_model=DeletePostResponse)
async def delete_post(request: DeletePostRequest):
    """
    Deletes an existing post in the Posts table via Hasura GraphQL API.
    """
    async with httpx.AsyncClient() as client:
        try:
            # GraphQL mutation query to delete a post
            graphql_mutation = {
                "query": """
                    mutation DeletePost($id: uuid!) {
                        delete_Posts_by_pk(id: $id) {
                            id
                            title
                            content
                            author_id
                        }
                    }
                """,
                "variables": {
                    "id": request.id
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
                    detail=f"Failed to delete post: {response.json().get('errors')}"
                )

            # Extract the deleted post data
            data = response.json()["data"]["delete_Posts_by_pk"]

            # Return the response
            return DeletePostResponse(
                id=data["id"],
                title=data["title"],
                content=data["content"],
                author_id=data["author_id"]
            )

        except Exception as e:
            # Handle unexpected errors
            raise HTTPException(status_code=500, detail=str(e))



# Pydantic Model for Get Post By ID Request
class GetPostByIdRequest(BaseModel):
    id: str

# Pydantic Model for Get Post By ID Response
class GetPostByIdResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str

@app.get("/get_post_by_id", response_model=GetPostByIdResponse)
async def get_post_by_id(request: GetPostByIdRequest):
    """
    Retrieves a specific post by its ID via Hasura GraphQL API.
    """
    async with httpx.AsyncClient() as client:
        try:
            # GraphQL query to get a post by ID
            graphql_query = {
                "query": """
                    query GetPostById($id: uuid!) {
                        Posts_by_pk(id: $id) {
                            id
                            title
                            content
                            author_id
                        }
                    }
                """,
                "variables": {
                    "id": request.id
                }
            }

            # Set up headers
            headers = {
                "x-hasura-admin-secret": ADMIN_SECRET,
                "Content-Type": "application/json"
            }

            # Send POST request to Hasura GraphQL endpoint
            response = await client.post(NHOST_GRAPHQL_URL, json=graphql_query, headers=headers)

            # Handle response errors
            if response.status_code != 200 or "errors" in response.json():
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to retrieve post: {response.json().get('errors')}"
                )

            # Extract the retrieved post data
            data = response.json()["data"]["Posts_by_pk"]

            # Return the response
            return GetPostByIdResponse(
                id=data["id"],
                title=data["title"],
                content=data["content"],
                author_id=data["author_id"]
            )

        except Exception as e:
            # Handle unexpected errors
            raise HTTPException(status_code=500, detail=str(e))

