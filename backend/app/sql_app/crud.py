from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from bson.objectid import ObjectId
from connections.aws_s3 import aws_s3_connection
from connections.mongodb import MongodbConntect
import os, uuid, io
from . import models, schemas

S3 = aws_s3_connection()
mongodb = MongodbConntect("chunws")

def get_all_board(db: Session):
    return db.query(models.Board).count()

def get_part_board(db: Session, skip:int, limit: int):
    return db.query(models.Board).options(
            joinedload(models.Board.comment)).options(joinedload(models.Board.files)).options(joinedload(models.Board.like_people)).order_by(desc(models.Board.id)).offset(skip).limit(limit).all()

def get_board(db: Session, board_id: int): 
    return db.query(models.Board).options(
            joinedload(models.Board.comment)).options(joinedload(models.Board.files)).filter(models.Board.id == board_id).first()

async def create_board(db: Session, title: str, content: str, files: str, memo_id: str, writer: str):            
    memo_id = ObjectId(memo_id)
    memo_info = mongodb.memo.find_one({"_id" : memo_id})
    
    if memo_info["admit_status"]:
        raise HTTPException(status_code=404, detail="인증을 완료한 메모입니다")

    if memo_info["writer"] != writer:
        raise HTTPException(status_code=404, detail="권한이 없습니다")
    
    board_db_create = models.Board(writer = writer, title = title, content = content)
    
    db.add(board_db_create)
    db.flush()
    
    file_data = [file for file in files]
    file_list = []
    
    for file in file_data:
        filename, extension = os.path.splitext(file.filename)
        
        if extension.lower() not in [".jpg", ".jpeg", ".png"]:
            message = "지원하지 않는 확장자 {}".format(file.filename)
            raise HTTPException(status_code=422, detail= message)
        
        save_file = await file.read()
        convert_image = io.BytesIO(save_file)
        file_name = "{name}.{extension}".format(name = str(uuid.uuid4()), extension = extension)

        file_list.append(models.Files(board_id = board_db_create.id, file_name = file_name))
        S3.upload_fileobj(convert_image, "levupbucket", 
                        "boards/{file_name}".format(file_name = file_name), ExtraArgs ={"ContentType": file.content_type})

    mongodb.memo.update_one({"_id": memo_id}, {"$set" : {"admit_status" : True}})
    
    user = mongodb.users.find_one({"id": writer})
    mongodb.users.update_one({"id": writer}, {"$set": {"board": user["board"] + 1}})
    
    db.bulk_save_objects(file_list)
    db.commit()

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
    comment_db = db.query(models.Comment).filter(models.Comment.board_id == board_id).order_by(desc(models.Comment.id)).all()
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
