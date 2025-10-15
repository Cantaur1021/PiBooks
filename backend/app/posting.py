from fastapi import HTTPException
from sqlmodel import select
from .models import JournalEntry, JournalLine, Account
from .db import get_session
from datetime import date

def post_entry(jdate: date, lines: list[dict], ref:str|None=None, memo:str|None=None):
    debit = round(sum(l.get("debit",0) for l in lines),2)
    credit = round(sum(l.get("credit",0) for l in lines),2)
    if debit != credit or debit == 0:
        raise HTTPException(400, "Entry must be balanced and non-zero")
    with get_session() as s:
        e = JournalEntry(jdate=jdate, ref=ref, memo=memo)
        s.add(e); s.commit(); s.refresh(e)
        # optional: verify account ids exist
        for l in lines:
            if not s.exec(select(Account).where(Account.id==l["account_id"])).first():
                raise HTTPException(400, f"Account {l['account_id']} not found")
            s.add(JournalLine(entry_id=e.id, account_id=l["account_id"],
                              debit=l.get("debit",0), credit=l.get("credit",0)))
        s.commit()
        return e.id
