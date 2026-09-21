"""
Sends an SMS to the site owner whenever the Contact form is submitted.

Uses Twilio (https://www.twilio.com). Reads settings from environment
variables (see backend/.env.example) so no secrets live in the code.

If Twilio settings are missing, the package isn't installed, or sending
fails for any reason, this quietly does nothing — the enquiry is still
saved to the database and the email notification (mailer.py) still runs
either way, so an SMS hiccup never breaks the contact form for the
visitor.
"""

import os

from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "")
NOTIFY_PHONE = os.getenv("NOTIFY_PHONE", "")


def send_enquiry_sms(enquiry) -> bool:
    """Texts NOTIFY_PHONE with the enquiry details. Returns True if sent."""
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_FROM_NUMBER or not NOTIFY_PHONE:
        print("[sms] Twilio not configured — skipping SMS notification.")
        return False

    body = (
        f"New enquiry: {enquiry.name} ({enquiry.service})\n"
        f"Phone: {enquiry.phone or '-'}\n"
        f"Email: {enquiry.email}\n"
        f"Deadline: {enquiry.deadline or '-'}\n"
        f"Details: {enquiry.project_details[:300]}"
    )

    try:
        from twilio.rest import Client

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        client.messages.create(body=body, from_=TWILIO_FROM_NUMBER, to=NOTIFY_PHONE)
        return True
    except Exception as exc:
        print(f"[sms] failed to send enquiry SMS: {exc}")
        return False
