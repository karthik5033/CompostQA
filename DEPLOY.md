# Deployment Guide

This project consists of a **Next.js Frontend** and a **Flask Backend**. Both need to be deployed separately, but they will communicate with each other.

**Prerequisites:**
- A GitHub account (repo pushed to GitHub).
- Accounts on [Vercel](https://vercel.com) (Frontend) and [Render](https://render.com) (Backend).

---

## 🚀 Part 1: Deploy Backend (Render)

We will deploy the Python Flask API first so we can get the URL to give to the frontend.

1.  **Push your code to GitHub**.
2.  Log in to **[Render.com](https://render.com)**.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Configure the service**:
    *   **Root Directory**: `backend` (Important! This tells Render where the app is).
    *   **Runtime**: Docker (Recommended) OR Python 3.
        *   *If choosing Docker*: It will automatically use the `Dockerfile` we created.
        *   *If choosing Python*:
            *   **Build Command**: `pip install -r requirements.txt`
            *   **Start Command**: `gunicorn app:app`
    *   **Free Instance Type**: Select "Free".
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish. You will get a URL like `https://modern-compost-backend.onrender.com`.
    *   **Copy this URL**. You will need it for the frontend.

---

## 🎨 Part 2: Deploy Frontend (Vercel)

Now we deploy the Next.js user interface.

1.  Log in to **[Vercel.com](https://vercel.com)**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure the project**:
    *   **Framework Preset**: Next.js (Should be auto-detected).
    *   **Root Directory**: Edit this and select `frontend`.
5.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add a new variable:
        *   **Key**: `NEXT_PUBLIC_API_URL`
        *   **Value**: The backend URL you copied from Render (e.g., `https://modern-compost-backend.onrender.com`).
        *   *Note: Do not add a trailing slash `/` at the end.*
6.  Click **Deploy**.

---

## ✅ Verification

1.  Open your Vercel deployment URL (e.g., `https://modern-compost-frontend.vercel.app`).
2.  Check the status indicator in the top right. It should say **API: Online**.
3.  Try running a sample analysis to ensure the frontend is successfully talking to the backend.

---

## 🐳 Local Development (Optional)

To run everything locally:

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```
