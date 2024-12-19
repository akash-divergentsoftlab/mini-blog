import os
import stripe
import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# stripe.api_key = os.environ["STRIPE_KEY"]

stripe.api_key = "sk_test_51QXcuqP1aeDbPFiR1k9FZVQULjUYUnfWvV0YyW5nfV35cBDFve1g0WULVo955GLom3oBOvoPmOKJ6n9roPVk5Lqw000hvz7snu"

@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/success")
async def success(request: Request):
    return templates.TemplateResponse("success.html", {"request": request})

@app.get("/cancel")
async def cancel(request: Request):
    return templates.TemplateResponse("cancel.html", {"request": request})


@app.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()
    checkout_session = stripe.checkout.Session.create(
        success_url="http://localhost:8000/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="http://localhost:8000/cancel",
        payment_method_types=["card"],
        mode="subscription",
        line_items=[
            {
                "price": data["priceId"],
                "quantity": 1,
            }
        ],
    )
    return {"sessionId": checkout_session["id"]}


if __name__ == "__main__":
    uvicorn.run("app:app", reload=True)
