# 🔐 Messonimous

> Anonymous messaging platform built with Next.js, TypeScript, MongoDB,
> Mongoose, NextAuth, Zod, and AI-powered message suggestions.

## ✨ Overview

Messonimous is an anonymous messaging application where users can create
an account, share a unique username-based profile, and receive anonymous
messages.

The application also provides account management features such as:

-   💬 Anonymous messaging
-   🤖 AI-powered message suggestions
-   👤 Username management
-   🔑 Password management
-   📧 Email verification and password recovery
-   🗑️ Delayed account deletion
-   ♻️ Account recovery
-   ⏰ Automated account cleanup
-   🔐 Protected authenticated routes

------------------------------------------------------------------------

# 🚀 Tech Stack

- ⚛️ **React** — Frontend UI
- ▲ **Next.js** — Full-stack React framework
- 📘 **TypeScript** — Type safety
- 🎨 **Tailwind CSS** — Styling
- 🧩 **shadcn/ui** — UI components
- 🔐 **NextAuth** — Authentication and sessions
- 🗄️ **MongoDB** — Database
- 🐍 **Mongoose** — MongoDB ODM
- ✅ **Zod** — Request/form validation
- 🔒 **bcrypt** — Password hashing
- 📧 **Nodemailer** — Transactional emails
- 🤖 **AI API** — AI message suggestions
- 📦 **Axios** — HTTP requests
- 🔀 **Git & GitHub** — Version control
- ☁️ **Vercel** — Deployment and cron jobs

------------------------------------------------------------------------

# 📁 Project Structure

``` text
messonimous/
├── public/
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── (navbar)/
│   │   │   │   └── dashboard/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── delete-account/
│   │   │   │   └── verify/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── change-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── change-username/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── security/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── [token]/
│   │   │   │       └── page.tsx
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   └── verify/
│   │   │       └── [username]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── u/
│   │   │   └── [username]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── account/
│   │   │   │   ├── change-password/
│   │   │   │   ├── change-username/
│   │   │   │   ├── delete-account/
│   │   │   │   └── ...
│   │   │   ├── auth/
│   │   │   ├── send-message/
│   │   │   ├── suggest-messages/
│   │   │   └── ...
│   │   │
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   └── ...
│   │
│   ├── helpers/
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── dbConnect.ts
│   │   └── ...
│   │
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── AccountDeletion.model.ts
│   │   └── ...
│   │
│   ├── schemas/
│   │   ├── changePassword.ts
│   │   ├── changeUsername.ts
│   │   └── ...
│   │
│   └── types/
│       └── ...
│
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

------------------------------------------------------------------------

# 🔄 Application Flow

``` text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Sign Up     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Sign In     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Dashboard    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         💬 Messages     ⚙️ Settings     🗑️ Delete
              │              │              │
              ▼              ▼              ▼
        Anonymous       Account          Recovery
        Messages        Management        Period
```

------------------------------------------------------------------------

# 💬 Anonymous Messaging

Messonimous allows users to receive anonymous messages through a public
username-based profile.

Each user gets a unique public URL:

``` text
/u/<username>
```

Example:

``` text
/u/ayaan
```

Visitors can open the profile and send a message without creating an
account.


If the username does not exist:

``` text
/u/unknown-user
        │
        ▼
   User Not Found
        │
        ▼
     404 Page
```

## ✨ Features

-   💬 Send anonymous messages
-   👤 Username-based public profiles
-   🚫 No authentication required for sending messages
-   🔒 Users can control whether they accept messages
-   🤖 AI-powered message suggestions
-   🔔 Toast notifications for success and errors
-   📱 Responsive messaging interface

------------------------------------------------------------------------

# 👤 Username Management

Users can change their username from the **Settings** section.

Usernames are required to be unique across the platform.

## 🔐 Username Rules

Every username is:

-   ✅ Unique
-   ✅ Lowercase
-   ✅ Trimmed
-   ✅ Validated using Zod
-   ✅ Protected by a MongoDB unique index

The username is normalized before being stored:


## ⏳ 14-Day Username Change Cooldown

To prevent frequent username changes, Messonimous allows a user to
change their username only once every **14 days**.


------------------------------------------------------------------------

# 🔑 Password Management

The password change interface contains:

``` text
Current Password
       │
       ▼
