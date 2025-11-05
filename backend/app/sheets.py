import logging
import gspread
from gspread.exceptions import SpreadsheetNotFound, WorksheetNotFound
from .config import CREDS_PATH, settings

logger = logging.getLogger(__name__)

class SheetClient:
    def __init__(self):
        if not CREDS_PATH:
            raise RuntimeError('Missing Google credentials')
        self.gc = gspread.service_account(filename=CREDS_PATH)

    def read_records(self, sheet_id: str, tab_name: str) -> list[dict]:
        if not sheet_id:
            logger.warning("Sheet ID is not configured for tab '%s'", tab_name)
            return []

        try:
            sh = self.gc.open_by_key(sheet_id)
        except SpreadsheetNotFound:
            logger.warning("Spreadsheet '%s' not found or inaccessible", sheet_id)
            return []

        try:
            # Tambahan debug opsional untuk membantu jika tab tidak ditemukan
            print("=== Available worksheets ===")
            print([ws.title for ws in sh.worksheets()])
            print("=== Looking for tab:", tab_name, "===")

            ws = sh.worksheet(tab_name)
        except WorksheetNotFound:
            available = [ws.title for ws in sh.worksheets()]
            logger.warning(
                "Worksheet '%s' not found in sheet '%s'. Available worksheets: %s",
                tab_name,
                sheet_id,
                ", ".join(available) or "<none>",
            )
            return []

        rows = ws.get_all_records()
        return rows


sheets = SheetClient()


def get_plantation():
    return sheets.read_records(settings.plantation_sheet_id, settings.plantation_tab)


def get_factory():
    return sheets.read_records(settings.factory_sheet_id, settings.factory_tab)


def get_company():
    return sheets.read_records(settings.company_sheet_id, settings.company_tab)
