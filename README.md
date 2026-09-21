# AniVora - Anime Streaming Platform

A modern anime streaming web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Browse and search anime
- Watch anime episodes with multiple server support
- User authentication and authorization
- Watchlist management
- Watch history tracking
- Responsive design with dark/light theme
- Genre-based filtering
- Episode management with skip intro and auto-next

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Axios
- HLS.js for video streaming

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Set up environment variables in `server/.env`
4. Run the development server:
   ```bash
   npm run dev
   ```

## API Documentation

The backend provides RESTful APIs for:
- Authentication (register, login, logout)
- Anime data fetching (via Miruro API integration)
- Watch history management
- Watchlist management
- User preferences

## developed by Abhi
use free of copyright