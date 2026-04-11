# Full-Stack Learning Management System (LMS) 🎓

A complete, production-ready MERN stack E-Learning Platform that empowers instructors to create courses and students to enroll, purchase, and track their learning progress.

## 🚀 Features

### For Students:
*   **Course Catalog & Search**: Browse, filter, and search through published courses with real-time results.
*   **Stripe Secure Checkout**: Purchase courses individually using Stripe Payments.
*   **My Learning Dashboard**: Keep track of purchased courses and your overall progress.
*   **Video Playback & Progress**: Watch course lectures and instantly mark segments as complete/incomplete.
*   **Rich Text Descriptions**: View detailed course overviews correctly rendered with rich text.

### For Instructors/Admins:
*   **Comprehensive Analytics Dashboard**: Check your overall sales metrics, revenue, and charts visualising your financial success.
*   **Course Builder**: Create, update, and manage course structures.
*   **Lecture Manager**: Add, reorder, and upload video content or documents to your course lectures.
*   **Free Previews**: Set individual lectures to be completely free (for previewing) to attract buyers.
*   **Media Management**: Automatically upload rich media (images and videos) via Cloudinary integration.
*   **Course Publishing System**: Keep courses as drafts while editing and only toggle to "Published" once you are completely ready.

---

## 🛠️ Tech Stack

**Frontend Framework & Libraries:**
*   **React (Vite)**
*   **Redux Toolkit (RTK Query)** for robust API state and cache management.
*   **Tailwind CSS** with **Shadcn UI** components for modern, accessible styling.
*   **Recharts** for the admin analytics dashboard.
*   **React Router DOM** for protected routing based on user permissions.

**Backend Environment:**
*   **Node.js & Express.js**
*   **MongoDB & Mongoose DB** for schema validations and relationship management.
*   **Cloudinary Module** + **Multer** for safe server-side media processing and cloud storage.
*   **Stripe SDK** & Webhooks.
*   **JSON Web Tokens (JWT)** & **Bcrypt** for secure authentication flows.

---

## ⚙️ Installation & Setup to Run Locally

### 1. Prerequisites
Make sure you have installed:
*   [Node.js](https://nodejs.org/en) (v16 or higher)
*   [Git](https://git-scm.com/)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas Atlas cluster)
*   [Stripe CLI](https://stripe.com/docs/stripe-cli) (For local webhook testing)
*   A [Cloudinary](https://cloudinary.com/) Account for media storage

### 2. Clone the repository
```bash
git clone https://github.com/your-username/your-lms-repo-name.git
cd your-lms-repo-name
```

### 3. Backend Setup

1. Open a terminal and navigate to the backend folder:
```bash
cd Backend
```
2. Install necessary npm packages:
```bash
npm install
```
3. Create a `.env` file in the `Backend` directory and populate your sensitive credentials based on the `.env.example` file provided:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SETUP_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
WEBHOOK_ENDPOINT_SECRET=your_local_stripe_cli_webhook_secret
```
4. Start the backend development server:
```bash
npm run dev
```

### 4. Frontend Setup

1. Open a new terminal instance and navigate to the frontend folder:
```bash
cd Frontend
```
2. Install npm dependencies:
```bash
npm install
```
3. Start the Vite development server:
```bash
npm run dev
```
4. The React application will spin up at `http://localhost:5173`. Make sure the proxy inside your `vite.config.js` is correctly pointing to your backend's port.

### 5. Running Stripe Webhooks Locally
To test real payments working via the backend update system:
```bash
stripe listen --forward-to localhost:8000/api/v1/purchase/webhook
```
*(Make sure you enter the `whsec_...` output from this command into your Backend's `.env`'s `WEBHOOK_ENDPOINT_SECRET` key to accept incoming hooks).*

---

## 📂 Project Structure Overview

```
project-root/
│
├── Backend/                 # Express REST API Server
│   ├── src/
│   │   ├── controllers/     # API logic (courses, users, purchases, payments)
│   │   ├── db/              # Mongoose connections
│   │   ├── middlewares/     # JWT Auth, Multer
│   │   ├── models/          # DB structures
│   │   ├── routes/          # Express route bindings
│   │   └── utils/           # Cloudinary uploader, Error handler
│   └── package.json
│
├── Frontend/                # React App
│   ├── src/
│   │   ├── app/             # Redux Store
│   │   ├── components/      # Global Layout and UI building blocks (Shadcn)
│   │   ├── features/        # RTK Query API Slices and authSlice 
│   │   ├── layout/          # Navbar, Footer structures
│   │   └── pages/           # Screens mapped to router (Admin, Student, etc)
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🤝 Contribution Guidelines
Found a bug or want to add a feature?
1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request!
