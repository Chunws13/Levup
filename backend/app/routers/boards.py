from fastapi import Depends, HTTPException, APIRouter, Header, File, UploadFile
from typing import Union, Annotated, List
from sqlalchemy.orm import Session
from sql_app import crud, models, schemas
from sql_app.database import SessionLocal, engine
from auth.login_auth import User_Auth
from dotenv import load_dotenv
import os

models.Base.metadata.create_all(bind=engine)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))
Boards_DIR = os.path.join(BASE_DIR, "images/boards")

router = APIRouter(prefix="/api/boards", tags=["boards"])

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

@router.post("/auth/{memo_id}")
async def create_board(memo_id: str,
                        upload_file : UploadFile,
                        db: Session = Depends(get_db),
                        Authorization : Annotated[Union[str, None], Header()] = None):
    
    data = await upload_file.read()
    return "good"
    decoded_file_names = []
    
    try:
        for file in board.file:
            # 파일 이름을 그대로 사용하거나, 디코딩 에러가 발생하면 파일 이름을 그대로 사용
            decoded_name = file.filename
            try:
                decoded_name = file.filename.decode('utf-8')
            except UnicodeDecodeError:
                pass
            
            decoded_file_names.append(decoded_name)
    except:
        pass
    return
    login_check = User_Auth(Authorization).check_auth()
    if login_check["status"]:
        try:
            return crud.create_board(db = db, board = board, 
                                     memo_id = memo_id,
                                     writer = login_check["data"])
        
        except:
            raise HTTPException(status_code=404, detail="오류가 발생했습니다.")
    
    else:
        raise HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")

@router.put("/{board_id}")
async def edit_board(board_id: int, edit_board: schemas.Edit_Board, db: Session = Depends(get_db), Authorization : Annotated[Union[str, None], Header()] = None):
    login_check = User_Auth(Authorization).check_auth()
    if login_check["status"]:
        try:
            return crud.edit_board(db = db, edit_board = edit_board, board_id = board_id, writer = login_check["data"])
        
        except:
            raise HTTPException(status_code=404, detail=login_check["data"])
    
    else:
        raise HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")

@router.delete("/{board_id}")
async def delete_board(board_id: int, db: Session = Depends(get_db), Authorization : Annotated[Union[str, None], Header()] = None):
    login_check = User_Auth(Authorization).check_auth()
    if login_check["status"]:
        try:
            return crud.delete_board(db = db, board_id = board_id, writer = login_check["data"])
        
        except:
            return HTTPException(status_code=404, detail="오류 발생")
    
    else:
        return HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")

@router.get("/{board_id}/like")
async def like_board(board_id: int, db: Session = Depends(get_db), Authorization : Annotated[Union[str, None], Header()] = None):
    checker = User_Auth(Authorization)
    result = checker.check_auth()
    if result["status"]:
        try:
            return crud.like_board(db = db, board_id = board_id, like_user = result["data"])
        
        except:
            raise HTTPException(status_code=404, detail="오류 발생")
    
    else:
        raise HTTPException(status_code=404, detail=result["data"])
    
@router.get("/{board_id}/comment")
async def get_comment(board_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_comment(board_id = board_id, db = db)
    
    except:
        raise HTTPException(status_code=404, detail="에러가 발생했습니다.")


@router.post("/{board_id}/comment")
async def create_comment(comment : schemas.Create_Comment, board_id: int, db: Session = Depends(get_db), Authorization : Annotated[Union[str, None], Header()] = None):
    login_check = User_Auth(Authorization).check_auth()
    if login_check["status"]:
        try:
           return crud.create_comment(db = db, writer = login_check["data"], comment = comment, board_id = board_id)
       
        except:
            raise HTTPException(status_code=404, detail=login_check["data"])
    else:
        raise HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")

@router.put("/comment/{comment_id}")
async def edit_comment(edit_comment: schemas.Edit_Comment, comment_id: int, db: Session = Depends(get_db), Authorization : Annotated[Union[str, None], Header()] = None):
    login_check = User_Auth(Authorization).check_auth()
    if login_check["status"]:
        try:
           return crud.edit_comment(db = db, edit_comment = edit_comment, comment_id = comment_id, create_user = login_check["data"])
       
        except:
            raise HTTPException(status_code=404, detail=login_check["data"])
    else:
        raise HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")
    

@router.delete("/comment/{comment_id}")
async def delete_comment(comment_id: int, db: Session = Depends(get_db), Authorization : Annotated[Union[str, None], Header()] = None):
    login_check = User_Auth(Authorization).check_auth()
    if login_check["status"]:
        try:
           return crud.delete_comment(db = db, comment_id = comment_id, create_user = login_check["data"])
       
        except:
            raise HTTPException(status_code=404, detail=login_check["data"])
    else:
        raise HTTPException(status_code=404, detail="로그인이 필요한 서비스입니다.")
    
@router.post("/test")
async def test(file: UploadFile):
    data = await file.read()
    save_point = Boards_DIR + "/" + file.filename
    with open(save_point, "wb") as f:
        f.write(data)
    
    return {"file_size": len(data)}