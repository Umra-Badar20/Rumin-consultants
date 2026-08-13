# ⚡ Quick Start Guide

## 🚀 Get Your Site Live in 10 Minutes

This guide will get your contact form and admin panel working with Supabase in the fastest way possible.

---

## Step 1: Create Supabase Account & Project (2 min)

1. Go to https://supabase.com
2. Click **"Start your project"** → Sign up with email or GitHub
3. After login, click **"New project"** and fill in:
   - **Name**: `rumin-db` (or any name)
   - **Database Password**: Create a strong password
4. Wait for project to be created (~2 minutes)

---

## Step 2: Get Your Credentials (1 min)

1. In Supabase, click **Settings** → **API** (left sidebar)
2. Copy the following and **keep them safe**:
   - **Project URL** (looks like: `https://xyz123.supabase.co`)
   - **Anon Public Key** (long string starting with `eyJ...`)

---

## Step 3: Create Database Tables (2 min)

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy & paste this SQL:

```sql
-- Admin Table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
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

-- Enable Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public insert contacts"
  ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read contacts"
  ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow admin read contacts"
  ON contacts FOR SELECT USING (true);

-- Add Admin User
INSERT INTO admins (username, password) 
VALUES ('admin', 'admin123');
```

4. Click **"Run"** (blue button)
5. ✅ Tables created!

---

## Step 4: Configure Environment (1 min)

1. In your project root, open `.env.example`
2. Replace with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

3. Save as `.env` in the root folder
4. ⚠️ **NEVER** commit `.env` to GitHub!

---

## Step 5: Install Dependencies (1 min)

In terminal/command prompt, run:

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase SDK
- `sweetalert2` - Notifications

---

## ✅ You're Done! Test It Now

### Test Contact Form:
1. Open `contact.html` in your browser
2. Fill out the form with test data
3. **Important**: Fill in the phone field (new!)
4. Click Submit
5. ✅ Check email: **umrabadar55@gmail.com** (should get email)
6. ✅ Check Supabase: Table should show new row

### Test Admin Panel:
1. Open `admin.html` in your browser
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`
3. ✅ See all submitted inquiries with phone numbers!

---

## 🌐 Deploy to Production

### Option A: Vercel (Recommended - Free)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click **"Import Project"** → Select your GitHub repo
4. Add **Environment Variables**:
   - Key: `VITE_SUPABASE_URL` → Value: `https://xyz...supabase.co`
   - Key: `VITE_SUPABASE_ANON_KEY` → Value: `eyJ...`
5. Click **"Deploy"** ✅ Done!

### Option B: Netlify (Free)

1. Push your code to GitHub
2. Go to https://netlify.com
3. Click **"Add new site"** → Select your repo
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add same environment variables
6. Deploy! ✅

### Option C: Any Web Host

1. Build locally: `npm run build`
2. Upload `dist/` folder to your host
3. Set environment variables in `.env` file on the server
4. Done! ✅

---

## 🔧 Common Issues

### "Contact form not saving"
- ✅ Check `.env` file has correct credentials
- ✅ Check browser console for errors (F12)
- ✅ Verify Supabase tables were created

### "Admin login fails"
- ✅ Check admin user exists in `admins` table
- ✅ Password is case-sensitive: `admin123` (not `Admin123`)
- ✅ Check browser console

### "Email not received"
- ✅ Check spam folder
- ✅ Verify email in `contact.html` form action is `umrabadar55@gmail.com`
- ✅ FormSubmit.co may need you to confirm email

---

## 📞 What's New?

✨ **Features in this version:**
- ✅ Phone/Contact number field added to form
- ✅ All main files in root directory (easy to find)
- ✅ Emails go to umrabadar55@gmail.com
- ✅ Admin panel shows all inquiries with phone numbers
- ✅ No backend server needed!

---

## 📁 File Locations

```
Your project root:
├── admin.html           ← Open in browser for admin dashboard
├── contact.html         ← Open in browser for contact form  
├── admin.js             ← Admin logic (auto-loaded)
├── supabase.js          ← Database logic (auto-loaded)
├── .env                 ← YOUR CREDENTIALS (create this!)
└── frontend/            ← Static files (CSS, images, etc)
```

---

## 🎯 Next Steps

1. ✅ Complete the 5 steps above
2. ✅ Test both forms locally
3. ✅ Deploy to Vercel/Netlify
4. ✅ Share your site!

---

**That's it! You have a fully functional contact system with zero backend servers.** 🚀
