# NeoQuiz

![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

**AI-powered quiz generator** that creates quizzes from prompts or PDF study material using **Google Gemini**.

Generate quizzes instantly, attempt them with an interactive timer, review explanations, and track performance through a persistent quiz history.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Demo](#demo)
- [About The Project](#about-the-project)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)


### Live Demo

🔗 https://neoquiz-one.vercel.app

## Demo

![NeoQuiz Demo](screenshots/demo.gif)


## About The Project

NeoQuiz was built as a full-stack project to explore how generative AI can assist learning workflows.

The application allows users to generate quizzes either from a **text prompt** or from **uploaded PDF study material**. The generated quiz can then be attempted interactively, and results are stored so users can review their progress later.

The project focuses on:

- AI-assisted content generation
- Secure authentication
- Persistent quiz history
- Clean UI/UX for quiz attempts
- Safe server-side API design

## Screenshots

### Landing Page

![Landing Page](screenshots/landing_page.png)

---

### Quiz Generation

![Quiz Generator 1](screenshots/quiz_generator_1.png)

![Quiz Generator 2](screenshots/quiz_generator_2.png)

---

### Quiz Attempt

![Quiz Play](screenshots/quiz_play.png)

---

### Quiz Results

![Quiz Result](screenshots/quiz_result.png)

---

### Quiz History

![Quiz History 1](screenshots/quiz_history_1.png)

![Quiz History 2](screenshots/quiz_history_2.png)

---

### Dashboard

![Dashboard](screenshots/dashboard.png)


## Features

- Generate quizzes using **AI**
- Create quizzes from text prompts
- Create quizzes from PDF study material
- Automatic quiz title generation
- Interactive quiz attempt interface
- Answer explanations for learning
- Quiz history tracking
- Google authentication
- Persistent storage using PostgreSQL
- Secure API routes
  
## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)

## Architecture Overview

```
User
  ↓
Next.js Frontend (React UI)
  ↓
API Routes
  ↓
Google Gemini API (Quiz Generation)
  ↓
PostgreSQL Database (Prisma ORM)
```

## Project Structure

```
src/
  app/          → pages and routing
  api/          → backend API routes
  components/   → UI components
  lib/          → authentication, prisma client, helpers

prisma/
  schema.prisma → database models
```

## Getting Started

Clone the repository

```bash
git clone https://github.com/Ashwinr03/neoquiz.git
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file in the root directory and add the following variables:

```env
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the development server

```bash
npm run dev
```

Open in your browser

```
http://localhost:3000
```


## Future Improvements

Potential future improvements include:

- Difficulty levels for quizzes
- Quiz sharing links
- Leaderboard system
- Improved PDF parsing
- Analytics dashboard for quiz performance

---

## License

This project is licensed under the **Unlicense**.

---

## Author

**Ashwin Ramesh**

GitHub: https://github.com/Ashwinr03  
Live Project: https://neoquiz-one.vercel.app

