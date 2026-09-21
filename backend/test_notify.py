"""
Quick check that YOU get notified when someone fills the contact form.

Run from the backend folder (with the venv active):

    python test_notify.py

It sends one sample enquiry through email, SMS and WhatsApp and tells you which
ones worked. A channel that says "not configured" just needs its values filled
in backend/.env. The private inbox at /admin always works either way.
"""
from datetime import datetime
from types import SimpleNamespace

from dotenv import load_dotenv

load_dotenv()

from app.mailer import send_enquiry_notification  # noqa: E402
from app.sms import send_enquiry_sms  # noqa: E402
from app.whatsapp import send_enquiry_whatsapp  # noqa: E402

sample = SimpleNamespace(
    name="Test Visitor",
    email="visitor@example.com",
    phone="9999999999",
    service="Data Entry & Excel",
    project_details="This is a test message from test_notify.py.",
    deadline="2026-12-31",
    budget=None,
    created_at=datetime.utcnow(),
)

print("Email   :", "SENT" if send_enquiry_notification(sample) else "not sent")
print("SMS     :", "SENT" if send_enquiry_sms(sample) else "not sent")
print("WhatsApp:", "SENT" if send_enquiry_whatsapp(sample) else "not sent")
