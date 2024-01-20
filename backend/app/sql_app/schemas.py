from fastapi import UploadFile, File 
from pydantic import BaseModel
from typing import Union, List
from datetime import datetime
from PIL import Image
import io

class Create_Board(BaseModel):
    title : str
    content : str
    # file : UploadFile

class Edit_Board(Create_Board):
    edited_datetime : Union[str, None] = datetime.now()

class Create_Comment(BaseModel):
    content : str

class Edit_Comment(Create_Comment):
    edited_datetime : Union[str, None] = datetime.now()