from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import jwt, hashlib, datetime

app = FastAPI()
db = {}

class Users(BaseModel):
    id : str
    email : str
    password : str

@app.get("/")
def home():
    return {"Hello" : "World"}

@app.post("/api/signup")
def signup(Users: Users):
    id, email, password = Users.id, Users.email, Users.password
    
    if id in db:
        return {"error" : "이미 존재하는 ID입니다."}
    
    hash_pw = hashlib.sha256(password.encode("utf-8")).hexdigest()
    db[id] = {"email": email, "password": hash_pw}
    return db

@app.post("/api/login")
def login(Users: Users):
    id, email, password = Users.id, Users.email, Users.password
    
    hash_pw = hashlib.sha256(password.encode("utf-8")).hexdigest()
    
    if id not in db or db[id]["password"] != hash_pw:
        return {"error" : "아이디 혹은 비밀번호를 확인해주세요"}
    
    payload = {"id" : id,
               "exp" : datetime.datetime.now() + datetime.timedelta(minutes=30)}
    
    token = jwt.encode(payload, "1234", algorithm="HS256")
    return {"success" : "로그인 성공", "token" : token}