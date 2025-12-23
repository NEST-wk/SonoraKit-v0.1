# SonoraKit Backend - Universal AI API Proxy

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx
from auth import authenticate_user, register_user

app = FastAPI(title="SonoraKit API", version="0.1.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models


class Message(BaseModel):
    role: str
    content: str


class ModelConfig(BaseModel):
    provider: str
    model: str
    apiKey: str


class ChatRequest(BaseModel):
    message: str
    config: ModelConfig
    history: List[Dict[str, Any]] = []


class ChatResponse(BaseModel):
    response: str
    model: str
    provider: str


# Auth Models
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    username: str


class AuthResponse(BaseModel):
    success: bool
    user: Optional[Dict[str, str]] = None
    message: str


# Provider configurations
PROVIDER_CONFIGS = {
    "openai": {
        "base_url": "https://api.openai.com/v1/chat/completions",
        "headers": lambda key: {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
    },
    "anthropic": {
        "base_url": "https://api.anthropic.com/v1/messages",
        "headers": lambda key: {
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
    },
    "google": {
        "base_url": "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        "headers": lambda key: {
            "Content-Type": "application/json"
        },
        "use_query_param": True
    },
    "mistral": {
        "base_url": "https://api.mistral.ai/v1/chat/completions",
        "headers": lambda key: {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
    },
    "cohere": {
        "base_url": "https://api.cohere.ai/v1/chat",
        "headers": lambda key: {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
    },
    "groq": {
        "base_url": "https://api.groq.com/openai/v1/chat/completions",
        "headers": lambda key: {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
    },
    "openrouter": {
        "base_url": "https://openrouter.ai/api/v1/chat/completions",
        "headers": lambda key: {
            "Authorization": f"Bearer {key}",
            "HTTP-Referer": "http://localhost:5173",
            "Content-Type": "application/json"
        }
    }
}

# Available models per provider
PROVIDER_MODELS = {
    "openai": [
        {"id": "gpt-4o", "name": "GPT-4o"},
        {"id": "gpt-4o-mini", "name": "GPT-4o Mini"},
        {"id": "gpt-4-turbo", "name": "GPT-4 Turbo"},
        {"id": "gpt-4", "name": "GPT-4"},
        {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo"}
    ],
    "anthropic": [
        {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet"},
        {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus"},
        {"id": "claude-3-sonnet-20240229", "name": "Claude 3 Sonnet"},
        {"id": "claude-3-haiku-20240307", "name": "Claude 3 Haiku"}
    ],
    "google": [
        {"id": "gemini-2.0-flash-exp", "name": "Gemini 2.0 Flash"},
        {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro"},
        {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash"},
        {"id": "gemini-pro", "name": "Gemini Pro"}
    ],
    "mistral": [
        {"id": "mistral-large-latest", "name": "Mistral Large"},
        {"id": "mistral-medium-latest", "name": "Mistral Medium"},
        {"id": "mistral-small-latest", "name": "Mistral Small"},
        {"id": "open-mistral-7b", "name": "Mistral 7B"},
        {"id": "open-mixtral-8x7b", "name": "Mixtral 8x7B"}
    ],
    "cohere": [
        {"id": "command-r-plus", "name": "Command R+"},
        {"id": "command-r", "name": "Command R"},
        {"id": "command", "name": "Command"},
        {"id": "command-light", "name": "Command Light"}
    ],
    "groq": [
        {"id": "llama-3.3-70b-versatile", "name": "Llama 3.3 70B"},
        {"id": "llama-3.1-70b-versatile", "name": "Llama 3.1 70B"},
        {"id": "llama-3.1-8b-instant", "name": "Llama 3.1 8B"},
        {"id": "mixtral-8x7b-32768", "name": "Mixtral 8x7B"},
        {"id": "gemma2-9b-it", "name": "Gemma 2 9B"}
    ],
    "openrouter": [
        {"id": "anthropic/claude-3.5-sonnet", "name": "Claude 3.5 Sonnet"},
        {"id": "openai/gpt-4-turbo", "name": "GPT-4 Turbo"},
        {"id": "google/gemini-pro-1.5", "name": "Gemini Pro 1.5"},
        {"id": "meta-llama/llama-3.1-70b-instruct", "name": "Llama 3.1 70B"},
        {"id": "mistralai/mistral-large", "name": "Mistral Large"}
    ]
}


def format_messages_openai(history: List[Dict], new_message: str) -> List[Dict]:
    """Format messages for OpenAI-compatible APIs"""
    messages = []
    for msg in history:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    messages.append({"role": "user", "content": new_message})
    return messages


def format_messages_anthropic(history: List[Dict], new_message: str) -> tuple:
    """Format messages for Anthropic Claude API"""
    messages = []
    system_message = ""

    for msg in history:
        if msg["role"] == "system":
            system_message = msg["content"]
        else:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

    messages.append({"role": "user", "content": new_message})
    return messages, system_message


def format_messages_google(history: List[Dict], new_message: str) -> Dict:
    """Format messages for Google Gemini API"""
    contents = []
    for msg in history:
        if msg["role"] != "system":
            role = "user" if msg["role"] == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg["content"]}]
            })

    contents.append({
        "role": "user",
        "parts": [{"text": new_message}]
    })

    return {"contents": contents}


def format_messages_cohere(history: List[Dict], new_message: str) -> Dict:
    """Format messages for Cohere API"""
    chat_history = []
    for msg in history:
        if msg["role"] != "system":
            chat_history.append({
                "role": "USER" if msg["role"] == "user" else "CHATBOT",
                "message": msg["content"]
            })

    return {
        "message": new_message,
        "chat_history": chat_history
    }


async def call_openai_compatible(config: ModelConfig, messages: List[Dict]) -> str:
    """Call OpenAI-compatible APIs (OpenAI, Mistral, Groq, OpenRouter)"""
    provider_config = PROVIDER_CONFIGS[config.provider]

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            provider_config["base_url"],
            headers=provider_config["headers"](config.apiKey),
            json={
                "model": config.model,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 2000
            }
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail=response.text)

        data = response.json()
        return data["choices"][0]["message"]["content"]


async def call_anthropic(config: ModelConfig, messages: List[Dict], system: str) -> str:
    """Call Anthropic Claude API"""
    provider_config = PROVIDER_CONFIGS["anthropic"]

    payload = {
        "model": config.model,
        "messages": messages,
        "max_tokens": 2000,
        "temperature": 0.7
    }

    if system:
        payload["system"] = system

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            provider_config["base_url"],
            headers=provider_config["headers"](config.apiKey),
            json=payload
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail=response.text)

        data = response.json()
        return data["content"][0]["text"]


async def call_google(config: ModelConfig, contents: Dict) -> str:
    """Call Google Gemini API"""
    provider_config = PROVIDER_CONFIGS["google"]
    url = provider_config["base_url"].format(model=config.model)

    if provider_config.get("use_query_param"):
        url += f"?key={config.apiKey}"

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            url,
            headers=provider_config["headers"](config.apiKey),
            json=contents
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail=response.text)

        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


async def call_cohere(config: ModelConfig, payload: Dict) -> str:
    """Call Cohere API"""
    provider_config = PROVIDER_CONFIGS["cohere"]

    payload["model"] = config.model

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            provider_config["base_url"],
            headers=provider_config["headers"](config.apiKey),
            json=payload
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail=response.text)

        data = response.json()
        return data["text"]


@app.get("/")
async def root():
    return {
        "message": "SonoraKit API - Universal AI Proxy",
        "version": "0.1.0",
        "supported_providers": list(PROVIDER_CONFIGS.keys())
    }


@app.get("/api/providers")
async def get_providers():
    """Get list of available providers"""
    return {
        "providers": [
            {"id": "openai", "name": "OpenAI"},
            {"id": "anthropic", "name": "Anthropic (Claude)"},
            {"id": "google", "name": "Google (Gemini)"},
            {"id": "mistral", "name": "Mistral AI"},
            {"id": "cohere", "name": "Cohere"},
            {"id": "groq", "name": "Groq"},
            {"id": "openrouter", "name": "OpenRouter"}
        ]
    }


@app.get("/api/models/{provider}")
async def get_models(provider: str):
    """Get available models for a specific provider"""
    if provider not in PROVIDER_MODELS:
        raise HTTPException(
            status_code=404,
            detail=f"Provider '{provider}' not found"
        )

    return {
        "provider": provider,
        "models": PROVIDER_MODELS[provider]
    }


@app.post("/api/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login endpoint"""
    user = authenticate_user(request.email, request.password)

    if user:
        return AuthResponse(
            success=True,
            user=user,
            message="Login successful"
        )
    else:
        return AuthResponse(
            success=False,
            message="Invalid email or password"
        )


@app.post("/api/auth/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Register endpoint"""
    user = register_user(request.email, request.password, request.username)

    if user:
        return AuthResponse(
            success=True,
            user=user,
            message="Registration successful"
        )
    else:
        return AuthResponse(
            success=False,
            message="Email already exists"
        )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Universal chat endpoint that routes to the appropriate AI provider
    """
    try:
        provider = request.config.provider.lower()

        if provider not in PROVIDER_CONFIGS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported provider: {provider}"
            )

        # Route to appropriate provider
        if provider in ["openai", "mistral", "groq", "openrouter"]:
            messages = format_messages_openai(request.history, request.message)
            response_text = await call_openai_compatible(request.config, messages)

        elif provider == "anthropic":
            messages, system = format_messages_anthropic(
                request.history, request.message)
            response_text = await call_anthropic(request.config, messages, system)

        elif provider == "google":
            contents = format_messages_google(request.history, request.message)
            response_text = await call_google(request.config, contents)

        elif provider == "cohere":
            payload = format_messages_cohere(request.history, request.message)
            response_text = await call_cohere(request.config, payload)

        else:
            raise HTTPException(
                status_code=400, detail="Provider not implemented")

        return ChatResponse(
            response=response_text,
            model=request.config.model,
            provider=provider
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
