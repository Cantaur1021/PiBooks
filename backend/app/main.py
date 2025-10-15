import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from .db import init_db, get_session
from .auth import create_token, verify_password
from .models import User
from .routers import accounts, entries, invoices, reports

app = FastAPI(title=os.getenv("APP_NAME","AccBooks"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

@app.on_event("startup")
def on_start():
    init_db()
    # run seed once at first run
    if not os.path.exists("data/.seeded"):
        from .seed import run as seed_run
        seed_run()
        os.makedirs("data", exist_ok=True)
        open("data/.seeded","w").close()

@app.post("/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    with get_session() as s:
        u = s.query(User).filter(User.email==form.username).first()
        if not u or not verify_password(form.password, u.hashed_password):
            raise HTTPException(401, "Invalid credentials")
        token = create_token(u.email, u.is_admin)
        return {"access_token": token, "token_type": "bearer", "email": u.email}

app.include_router(accounts.router, prefix="/api")
app.include_router(entries.router, prefix="/api")
app.include_router(invoices.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
