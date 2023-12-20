from pydantic import BaseModel
from typing import Union
from datetime import datetime

class Create_Board(BaseModel):
    writer : str
    title : str
    content : str

class Edit_Board(Create_Board):
    edited_datetime : Union[str, None] = datetime.now()

class Create_Comment(BaseModel):
    writer : str
    content : str