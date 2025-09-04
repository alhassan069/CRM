# 🏥 Doctor Acquisition CRM

A modern Customer Relationship Management (CRM) system designed specifically for medical application sales teams to streamline the process of acquiring doctors as users.

## 🌟 Features

### Lead Management
- Full lead lifecycle management from initial contact to conversion
- Customizable lead status tracking with 6-level progression system
- Detailed doctor and clinic profile management
- Activity logging for calls, emails, WhatsApp messages, and in-person meetings

### AI-Powered Tools
- **Deal Coach**: Get AI-suggested next steps to improve close probability
- **Customer Persona Builder**: Auto-generate behavioral profiles based on interactions
- **Objection Handler**: Receive AI-suggested responses to common objections
- **Win-Loss Explainer**: AI-powered analysis of deal outcomes and patterns

### Task Management
- Create and track follow-up tasks
- Priority-based task organization
- Team-wide task visibility for admins

### Reporting & Analytics
- Conversion funnel visualization
- Performance metrics by sales representative
- Source-wise lead analytics
- AI-powered win/loss analysis

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MySQL with Sequelize ORM
- JWT Authentication
- OpenAI API Integration

### Frontend
- React with Next.js
- Tailwind CSS + shadcn/ui Components
- Lucide Icons
- Charts and Data Visualization

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/doctor-acquisition-crm.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Configure environment variables:
- Create `.env` files in both backend and frontend directories
- Set up necessary environment variables (database, OpenAI API, etc.)

5. Initialize the database:
```bash
cd backend
npm run create:admin
npm run seed:users
```

## 🚀 Usage

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application at `http://localhost:3000`

## 👥 User Roles

### Sales Representative
- Manage assigned leads
- Log interactions and activities
- Use AI tools for better conversion
- Track personal tasks

### Sales Admin
- Overview of entire sales funnel
- Assign leads to sales representatives
- Access comprehensive reports
- Monitor team performance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [OpenAI](https://openai.com) for the AI capabilities
- [Lucide Icons](https://lucide.dev) for the icon system
