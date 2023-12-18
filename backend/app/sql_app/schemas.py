from pydantic import BaseModel
from typing import Union
from datetime import datetime

class Create_Board(BaseModel):
    writer : str
    title : str
    content : str

# class Create_Board(Default_Boad):
#     like : Union[int, None] = 0
#     created_datetime : Union[str, None] = datetime.now() 
#     edited_datetime : Union[str, None] = datetime.now()

class Edit_Board(Create_Board):
    edited_datetime : Union[str, None] = datetime.now()