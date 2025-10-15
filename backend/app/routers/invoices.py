from fastapi import APIRouter, Depends, HTTPException
from datetime import date
from sqlmodel import select
from ..auth import current_user
from ..db import get_session
from ..models import Invoice, Account, Tax, Contact
from ..schemas import InvoiceIn
from ..posting import post_entry

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.post("")
def create_invoice(body: InvoiceIn, _: dict = Depends(current_user)):
    with get_session() as s:
        if not s.get(Contact, body.contact_id):
            raise HTTPException(400, "Contact not found")
        subtotal = 0; tax_total = 0
        for ln in body.lines:
            line_total = ln.qty * ln.unit_price
            subtotal += line_total
            if ln.tax_id:
                t = s.get(Tax, ln.tax_id)
                if t:
                    tax_total += round(line_total * (t.rate/100.0), 2)
        total = round(subtotal + tax_total, 2)
        inv = Invoice(contact_id=body.contact_id, number=body.number, date=body.date,
                      due_date=body.due_date, subtotal=subtotal, tax_total=tax_total,
                      total=total, balance=total)
        s.add(inv); s.commit(); s.refresh(inv)
        # post AR entry: DR A/R, CR Revenue (+ CR VAT)
        # assume revenue account id = 4000, AR account id = 1200, VAT Out = 2100 by seed
        lines = [{"account_id":1200,"debit":total,"credit":0}]
        revenue_sum = subtotal
        if tax_total:
            lines.append({"account_id":2100,"debit":0,"credit":tax_total})
            revenue_sum = round(total - tax_total,2)
        lines.append({"account_id":4000,"debit":0,"credit":revenue_sum})
        post_entry(inv.date, lines, ref=f"INV {inv.number}", memo="Invoice approved")
        return inv
