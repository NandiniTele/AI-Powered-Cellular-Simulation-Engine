from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from jose import jwt
import datetime
from typing import Dict

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SECRET_KEY = "BIOCELL_SECRET_AI_REVOLUTION_KEY_2026"
ALGORITHM = "HS256"

class AuthRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    lab_role: str # Lead Researcher, Computational Biologist, Pharmacologist, etc.

# Mock user database
USERS_DB = {
    "admin": {
        "username": "admin",
        "email": "lead.scientist@virtualhuman.ai",
        "password": "admin",
        "lab_role": "Lead Researcher"
    }
}

def create_jwt_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    # Support both PyJWT returns (str or bytes depending on older versions)
    if isinstance(encoded_jwt, bytes):
        return encoded_jwt.decode("utf-8")
    return encoded_jwt

@router.post("/login")
def login(payload: AuthRequest):
    user = USERS_DB.get(payload.username)
    if not user or user["password"] != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Biometric verification failed. Invalid scientific credentials."
        )
    
    token = create_jwt_token({
        "username": user["username"],
        "email": user["email"],
        "lab_role": user["lab_role"]
    })
    
    return {
        "status": "Verified",
        "token": token,
        "user": {
            "username": user["username"],
            "email": user["email"],
            "lab_role": user["lab_role"]
        }
    }

@router.post("/register")
def register(payload: RegisterRequest):
    if payload.username in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scientist profile already registered with this identifier."
        )
    
    # Store new user
    USERS_DB[payload.username] = {
        "username": payload.username,
        "email": payload.email,
        "password": payload.password,
        "lab_role": payload.lab_role
    }
    
    token = create_jwt_token({
        "username": payload.username,
        "email": payload.email,
        "lab_role": payload.lab_role
    })
    
    return {
        "status": "Registered & Verified",
        "token": token,
        "user": {
            "username": payload.username,
            "email": payload.email,
            "lab_role": payload.lab_role
        }
    }
