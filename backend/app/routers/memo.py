from fastapi import APIRouter, Header
from typing import Union, Annotated
from models.memo import Memo
from auth.login_auth import User_Auth
from pymongo import MongoClient
from bson.json_util import dumps
# from bson.objectid import ObjectId
import certifi, hashlib, datetime, jwt, json

router = APIRouter(prefix = "/api/memo", tags = ["memo"])

ca = certifi.where()
client = MongoClient("mongodb+srv://chunws:password@chunws.w8zkw9b.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)
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
        print(test_memo)
        return {"status" : "success", "data" : "저장되었습니다."}
    
    else:
        return result["data"]
# @router.put("/{memo_id}")
# def edit_memo(memo_id: int, Memo: Memo):
#     if memo_id not in memo_db:
#         return {"error" : "메모 정보가 없습니다."}
    
#     memo_db[memo_id] = Memo.content
#     return {memo_id : memo_db[memo_id]}

# @router.delete("/{memo_id}")
# def delete_memo(memo_id: int):
#     if memo_id not in memo_db:
#         return {"error" : "메모 정보가 없습니다."}
    
#     memo_db[memo_id] = "삭제됨"
#     return memo_db