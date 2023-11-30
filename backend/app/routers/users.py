from fastapi import APIRouter
from models.users import Users
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi, hashlib, datetime, jwt, os

router = APIRouter(prefix = "/api/users", tags=["users"])
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

ca = certifi.where()
client = MongoClient(os.environ["db_address"], tlsCAFile=ca)
db = client.chunws

@router.post("/signup")
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

@router.post("/login")
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
