# YDS Digital Services — Website + Enquiry System

A full-stack site for **Yazhini S / YDS Digital Services** (Chennai). Built
as three phases:

```
frontend/   React + Vite — the public website                (Phase 1)
backend/    FastAPI       — the contact/enquiry API           (Phase 2)
            PostgreSQL    — stores enquiries & portfolio data (Phase 3)
```

The site has five pages: **Home**, **About**, **Skills**, **Contact**, and
**Portfolio**. Home is a single long scrolling page — it includes its own
services/CTA content plus the same About, Skills, and Contact content and
form (with `id="about"`, `id="skills"`, `id="contact"` sections you can link
to directly, e.g. `/#contact`). About, Skills, and Contact also still exist
as their own standalone routes with identical content. Portfolio is
intentionally the one page kept separate only — it is not duplicated on
Home.

Phase 4 (an admin dashboard to view/manage enquiries without Postman) isn't
built yet — see the bottom of this file.

---

## Quick start (fastest path to seeing it run)

You need **Node.js 18+**, **Python 3.10+**, and **PostgreSQL** installed.
Two terminals, run in order:

**Terminal 1 — backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
copy .env.example .env       # Windows — cp .env.example .env on Mac/Linux
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
copy .env.example .env       # Windows — cp .env.example .env on Mac/Linux
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The site works
even if you skip the backend — only the Contact form needs it running.

---

## 1. Database (PostgreSQL)

Create an empty database once:

```sql
psql -U postgres
CREATE DATABASE portfolio_db;
\q
```

You don't need to run `schema.sql` by hand — the backend creates all tables
automatically the first time it starts (via SQLAlchemy). `backend/schema.sql`
is kept for reference or manual setup.

> **No PostgreSQL installed yet, just testing locally?** Change
> `DATABASE_URL` in `backend/.env` to `sqlite:///./dev.db` — SQLAlchemy will
> use a local file instead, no install or password required. Switch back to
> Postgres before deploying for real.

## 2. Backend (FastAPI)

After `pip install -r requirements.txt` and copying `.env.example` to `.env`,
edit `.env`:

- `DATABASE_URL` — your PostgreSQL connection string
- `ADMIN_API_KEY` — replace with a long random string (this protects the
  admin-only endpoints below)
- `CORS_ORIGINS` — the frontend URL(s) allowed to call this API

Run it with `uvicorn app.main:app --reload --port 8000`, then visit
`http://localhost:8000/docs` — FastAPI's interactive API explorer, where you
can try every endpoint from the browser.

### Endpoints

| Method | Path                  | Auth      | Purpose                    |
| ------ | --------------------- | --------- | --------------------------- |
| POST   | `/api/enquiries`      | Public    | Contact form submits here   |
| GET    | `/api/enquiries`      | Admin key | List all enquiries          |
| PATCH  | `/api/enquiries/{id}` | Admin key | Update an enquiry's status  |
| GET    | `/api/portfolio`      | Public    | List portfolio projects     |
| POST   | `/api/portfolio`      | Admin key | Add a portfolio project     |
| DELETE | `/api/portfolio/{id}` | Admin key | Remove a portfolio project  |

Admin routes require a header: `X-Admin-Key: <value from .env>`. Until the
admin dashboard (Phase 4) exists, use `/docs` or a tool like Postman/Insomnia
to call them.

## 3. Frontend (React + Vite)

`VITE_API_URL` in `frontend/.env` should point at your running backend
(`http://localhost:8000` by default). The Contact page posts real
submissions to `/api/enquiries`.

### Where to edit your business details

All of your name, brand, email, phone/WhatsApp number, and location live in
**one file**: `frontend/src/config.js`. Change it there and it updates the
navbar, footer, floating WhatsApp button, and Contact page automatically —
no need to hunt through every page.

### Editing your services list

The services shown on the Home page live in the `services` array at the top
of `frontend/src/pages/Home.jsx` — edit titles, icons, or the bullet list
under each one directly there.

### Email notifications for the Contact form

By default the Contact form only *saves* enquiries to the database — nobody
gets notified. To also get an email every time someone submits it:

