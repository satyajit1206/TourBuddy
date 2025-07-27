# 🌍 TourBuddy

**TourBuddy** is a comprehensive web platform that facilitates group travel by connecting travelers, sharing experiences, and enabling collaborative trip planning. Users can list and review destinations they've visited, helping others make informed travel decisions.

Live Link - https://tourbuddy-d6zy.onrender.com/

---

## 🌟 Features

### 🔐 User Authentication
- Email-based registration with verification
- Google OAuth 2.0 integration
- Secure login system (JWT + Passport.js)

### 👥 Travel Communities
- Create and join travel groups
- Real-time discussion forums using Socket.io
- Like/dislike message system

### 📌 Destination Management
- Add and browse travel destinations
- Multiple image uploads via Cloudinary
- Interactive maps powered by Mapbox

### 🤖 AI-Powered Features
- Automatic place descriptions using Google's Gemini AI
- Smart content generation

### ⭐ Review System
- Comprehensive rating and review functionality
- User feedback on destinations

### 🌦️ Weather Information
- Real-time weather data for destinations
- Powered by OpenWeather API

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Socket.io

### Frontend
- EJS (Embedded JavaScript Templates)
- JavaScript

### Authentication
- Passport.js
- JWT (JSON Web Token)
- Google OAuth 2.0

### APIs & Services
- Google Gemini AI
- Mapbox
- OpenWeather
- Cloudinary

---

## 📋 Prerequisites

Make sure the following are installed/configured before running the project:

- [Node.js](https://nodejs.org/) (v20.14.0 or higher)
- [MongoDB](https://www.mongodb.com/)
- API Keys for:
  - [Google Gemini AI](https://ai.google.dev/)
  - [Mapbox](https://www.mapbox.com/)
  - [OpenWeather](https://openweathermap.org/)
  - [Cloudinary](https://cloudinary.com/)
  - [Google OAuth](https://console.developers.google.com/)

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/tourbuddy.git

# Install dependencies
cd tourbuddy
npm install

# Set environment variables
cp .env.example .env
# Add your API keys and Mongo URI in the .env file

# Start the server
npm run dev
