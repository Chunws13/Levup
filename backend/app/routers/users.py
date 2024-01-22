from fastapi import APIRouter, HTTPException, Header
from typing import Union, Annotated
from models.users import User_Login, User_Create
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.json_util import dumps
from auth.login_auth import User_Auth
import certifi, hashlib, datetime, jwt, os, json

router = APIRouter(prefix = "/api/users", tags=["users"])
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

ca = certifi.where()
client = MongoClient(os.environ["db_address"], tlsCAFile=ca)
db = client.chunws

@router.post("/signup")
def signup(Users: User_Create):
    id, email, password = Users.id, Users.email, Users.password

    check_duplication = db.users.find_one({"id" : id})
    if check_duplication:
        raise HTTPException(status_code = 404, detail = "이미 존재하는 ID 입니다.")
    
    hash_pw = hashlib.sha256(password.encode("utf-8")).hexdigest()
    user_info = {
        "id" : id,
        "email" : email,
        "password" : hash_pw,
        "level": 1,
        "exp": 0,
        "like": 0,
        "board": 0,
        "point" : 0,
        "mission_start": 0,
        "mission_complete": 0
    }
    
    db.users.insert_one(user_info)
    return {"status": True, "data": "회원가입 성공"}

@router.post("/login")
def login(Users: User_Login):
    id, password = Users.id, Users.password
    hash_pw = hashlib.sha256(password.encode("utf-8")).hexdigest()
    
    find_id = db.users.find_one({"id": id})
    if find_id is None or find_id['password'] != hash_pw:
        raise HTTPException(status_code=404, detail="아이디 또는 비밀번호를 확인하세요")
    
    payload = {"id" : id, "exp" : datetime.datetime.now() + datetime.timedelta(minutes=30)}
    
    token = jwt.encode(payload, "1234", algorithm="HS256")
    return {"status" : True , "token" : token}

@router.get("/")
def get_user_info(Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    
    if result["status"]:
        try:
            user_info = db.users.find_one({"id": result["data"]})
            return {"data" : json.loads(dumps(user_info))}
        
        except:
            return HTTPException(status_code=404, detail="예기치 못한 오류가 발생했습니다.")
        
    else:
        return HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")
