from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
import certifi, os
from . import models, schemas

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

ca = certifi.where()
client = MongoClient(os.environ["db_address"], tlsCAFile=ca)
mongodb = client.chunws

def get_all_board(db: Session):
    return db.query(models.Board).options(joinedload(models.Board.comment)).all()

def get_board(db: Session, board_id: int): 
    return db.query(models.Board).options(joinedload(models.Board.comment)).filter(models.Board.id == board_id).first()

def create_board(db: Session, board: schemas.Create_Board, memo_id: str, writer: str):
    memo_id = ObjectId(memo_id)
    memo_info = mongodb.memo.find_one({"_id" : memo_id})
    if memo_info["admit_status"]:
        raise HTTPException(status_code=404, detail="메모가 없습니다")

    if memo_info["writer"] != writer:
        raise HTTPException(status_code=404, detail="권한이 없습니다")
    
    board_db_create = models.Board(writer = writer,
                                   title = board.title,
                                   content = board.content)
    
    db.add(board_db_create)
    db.commit()
    db.refresh(board_db_create)
    mongodb.memo.update_one({"_id": memo_id}, {"$set" : {"admit_status" : True}})

    user = mongodb.users.find_one({"id": writer})
    mongodb.users.update_one({"id": writer}, {"$set": {"board": user["board"] + 1}})

    return {"status": True, "data" : "인증글 생성 성공"}

def edit_board(db: Session, edit_board: schemas.Edit_Board, board_id: int, writer: str):
    origin_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if writer != origin_board.writer:
        return {"status" : False, "message" : "권한이 없습니다."}
    
    origin_board.title = edit_board.title
    origin_board.content = edit_board.content
    origin_board.edited_datetime = edit_board.edited_datetime
    
    db.commit()
    db.refresh(origin_board)
    return {"status" : True, "message" : "수정 성공했습니다"}

def delete_board(db: Session, board_id: int, writer: str):
    delete_board_db = db.query(models.Board).filter(models.Board.id == board_id).first()
    if writer != delete_board_db.writer:
        return {"status": False, "message": "권한이 없습니다."}
    
    db.delete(delete_board_db)
    db.commit()
    return {"status": True, "message" : "삭제 성공했습니다."}

def like_board(db: Session, board_id: int, like_user: str):
    board_db = db.query(models.Board).filter(models.Board.id == board_id).first()
    like_people = db.query(models.Like_People).filter(models.Like_People.board_id == board_id, models.Like_People.people == like_user).first()
    
    if like_user != board_db.writer and board_db.like == 0:
        write_user = mongodb.users.find_one({"id": board_db.writer})
        mongodb.users.update_one({"id": write_user["id"]}, {"$set": {"point": write_user["point"] + 100}})
    
    # 인정 버튼을 누르지 않은 유저
    if like_people == None:
        like_user = models.Like_People(board_id = board_id, people = like_user)
        board_db.like += 1
        db.add(like_user)
        
        if like_user != board_db.writer:
            user = mongodb.users.find_one({"id": board_db.writer})
            mongodb.users.update_one({"id": board_db.writer}, {"$set": {"like": user["like"] + 1}})
        
        message = "인정하셨습니다"
    
    # 인정 버튼을 누른 유저
    else:
        board_db.like -= 1
        db.delete(like_people)

        if like_user != board_db.writer:
            user = mongodb.users.find_one({"id": board_db.writer})
            mongodb.users.update_one({"id": board_db.writer}, {"$set": {"like": user["like"] - 1}})

        message = "인정을 취소했습니다"    
    
    db.commit()
    return {"status" : True, "message": message}

def get_comment(board_id: int, db:Session):
    comment_db = db.query(models.Comment).filter(models.Comment.board_id == board_id).all()
    return comment_db


def create_comment(db: Session, board_id: int, writer: str ,comment: schemas.Create_Comment):
    comment_db_create = models.Comment(writer = writer,
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
