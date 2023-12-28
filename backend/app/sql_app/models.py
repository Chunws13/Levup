from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

class Board(Base):
    __tablename__ = "Boards"
    
    id = Column(Integer, primary_key = True, index = True)
    writer = Column(String(255))
    title = Column(String(255))
    content = Column(String(255))
    like = Column(Integer, default=0)
    created_datetime = Column(DateTime, default = func.now())
    edited_datetime = Column(DateTime, default = func.now())
    comment = relationship("Comment", back_populates= "owner")
    related = relationship("Like_People", back_populates= "related")
    
class Comment(Base):
    __tablename__ = "Comments"
    
    id = Column(Integer, primary_key = True, index = True)
    writer = Column(String(255))
    content = Column(String(255))
    created_datetime = Column(DateTime, default = func.now())
    edited_datetime = Column(DateTime, default = func.now())
    
    board_id = Column(Integer, ForeignKey("Boards.id"))
    owner = relationship("Board", back_populates= "comment")

class Like_People(Base):
    __tablename__ = "Like_People"
    id = Column(Integer, primary_key = True, index = True)
    people = Column(String(255))
    board_id = Column(Integer, ForeignKey("Boards.id"))
    # related = relationship("Board", back_populates= "related")
    