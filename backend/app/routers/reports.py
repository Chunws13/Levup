from fastapi import APIRouter, Header, HTTPException, Form
from typing import Union, Annotated
from auth.login_auth import User_Auth
from models.reports import Create_Report
from connections.mongodb import MongodbConntect
from bson.json_util import dumps
import json, datetime

router = APIRouter(prefix="/api/reports", tags=["reports"])
db = MongodbConntect("chunws")

@router.get("/")
def get_all_report(Authorization : Annotated[Union[str, None], Header()] = None):
    result = User_Auth(Authorization).check_auth()
    
    if result["status"]:
        reports_data = db.reports.find().sort("id", -1)
        return {"data": json.loads(dumps(reports_data))}
    
    else:
        raise HTTPException(status_code=404, detail=result["data"])

@router.post("/")
def get_all_report(Content: Create_Report, Authorization : Annotated[Union[str, None], Header()] = None):
    result = User_Auth(Authorization).check_auth()
    
    if result["status"]:
        report_content = {
            "writer": result["data"],
            "title": Content.title,
            "content": Content.content,
            "reported_date": datetime.datetime.now()
        }
        
        db.reports.insert_one(report_content)
        return {"data" : json.loads(dumps(report_content))}
    
    else:
        raise HTTPException(status_code=404, detail=result["data"])

