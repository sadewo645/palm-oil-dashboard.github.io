import base64, os, tempfile
from pydantic import BaseModel

class Settings(BaseModel):
    creds_b64: str = os.getenv('GOOGLE_SHEETS_CREDENTIALS_BASE64', '')
    plantation_sheet_id: str = os.getenv('PLANTATION_SHEET_ID', '')
    factory_sheet_id: str = os.getenv('FACTORY_SHEET_ID', '')
    company_sheet_id: str = os.getenv('COMPANY_SHEET_ID', '')
    plantation_tab: str = os.getenv('PLANTATION_TAB_NAME', 'Plantation')
    factory_tab: str = os.getenv('FACTORY_TAB_NAME', 'Factory')
    company_tab: str = os.getenv('COMPANY_TAB_NAME', 'Company')
    port: int = int(os.getenv('PORT', '8000'))

settings = Settings()

# build credentials.json in temp file from base64
CREDS_FILE = None
if settings.creds_b64:
    data = base64.b64decode(settings.creds_b64)
    CREDS_FILE = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
    CREDS_FILE.write(data)
    CREDS_FILE.flush()
    CREDS_FILE.close()
    CREDS_PATH = CREDS_FILE.name
else:
    CREDS_PATH = ''
