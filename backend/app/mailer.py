"""
Sends an email to the site owner whenever the Contact form is submitted.

Uses plain smtplib (no extra dependency). Reads settings from environment
variables (see backend/.env.example) so no secrets live in the code.

If SMTP settings are missing or sending fails for any reason, this quietly
does nothing — the enquiry is still saved to the database either way, so a
mail hiccup never breaks the contact form for the visitor.
"""

import os

from dotenv import load_dotenv

load_dotenv()
import smtplib
from datetime import timedelta
from email.mime.text import MIMEText

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", SMTP_USER)


def received_at(enquiry) -> str:
    """Submission time shown in Indian Standard Time."""
    try:
        return (enquiry.created_at + timedelta(hours=5, minutes=30)).strftime("%d %b %Y, %I:%M %p IST")
    except Exception:
        return "-"


def send_enquiry_notification(enquiry) -> bool:
    """Emails NOTIFY_EMAIL with the enquiry details. Returns True if sent."""
    if not SMTP_USER or not SMTP_PASSWORD or not NOTIFY_EMAIL:
        print("[mailer] SMTP not configured — skipping email notification.")
        return False

    body = (
        "New enquiry from the website contact form:\n\n"
        f"Received: {received_at(enquiry)}\n"
        f"Name: {enquiry.name}\n"
        f"Email: {enquiry.email}\n"
        f"Phone: {enquiry.phone or '-'}\n"
        f"Service: {enquiry.service}\n"
        f"Deadline: {enquiry.deadline or '-'}\n"
        f"Budget: {enquiry.budget or '-'}\n\n"
        f"Project details:\n{enquiry.project_details}\n"
    )

    msg = MIMEText(body)
    msg["Subject"] = f"New enquiry: {enquiry.name} ({enquiry.service})"
    msg["From"] = SMTP_USER
    msg["To"] = NOTIFY_EMAIL
    msg["Reply-To"] = enquiry.email

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, [NOTIFY_EMAIL], msg.as_string())
        return True
    except smtplib.SMTPAuthenticationError:
        print(
            "[mailer] Gmail rejected the login. SMTP_PASSWORD must be a 16-character "
            "Google App Password (not your normal Gmail password)."
        )
        return False
    except Exception as exc:
        print(f"[mailer] failed to send enquiry email: {exc}")
        return False
