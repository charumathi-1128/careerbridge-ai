import os
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

def _get_secret_key() -> str:
    secret_key = os.getenv("JWT_SECRET")
    if not secret_key:
        raise RuntimeError("JWT_SECRET must be configured")
    return secret_key

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, _get_secret_key(), algorithm=ALGORITHM)

def decode_access_token(token: str):
    return jwt.decode(token, _get_secret_key(), algorithms=[ALGORITHM])