-- Create User table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Create Job Application table
CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    date_applied DATE NOT NULL,
    notes TEXT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Insert a default demo user
INSERT INTO users (name, email) VALUES ('Demo User', 'demo@example.com') ON CONFLICT DO NOTHING;
