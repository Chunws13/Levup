from pydantic import BaseModel

class Users(BaseModel):
    id : str
    email : str
    password : str