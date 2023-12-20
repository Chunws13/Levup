from sqlalchemy.orm import Session, joinedload
from . import models, schemas

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

def edit_board(db: Session, edit_board: schemas.Edit_Board, board_id: int):
    origin_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    
    origin_board.writer = edit_board.writer
    origin_board.title = edit_board.title
    origin_board.content = edit_board.content
    origin_board.edited_datetime = edit_board.edited_datetime
    
    db.commit()
    db.refresh(origin_board)
    return origin_board

def delete_board(db: Session, board_id: int):
    delete_db = db.query(models.Board).filter(models.Board.id == board_id).first()
    db.delete(delete_db)
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

def edit_comment(db: Session, comment_id: int, edit_comment: schemas.Edit_Comment):
    origin_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    origin_comment.writer = edit_comment.writer
    origin_comment.content = edit_comment.content
    origin_comment.edited_datetime = edit_comment.edited_datetime
    
    db.commit()
    db.refresh(origin_comment)
    return origin_comment

def delete_comment():
    return

