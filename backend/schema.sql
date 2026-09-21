-- Run this once against your PostgreSQL database, e.g.:
--   psql -U postgres -d portfolio_db -f schema.sql
-- (FastAPI also auto-creates these tables on first run via SQLAlchemy,
-- so this file is mainly for reference / manual setup.)

CREATE TABLE IF NOT EXISTS enquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(30),
    service VARCHAR(120) NOT NULL,
    project_details TEXT NOT NULL,
    deadline VARCHAR(50),
    budget VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries (email);

CREATE TABLE IF NOT EXISTS portfolio_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(300),
    technologies VARCHAR(300),
    project_url VARCHAR(300),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);
