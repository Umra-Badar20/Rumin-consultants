# Supabase Migration Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Create a new project
4. Get your **Project URL** and **Anon Public Key** from Project Settings → API

## Step 2: Create Database Tables

Run the following SQL in Supabase SQL Editor:

```sql
-- Create Admin table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Contact table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  age INT NOT NULL CHECK (age >= 16 AND age <= 60),
  qualification VARCHAR(100) NOT NULL,
  percentage VARCHAR(10) NOT NULL,
  english_test VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  message VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contacts
CREATE POLICY "Allow public insert contacts"
  ON contacts FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public read contacts (optional for statistics)
CREATE POLICY "Allow public read contacts"
  ON contacts FOR SELECT
  USING (true);

-- Create policy for admin read (you can enhance this later with auth)
CREATE POLICY "Allow admin read contacts"
  ON contacts FOR SELECT
  USING (true);
```

## Step 3: Insert Admin User

Replace `YOUR_PASSWORD` with a secure password (you'll hash it in frontend):

```sql
INSERT INTO admins (username, password) 
VALUES ('admin', 'admin123');
```

## Step 4: Create .env file

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Update Frontend

The frontend files have been updated to use Supabase SDK. Install dependencies:

```bash
npm install
```

## Security Notes

- **Row Level Security (RLS)**: Currently allows public read/write. You should restrict this:
  - For contacts: Allow public INSERT only, authenticated admin can SELECT
  - For admins: Use Supabase Auth or restrict SELECT to authenticated users only

- **Password Hashing**: Install bcryptjs in frontend if needed:
  ```bash
  npm install bcryptjs
  ```

- **Deployment**: Update environment variables in your hosting platform (Vercel, Netlify, etc.)
