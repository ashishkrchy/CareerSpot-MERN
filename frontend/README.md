## 💼 CareerSpot – Job Portal Platform

CareerSpot is a full-stack job portal application built with the **MERN stack**, designed to connect job seekers with recruiters in a seamless, responsive, and feature-rich environment.

## 🌐 **Live App:** [CareerSpot on Vercel](https://career-spot-frontend.vercel.app)

## 📸 Screenshots

![image](![alt text](image.png))
![image](https://github.com/user-attachments/assets/example2.jpg)
![image](https://github.com/user-attachments/assets/example3.jpg)

---

## 🌟 Overview

CareerSpot provides a smooth experience for both **job seekers** and **recruiters**, enabling job applications, company creation, job posting, and much more. The platform is mobile-responsive, equipped with role-based access, and enhanced by toast notifications and cloud image hosting.

---

## ✨ Features

👨‍💼 **For Job Seekers:**

- ✅ User registration, login, and secure JWT authentication
- 🔍 Search jobs by title, company, and category
- ❤️ Add jobs to wishlist
- 📄 Apply for jobs directly from the platform
- 👤 Edit profile and upload resume

🏢 **For Recruiters:**

- 🏢 Company profile creation and editing
- 📢 Post, update, and delete job listings
- 📄 View applicants and update application status

🛡️ **For Admins:**

- 🔒 Role-based access control (admin, general)
- 📊 Admin dashboard for user, job, and company management

🧪 **General Features:**

- ☁️ Cloudinary integration for uploading resumes and logos
- 🔔 Real-time toast notifications using Sonner
- 💬 Fully responsive UI for mobile and desktop
- ⚡ Framer Motion animations for smooth transitions

---

## 🛠️ Tech Stack

| Category           | Technologies                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| **Frontend**       | React.js, Tailwind CSS, Redux Toolkit, React Router, Radix UI, Framer Motion |
| **Backend**        | Node.js, Express.js, MongoDB, Mongoose                                       |
| **Authentication** | JWT (JSON Web Tokens)                                                        |
| **File Storage**   | Cloudinary                                                                   |
| **Notifications**  | Sonner                                                                       |
| **Deployment**     | Vercel (Frontend & Backend)                                                  |

---

## 🔧 Installation & Setup

### ✅ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary Account

---

### 📂 Clone the Repository

```bash
git clone https://github.com/ashishkrchy/careerspot.git
cd careerspot
```

---

### ⚙️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

---

### 🎨 Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside the `frontend/` folder and add:

```
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend server:

```bash
npm run dev
```

---

## 🔐 Authentication & Authorization

- 👤 **Job Seekers:** Browse and apply for jobs, manage profile and wishlist
- 🏢 **Recruiters:** Post jobs, manage company profile, track applicants
- 🛡️ **Admins:** Full access to all users, jobs, companies (role-based control)

---

## 🌐 Deployment

Both frontend and backend are deployed using **Vercel**:

```bash
vercel --prod
```

Ensure all environment variables are added in Vercel’s project settings under Environment Variables.

---

## 📁 Folder Structure

```
careerspot/
├── frontend/                # Frontend (React.js)
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── redux/           # Redux slices and store
│       ├── pages/           # Pages like Home, Profile, Admin
│       ├── utils/           # Helper functions
│       ├── App.jsx          # Main app file
│       └── main.jsx         # React DOM entry
├── backend/                 # Backend (Node.js/Express.js)
│   ├── controllers/         # Route logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth and error handling
│   ├── utils/               # Cloudinary and helpers
│   └── server.js            # App entry point
├── README.md                # This file
└── .gitignore               # Ignored files
```

---

## 📬 Contact

👨‍💻 Author: **Ashish Kumar Choudhary**
🔗 **GitHub:** [ashishkrchy](https://github.com/ashishkrchy)
💼 **LinkedIn:** [Ashish Kumar Choudhary](https://www.linkedin.com/in/ashishkrchy)

---

🎯 Empower your career journey with **CareerSpot** – where talent meets opportunity!
