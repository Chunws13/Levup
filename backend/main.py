from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import jwt, hashlib, datetime, certifi, jsonify

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ca = certifi.where()
client = MongoClient("mongodb+srv://chunws:<password>@chunws.w8zkw9b.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)
db = client.chunws
memo_db = {}

class Users(BaseModel):
    id : str
    email : str
    password : str

class Memo(BaseModel):
    content : str

@app.get("/")
def home():
    return {"Hello" : "World"}

@app.post("/api/signup")
def signup(Users: Users):
    id, email, password = Users.id, Users.email, Users.password

    check_duplication = db.users.find_one({"id" : id})
    
    if check_duplication:
        return {"error" : "이미 존재하는 ID입니다."}
    
    hash_pw = hashlib.sha256(password.encode("utf-8")).hexdigest()
    user_info = {
        "id" : id,
        "email" : email,
        "password" : hash_pw
    }
    
    db.users.insert_one(user_info)
    return db.users

@app.post("/api/login")
def login(Users: Users):
    id, password = Users.id, Users.password
    hash_pw = hashlib.sha256(password.encode("utf-8")).hexdigest()
    
    find_id = db.users.find_one({"id": id})
    if find_id is None or find_id['password'] != hash_pw:
        return {"error" : "아이디 혹은 비밀번호를 확인해주세요"}
    
    payload = {"id" : id,
               "exp" : datetime.datetime.now() + datetime.timedelta(minutes=30)}
    
    token = jwt.encode(payload, "1234", algorithm="HS256")
    return {"success" : "로그인 성공", "token" : token}

@app.get("/api/memo")
def get_memo():
    return memo_db

@app.post("/api/memo")
def create_memo(Memo: Memo):
    index = len(memo_db) + 1
    memo_db[index] = Memo.content
    return {index : memo_db[index]}

@app.put("/api/memo/{memo_id}")
def edit_memo(memo_id: int, Memo: Memo):
    if memo_id not in memo_db:
        return {"error" : "메모 정보가 없습니다."}
    
    memo_db[memo_id] = Memo.content
    return {memo_id : memo_db[memo_id]}

@app.delete("/api/memo/{memo_id}")
def delete_memo(memo_id: int):
    if memo_id not in memo_db:
        return {"error" : "메모 정보가 없습니다."}
    
    memo_db[memo_id] = "삭제됨"
    return memo_db