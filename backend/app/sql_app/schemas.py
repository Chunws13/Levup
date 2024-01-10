from pydantic import BaseModel
from typing import Union
from datetime import datetime

class Create_Board(BaseModel):
    title : str
    content : str

class Edit_Board(Create_Board):
    edited_datetime : Union[str, None] = datetime.now()

class Create_Comment(BaseModel):
    content : str

class Edit_Comment(Create_Comment):
    edited_datetime : Union[str, None] = datetime.now()