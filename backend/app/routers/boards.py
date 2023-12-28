from fastapi import Depends, HTTPException, APIRouter, Header
from typing import Union, Annotated
from sqlalchemy.orm import Session
from sql_app import crud, models, schemas
from sql_app.database import SessionLocal, engine
from auth.login_auth import User_Auth
from dotenv import load_dotenv
import os

models.Base.metadata.create_all(bind=engine)
router = APIRouter(prefix="/api/board", tags=["boards"])
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

def get_db():
    db = SessionLocal()
    try:
        yield db
        
    finally:
        db.close()

@router.get("/")
async def get_all_board(db: Session = Depends(get_db)):
    return crud.get_all_board(db = db)

@router.get("/{board_id}")
async def get_board(board_id: int, db: Session = Depends(get_db)):
    return crud.get_board(db = db, board_id = board_id)

@router.post("/create")
async def create_board(board: schemas.Create_Board, db: Session = Depends(get_db)):
    return crud.create_board(db = db, board = board)

@router.delete("/{board_id}")
async def delete_board(board_id: int, db: Session = Depends(get_db)):
    return crud.delete_board(db = db, board_id = board_id)

@router.post("/{board_id}/like")
async def like_board(board_id: int, db: Session = Depends(get_db), Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    if result["status"] == "success":
        # try:
            return crud.like_board(db = db, board_id = board_id, like_user = result["data"])
        
        # except:
        #     raise HTTPException(status_code=404, detail="오류 발생")
        
    
    else:
        raise HTTPException(status_code=404, detail=result["data"])
    

@router.post("/{board_id}/comment")
async def create_comment(comment : schemas.Create_Comment, board_id: int, db: Session = Depends(get_db)):
    return crud.create_comment(db = db, comment = comment, board_id = board_id)
