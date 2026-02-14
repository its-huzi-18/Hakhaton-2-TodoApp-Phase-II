from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from pydantic import EmailStr, Field
from sqlmodel import Column, DateTime, Field as SQLField, SQLModel


# Base model for common fields
class BaseModel(SQLModel):
    id: UUID = SQLField(default_factory=uuid4, primary_key=True)
    created_at: datetime = SQLField(default_factory=datetime.utcnow)


class UserBase(SQLModel):
    email: EmailStr = Field(index=True, unique=True, max_length=255)


class User(UserBase, BaseModel, table=True):
    hashed_password: str = Field(max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=100)


class UserRead(UserBase):
    id: UUID
    created_at: datetime


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    is_completed: bool = Field(default=False)


class Task(TaskBase, BaseModel, table=True):
    user_id: UUID = Field(foreign_key="user.id", index=True)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    is_completed: Optional[bool] = None


class TaskRead(TaskBase):
    id: UUID
    user_id: UUID
    created_at: datetime


# Export Base for SQLAlchemy metadata
from sqlmodel.main import SQLModelMetaclass

Base = SQLModelMetaclass(
    "Base",
    (BaseModel,),
    {},
)
