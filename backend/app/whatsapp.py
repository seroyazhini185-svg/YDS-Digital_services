"""
Sends a WhatsApp message to the site owner whenever the Contact form is
submitted.

Uses Twilio's WhatsApp messaging (same Twilio account as sms.py, just a
different "channel"). Reads settings from environment variables (see
backend/.env.example) so no secrets live in the code.

If Twilio WhatsApp settings are missing, the package isn't installed, or
sending fails for any reason, this quietly does nothing — the enquiry is
still saved to the database and the email/SMS notifications still run
either way, so a WhatsApp hiccup never breaks the contact form for the
visitor.
"""

import os

from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
# Twilio's shared WhatsApp sandbox number by default: whatsapp:+14155238886
# Swap for your own approved WhatsApp Business number in production.
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM", "")
NOTIFY_WHATSAPP = os.getenv("NOTIFY_WHATSAPP", "")


def send_enquiry_whatsapp(enquiry) -> bool:
    """WhatsApps NOTIFY_WHATSAPP with the enquiry details. Returns True if sent."""
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_WHATSAPP_FROM or not NOTIFY_WHATSAPP:
        print("[whatsapp] Twilio WhatsApp not configured — skipping WhatsApp notification.")
        return False

    body = (
        f"New enquiry: {enquiry.name} ({enquiry.service})\n"
        f"Phone: {enquiry.phone or '-'}\n"
        f"Email: {enquiry.email}\n"
        f"Deadline: {enquiry.deadline or '-'}\n"
        f"Details: {enquiry.project_details[:1200]}"
    )

    try:
        from twilio.rest import Client

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        client.messages.create(body=body, from_=TWILIO_WHATSAPP_FROM, to=NOTIFY_WHATSAPP)
        return True
    except Exception as exc:
        print(f"[whatsapp] failed to send enquiry WhatsApp message: {exc}")
        return False
