from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

from .models import EnquiryStatus


class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service: str
    project_details: str
    deadline: Optional[str] = None
    budget: Optional[str] = None


class EnquiryOut(EnquiryCreate):
    id: int
    status: EnquiryStatus
    created_at: datetime

    class Config:
        from_attributes = True


class EnquiryStatusUpdate(BaseModel):
    status: EnquiryStatus


class PortfolioProjectCreate(BaseModel):
    title: str
    category: str
    description: Optional[str] = None
    image: Optional[str] = None
    technologies: Optional[str] = None
    project_url: Optional[str] = None


class PortfolioProjectOut(PortfolioProjectCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
