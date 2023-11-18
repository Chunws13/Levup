from pydantic import BaseModel

class Memo(BaseModel):
    content : str