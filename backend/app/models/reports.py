from pydantic import BaseModel

class Create_Report(BaseModel):
    title: str
    content: str