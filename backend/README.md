# SonoraKit Backend

Backend service for SonoraKit - Universal AI API Proxy

## Features

- Universal proxy for multiple AI providers
- Supports: OpenAI, Anthropic (Claude), Google (Gemini), Mistral, Cohere, Groq, OpenRouter
- FastAPI-based REST API
- CORS enabled for frontend integration

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Running the server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### GET /
Health check and info endpoint

### POST /api/chat
Send a chat message to any supported AI provider

**Request body:**
```json
{
  "message": "Your message here",
  "config": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": "your-api-key"
  },
  "history": []
}
```

**Response:**
```json
{
  "response": "AI response",
  "model": "gpt-4",
  "provider": "openai"
}
```

## Supported Providers

- **OpenAI**: gpt-4, gpt-3.5-turbo, etc.
- **Anthropic**: claude-3-opus, claude-3-sonnet, claude-3-haiku
- **Google**: gemini-pro, gemini-1.5-pro
- **Mistral**: mistral-large, mistral-medium, mistral-small
- **Cohere**: command, command-light, command-nightly
- **Groq**: llama2-70b, mixtral-8x7b, etc.
- **OpenRouter**: Access to 100+ models

## Environment Variables

No environment variables required. API keys are provided by the user through the frontend.

## Security Note

API keys are never stored on the server. They are sent with each request and used only for that request.
