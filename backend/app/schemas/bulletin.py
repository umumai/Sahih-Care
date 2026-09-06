from pydantic import BaseModel


class Bulletin(BaseModel):
    id: int
    title: str
    description: str = ""
    source: str = ""
    url: str = ""
