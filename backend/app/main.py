from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import memo, users, boards

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

board_image_directory = os.path.join(os.getcwd(), "images/boards")
profile_image_directory = os.path.join(os.getcwd(), "images/users")
app.mount("/images/boards", StaticFiles(directory=board_image_directory), name="board photo file directory")
app.mount("/images/users", StaticFiles(directory=profile_image_directory), name="user profile directory")

app.include_router(memo.router)
app.include_router(users.router)
app.include_router(boards.router)

@app.get("/")
def home():
    return {"Hello" : "World"}
