from pydantic import BaseModel

class User_Login(BaseModel):
    id: str
    password: str

class User_Create(User_Login):
    email : str
    

class Kakao_Login(BaseModel):
    access_token: str