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

@router.post("/create")
def create_board(board: schemas.Create_Board, db: Session = Depends(get_db)):
    # try:
    return crud.create_board(db = db, board = board)
    
    # except:
    #     return HTTPException(status_code=404, detail="오류")