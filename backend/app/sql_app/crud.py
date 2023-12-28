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
    return board_db_create

def edit_board():
    return

def delete_board(db: Session, board_id: int):
    delete_db = db.query(models.Board).filter(models.Board.id == board_id).first()
    db.delete(delete_db)
    db.commit()
    return 

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
    return comment_db_create

def edit_comment():
    return

def delete_comment():
    return
