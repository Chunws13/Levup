from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import jwt, hashlib, datetime, certifi

from routers import memo
from routers import users

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(memo.router)
app.include_router(users.router)

@app.get("/")
def home():
    return {"Hello" : "World"}
