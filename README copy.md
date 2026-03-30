<h1 align="center">✈️ TravelX – Online Travel Management System 🌍</h1>

<p align="center">
  Search flights ✈️ and discover hotels 🏨 with real-time data — fast, clean, and scalable.
</p>

<p align="center">

</p>

<p align="center">
  <a href="https://YOUR_FRONTEND_URL.vercel.app">
    <img src="https://img.shields.io/badge/🌐 Live%20Demo-Open-success?style=for-the-badge" />
  </a>
  <a href="https://github.com/SandeepLakshman/TravelX">
    <img src="https://img.shields.io/badge/📦 Code-Repository-blue?style=for-the-badge" />
  </a>
  <a href="https://YOUR_BACKEND_URL.onrender.com">
    <img src="https://img.shields.io/badge/⚙️ Backend-API-orange?style=for-the-badge" />
  </a>
</p>

---

## 🧭 Overview

TravelX is a full-stack web application that enables users to search for flights and discover hotels in their destination city. It integrates real-time data from external APIs to deliver accurate results and a seamless planning experience. Built with a modern React (Vite) frontend and a Spring Boot backend, the system focuses on performance, clean architecture, and scalability.

The platform supports dynamic city-based searches for both domestic and international travel, automatically surfacing relevant hotel options for the selected destination. Designed with modularity in mind, TravelX is easy to extend with features like payments, recommendations, and trip planning.

---

## 🧠 Architecture

```text
Client (Vercel - React)
        │
        ▼
Backend (Render - Spring Boot)
        │
        ├── Aviationstack API (Flights)
        └── Geoapify API (Hotels)
        │
        ▼
     JSON → UI
```

---

## ✨ Key Features

* ✈️ **Flight Search** — dynamic routes across global cities
* 🏨 **Hotel Discovery** — destination-based hotel results
* 🌍 **International Support** — city-based global queries
* ⚡ **Fast UI** — Vite + optimized rendering
* 🔐 **Auth Ready** — extensible login/register flow
* 🧩 **Modular Backend** — clean controllers/services/DTOs

---

## 🛠️ Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Fetch / Axios

**Backend**

* Spring Boot (Java)
* REST APIs
* Layered architecture (Controller → Service → DTO)

**External APIs**

* Aviationstack — flight data
* Geoapify — hotel data

---

## 📦 API Endpoints

```http
GET /api/flights?from={city}&to={city}
GET /api/hotels?city={city}
GET /api/hotels/nearby?lat={lat}&lon={lon}
GET /api/travel?from={city}&to={city}   // combined (optional)
```

---

## ⚙️ Getting Started

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/TravelX.git
cd TravelX
```

### 2. Frontend Setup

```bash
cd travel_frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
# from backend directory
./mvnw clean package
java -jar target/*.jar
```

---

## 🔐 Environment Variables

**Frontend (`.env`)**

```env
VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com
```

**Backend (`application.properties` or env)**

```env
AVIATIONSTACK_KEY=your_key
GEOAPIFY_KEY=your_key
```

> Never commit `.env` files.

---

## 🌐 Deployment

| Layer    | Platform | URL                                   |
| -------- | -------- | ------------------------------------- |
| Frontend | Vercel   | https://YOUR_FRONTEND_URL.vercel.app  |
| Backend  | Render   | https://YOUR_BACKEND_URL.onrender.com |

---

## 📸 Preview

<p align="center">
  <img src="https://via.placeholder.com/900x450.png?text=TravelX+UI+Preview" width="85%" />
</p>

---

## 🧪 Testing

* Validate endpoints via browser/Postman
* Check CORS between Vercel ↔ Render
* Verify dynamic city queries (e.g., `Delhi`, `Paris`, `New York`)

---

## 🚧 Roadmap

* 💳 Payments & bookings
* 🤖 AI-based recommendations
* 🗺️ Map view (hotel clusters)
* 📅 Trip planner & itinerary

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a PR

---

## 📜 License

Educational use.

---

## 👨‍💻 Author

**Sandeep Lakshman**
Cloud & DevOps Enthusiast.

---

## ⭐ Support

If this helped you:

* ⭐ Star the repo
* 🔁 Share it
* 🚀 Build on it

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" />
</p>
