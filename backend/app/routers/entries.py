from fastapi import APIRouter, Depends
from ..schemas import EntryIn
from ..posting import post_entry
from ..auth import current_user

router = APIRouter(prefix="/entries", tags=["entries"])

@router.post("")
def create_entry(body: EntryIn, _: dict = Depends(current_user)):
    eid = post_entry(body.jdate, [l.dict() for l in body.lines], body.ref, body.memo)
    return {"entry_id": eid}
