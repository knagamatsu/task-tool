from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    progress = Column(Float, default=0)
    status = Column(String, default="進行中")  # "進行中" or "完了"
    goal_id = Column(Integer, ForeignKey("goals.id"))
    
    goal = relationship("Goal", back_populates="tasks")

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    tasks = relationship("Task", back_populates="goal")