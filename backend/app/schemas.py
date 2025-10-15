from pydantic import BaseModel, EmailStr
from datetime import date

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class AccountIn(BaseModel):
    code: str
    name: str
    type: str

class LineIn(BaseModel):
    account_id: int
    debit: float = 0
    credit: float = 0

class EntryIn(BaseModel):
    jdate: date
    ref: str | None = None
    memo: str | None = None
    lines: list[LineIn]

class InvoiceLineIn(BaseModel):
    account_id: int
    description: str
    qty: float
    unit_price: float
    tax_id: int | None = None

class InvoiceIn(BaseModel):
    contact_id: int
    number: str
    date: date
    due_date: date | None = None
    currency: str = "AED"
    lines: list[InvoiceLineIn]
