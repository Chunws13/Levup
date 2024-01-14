from pydantic import BaseModel

class Edit_Memo(BaseModel):
    content: str
    
class Memo(Edit_Memo):
    year: int
    month: int
    day: int