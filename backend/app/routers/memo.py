from fastapi import APIRouter, Header
from typing import Union, Annotated
from models.memo import Memo
from auth.login_auth import User_Auth
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from dotenv import load_dotenv
import certifi, hashlib, datetime, jwt, json, os

router = APIRouter(prefix = "/api/memo", tags = ["memo"])
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))


ca = certifi.where()
client = MongoClient(os.environ["db_address"], tlsCAFile=ca)
db = client.chunws

@router.get("/")
def get_memo(Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    if result["status"] == "success":
        writer = result["data"]
        memo = list(db.memo.find({"writer" : writer}, {"_id" : True, "content" : True}))
        return {"data" :  json.loads(dumps(memo))}
    
    else:
        message = result["data"]
        return message

@router.post("/")
def create_memo(Memo: Memo, Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()

    if result["status"] == "success":
        writer = result["data"]
        content = Memo.content
        
        memo_data = {"writer" : writer, "content": content}
        db.memo.insert_one(memo_data)
        test_memo = db.memo.find_one({"writer" :writer})
        
        return {"status" : "success", "data" : "저장되었습니다."}
    
    else:
        return result["data"]
    
@router.put("/{memo_id}")
def edit_memo(memo_id: str, Memo: Memo, Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    
    if result["status"] == "success":
        target_id = ObjectId(memo_id)
        if db.memo.find_one({"_id": target_id}) == None:
            return {"status": "fail", "data" : "메모가 없습니다."}
        
        try:
            db.memo.update_one({"_id" : target_id}, {"$set" : { "content" : Memo.content }})
            return {"status" : "success", "data" : "수정되었습니다."}
        
        except:
            return {"status" : "fail", "data" : "수정 실패했습니다."}
    
    else:
        return result["data"]

@router.delete("/{memo_id}")
def delete_memo(memo_id: str, Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    
    if result["status"] == "success":
        target_id = ObjectId(memo_id)
        if db.memo.find_one({"_id": target_id}) == None:
            return {"status": "fail", "data" : "메모가 없습니다."}
        
        try:
            db.memo.delete_one({"_id" : target_id})
            return {"status" : "success", "data" : "삭제되었습니다."}
        
        except:
            return {"status" : "fail", "data" : "삭제 실패했습니다."}
    
    else:
        return result["data"]