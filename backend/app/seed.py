from .db import init_db, get_session
from .models import Account, Tax, Contact, User
from .auth import hash_password

def run():
    init_db()
    with get_session() as s:
        # Chart of Accounts (minimal)
        seeds = [
          Account(code="1000", name="Bank", type="asset"),
          Account(code="1200", name="Accounts Receivable", type="asset"),
          Account(code="2100", name="VAT Payable", type="liability"),
          Account(code="4000", name="Sales Revenue", type="income"),
          Account(code="5000", name="Expenses", type="expense"),
        ]
        for a in seeds:
            if not s.query(Account).filter(Account.code==a.code).first():
                s.add(a)
        if not s.query(Tax).count():
            s.add(Tax(name="VAT 5%", rate=5.0, inclusive=False, code="VAT5", country="AE"))
        if not s.query(Contact).count():
            s.add(Contact(name="Walk-in Customer", kind="customer"))
        if not s.query(User).filter(User.email=="admin@example.com").first():
            s.add(User(email="admin@example.com", hashed_password=hash_password("admin"), is_admin=True))
        s.commit()

if __name__ == "__main__":
    run()
