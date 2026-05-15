# PulseCare 🏥

PulseCare is a full-stack healthcare management platform designed to digitally connect patients and doctors through secure authentication, health monitoring, alert management, and real-time communication.

---

# 🚀 Features

## Authentication & Security
- JWT-based authentication
- Role-based authorization
- Secure password hashing using bcrypt
- Protected API routes

## Patient Features
- Patient registration/login
- Health vitals upload
- Assigned doctor monitoring
- Real-time communication with doctors

## Doctor Features
- View assigned patients
- Monitor patient vitals
- Receive abnormal health alerts
- Dashboard analytics
- Real-time patient chat

## Real-Time Communication
- Socket.IO based messaging
- Live doctor-patient communication
- Read receipts
- Instant notifications

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Authentication | JWT |
| Real-Time Communication | Socket.IO |
| Security | bcrypt + Helmet |

---

# 📂 Project Structure

```text
PulseCare/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── public/
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/Mahin00789/PulseCare.git
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

# ▶️ Run the Project

## Backend

```bash
npm run dev
```

## Frontend

```bash
npm start
```

---

# 🧠 Why PostgreSQL Instead of MongoDB?

PulseCare uses PostgreSQL because healthcare systems require:

- Structured relational data
- ACID transaction support
- Strong consistency
- Better relational integrity
- Secure transactional operations

Examples:
- One doctor can manage multiple patients
- One patient can have multiple health logs
- One conversation can contain multiple messages

---

# 🧩 Why Prisma ORM?

Prisma was used because:

- Type-safe queries
- Faster backend development
- Easier migrations
- Better query readability
- Reduced SQL complexity
- Improved developer productivity

---

# 📡 Real-Time Chat Architecture

PulseCare uses Socket.IO for:
- Real-time messaging
- Instant notifications
- Live doctor-patient communication

Flow:
1. User connects through socket
2. Room-based communication established
3. Messages stored in database
4. Receiver notified instantly

---

# 🔒 Security Features

- JWT Authentication
- Password hashing using bcrypt
- Role-based access control
- Protected REST APIs
- Secure database operations using Prisma ORM

---

# 📈 Future Enhancements

- AI symptom checker
- Video consultations
- E-prescriptions
- Push notifications
- Cloud deployment
- Mobile application
- Multi-language support

---

# 📌 Key Learning Outcomes

This project demonstrates:
- Full-stack development
- REST API architecture
- Authentication systems
- Real-time communication
- Database design
- Scalable backend development
- Secure software engineering practices

---

# 👨‍💻 Author

Mahin Mehta

---

# ⭐ If You Like This Project

Give this repository a star on GitHub ⭐