import os, time, jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.hash import bcrypt

APP_SECRET = os.getenv("APP_SECRET","super-secret")
bearer = HTTPBearer()

def create_token(sub: str, is_admin: bool = False, exp_seconds: int = 86400):
    payload = {"sub": sub, "adm": is_admin, "exp": int(time.time()) + exp_seconds}
    return jwt.encode(payload, APP_SECRET, algorithm="HS256")

def verify_token(token: str):
    try:
        return jwt.decode(token, APP_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid or expired token")

def current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    return verify_token(creds.credentials)

def hash_password(p:str)->str:
    return bcrypt.hash(p)

def verify_password(p:str, hp:str)->bool:
    return bcrypt.verify(p, hp)
