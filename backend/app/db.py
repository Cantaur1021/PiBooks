import os
from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager

DB_DIR = os.path.join(os.getcwd(), "data")
os.makedirs(DB_DIR, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL")  # if not set -> local SQLite
if not DATABASE_URL:
    DATABASE_URL = f"sqlite:///{os.path.join(DB_DIR, 'books.sqlite')}"

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

def init_db():
    SQLModel.metadata.create_all(engine)

@contextmanager
def get_session():
    with Session(engine) as session:
        yield session