New Password
       │
       ▼
Confirm New Password
```


## 🛡️ Password Security

Passwords are never stored as plain text.

Messonimous uses `bcrypt` to hash passwords before storing them in
MongoDB.

``` text
Plain Password
      │
      ▼
   bcrypt
      │
      ▼
Hashed Password
      │
      ▼
    MongoDB
```

After successfully changing the password, the user is required to
authenticate again.

The user is redirected to:

``` text
/sign-in
```

## ✨ Password Features

-   🔒 Current password verification
-   ✅ Zod validation
-   🔐 bcrypt password hashing
-   👁️ Show/hide password fields
-   🚫 Password confirmation validation
-   🔄 Session invalidation after change
-   ➡️ Redirect to sign-in after successful change

------------------------------------------------------------------------

# 🗑️ Account Deletion

Messonimous does not immediately permanently delete an account when the
user requests deletion.

Instead, the account enters a temporary recovery period.


## 🔢 OTP Verification

Before scheduling account deletion, the user must verify an OTP.

The backend checks:

-   🔢 OTP value
-   👤 User association
-   ⏳ OTP expiration

If the OTP is invalid:

``` text
400 Bad Request
Invalid OTP
```

If the OTP has expired:

``` text
400 Bad Request
OTP has expired
```

Expired OTP records are removed from the database.

## ⏳ Recovery Period

After successful OTP verification, the account is marked for deletion.


During the recovery period, the user can cancel the deletion.

## ♻️ Account Recovery

Users can recover their account before the scheduled deletion date.

After recovery, the account becomes active again.

## ⏰ Automatic Cleanup

Once the recovery period expires, the account becomes eligible for
permanent deletion.

A scheduled Vercel Cron job periodically calls the cleanup API.

``` text
Vercel Cron
     │
     ▼
Cleanup API
     │
     ▼
Find Expired Accounts
     │
     ▼
Permanently Delete
     │
     ▼
Remove Account Data
```

The cleanup API is protected using:

``` http
Authorization: Bearer <CRON_SECRET>
```

## 🛡️ Account Deletion Security

The deletion system provides:

-   🔢 OTP verification
-   ⏳ Recovery period
-   ♻️ Account recovery
-   🔐 Protected cleanup endpoint
-   ⏰ Automated permanent deletion
-   🗑️ Delayed account removal
-   🚫 Prevention of recovery after the deletion deadline

------------------------------------------------------------------------

# 🤖 AI Message Suggestions

Messonimous provides AI-powered suggestions for anonymous messages.

Users can click:

``` text
✨ Suggest Messages
```

The application requests suggestions from the AI backend.

Generated suggestions are displayed as selectable cards.

Clicking a suggestion automatically fills the message textarea.

------------------------------------------------------------------------

# 🗄️ Database

Messonimous uses **MongoDB** with **Mongoose**.

The main `User` model contains:

``` text
User
├── username
├── email
├── password
├── isVerified
├── isAcceptingMessage
├── messages[]
├── resetPasswordToken
├── resetPasswordExpiry
├── isDeleted
├── deletionRequestedAt
├── deletionScheduledFor
└── usernameLastChangedAt
```

## Important Database Constraints

-   `username` is unique
-   `email` is unique
-   Passwords are stored as bcrypt hashes
-   Account deletion fields support delayed deletion
-   `usernameLastChangedAt` supports the 14-day cooldown

------------------------------------------------------------------------

# 🔐 Security

Messonimous follows server-side security practices including:

-   🔒 Password hashing with bcrypt
-   🛡️ NextAuth authentication
-   🔑 Server-side authorization
-   ✅ Zod validation
-   🗄️ MongoDB unique indexes
-   🚫 Protected account APIs
-   🔢 OTP verification
-   ⏳ Delayed account deletion
-   🔐 Protected cron endpoint
-   🌱 Environment-based secrets

Client-side validation improves user experience, but sensitive
validation and authorization are always performed on the server.

------------------------------------------------------------------------

# 🌱 Environment Variables

Create a `.env.local` file:

``` env
MONGODB_URI=

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

RESEND_API_KEY=

GEMINI_API_KEY=

