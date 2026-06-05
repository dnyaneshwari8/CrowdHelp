# 🌟 CrowdHelp - Production-Ready NGO & Crowdfunding Platform

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

CrowdHelp is a sophisticated, full-stack MERN platform designed to facilitate transparent fundraising for NGOs and individuals. It features a complete ecosystem for donors, organizations, and administrators with automated document generation and real-time notifications.

---

## 📖 Table of Contents
- [🚀 Key Features](#-key-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [📦 Installation & Setup](#-installation--setup)
- [🏃 How to Run](#-how-to-run)
- [🛡️ Security & Roles](#-security--roles)
- [📑 API Summary](#-api-summary)

---

## 🚀 Key Features

### **1. Multi-Role Ecosystem**
- **Donors**: Browse verified causes, secure payments via Razorpay, download tax receipts, and track their donation history.
- **NGOs**: Custom dashboard for campaign lifecycle management, analytics tracking, and public milestone updates.
- **Admins**: Centralized governance for approving organizations, verifying campaigns, and monitoring platform-wide audit logs.

### **2. Automation & Trust**
- **Smart Documents**: Instant generation of **PDF Tax Receipts** and **Certificates of Appreciation** using PDFKit.
- **Milestone Updates**: NGOs can post updates (photos/text) directly to campaign pages to maintain transparency.
- **Notification Engine**: Integrated in-app alerts and branded emails for 10+ triggers (e.g., goal achieved, application approved).

### **3. Advanced Analytics**
- **NGO Insights**: Visual charts (Chart.js) for monthly trends, donor demographics, and campaign performance.
- **Global Stats**: Admin-level analytics for platform growth and total financial impact.

### **4. Social Engagement**
- **Donor Wall & Leaderboard**: Public recognition for contributors (with privacy toggles).
- **Favorites System**: Users can follow campaigns and receive updates on causes they care about.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Chart.js, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose) with optimized indexing.
- **Payments**: Razorpay SDK.
- **Email**: Nodemailer with HTML templates.
- **Docs**: PDFKit for dynamic document generation.

---

## 📂 Project Structure

```text
donation/
├── backend/
│   ├── config/             # DB & Env configuration
│   ├── controllers/        # Business logic (Auth, Admin, NGO, etc.)
│   ├── middleware/         # Auth guards & RBAC
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoint definitions
│   ├── services/           # Email & Notification logic
│   ├── utils/              # PDF Generators, Multer (Uploads)
│   └── uploads/            # Secure file storage
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Kits & Layouts
│   │   ├── context/        # Auth & State Management
│   │   ├── pages/          # Feature-rich dashboards
│   │   └── services/       # API abstraction layer
│   └── public/             # Manifest & static assets
```

---

## 📦 Installation & Setup

### **1. Prerequisites**
- Node.js (v16+)
- Local MongoDB or MongoDB Atlas
- Razorpay API Keys (Test mode recommended)

### **2. Backend Setup**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/donation
JWT_SECRET=your_long_random_string
JWT_EXPIRES_IN=30d
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### **3. Frontend Setup**
```bash
cd ../frontend
npm install
```

---

## 🏃 How to Run

1. **Start Database**: Ensure MongoDB service is running.
2. **Launch Backend**:
   ```bash
   cd backend
   npm run dev
   ```
3. **Launch Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🛡️ Security & Roles

| Role | Permissions |
| :--- | :--- |
| **USER** | Browse, Donate, Favorite, Apply for NGO, View Certificates. |
| **NGO** | Create/Edit/Update own Campaigns, View Received Donations, Upload Docs. |
| **ADMIN** | Manage Users, Approve/Reject NGOs & Campaigns, View Audit Logs. |

- **JWT Auth**: All sensitive operations require a valid JSON Web Token.
- **OTP Verification**: Email-based OTP for registration and password recovery.
- **File Validation**: Strict mime-type checking for images and PDFs.

---

## 📑 API Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth` | POST | Login, Register, OTP Verify. |
| `/api/ngo` | GET/POST | NGO Dashboard, Analytics, Campaign CRUD. |
| `/api/admin` | GET/POST | Governance, Approvals, Audit Logs. |
| `/api/notifications` | GET/PUT | User-specific notifications & unread counts. |
| `/api/donations` | GET/POST | Razorpay integration & Receipt generation. |

---

## 📄 License
Distributed under the ISC License.
