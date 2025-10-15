from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from ..db import get_session
from ..models import Account
from ..schemas import AccountIn
from ..auth import current_user

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.get("")
def list_accounts(_: dict = Depends(current_user)):
    with get_session() as s:
        rows = s.exec(select(Account).order_by(Account.code)).all()
        return rows

@router.post("")
def create_account(data: AccountIn, _: dict = Depends(current_user)):
    with get_session() as s:
        if s.exec(select(Account).where(Account.code==data.code)).first():
            raise HTTPException(400, "Code already exists")
        a = Account(**data.dict())
        s.add(a); s.commit(); s.refresh(a)
        return a
