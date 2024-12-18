from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Pydantic model to validate the request payload from Hasura
class GetUserDataInput(BaseModel):
    user_id: str

@router.post("/get-user-data")
async def get_user_data(input: GetUserDataInput):
    try:
        # Simulate fetching user data (replace this logic with your own)
        user_id = input.user_id
        fake_user_data = {
            "123e4567-e89b-12d3-a456-426614174000": {
                "user_id": user_id,
                "message": "User data fetched successfully!"
            }
        }

        # Return the response matching Hasura's Action expectation
        if user_id in fake_user_data:
            return fake_user_data[user_id]
        else:
            raise HTTPException(status_code=404, detail="User not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
