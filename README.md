# Smart Placement Portal 🎓

An enterprise-grade recruitment platform connecting Students, Recruiters, and TPOs.

## 🚀 Features

### 👨‍🎓 Student
- **Profile Management**: Update CGPA, Backlogs, Skills, and Resume.
- **Smart Apply**: "Apply" button is disabled if you don't meet eligibility criteria (CGPA/Backlogs) or are already placed.
- **Application Tracking**: View status of all applications.

### 🏢 Recruiter
- **Post Jobs**: Create job listings with specific eligibility criteria.
- **Manage Applicants**: Shortlist, Interview, or Place candidates.
- **Role-Based View**: See only jobs posted by you and their applicants.

### 👮 TPO (Admin)
- **Analytics Dashboard**: View placement stats, departmental heatmaps (Recharts).
- **User Verification**: Verify student profiles before they can apply.
- **Live Ticker**: Real-time updates when a student gets placed (Socket.io).

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Shadcn/UI, Redux Toolkit.
- **Backend**: Node.js, Express, MongoDB, Socket.io.
- **Auth**: JWT with Role-Based Access Control (RBAC).

## 🏃‍♂️ How to Run

### Prerequisites
- Node.js installed
- MongoDB running locally (default port 27017)

### Steps
1.  **Backend**:
    ```bash
    cd server
    npm install
    # Create .env based on instructions or use defaults
    npm run dev # or node server.js
    ```
    Server runs on `http://localhost:5000`.

2.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
    Client runs on `http://localhost:5173`.

## 🧪 Testing Flow
1.  Register as **TPO** -> Go to Verification tab -> Verify users.
2.  Register as **Recruiter** -> Post a Job.
3.  Register as **Student** -> Update Profile -> Apply for Job (if eligible).
4.  Recruiter -> Mark Student as **Placed**.
5.  Check TPO Dashboard -> See Live Update & Analytics.

## 🔑 Default Ports
- Frontend: 5173
- Backend: 5000
