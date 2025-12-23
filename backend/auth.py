# Mock users database
from typing import Dict, Optional

USERS_DB: Dict[str, Dict[str, str]] = {
    "admin@sonorakit.com": {
        "password": "admin123",
        "username": "Admin",
        "id": "1"
    },
    "demo@sonorakit.com": {
        "password": "demo123",
        "username": "Demo User",
        "id": "2"
    },
    "test@sonorakit.com": {
        "password": "test123",
        "username": "Test User",
        "id": "3"
    }
}


def authenticate_user(email: str, password: str) -> Optional[Dict[str, str]]:
    """Authenticate user with email and password"""
    user = USERS_DB.get(email)
    if user and user["password"] == password:
        return {
            "id": user["id"],
            "email": email,
            "username": user["username"]
        }
    return None


def register_user(email: str, password: str, username: str) -> Optional[Dict[str, str]]:
    """Register a new user (mock - adds to in-memory dict)"""
    if email in USERS_DB:
        return None  # User already exists

    new_id = str(len(USERS_DB) + 1)
    USERS_DB[email] = {
        "password": password,
        "username": username,
        "id": new_id
    }

    return {
        "id": new_id,
        "email": email,
        "username": username
    }
