from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from sql_app import crud, models, schemas
from sql_app.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)
router = APIRouter(prefix="/api/board", tags=["boards"])

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

@router.post("/{board_id}/comment")
async def create_comment(comment : schemas.Create_Comment, board_id: int, db: Session = Depends(get_db)):
    return crud.create_comment(db = db, comment = comment, board_id = board_id)
