import os
from datetime import timedelta

import resend
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "onboarding@resend.dev")


def received_at(enquiry) -> str:
    try:
        return (
            enquiry.created_at + timedelta(hours=5, minutes=30)
        ).strftime("%d %b %Y, %I:%M %p IST")
    except Exception:
        return "-"


def send_enquiry_notification(enquiry) -> bool:

    if not RESEND_API_KEY or not NOTIFY_EMAIL:
        print("[mailer] Resend is not configured — skipping email notification.")
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

    try:
        resend.api_key = RESEND_API_KEY

        params = {
            "from": FROM_EMAIL,
            "to": [NOTIFY_EMAIL],
            "subject": f"New enquiry: {enquiry.name} ({enquiry.service})",
            "text": body,
            "reply_to": enquiry.email,
        }

        response = resend.Emails.send(params)

        print(f"[mailer] enquiry email sent successfully: {response}")
        return True

    except Exception as exc:
        print(f"[mailer] failed to send enquiry email: {exc}")
        return False