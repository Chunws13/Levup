from sqlalchemy.orm import Session
from . import models, schemas

def get_board(db: Session, id: int):
    return db.query(models.Board).filter(models.Board.id == id).first()

def get_all_board(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Board).offset(skip).limit(limit).all()

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

def delete_board():
    return



def get_comment():
    return

def create_comment():
    return

def edit_comment():
    return

def delete_comment():
    return

