# CodePerfect

A full-stack LeetCode-like platform for coding practice, progress tracking, and daily logs. 
Future scope is to integrate ide and judge api and other things as well to make sure it can be called as leetcode clone.
<<<<<<< HEAD
=======
## some Glimpses
<img width="1900" height="845" alt="Screenshot 2025-08-17 230745" src="https://github.com/user-attachments/assets/b9f68b58-bb60-477d-914f-4b99304685d7" />
<img width="1899" height="847" alt="image" src="https://github.com/user-attachments/assets/a69fc818-159b-42ac-8f69-7beaaf77b904" />
<img width="1899" height="852" alt="Screenshot 2025-08-17 230918" src="https://github.com/user-attachments/assets/915b6aa7-dcb0-45d0-a1f5-c3457f313b66" />
<img width="1897" height="842" alt="Screenshot 2025-08-17 230758" src="https://github.com/user-attachments/assets/f4cd43b0-6b81-45eb-a0bc-ca2a220adaca" />
<img width="1899" height="840" alt="Screenshot 2025-08-17 230809" src="https://github.com/user-attachments/assets/47227701-8fc5-40da-886a-29bcad444cfd" />

>>>>>>> f7e39ea1a8f4c5078290a1723d1d0adb466253e9

## Project Overview
CodePerfect is a web application that allows users to:
- Practice coding problems by category and difficulty
- Bookmark and mark problems as complete
- Track progress and daily activity
- Authenticate securely (login/register)
- Enjoy a modern, responsive UI

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
   git clone <repo-url>
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
    contexts/
    App.js/ts
    index.js/ts
    ...
  public/
  ...
```

## Author
- **Name:** Mishti Garg
- **Enrollment Number:** IEC2024039

## License
This project is for educational purposes.
