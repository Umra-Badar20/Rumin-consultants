# ✅ Supabase Migration Complete - Setup Instructions

Your backend has been successfully migrated from Express/MongoDB to **Supabase**! 

## 🚀 Quick Start Guide

### 1️⃣ **Set Up Supabase Project** (5 minutes)

**If you don't have a Supabase account:**
- Visit: https://supabase.com
- Sign up with email or GitHub
- Create a new project

**Once you have a project:**
1. Go to **Project Settings** → **API**
2. Copy these values:
   - `Project URL` → Save as `VITE_SUPABASE_URL`
   - `anon public` key → Save as `VITE_SUPABASE_ANON_KEY`

### 2️⃣ **Create Database Tables** (2 minutes)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy & paste this SQL:

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

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to insert contacts
CREATE POLICY "Allow public insert contacts"
  ON contacts FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Allow public read contacts (for analytics)
CREATE POLICY "Allow public read contacts"
  ON contacts FOR SELECT
  USING (true);

-- RLS Policy: Allow admin read contacts
CREATE POLICY "Allow admin read contacts"
  ON contacts FOR SELECT
  USING (true);
```

4. Click **Run**

### 3️⃣ **Add Admin User** (1 minute)

In the **SQL Editor**, run:

```sql
INSERT INTO admins (username, password) 
VALUES ('admin', 'admin123');
```

**⚠️ Important**: Change `admin123` to a strong password!

### 4️⃣ **Configure Environment Variables** (1 minute)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
   ```

### 5️⃣ **Install Dependencies** (2 minutes)

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase SDK
- `sweetalert2` - Alert notifications

---

## 📁 **What Changed?**

### ❌ Removed Backend Files:
- ❌ `server.js` - Express server
- ❌ `controllers/` - API controllers
- ❌ `models/` - MongoDB models
- ❌ `routes/` - API routes
- ❌ `config/db.js` - Database config
- ❌ `createAdmin.js` - Admin creation script

### ✅ New Frontend Files:
- ✅ `supabase.js` - Supabase client & functions
- ✅ `admin.html` - Admin panel (in root)
- ✅ `admin.js` - Admin panel logic (in root)
- ✅ `contact.html` - Contact form (in root)
- ✅ `SUPABASE_SETUP.md` - Setup guide
- ✅ `vite.config.js` - Vite configuration
- ✅ `.env.example` - Environment template

### 🔄 Updated Files:
- 🔄 `frontend/admin/admin.js` - Now uses Supabase SDK
- 🔄 `frontend/contact.html` - Now uses Supabase for contact storage
- 🔄 `package.json` - Backend dependencies removed

---

## 🔧 **Testing**

### Test Contact Form:
1. Open `contact.html` in browser
2. Fill out the form (including new phone field) and submit
3. Check email: **umrabadar55@gmail.com** (you should receive submission email)
4. Check Supabase Dashboard → **contacts** table (new row should appear)

### Test Admin Panel:
1. Open `admin.html`
2. Login with:
   - Username: `admin`
   - Password: `admin123` (or whatever you set)
3. You should see all submitted inquiries including phone numbers

---

## 🌐 **Deployment**

### For Vercel:
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### For Netlify:
1. Push code to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build` (after adding build script)
4. Publish directory: `dist`
5. Add same environment variables
6. Deploy!

### For Traditional Hosting:
1. Build: `npm run build`
2. Upload `dist/` folder contents
3. Set environment variables in `.env`

---

## � **Project Structure**

All main files are now in the root directory for easy access:

```
rumin/
├── admin.html                 ← Admin panel (open in browser)
├── admin.js                   ← Admin panel Vue app logic
├── contact.html               ← Contact form (open in browser)
├── supabase.js                ← Supabase SDK client
├── main.js                    ← Main JS utilities
├── package.json               ← Dependencies
├── .env                       ← Supabase credentials (CREATE THIS)
├── .env.example               ← Environment template
├── vite.config.js             ← Vite config
├── README_MIGRATION.md        ← Setup guide (this file)
├── SUPABASE_SETUP.md          ← Database schema
├── MIGRATION_CHECKLIST.md     ← Verification checklist
└── frontend/                  ← Static assets
    ├── css/                   ← Bootstrap, styles
    ├── js/                    ← Additional scripts
    ├── img/                   ← Images
    ├── lib/                   ← Libraries (carousel, animations, etc)
    ├── about.html
    ├── feature.html
    ├── service.html
    └── ... other HTML files
```

**Key Files:**
- **contact.html** - User-facing contact form (includes phone field)
- **admin.html** - Admin dashboard to view submissions
- **supabase.js** - All Supabase functions & authentication
- **.env** - Your Supabase credentials (must be created)

---

## �🔐 **Security Considerations**

### Current Setup (Development):
- ✅ Simple password comparison (for testing)
- ✅ Public can insert contacts
- ✅ Suitable for demo/testing

### For Production:
1. **Hash Passwords**: Use bcryptjs library
   ```bash
   npm install bcryptjs
   ```
   Update `frontend/supabase.js` to use bcryptjs

2. **Restrict Access**: Update RLS policies in Supabase:
   ```sql
   -- Only admins can read (requires Supabase Auth)
   CREATE POLICY "Only admins read contacts"
     ON contacts FOR SELECT
     USING (auth.jwt() ->> 'role' = 'admin');
   ```

3. **Use Supabase Auth**: Replace custom admin login with Supabase Auth

---

## 📞 **Support & Troubleshooting**

### Contact form not saving?
- Check browser console for errors
- Verify `.env` variables are correct
- Check Supabase RLS policies

### Admin login not working?
- Verify admin user exists in `admins` table
- Check password is correct
- Look at browser console for error messages

### Environment variables not loading?
- Restart dev server after changing `.env`
- For Vercel/Netlify, redeploy after adding env vars
- Use `VITE_` prefix for frontend variables

---

## 📚 **Useful Resources**

- **Supabase Docs**: https://supabase.com/docs
- **Supabase JavaScript Client**: https://supabase.com/docs/reference/javascript/introduction
- **FormSubmit.co**: https://formsubmit.co/

---

## ✨ **Next Steps**

1. ✅ Complete the 5 setup steps above
2. ✅ Test contact form submission
3. ✅ Test admin login & viewing inquiries
4. ✅ Deploy to Vercel/Netlify
5. ✅ Update any hardcoded URLs in your code

---

**🎉 You're all set! Your Supabase backend is ready to go!**
