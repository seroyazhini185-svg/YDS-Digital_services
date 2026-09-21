import os
from typing import List

from fastapi import BackgroundTasks, FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from . import models, schemas
from .database import engine, get_db
from .mailer import send_enquiry_notification
from .sms import send_enquiry_sms
from .whatsapp import send_enquiry_whatsapp

load_dotenv()

models.Base.metadata.create_all(bind=engine)

ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "change-this-to-a-long-random-string")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app = FastAPI(title="YDS Digital Services API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def require_admin(x_admin_key: str = Header(default="")):
    if x_admin_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing admin key")


@app.get("/")
def root():
    return {"status": "ok", "service": "YDS Digital Services API"}


# ---------- Enquiries (Contact form -> here) ----------

@app.post("/api/enquiries")
def create_enquiry(payload: schemas.EnquiryCreate, background: BackgroundTasks, db: Session = Depends(get_db)):
    """Public endpoint. The Contact page form submits here.

    The message is saved privately and only the site owner is notified
    (email / SMS / WhatsApp). The visitor gets a bare {"ok": true} back, and
    nobody can list enquiries without the admin key.
    """
    enquiry = models.Enquiry(**payload.model_dump())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    # Notifications run after the response, so a slow/failed one never delays or breaks the form.
    background.add_task(send_enquiry_notification, enquiry)
    background.add_task(send_enquiry_sms, enquiry)
    background.add_task(send_enquiry_whatsapp, enquiry)
    return {"ok": True}


@app.get("/api/enquiries", response_model=List[schemas.EnquiryOut], dependencies=[Depends(require_admin)])
def list_enquiries(db: Session = Depends(get_db)):
    """Admin-only. Requires header: X-Admin-Key."""
    return db.query(models.Enquiry).order_by(models.Enquiry.created_at.desc()).all()


@app.patch("/api/enquiries/{enquiry_id}", response_model=schemas.EnquiryOut, dependencies=[Depends(require_admin)])
def update_enquiry_status(enquiry_id: int, payload: schemas.EnquiryStatusUpdate, db: Session = Depends(get_db)):
    enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.status = payload.status
    db.commit()
    db.refresh(enquiry)
    return enquiry


# ---------- Portfolio projects ----------

@app.get("/api/portfolio", response_model=List[schemas.PortfolioProjectOut])
def list_portfolio(db: Session = Depends(get_db)):
    """Public endpoint. The Portfolio page can fetch real projects from here."""
    return db.query(models.PortfolioProject).order_by(models.PortfolioProject.created_at.desc()).all()


@app.post("/api/portfolio", response_model=schemas.PortfolioProjectOut, dependencies=[Depends(require_admin)])
def create_portfolio_item(payload: schemas.PortfolioProjectCreate, db: Session = Depends(get_db)):
    item = models.PortfolioProject(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.delete("/api/portfolio/{item_id}", dependencies=[Depends(require_admin)])
def delete_portfolio_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.PortfolioProject).filter(models.PortfolioProject.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(item)
    db.commit()
    return {"deleted": True}
