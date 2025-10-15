from fastapi import APIRouter, Depends, Query
from sqlmodel import text
from datetime import date
from ..db import get_session
from ..auth import current_user

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/trial-balance")
def trial_balance(_: dict = Depends(current_user)):
    sql = """
    SELECT a.code, a.name,
           ROUND(COALESCE(SUM(l.debit),0),2) AS debit,
           ROUND(COALESCE(SUM(l.credit),0),2) AS credit
    FROM account a
    LEFT JOIN journalline l ON l.account_id=a.id
    GROUP BY a.id
    ORDER BY a.code;
    """.replace("account","account").replace("journalline","journalline")
    with get_session() as s:
        rows = s.exec(text(sql)).all()
        return [{"code":r[0], "name":r[1], "debit":r[2], "credit":r[3],
                 "balance": round(float(r[2])-float(r[3]),2)} for r in rows]

@router.get("/pl")
def profit_and_loss(start: date = Query(...), end: date = Query(...), _: dict = Depends(current_user)):
    sql = """
    WITH gl AS (
      SELECT a.type, (l.debit - l.credit) AS amt
      FROM journalline l
      JOIN journalentry e ON e.id=l.entry_id
      JOIN account a ON a.id=l.account_id
      WHERE e.jdate >= :start AND e.jdate <= :end
    )
    SELECT
      ROUND(COALESCE(SUM(CASE WHEN type='income' THEN -amt END),0),2) AS income,
      ROUND(COALESCE(SUM(CASE WHEN type='expense' THEN  amt END),0),2) AS expense,
      ROUND(COALESCE(SUM(CASE WHEN type IN ('income','expense') THEN -amt END),0),2) AS net
    FROM gl;
    """.replace("account","account").replace("journalentry","journalentry").replace("journalline","journalline")
    with get_session() as s:
        row = s.exec(text(sql), {"start":start, "end":end}).one()
        return {"income": row[0], "expense": row[1], "net": row[2]}
