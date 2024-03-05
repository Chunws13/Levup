from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routers import memo, users, boards, reports

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
app.include_router(boards.router)
app.include_router(reports.router)

@app.get("/")
def home():
    return {"Hello" : "World"}

@app.get("/check")
def healthcehck():
    return {"success": "연결 중"}

if __name__ == "__main__":
    uvicorn.run(app, port=8000, reload=True)