CRON_SECRET=
```

> ⚠️ Never commit `.env.local` or any secret credentials to GitHub.

------------------------------------------------------------------------

# 🚀 Getting Started

## Prerequisites

Make sure you have:

-   Node.js
-   npm
-   Git
-   MongoDB / MongoDB Atlas

You will also need API credentials for the external services used by the
application.

## 1. Clone the Repository

``` bash
git clone https://github.com/ayaanshaikhhh/messonimous.git
```

## 2. Navigate to the Project

``` bash
cd messonimous
```

## 3. Install Dependencies

``` bash
npm install
```

## 4. Configure Environment Variables

Create:

``` text
.env.local
```

Add all required environment variables.

## 5. Start the Development Server

``` bash
npm run dev
```

Open:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# 🧪 Testing

Important scenarios to test include:

## Authentication

-   ✅ Sign Up
-   ✅ Sign In
-   ✅ Sign Out
-   ✅ Session persistence
-   ✅ Protected routes
-   ✅ Unauthorized requests
-   ✅ Password reset

## Username

-   ✅ Valid username
-   ✅ Invalid username
-   ✅ Duplicate username
-   ✅ Lowercase normalization
-   ✅ 14-day cooldown
-   ✅ Database update
-   ✅ Public profile URL
-   ✅ Invalid username returns 404

## Password

-   ✅ Incorrect current password
-   ✅ Invalid new password
-   ✅ Password confirmation mismatch
-   ✅ Successful password change
-   ✅ Session invalidation
-   ✅ Redirect to sign-in
-   ✅ Login with the new password

## Account Deletion

-   ✅ OTP generation
-   ✅ OTP verification
-   ✅ Invalid OTP
-   ✅ Expired OTP
-   ✅ Account scheduling
-   ✅ Account recovery
-   ✅ Expired recovery period
-   ✅ Cron cleanup

------------------------------------------------------------------------

# ⏰ Vercel Cron

Messonimous uses Vercel Cron for permanent account cleanup.

The cron configuration is stored in:

``` text
vercel.json
```

Example:

``` json
{
  "crons": [
    {
      "path": "/api/delete-account/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

The cleanup endpoint is protected using:

``` http
Authorization: Bearer <CRON_SECRET>
```

------------------------------------------------------------------------

# ☁️ Production Deployment

Messonimous is designed to be deployed using Vercel.

``` text
GitHub
   │
   ▼
Vercel
   │
   ├── Next.js Application
   ├── Environment Variables
   └── Cron Jobs
           │
           ▼
     Account Cleanup
```

Before deploying:

-   Configure production environment variables.
-   Configure MongoDB Atlas access.
-   Configure authentication secrets.
-   Configure email provider credentials.
-   Configure AI API credentials.
-   Configure `CRON_SECRET`.
-   Verify the cron endpoint.
-   Test authentication and protected routes.

------------------------------------------------------------------------

# 🛣️ Roadmap

Potential future improvements:

-   🔐 Two-factor authentication
-   📱 Session/device management
-   🚦 API rate limiting
-   🤖 Improved AI suggestions
-   📄 Message pagination
-   🔍 Message search
-   🚫 Message reporting/blocking
-   👤 Profile customization
-   🖼️ Profile pictures
-   📊 Analytics
-   🧪 Automated testing
-   🔄 CI/CD pipeline
-   📈 Application monitoring

------------------------------------------------------------------------

# 📊 Project Status

🟢 **Active Development**

Current core functionality includes:

-   🔐 Authentication
-   💬 Anonymous messaging
-   🤖 AI message suggestions
-   ⚙️ Account settings
-   🔑 Password management
-   👤 Username management
-   🗑️ Account deletion
-   ♻️ Account recovery
-   ⏰ Scheduled account cleanup

------------------------------------------------------------------------

# 👨‍💻 Author

## Ayaan Shaikh

**Full Stack Web Developer**

## 🔗 Connect With Me

- 💼 **LinkedIn** — https://www.linkedin.com/in/shaikh-ayaan-dev/
- 🐙 **GitHub** — https://github.com/ayaanshaikhhh

### Tech Stack

`React.js` • `TypeScript` • `Next.js` • `Node.js` • `MongoDB` •
`Mongoose` • `REST APIs` • `Git` • `GitHub`

------------------------------------------------------------------------

# 📄 License

Messonimous is currently developed as a open source project.

