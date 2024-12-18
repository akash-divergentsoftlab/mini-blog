from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Define the request schema
class GetUserRequest(BaseModel):
    user_id: str

# Define the response schema
class UserResponse(BaseModel):
    user_id: str
    message: str

@router.post("/get-user-data")
async def get_user_data(payload: GetUserRequest):
    try:
        # Simulate fetching user data (replace with actual DB or logic)
        user_data = {
            "user_id": payload.user_id,
            "message": "Successfully retrieved user data from FastAPI."
        }
        return UserResponse(**user_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
