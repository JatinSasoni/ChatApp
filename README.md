# 💼 TalentNest Pro - MERN Stack Job Portal

A modern job portal connecting recruiters and job seekers with real-time features, secure payments, and an intuitive UI.

![Job Portal Screenshot](https://via.placeholder.com/800x400?text=TalentNest+Pro+Screenshot)
_(Consider adding a real screenshot here)_

## 🌐 Live Demo

- **Frontend:** [https://talentnestpro.netlify.app/](https://talentnestpro.netlify.app/)
- **Backend:** [https://job-portal-ac6k.onrender.com/api/v1/job/server/info](https://job-portal-ac6k.onrender.com/api/v1/job/server/info)

> ⚠️ **Note:** The backend server may take 30-60 seconds to wake up if inactive (Render free tier limitation).

## 🚀 Key Features

### 👨‍💻 Job Seekers

- 🔍 Advanced job search with filters (salary, location, experience)
- 📄 One-click job applications
- 📊 Application tracking dashboard
- ✉️ Email notifications for application updates

### 👔 Recruiters

- 📢 Create and manage job postings
- 💎 Premium "Job of the Day" feature (Razorpay integration)
- 👥 View and manage applicants
- 📈 Boost job visibility

### 🛠️ Technical Highlights

- ⚡ Real-time notifications with Nodemailer
- 💳 Secure payment gateway (Razorpay)
- 🧊 State management with Redux Persist
- 🎨 Smooth animations with Framer Motion
- 📱 Fully responsive design (Tailwind CSS)

## 🛠️ Tech Stack

### Frontend

- React.js (Vite)
- Redux Toolkit + Redux Persist
- Framer Motion (Animations)
- Tailwind CSS + PostCSS
- Axios (API calls)
- React Hook Form (Forms)
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Bcrypt (Password hashing)

### Services

- Cloudinary (Image storage)
- Razorpay (Payments)
- Nodemailer (Email notifications)
- Render (Backend hosting)
- Netlify (Frontend hosting)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB Atlas account or local MongoDB
- Razorpay developer account (for payments)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/JatinSasoni/Job-Portal.git
cd Job-Portal
```

2️⃣ Backend Setup
Navigate to the Server directory:

bash
Copy
Edit
cd Server
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file in /Server:

ini
Copy
Edit
PORT=8000
MONGODB_URI=your_mongodb_uri
SECRET_KEY=your_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
COMPANY_NAME=your_company_name
COMPANY_EMAIL=your_company_email
RAZOR_PAY_KEY=your_razorpay_key
RAZOR_PAY_SECRET=your_razorpay_secret
RAZOR_PLAN_ID=your_razorpay_plan_id
Start the backend server:

bash
Copy
Edit
npm run dev
3️⃣ Frontend Setup
Navigate to the Client directory:

bash
Copy
Edit
cd ../Client
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file in /Client:

ini
Copy
Edit
VITE_API_URI=your_backend_api_base_url
VITE_RAZOR_PAY_KEY=your_razorpay_key
VITE_SUBSCRIPTION_PRICE=your_subscription_price
Start the frontend:

bash
Copy
Edit
npm run dev
📁 Folder Structure
pgsql
Copy
Edit
/Client --> React Frontend
/Server --> Express Backend API
🔮 To-Do / Future Enhancements
Admin dashboard for management

Job analytics for recruiters

Enhanced search & filter optimizations

Push notifications
