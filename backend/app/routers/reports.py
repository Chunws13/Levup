from fastapi import APIRouter, Header, HTTPException
from typing import Union, Annotated
from auth.login_auth import User_Auth
from connections.mongodb import MongodbConntect

router = APIRouter(prefix="/api/reports", tags=["reports"])
db = MongodbConntect("chunws")

@router.get("/")
def get_all_report(Authorization : Annotated[Union[str, None], Header()] = None):

    result = User_Auth(Authorization).check_auth()
    
    if result["status"]:
        print(result["data"])
        return db.reports.find()
    
    else:
        raise HTTPException(status_code=404, detail=result["data"])