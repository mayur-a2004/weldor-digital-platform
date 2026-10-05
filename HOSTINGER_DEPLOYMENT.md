# Hostinger Deployment Guide - Weldor Digital Platform

Yeh project **Fullstack Production Ready** hai jisme React 19 Frontend + Express Backend + MongoDB Atlas + Cloudinary CDN shaamil hai.

---

## 📌 Repository Details
- **GitHub URL**: `https://github.com/mayur-a2004/weldor-digital-platform`
- **Clone URL (HTTPS)**: `https://github.com/mayur-a2004/weldor-digital-platform.git`
- **Default Branch**: `main`

---

## 🚀 Option 1: Hostinger Node.js Web Hosting (Recommended)

Agar aap Hostinger par **Node.js Web Hosting (Cloud / Business Plan)** use kar rahe hain:

### Step 1: Git Repository Connect Karein
1. Hostinger **hPanel** me login karein.
2. Apne domain ke dashboard me jayein -> **Advanced** -> **Git**.
3. Naya repository add karein:
   - **Repository URL**: `https://github.com/mayur-a2004/weldor-digital-platform.git`
   - **Branch**: `main`
   - **Install Path**: `/public_html` (ya custom folder jaise `/weldor`)
4. **Create** par click karein.

### Step 2: Node.js Application Setup
1. hPanel me **Node.js** ya **Node.js Manager** open karein.
2. **Create Application** par click karein:
   - **Node.js version**: `18.x` ya `20.x`
   - **Application root**: `public_html`
   - **Application startup file**: `server/index.js`
3. **Environment Variables** section me jaakar add karein:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (ya Hostinger ka assigned port)
   - `MONGODB_URI` = Apka MongoDB Atlas Connection String
   - `CLOUDINARY_CLOUD_NAME` = Apka Cloudinary Cloud Name
   - `CLOUDINARY_API_KEY` = Apka Cloudinary API Key
   - `CLOUDINARY_API_SECRET` = Apka Cloudinary API Secret
   - `ADMIN_EMAIL` = `admin@weldorindustries.com`
   - `ADMIN_INITIAL_PASSWORD` = Apka Admin Password
4. Save karein.

### Step 3: Build & Start
1. Hostinger SSH Terminal ya Node.js Manager Console me run karein:
   ```bash
   npm install
   npm run build
   ```
2. Application ko **Start / Restart** karein.
3. Express server automatically frontend bundle (`dist/`) aur backend APIs (`/api/*`) dono ko single domain par serve karega!

---

## 🌐 Option 2: Static Frontend (Shared Hosting `public_html`) + Backend API

Agar aapke paas normal Hostinger Shared Hosting (PHP/Apache) hai:

1. Apne local machine me production build banayein:
   ```bash
   npm run build
   ```
2. `dist` folder ke andar ki saari files ko Hostinger ke `public_html` folder me upload karein.
3. Node.js backend ko kisi VPS, Render, Railway, ya Hostinger VPS par run karke `.env` me API URL connect karein.

---

## 🔑 Default Credentials
- **Admin Login**: `admin@weldorindustries.com`
- **Initial Password**: `Weldor@2026` (Setup ke baad Settings se change kar sakte hain)
