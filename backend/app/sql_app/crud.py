from sqlalchemy.orm import Session, joinedload
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi, jwt, json, os
from . import models, schemas

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

ca = certifi.where()
client = MongoClient(os.environ["db_address"], tlsCAFile=ca)
mongodb = client.chunws

def get_all_board(db: Session):
    return db.query(models.Board).all()

def get_board(db: Session, board_id: int): 
    return db.query(models.Board).options(joinedload(models.Board.comment)).filter(models.Board.id == board_id).first()

def create_board(db: Session, board: schemas.Create_Board):
    board_db_create = models.Board(writer = board.writer,
                                   title = board.title,
                                   content = board.content)
    
    db.add(board_db_create)
    db.commit()
    db.refresh(board_db_create)
    return {"status": True, "data" : "인증글 생성 성공"}

def edit_board(db: Session, edit_board: schemas.Edit_Board, board_id: int, create_user: str):
    origin_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if create_user != origin_board.writer:
        return {"status" : False, "message" : "권한이 없습니다."}
    
    origin_board.title = edit_board.title
    origin_board.content = edit_board.content
    origin_board.edited_datetime = edit_board.edited_datetime
    
    db.commit()
    db.refresh(origin_board)
    return {"status" : True, "message" : "수정 성공했습니다"}

def delete_board(db: Session, board_id: int, create_user: str):
    delete_board_db = db.query(models.Board).filter(models.Board.id == board_id).first()
    if create_user != delete_board_db.writer:
        return {"status": False, "message": "권한이 없습니다."}
    
    db.delete(delete_board_db)
    db.commit()
    return {"status": True, "message" : "삭제 성공했습니다."}

def like_board(db: Session, board_id: int, like_user: str):
    like_db = db.query(models.Board).filter(models.Board.id == board_id).first()
    if like_user != like_db.writer and like_db.like == 0:
        write_user = mongodb.users.find_one({"id": like_db.writer})
        mongodb.users.update_one({"id": write_user["id"]}, {"$set": {"point": write_user["point"] + 100}})
    
    like_db.like += 1
    db.add(like_db)
    db.commit()
    return

def create_comment(db: Session, board_id: int, comment: schemas.Create_Comment):
    comment_db_create = models.Comment(writer = comment.writer,
                                       content = comment.content,
                                       board_id = board_id)
    
    db.add(comment_db_create)
    db.commit()
    db.refresh(comment_db_create)
    return {"status": True, "data" : "답글 생성 성공"}

def edit_comment(db: Session, comment_id: int, edit_comment: schemas.Edit_Comment, create_user: str):
    origin_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if create_user != origin_comment.id:
        return {"status": False, "message" : "권한이 없습니다."}
    origin_comment.writer = edit_comment.writer
    origin_comment.content = edit_comment.content
    origin_comment.edited_datetime = edit_comment.edited_datetime
    
    db.commit()
    db.refresh(origin_comment)
    return {"status": True, "data": "수정 완료"}

def delete_comment(db: Session, comment_id: int, create_user: str):
    delete_comment_db = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if create_user != delete_comment_db.id:
        return {"status": False, "message" : "권한이 없습니다."}
    
    db.delete(delete_comment_db)
    db.commit()
    return {"status": True, "data": "삭제 완료"}
