import gspread
from .config import CREDS_PATH, settings

class SheetClient:
    def __init__(self):
        if not CREDS_PATH:
            raise RuntimeError('Missing Google credentials')
        self.gc = gspread.service_account(filename=CREDS_PATH)

def read_records(self, sheet_id: str, tab_name: str) -> list[dict]:
    sh = self.gc.open_by_key(sheet_id)
    print("=== Available worksheets ===")
    print([ws.title for ws in sh.worksheets()])   # 🟢 Tambahkan ini
    print("=== Looking for tab:", tab_name, "===") # 🟢 Tambahkan ini
    ws = sh.worksheet(tab_name)
    rows = ws.get_all_records()
    return rows

sheets = SheetClient()

def get_plantation():
    return sheets.read_records(settings.plantation_sheet_id, settings.plantation_tab)

def get_factory():
    return sheets.read_records(settings.factory_sheet_id, settings.factory_tab)

def get_company():
    return sheets.read_records(settings.company_sheet_id, settings.company_tab)



