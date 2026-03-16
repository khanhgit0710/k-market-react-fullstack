# 🛒 K-Market - Fullstack E-commerce Platform (Next.js 15)

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 🚀 Project Overview
**K-Market** is a high-performance e-commerce storefront built with **Next.js 15 App Router** and **MongoDB Atlas**. This project demonstrates advanced frontend logic, RESTful API integration, and modern UI/UX principles.

> **Status:** 🏗️ Phase 2: Core Logic & Database Integration (Targeting MVP by March 20)

## ✨ Key Features
- **⚡ Next.js 15 Power:** Utilizing Server Components for maximum performance.
- **🛡️ Fullstack with MongoDB:** Real data fetching from Atlas Cloud via RESTful API routes.
- **🔍 Smart Pagination:** Custom-built pagination logic with "..." support for clean UX.
- **📱 Responsive Layout:** Pixel-perfect UI on Mobile, Tablet, and Desktop using Tailwind v4.
- **🛠️ Type-Safe:** 100% TypeScript for robust development and bug prevention.
- **🛍️ Dynamic Category Filtering:** Instant product filtering using URL search parameters.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (Planned for Cart)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Deployment:** Vercel

## 📂 Project Structure
```text
app/
├── api/            # RESTful API Route Handlers
├── product/        # Dynamic Route [id] for Details
├── components/     # Layout & Reusable UI components
├── lib/            # MongoDB connection & Utilities
└── models/         # Mongoose Data Schemas