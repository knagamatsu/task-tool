from pydantic import BaseModel
from datetime import date
from typing import List

class TaskBase(BaseModel):
    title: str
    description: str
    start_date: date
    end_date: date
    progress: float
    status: str = "進行中"
    goal_id: int

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    
    class Config:
        from_attributes = True