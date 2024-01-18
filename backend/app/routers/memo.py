from fastapi import APIRouter, Header, HTTPException
from typing import Union, Annotated
from models.memo import Memo, Edit_Memo
from auth.login_auth import User_Auth
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from dotenv import load_dotenv
import certifi, datetime, json, os

router = APIRouter(prefix = "/api/memo", tags = ["memo"])
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

ca = certifi.where()
client = MongoClient(os.environ["db_address"], tlsCAFile=ca)
db = client.chunws

@router.get("/calendar")
def get_all_memo(year: int, month: int, Authorization : Annotated[Union[str, None], Header()] = None):
    start_date = datetime.datetime(year, month, 1)
    end_date = start_date + datetime.timedelta(days=31)
    
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    
    if result["status"]:
        writer = result["data"]
        
        memo = list(db.memo.find({"writer" : writer,
                                  "created_date" : {
                                      "$gte": start_date,
                                      "$lte": end_date }
                                  }))
        
        return {"data" :  json.loads(dumps(memo))}
        
    else:
        raise HTTPException(status_code=404, detail=result["data"])

@router.get("/")
def get_memo(year: int, month: int, day: int,  Authorization : Annotated[Union[str, None], Header()] = None):
    start_date = datetime.datetime(year, month, day)
    end_date = datetime.datetime(year, month, day, 23, 59, 59)
    
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    
    if result["status"]:
        writer = result["data"]
        memo = list(db.memo.find({"writer" : writer,
                                  "created_date" : {
                                      "$gte": start_date,
                                      "$lte": end_date }
                                  }))
        return {"data" :  json.loads(dumps(memo))}
        
    else:
        raise HTTPException(status_code=404, detail=result["data"])

@router.post("/")
def create_memo(Memo: Memo, Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()

    if result["status"]:
        writer = result["data"]
        content = Memo.content
        
        memo_data = {"writer" : writer, "content": content, 
                     "created_date": datetime.datetime(Memo.year, Memo.month, Memo.day),
                     "complete_status" : False, "complete_time": None, "admit_status": False}
        
        db.memo.insert_one(memo_data)

        user = db.users.find_one({"id": writer})
        db.users.update_one({"id": writer}, {"$set": {
            "mission_start": user["mission_start"] + 1,
            "exp": user["exp"] + 10}})

        return {"status" : "success", "data" : "저장되었습니다."}
    
    else:
        raise HTTPException(status_code=404, detail=result["data"])
    
@router.put("/{memo_id}")
def edit_memo(memo_id: str, Memo: Edit_Memo, Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    
    if result["status"]:
        target_id = ObjectId(memo_id)
        if db.memo.find_one({"_id": target_id}) == None:
            raise HTTPException(status_code=404, detail="메모가 없습니다")
        
        try:
            db.memo.update_one({"_id" : target_id}, {"$set" : { "content" : Memo.content }})
            return {"status" : "success", "data" : "수정되었습니다."}
        
        except:
            return {"status" : "fail", "data" : "수정 실패했습니다."}
    
    else:
        raise HTTPException(status_code=404, detail=result["data"])

@router.delete("/{memo_id}")
def delete_memo(memo_id: str, Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    
    if result["status"]:
        target_id = ObjectId(memo_id)
        if db.memo.find_one({"_id": target_id}) == None:
            return HTTPException(status_code=404, detail="메모가 없습니다.")
        
        try:
            db.memo.update_one({"_id" : target_id}, {"$set" : {"complete_status": True,
                                                               "complete_date": datetime.datetime.now()}})
            
            user = db.users.find_one({"id": result["data"]})
            db.users.update_one({"id": result["data"]}, {"$set": {"mission_complete": user["mission_complete"] + 1,
                                                                  "point": user["point"] + 100 }})

            return {"status" : "success", "data" : "삭제되었습니다."}
        
        except:
            return {"status" : "fail", "data" : "삭제 실패했습니다."}
    
    else:
        raise HTTPException(status_code=404, detail=result["data"])