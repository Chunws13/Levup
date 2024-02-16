from fastapi import APIRouter, HTTPException, Header, UploadFile
from typing import Union, Annotated
from models.users import User_Login, User_Create
from bson.json_util import dumps
from auth.login_auth import User_Auth
from connections.mongodb import MongodbConntect
from connections.aws_s3 import aws_s3_connection
import hashlib, datetime, jwt, os, json, io

router = APIRouter(prefix = "/api/users", tags=["users"])
S3 = aws_s3_connection()
db = MongodbConntect("chunws")

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
        "profile": False,
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
            raise HTTPException(status_code=404, detail="예기치 못한 오류가 발생했습니다.")
        
    else:
        raise HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")

@router.get('/profile')
def get_user_profile(user_name: str):
    try:
        user = db.users.find_one({"id": user_name})
        
        return {"data": user["profile"] }
    
    except:
        return {"data": False}
        

@router.post("/profile")
async def change_profile(profile: UploadFile, Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    filename, extension = os.path.splitext(profile.filename)
    
    if extension.lower() not in [".jpeg", ".jpg", ".png"]:
        raise HTTPException(status_code = 422, detail= "지원하지 않는 이미지 형식입니다.")
        
    if result["status"]:
        try:
            profile_image = await profile.read()
            convert_image = io.BytesIO(profile_image)
            save_name = "{filename}{extension}".format(filename=result["data"], extension=extension)
            
            # 기존에 등록된 이미지 삭제
            user_profile = db.users.find_one({"id" : result["data"]})["profile"]            
            S3.delete_object(Bucket="levupbucket", Key = "users/{}".format(user_profile))
            
            db.users.update_one({"id": result["data"]},
                                {"$set": {"profile": save_name}},
                                upsert = True)

            # 신규 이미지 등록
            S3.upload_fileobj(convert_image, "levupbucket", "users/" + save_name, ExtraArgs={"ContentType": profile.content_type})
            return {"filename": save_name}
        
        except:
            raise HTTPException(status_code=404, detail="예상하지 못한 오류가 발생했습니다.")
    else:
        raise HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")

@router.delete("/profile")
def delete_profile(Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    
    if result["status"]:
        try:
            user_profile = db.users.find_one({"id" : result["daviewerta"]})["profile"]
            
            db.users.update_one({"id": result["data"]},
                                {"$set": {"profile": False}},
                                upsert = True)
            
            S3.delete_object(Bucket="levupbucket", Key = "users/" + user_profile)
            
            return {"status": 200, "detail": "프로필 삭제 성공"}

        except:
            raise HTTPException(status_code=404, detail="서버 에러")
    else:
        raise HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")
