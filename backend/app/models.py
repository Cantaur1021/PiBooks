from datetime import datetime, date
from typing import Optional, Literal
from sqlmodel import SQLModel, Field, Relationship

AccountType = Literal["asset","liability","equity","income","expense"]

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Account(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    code: str = Field(index=True, unique=True)
    name: str
    type: AccountType

class JournalEntry(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    jdate: date
    ref: str | None = None
    memo: str | None = None
    posted_at: datetime = Field(default_factory=datetime.utcnow)

class JournalLine(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    entry_id: int = Field(foreign_key="journalentry.id")
    account_id: int = Field(foreign_key="account.id")
    debit: float = 0
    credit: float = 0

class Contact(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    kind: Literal["customer","supplier","both"] = "customer"
    email: str | None = None
    tax_number: str | None = None

class Tax(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    rate: float  # percent
    inclusive: bool = False
    code: str | None = None
    country: str | None = None

class Invoice(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    contact_id: int = Field(foreign_key="contact.id")
    number: str
    date: date
    due_date: date | None = None
    status: Literal["draft","approved","paid","void"] = "draft"
    currency: str = "AED"
    subtotal: float = 0
    tax_total: float = 0
    total: float = 0
    balance: float = 0
