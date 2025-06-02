# AI-Powered B2B CRM

A modern B2B CRM system with AI-powered features for enhanced sales and customer relationship management. Built with React, Node.js, and OpenAI integration.

## 🌟 Features

### Core CRM Features
- Contact and Organization Management
- Deal Pipeline with Kanban Board
- Task and Activity Tracking
- Role-based Access Control
- PDF Report Generation

### AI-Powered Add-ons
1. **Deal Coach AI**
   - Analyzes deal data and activities
   - Provides actionable recommendations
   - Suggests next steps to increase close probability

2. **Persona Builder AI**
   - Generates behavioral profiles of contacts
   - Identifies communication preferences
   - Suggests personalized sales approaches

3. **Objection Handler AI**
   - Provides context-aware responses to customer objections
   - Helps sales team handle objections effectively
   - Learns from feedback to improve suggestions

4. **Win-Loss Explainer AI**
   - Analyzes closed deals (won/lost)
   - Identifies key success/failure factors
   - Provides actionable insights for future deals

## 🚀 Live Demo

[Link to be added]

## 🛠️ Tech Stack

- **Frontend:**
  - React + Vite
  - Shadcn UI + Tailwind CSS
  - Redux for state management
  - Axios for API calls

- **Backend:**
  - Node.js + Express
  - Sequelize ORM
  - SQLite (Development)
  - PostgreSQL (Production)
  - OpenAI API Integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🔧 Local Development Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd CRM
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   - Create `.env` files in both `client` and `server` directories
   - Copy the example env files and fill in the required values:
     ```bash
     # server/.env
     PORT=3000
     DATABASE_URL=sqlite://./dev.db
     JWT_SECRET=your_jwt_secret
     OPENAI_API_KEY=your_openai_api_key

     # client/.env
     VITE_API_URL=http://localhost:3000
     ```

4. **Database Setup**
   ```bash
   cd server
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📚 API Documentation

API documentation is available at `/api-docs` when running the backend server. The documentation is generated using Swagger/OpenAPI.

## 👥 User Roles

- **Admin:** Full access to all features and configurations
- **Sales:** Access to CRM features and AI add-ons
- **Support:** Access to CRM features and AI add-ons

## 🔐 Authentication

The system uses JWT-based authentication with refresh tokens. Users can log in using their email and password.

## 📝 License

[License information to be added]

## 🤝 Contributing

[Contribution guidelines to be added]
