# SonoraKit v0.1 - Universal AI Chat Application

## 🚀 Project Overview
- **Type**: Web Chat Application with Universal AI API Proxy
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Python + FastAPI
- **Architecture**: Component-based with clean separation of concerns

## ✨ Features
- 🎨 Modern glassmorphism UI with animated backgrounds (LiquidEther)
- 🔐 Authentication system (mock users for development)
- 💬 Universal AI chat interface
- 🤖 Support for 7+ AI providers (OpenAI, Claude, Gemini, Mistral, Cohere, Groq, OpenRouter)
- 🔑 Secure API key management (client-side storage)
- 📱 Fully responsive design
- ⚡ Performance optimized with React.memo, useCallback, useMemo
- 🎭 Lazy loading for routes

## 📁 Folder Structure
```
SonoraKit-v0.1/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── LiquidEther.tsx
│   │   └── AnimatedContent.tsx
│   ├── pages/          # Page-level components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ChatPage.tsx
│   ├── services/       # API and business logic
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── assets/         # Static assets
│   └── utils/          # Utility functions
└── backend/
    ├── main.py         # FastAPI server
    ├── auth.py         # Authentication logic
    └── requirements.txt
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will run on `http://localhost:5173`

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py
```
Backend API will run on `http://localhost:8000`

## 🔑 Demo Credentials
Use these test accounts to login:

| Email | Password | Role |
|-------|----------|------|
| admin@sonorakit.com | admin123 | Admin |
| demo@sonorakit.com | demo123 | Demo User |
| test@sonorakit.com | test123 | Test User |

Or register a new account (saved in memory during session)

## 🤖 Supported AI Providers

| Provider | Models | API Required |
|----------|--------|--------------|
| **OpenAI** | GPT-4, GPT-3.5-turbo, etc. | OpenAI API Key |
| **Anthropic** | Claude 3 Opus, Sonnet, Haiku | Anthropic API Key |
| **Google** | Gemini Pro, Gemini 1.5 | Google AI API Key |
| **Mistral** | Mistral Large, Medium, Small | Mistral API Key |
| **Cohere** | Command, Command-Light | Cohere API Key |
| **Groq** | Llama 2, Mixtral, etc. | Groq API Key |
| **OpenRouter** | 100+ models | OpenRouter API Key |

## 📝 Usage
1. Start both frontend and backend servers
2. Navigate to `http://localhost:5173`
3. Login with test credentials or register
4. Click "⚙️ Configuración" to set up your AI model:
   - Select provider
   - Enter model name
   - Add your API key
5. Start chatting with your AI model!

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- GSAP for animations
- Three.js for 3D effects (LiquidEther)
- CSS3 with Glassmorphism effects

### Backend
- FastAPI (Python)
- httpx for async HTTP requests
- Pydantic for data validation
- CORS middleware for cross-origin requests

## 📊 Development Status
- [x] Create project structure
- [x] Landing Page with animated background
- [x] Register Page
- [x] Login Page with auth integration
- [x] Chat Page with model configuration
- [x] Backend API with universal AI proxy
- [x] Authentication system
- [x] Performance optimizations
- [x] Lazy loading
- [x] Responsive design

## 🔒 Security Notes
- API keys are stored in localStorage (client-side only)
- Keys are never sent to or stored on the backend
- Each request includes the API key for the specific provider
- For production, implement proper authentication and encryption

## 🚧 Future Enhancements
- [ ] Real database integration
- [ ] JWT authentication
- [ ] Conversation history persistence
- [ ] File upload support
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Export chat history

## 📄 License
MIT License - Feel free to use this project for learning or commercial purposes.

## 👥 Contributing
This is a learning project. Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React, TypeScript, and FastAPI
