import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum
from .database import Base


class EnquiryStatus(str, enum.Enum):
    new = "new"
    in_progress = "in_progress"
    completed = "completed"
    closed = "closed"


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(200), nullable=False, index=True)
    phone = Column(String(30), nullable=True)
    service = Column(String(120), nullable=False)
    project_details = Column(Text, nullable=False)
    deadline = Column(String(50), nullable=True)
    budget = Column(String(50), nullable=True)
    status = Column(Enum(EnquiryStatus), default=EnquiryStatus.new, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(300), nullable=True)
    technologies = Column(String(300), nullable=True)
    project_url = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    active = Column(Boolean, default=True, nullable=False)