1. Turn on 2-Step Verification on the Gmail account you want to send from:
   `myaccount.google.com/security`.
2. Create an **App Password**: `myaccount.google.com/apppasswords` → choose
   "Mail" → generate. Google gives you a 16-character code (spaces don't
   matter).
3. In `backend/.env`, set:
   - `SMTP_USER` — the Gmail address sending the notification
   - `SMTP_PASSWORD` — the 16-character App Password from step 2 (not your
     normal Gmail password — that won't work)
   - `NOTIFY_EMAIL` — where the notification should land (can be the same
     address as `SMTP_USER`)
4. Restart the backend (`uvicorn app.main:app --reload --port 8000`).

Submit the Contact form once to test it — check the terminal running the
backend for a `[mailer]` log line if it fails (wrong password, blocked
sign-in, etc). Leaving `SMTP_PASSWORD` blank simply skips sending — the
enquiry is still saved either way.

### SMS notifications for the Contact form

Same idea as email, but as a text message, via [Twilio](https://www.twilio.com):

1. Create a free Twilio account at `twilio.com` and verify it.
2. From the Twilio Console dashboard, copy your **Account SID** and
   **Auth Token**.
3. Get a sending number: use the Twilio trial number provided, or buy one
   under **Phone Numbers**. This is `TWILIO_FROM_NUMBER` (include the `+`
   and country code, e.g. `+15551234567`).
4. On a trial account, you must also **verify** the receiving number under
   **Phone Numbers → Verified Caller IDs** before Twilio will text it.
5. In `backend/.env`, set:
   - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` — from step 2
   - `TWILIO_FROM_NUMBER` — from step 3
   - `NOTIFY_PHONE` — the phone number that should receive the text
     (include the `+` and country code, e.g. `+9181486xxxxx`)
6. `pip install -r requirements.txt` again to pick up the `twilio` package,
   then restart the backend.

Submit the Contact form to test — check the terminal for an `[sms]` log
line if it fails. Leaving the Twilio variables blank simply skips sending;
the enquiry is still saved and the email notification (if configured)
still goes out either way.

### WhatsApp notifications for the Contact form

Same Twilio account as SMS above, just a different "channel." Fastest way
to test — Twilio's free WhatsApp **sandbox**:

1. In the Twilio Console, go to **Messaging → Try it out → Send a WhatsApp
   message**. It shows a sandbox number (usually `+1 415 523 8886`) and a
   join code like `join xxxx-xxxx`.
2. From the WhatsApp number you want to *receive* notifications on, send
   that `join xxxx-xxxx` message to the sandbox number. You only need to
   do this once (it expires after a period of inactivity, so re-join if
   notifications stop arriving).
3. In `backend/.env`, set:
   - `TWILIO_WHATSAPP_FROM=whatsapp:+14155238886` (the sandbox number,
     `whatsapp:` prefix included)
   - `NOTIFY_WHATSAPP=whatsapp:+91xxxxxxxxxx` — your WhatsApp number, with
     the `whatsapp:` prefix and country code
4. Restart the backend.

Submit the Contact form to test — check the terminal for a `[whatsapp]`
log line if it fails. Leaving these blank simply skips sending; the other
notifications still work independently.

For a **production** setup (no sandbox, no join-code, messages to anyone),
you'd apply for a WhatsApp Business number through Twilio and use that as
`TWILIO_WHATSAPP_FROM` instead — that's a longer approval process, so the
sandbox is the right starting point.

### The ocean background

Every page shares one fixed, animated background (`frontend/src/components/OceanBackground.jsx`
+ the "Ocean background" section at the bottom of `App.css`): drifting light
rays, rising bubbles, three layered waves, and a turtle that swims and dives
across the screen on a loop. It's pure CSS/SVG animation — no extra
dependencies — and respects `prefers-reduced-motion`. It sits fixed behind
the content (`position: fixed`, `z-index: -1`) so it keeps moving
independently as you scroll the page.

### Changing the color theme

The whole color palette (ocean blues/teals) is defined as CSS variables at
the top of `frontend/src/App.css`, inside the `:root` block. Change
`--color-bg`, `--color-primary`, `--color-accent`, etc. there and it updates
the entire site — including the ocean background gradient — consistently.

### Adding a real profile photo

The About page currently shows a circular initials badge ("YS") as a
placeholder, generated from your name in `config.js`. Once you have a
professional photo, drop it in `frontend/public/` (e.g. `profile.jpg`) and
swap the `<div className="avatar-placeholder">` in `About.jsx` for an
`<img src="/profile.jpg" className="avatar-placeholder" alt={BUSINESS.name} />`.

---

## Running both at once

```
Terminal 1: cd backend  && uvicorn app.main:app --reload --port 8000
Terminal 2: cd frontend && npm run dev
```

Submit the contact form on the site, then confirm it arrived by calling
`GET /api/enquiries` (with your admin key) from `/docs`.

---

## Deploying for real-world use

A common free/cheap setup:

- **Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
  Point either at the `frontend/` folder, build command `npm run build`,
  output directory `dist`. Set `VITE_API_URL` in their environment settings
  to your deployed backend URL.
- **Backend** → [Render](https://render.com) or [Railway](https://railway.app).
  Point at the `backend/` folder, start command
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `DATABASE_URL`,
  `ADMIN_API_KEY`, and `CORS_ORIGINS` (your deployed frontend URL) as
  environment variables there.
- **Database** → [Neon](https://neon.tech) or [Supabase](https://supabase.com)
  both offer a free managed PostgreSQL instance — copy the connection string
  they give you into `DATABASE_URL`.

Buy a domain (or use the free subdomain the host gives you), point it at the
frontend, and you have a live site clients can visit.

---

## What's next (Phase 4)

An admin dashboard — a simple internal page where you log in with the admin
key and see/manage enquiries and portfolio items without needing `/docs` or
Postman. Ask for it whenever you're ready to build it.


---

## Portfolio & Demo Works

The website now includes a **Portfolio** page at `/portfolio`.

The Portfolio page starts with the requested introduction details:

- Name: Yazhini S
- Business name: YDS Digital Services
- Email: yds.digitalservices18@gmail.com
- Phone: 8148607243
- WhatsApp: 8148607243
- Location: Madipakkam, Chennai

It then displays the services as cards with their **Related demo works**. Selecting **View** opens an in-site demo viewer so the demo preview can be inspected directly inside the website. The original demo files are also kept under `frontend/public/demos/`.

The added demo categories are:

1. Data Entry & Excel
2. Typing & Documentation
3. E-commerce & Content
4. Social Media
5. Software Testing
6. Web Development

The original website pages and backend are retained; this portfolio/demo functionality is additive.

---

## Private inbox (added)

Visit `/admin` on the site (it is not linked anywhere) and enter the
`ADMIN_API_KEY` from `backend/.env` to read contact-form messages and mark
them new / in progress / completed / closed. Visitors never see submitted
details: the form only gets `{"ok": true}` back and the list endpoint needs
the key. You are also notified by email / SMS / WhatsApp if those are set up.

## Page backgrounds

Images are in `frontend/public/backgrounds/` (`about`, `skills`, `contact`,
`portfolio` are full-page backgrounds; `home` is the banner on the Home
page). Replace a file with the same name to change it.

## Getting every enquiry (private to you)

Every submitted form is saved first, then sent to you. Visitors only see a
"thanks" message, never anyone's details.

1. **Private inbox (always works):** open `/admin`, enter `ADMIN_API_KEY`. New
   messages are highlighted and the page checks for new ones every 30 seconds.
2. **Email to yourself:** in `backend/.env` set `SMTP_PASSWORD` to a Gmail
   *App Password* (Google Account → Security → 2-Step Verification → App
   passwords). Paste the 16 characters with no spaces.
3. **SMS / WhatsApp to your phone (optional):** needs a Twilio account. Fill the
   `TWILIO_*` and `NOTIFY_*` values in `backend/.env`.
4. Check what works: `cd backend` then `python test_notify.py`.

The backend must be running (and hosted online once the site is live) for the
form to work.
