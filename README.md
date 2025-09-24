# Yardstick SaaS Notes Application

A multi-tenant SaaS notes application built with React.js frontend and Node.js/Express backend, deployed on Vercel.

## Live Demo
**Frontend:** [https://yardstick-notes.vercel.app](https://yardstick-notes.vercel.app)  
**Backend API:** [https://yardstick-backend.vercel.app](https://yardstick-backend.vercel.app)

## Assignment Requirements Checklist
- [x] Multi-Tenancy Support - Acme and Globex corporations  
- [x] Strict Tenant Isolation - Data never accessible between tenants  
- [x] JWT-based Authentication - Secure login system  
- [x] Role-Based Access Control - Admin and Member roles  
- [x] Subscription Feature Gating - Free (3 notes) vs Pro (unlimited)  
- [x] Complete Notes CRUD API - Create, Read, Update, Delete operations  
- [x] Vercel Deployment - Both frontend and backend hosted on Vercel  
- [x] CORS Enabled - API accessible from any origin  
- [x] Health Endpoint - GET /health for monitoring  
- [x] Minimal Frontend - Full functional UI with role-based features  

## Architecture & Technology Stack

### Backend
- **Runtime:** Node.js with Express.js  
- **Database:** SQLite with Prisma ORM  
- **Authentication:** JWT (JSON Web Tokens)  
- **Security:** bcryptjs for password hashing  
- **CORS:** Enabled for cross-origin requests  

### Frontend
- **Framework:** React.js with Vite  
- **Routing:** React Router DOM  
- **HTTP Client:** Axios  
- **State Management:** React Context API  
- **Styling:** Custom CSS with modern design  

### Deployment
- **Platform:** Vercel  
- **Database:** SQLite (file-based, included in deployment)  

## Multi-Tenancy Implementation
**Chosen Approach:** Shared Schema with Tenant ID  
**Reasoning:** Provides the best balance between isolation, performance, and maintainability for a SaaS application with multiple tenants.

**Implementation Details:**
- Single database schema with `tenantId` foreign keys  
- All database queries include tenant isolation checks  
- Automatic tenant context from JWT tokens  
- Strict row-level security enforced at application level  

**Database Schema:**
tenants (id, slug, name, plan, createdAt, updatedAt)
users (id, email, password, role, tenantId, ...)
notes (id, title, content, tenantId, authorId, ...)

less
Copy code

**Advantages:**
- Simple to implement and maintain  
- Good performance for small-medium tenant count  
- Easy database backups and migrations  
- Cost-effective hosting  

## Test Accounts
All accounts use password: `password`

**Acme Corporation**
- Admin: `admin@acme.test` - Can upgrade plans and manage users  
- Member: `user@acme.test` - Can only manage notes  

**Globex Corporation**
- Admin: `admin@globex.test` - Can upgrade plans and manage users  
- Member: `user@globex.test` - Can only manage notes  

## Authentication & Authorization
**JWT Token Structure**
```javascript
{
  userId: "user-id",
  email: "user@tenant.test",
  role: "ADMIN|MEMBER",
  tenantId: "tenant-id",
  tenantSlug: "acme|globex",
  iat: timestamp,
  exp: timestamp
}
Role-Based Permissions

Role	Notes CRUD	Upgrade Plan	User Management
Admin	✅	✅	✅
Member	✅	❌	❌

Subscription Plans
Free Plan
Up to 3 notes per tenant

Basic note management

Multi-user support

Pro Plan
Unlimited notes

All Free plan features

Priority support

Upgrade Endpoint: POST /tenants/:slug/upgrade (Admin only)

API Documentation
Base URL

arduino
Copy code
https://yardstick-backend.vercel.app
Health Check

bash
Copy code
GET /health
Response: { "status": "ok", "message": "Server is healthy", "timestamp": "..." }
Authentication

css
Copy code
POST /auth/login
Body: { "email": "user@tenant.test", "password": "password" }
Response: { "token": "jwt-token", "user": { ... } }
Notes Management

bash
Copy code
GET    /notes           # List all notes for current tenant
POST   /notes           # Create new note
GET    /notes/:id       # Get specific note
PUT    /notes/:id       # Update note
DELETE /notes/:id       # Delete note
Tenant Management

ruby
Copy code
POST /tenants/:slug/upgrade  # Upgrade tenant to Pro plan (Admin only)
Deployment Architecture
Backend (Vercel Serverless Functions)
Entry Point: src/index.js

Configuration: vercel.json

Database: SQLite file included in deployment

Environment Variables: JWT secret, database URL

Frontend (Vercel Static Hosting)
Build Tool: Vite

Configuration: vite.config.js

API Proxy: Development proxy to backend

Environment: Production API URL configuration

Local Development
Prerequisites
Node.js 16+

npm or yarn

Backend Setup
bash
Copy code
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
# Server runs on http://localhost:3001
Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
Testing the Application
Automated Test Scenarios
Tenant Isolation: Data separation between Acme and Globex

Role Enforcement: Admin vs Member permissions

Plan Limits: Free plan restricts to 3 notes

Upgrade Flow: Admin can upgrade, benefits apply to all tenant users

CRUD Operations: Full note lifecycle management

Manual Testing Flow
Login with each test account to verify access

Create notes to test Free plan limits

Upgrade tenant as Admin user

Verify unlimited notes after upgrade

Test cross-tenant data isolation

Security Features
Password Hashing: bcryptjs with salt rounds

JWT Expiration: 24-hour token validity

Tenant Isolation: Row-level security enforced

CORS Configuration: Controlled origins

Input Validation: Request body validation

Error Handling: Secure error messages

Project Structure
graphql
Copy code
yardstick-assessment/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── lib/
│   │   │   ├── auth.js            # JWT utilities
│   │   │   ├── db.js              # Database connection
│   │   │   └── middleware.js      # Auth middleware
│   │   ├── routes/
│   │   │   ├── auth.js            # Login endpoints
│   │   │   ├── notes.js           # Notes CRUD
│   │   │   ├── tenants.js         # Tenant management
│   │   │   └── health.js          # Health check
│   │   └── index.js               # Server entry point
│   └── vercel.json                # Deployment config
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── Header.jsx         # Navigation header
│   │   │   ├── NotesList.jsx      # Notes display
│   │   │   └── CreateNote.jsx     # Note creation form
│   │   ├── pages/
│   │   │   └── Dashboard.jsx      # Main app page
│   │   ├── utils/
│   │   │   ├── api.js             # API client
│   │   │   └── authContext.jsx    # Authentication context
│   │   └── App.jsx                # Root component
│   └── vercel.json                # Frontend deployment
└── README.md
Key Features Demonstrated
Multi-Tenant Architecture: Complete data isolation between companies

Role-Based Access Control: Fine-grained permissions system

Subscription Management: Plan-based feature gating

RESTful API Design: Clean, predictable endpoints

Modern React Patterns: Hooks, Context API, functional components

Production Deployment: Vercel-optimized configuration

Database Design: Prisma ORM with migrations

Security Best Practices: JWT, password hashing, input validation