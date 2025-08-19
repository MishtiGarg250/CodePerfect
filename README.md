# CodePerfect

A full-stack platform for coding practice, progress tracking, and daily logs. 

### live link : https://code-perfect.vercel.app/

<img width="1700" height="800" alt="image" src="https://github.com/user-attachments/assets/5108cdba-fd47-47cd-99fe-0c4b660e6daf" />


## Project Overview
CodePerfect is a web application that allows users to:
- Practice coding problems by category and difficulty
- Bookmark and mark problems as complete
- Track progress and daily activity
- Authenticate securely (login/register)
- Enjoy a modern, responsive UI
- see their daily summaries of progress and give recommendations as well
- allows user to see their last 7 day logs
- navigate to different problem pages with their voice

## Features
- **Frontend:** React (TypeScript), Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT-based, secure endpoints
- **Rate Limiting:** Prevents brute-force and abuse
- **UI/UX:** Custom animations, dark/light mode
- **API:** RESTful endpoints for user, content, progress, bookmarks, and logs

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation
1. Clone the repository:
   ```sh
   git clone "https://github.com/MishtiGarg250/CodePerfect"
   cd CodePerfect
   ```
2. Install backend dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd ../client
   npm install
   ```
4. Set up environment variables:
   - See `.env.example` in both `backend/` and `client/` for required variables.

### Running the App
- **Backend:**
  ```sh
  cd backend
  npm start
  ```
- **Frontend:**
  ```sh
  cd client
  npm run dev
  ```

### Seeding the Database
- Run the seed script in `backend/` to populate initial problems and categories:
  ```sh
  node seed.js
  ```

## Folder Structure
```
backend/
  controllers/
  middleware/
  models/
  routes/
  config/
  server.js
  ...
client/
  src/
    components/
    pages/
    api/
    useVoicePagination.ts
    main.tsx
    App.tsx
    index.html
    ...
  public/
  ...
```

## Author
- **Name:** Mishti Garg
- **Enrollment Number:** IEC2024039

## License
This project is for educational purposes.
