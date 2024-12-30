from pydantic import BaseModel
from datetime import date
from typing import List

class TaskBase(BaseModel):
    title: str
    description: str
    start_date: date
    end_date: date
    progress: float
    goal_id: int

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    
    class Config:
        orm_mode = True