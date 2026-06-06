# CrowdHelp - Crowdfunding Platform for Verified NGOs

CrowdHelp is a modern, community-driven crowdfunding platform designed to connect donors with verified NGOs and impactful social causes. Built with the MERN stack (MongoDB, Express, React, Node.js), it offers a transparent, secure, and user-friendly experience for social impact.

## 🚀 Key Features

### For Donors
- **Browse Campaigns**: Explore verified social causes across multiple categories (Education, Health, Environment, etc.).
- **Secure Donations**: Integrated with Razorpay for safe and seamless payments.
- **Impact Tracking**: View donation history, download receipts, and earn impact certificates.
- **Leaderboard & Wall**: See top contributors and community impact stories.
- **Favorites**: Save campaigns to support them later.

### For NGOs
- **Dashboard**: Track fundraising progress, donor counts, and campaign analytics.
- **Campaign Management**: Create, update, and manage social impact campaigns.
- **NGO Verification**: Robust application process to ensure trust and transparency.
- **Notification System**: Get real-time updates on approvals and donations.

### For Admin
- **Advanced Analytics**: Monitor platform-wide performance, revenue, and growth.
- **NGO Approval**: Review and approve/reject NGO applications.
- **Campaign Oversight**: Audit and approve campaigns before they go live.
- **User Management**: Monitor user activity and maintain platform integrity.
- **Audit Logs**: Track critical administrative actions for accountability.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Framer Motion, Lucide Icons, Axios, React Router 7.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Payment**: Razorpay.
- **Cloud Storage**: Cloudinary (for images, logos, and certificates).
- **Email**: Nodemailer (for OTP and notifications).

## 📦 Installation & Setup

### Prerequisites
- Node.js installed.
- MongoDB (Local or Atlas).
- Cloudinary Account.
- Razorpay Account.

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the following template:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=30d
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email (SMTP)
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 Project Structure

- `frontend/`: React application (Vite).
  - `src/components/`: Reusable UI components including new `DashboardLayout` and `Sidebar`.
  - `src/pages/`: Main application pages with polished Dashboards and History.
  - `src/services/api.js`: Centralized API service layer.
- `backend/`: Node.js/Express server.
  - `controllers/`: Optimized business logic with detailed validation and analytics.
  - `middleware/`: Includes `authMiddleware` and a new global `errorMiddleware`.
  - `models/`: Mongoose schemas with performance-optimized indexes.
  - `routes/`: Standardized API endpoints.
  - `utils/`: Production-ready helpers for Cloudinary, Email, and PDF generation.

## 🔒 Security & Optimization

- **Global Error Handling**: Centralized error management that prevents sensitive data leaks in production.
- **Database Indexing**: Optimized queries for dashboards and searches to ensure fast response times.
- **File Validation**: Strict file type (JPG, PNG, WEBP, PDF) and size limits (5MB) for all uploads.
- **Cloud Storage**: All images, receipts, and certificates are stored securely on Cloudinary.
- **JWT Protection**: Robust authentication and role-based access control (RBAC).

## 🤝 Support
For any questions or support, please use the **Contact Support** section on the platform or reach out to `support@crowdhelp.com`.

---
Made with ❤️ for a better world.
