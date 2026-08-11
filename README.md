# 💬 Messonimous

> An anonymous messaging platform built with **Next.js**, **TypeScript**, **MongoDB**, and **NextAuth**, allowing users to receive honest anonymous messages securely.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styled-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- 🔐 Secure Authentication
- 📩 Receive anonymous messages
- 👤 Unique username verification
- 📧 Email verification using OTP
- 🤖 AI-generated message suggestions
- 🌙 Modern responsive UI
- ⚡ Fast server-side rendering with Next.js
- 🛡️ Input validation using Zod
- 🍪 Secure cookie-based authentication
- 🎨 Beautiful UI built with Tailwind CSS & shadcn/ui

---

## 🛠️ Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

### Backend

- Next.js API Routes
- MongoDB
- Mongoose
- NextAuth
- bcryptjs
- JWT
- Axios

### AI

- Groq API (Llama Models)

### Email

- Resend

---

## 📂 Folder Structure

```text
src/
│
├── app/
│   ├── api/
│   ├── sign-in/
│   ├── sign-up/
│   └── verify/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── context/
│
├── helpers/
│
├── lib/
│
├── models/
│
├── schemas/
│
├── types/
│
└── middleware.ts
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/ayaanshaikhhh/messonimous.git
```

Move into the project

```bash
cd messonimous
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
MONGODB_URI=

NEXTAUTH_SECRET=

NEXTAUTH_URL=http://localhost:3000

RESEND_API_KEY=

GROQ_API_KEY=
```

Run the development server

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Description |
|-----------|-------------|
| `MONGODB_URI` | MongoDB Connection String |
| `NEXTAUTH_SECRET` | Secret for NextAuth |
| `NEXTAUTH_URL` | Base URL |
| `RESEND_API_KEY` | Resend Email API |
| `GROQ_API_KEY` | Groq AI API Key |

---

## 🔮 Upcoming Features

- ✅ Dark Mode
- ✅ Profile Customization
- ✅ Copy Share Link
- ✅ Message Analytics
- ✅ Rate Limiting
- ✅ Spam Detection
- ✅ Delete Messages
- ✅ User Dashboard
- ✅ Better AI Suggestions

---

## 🧠 What I Learned

Building **Messonimous** helped me gain practical experience with:

- Next.js App Router
- Authentication & Authorization
- MongoDB & Mongoose
- Server Actions & API Routes
- Form Validation using Zod
- React Hook Form
- AI API Integration
- Email Verification Workflow
- TypeScript Best Practices
- Production Folder Structure

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ayaan Shaikh**

GitHub: https://github.com/ayaanshaikhhh

LinkedIn: https://www.linkedin.com/in/shaikh-ayaan-dev/

---

⭐ If you found this project helpful, consider giving it a star on GitHub!
