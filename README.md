# Palm Oil Ops Dashboard — React + FastAPI + Google Sheets (GitHub-ready)

A complete, production-ready template for a professional web dashboard to monitor:

1. **Perkebunan Kelapa Sawit** (Plantation)
2. **Pabrik CPO** (Factory)
3. **Perusahaan** (Company KPIs: quality & finance)

Includes:

* Frontend (**React + TypeScript + Tailwind + Recharts**) — can deploy to **GitHub Pages**
* Backend (**FastAPI + gspread**) — serves data from **Google Sheets**
* Basic ML for **Harvest Prediction** with fallback heuristic
* **GitHub Actions** CI/CD (build + deploy) for frontend; backend deploy via Render/Railway/Vercel
* Clear **Google Sheets schema** (3 spreadsheets or 3 tabs)

---

## 📁 Project Structure

```
palm-oil-dashboard/
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ KPICard.tsx
│  │  │  ├─ DataTable.tsx
│  │  │  ├─ LineChartCard.tsx
│  │  │  ├─ BarChartCard.tsx
│  │  │  └─ SectionNav.tsx
│  │  ├─ pages/
│  │  │  ├─ Plantation.tsx
│  │  │  ├─ Factory.tsx
│  │  │  └─ Company.tsx
│  │  ├─ services/api.ts
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  └─ index.css
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ tailwind.config.js
│  ├─ postcss.config.js
│  └─ vite.config.ts
├─ backend/
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ config.py
│  │  ├─ models.py
│  │  ├─ sheets.py
│  │  └─ ml.py
│  ├─ requirements.txt
│  ├─ runtime.txt
│  └─ .env.example
├─ .github/
│  └─ workflows/
│     ├─ deploy-frontend.yml
│     └─ ci-backend.yml
└─ README.md
```

---

## 🗂️ Google Sheets Schema (3 tabs — boleh 1 file atau 3 file terpisah)

> **Penting:** Share sheet ke service account email (dari `credentials.json`) dengan akses **Editor**.

### 1) `Plantation` (Perkebunan)

| Column                 | Type       | Notes                  |
| ---------------------- | ---------- | ---------------------- |
| date                   | YYYY-MM-DD | tanggal data           |
| estate                 | string     | nama kebun / blok      |
| area_ha                | number     | luas (ha)              |
| palm_age_year          | number     | umur tanam (tahun)     |
| ffb_harvest_ton        | number     | TBS panen (ton)        |
| harvest_efficiency_pct | number     | 0-100                  |
| avg_bunch_weight_kg    | number     | berat TBS rata2        |
| rainfall_mm            | number     | curah hujan            |
| fertilizer_index       | number     | indeks pemupukan (0-1) |
| pest_incidence_pct     | number     | serangan hama (%)      |

### 2) `Factory` (Pabrik CPO)

| Column                 | Type       | Notes                           |
| ---------------------- | ---------- | ------------------------------- |
| date                   | YYYY-MM-DD | tanggal data                    |
| mill                   | string     | nama pabrik                     |
| ffb_intake_ton         | number     | TBS masuk (ton)                 |
| oee_pct                | number     | Overall Equipment Effectiveness |
| throughput_tph         | number     | Ton/jam                         |
| downtime_hours         | number     | jam berhenti                    |
| steam_pressure_bar     | number     | utilitas                        |
| kernel_recovery_pct    | number     | kernel recovery                 |
| cpo_yield_pct          | number     | CPO yield (%)                   |
| fuel_consumption_litre | number     | konsumsi BBM                    |

### 3) `Company` (Perusahaan: Kualitas & Keuangan)

| Column            | Type       | Notes                    |
| ----------------- | ---------- | ------------------------ |
| date              | YYYY-MM-DD | tanggal                  |
| site              | string     | estate/mill/company-wide |
| cpo_ffa_pct       | number     | FFA                      |
| cpo_moisture_pct  | number     | Kadar air                |
| cpo_dirt_pct      | number     | Kotoran                  |
| cpo_quality_grade | string     | A/B/C                    |
| revenue_idr       | number     | pendapatan (IDR)         |
| cogm_idr          | number     | biaya produksi           |
| opex_idr          | number     | biaya operasi            |
| gross_profit_idr  | number     | (revenue - cogm - opex)  |

> **Catatan:** Nama sheet dapat diset via ENV; kolom minimal agar komponen dashboard tidak error.

---

## 🔐 Environment Variables (backend/.env)

```
GOOGLE_SHEETS_CREDENTIALS_BASE64=...   # base64 dari credentials.json service account
PLANTATION_SHEET_ID=...
FACTORY_SHEET_ID=...
COMPANY_SHEET_ID=...
PLANTATION_TAB_NAME=Plantation
FACTORY_TAB_NAME=Factory
COMPANY_TAB_NAME=Company
PORT=8000
```

> Untuk keamanan di GitHub, simpan `GOOGLE_SHEETS_CREDENTIALS_BASE64` sebagai **Repository Secret**. File `credentials.json` tidak perlu dipush — backend akan membangunnya dari ENV.

---

## 🧠 Model Prediksi Hasil Panen (FFB/Ton)

* **Fitur**: `area_ha, palm_age_year, harvest_efficiency_pct, avg_bunch_weight_kg, rainfall_mm, fertilizer_index, pest_incidence_pct`
* **Model**: Regresi linear (scikit-learn).
* **Target**: `ffb_harvest_ton`
* **Fallback Heuristic** (jika data training < 30 baris):

  ( \hat{Y} = (area_ha) \times (0.6 + 0.02\times harvest_eff_pct) \times (avg_bunch_weight_kg/1000) \times (1 + 0.001\times rainfall_mm) \times (0.8 + 0.2\times fertilizer_index) \times (1 - 0.005\times pest_incidence_pct) \times f(age) )

  dengan ( f(age) = \min(1, \max(0.6, 1 - |palm_age_year-8|/10)) )

> Heuristic ini konservatif dan bisa diganti jika Anda punya formula internal.

---

## 🖥️ Frontend (React + TS + Tailwind + Recharts)

### `frontend/package.json`

```json
{
  "name": "palm-oil-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.0",
    "vite": "^5.0.8"
  }
}
```

### `frontend/tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0ea5e9',
          dark: '#0369a1'
        }
      }
    },
  },
  plugins: [],
}
```

### `frontend/postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `frontend/vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
```

### `frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light dark; }
body { @apply bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100; }
.card { @apply rounded-2xl shadow-sm border border-slate-200 bg-white dark:bg-slate-800; }
.card-pad { @apply p-4 md:p-6; }
```

### `frontend/src/services/api.ts`

```ts
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  plantation: () => get('/data/plantation'),
  factory: () => get('/data/factory'),
  company: () => get('/data/company'),
  predictHarvest: (payload: any) => fetch(`${API_BASE}/predict/harvest`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  }).then(r => r.json())
}
```

### `frontend/src/components/KPICard.tsx`

```tsx
import React from 'react';

export default function KPICard({ title, value, unit, trend }: { title: string; value: number | string; unit?: string; trend?: number; }) {
  const trendColor = trend && trend >= 0 ? 'text-green-600' : 'text-red-600';
  const trendSign = trend && trend >= 0 ? '+' : '';
  return (
    <div className="card card-pad">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}{unit ? <span className="text-base font-normal ml-1">{unit}</span> : null}</div>
      {typeof trend === 'number' && (
        <div className={`mt-1 text-sm ${trendColor}`}>{trendSign}{trend.toFixed(2)}%</div>
      )}
    </div>
  );
}
```

### `frontend/src/components/DataTable.tsx`

```tsx
import React from 'react';

type Props = { columns: string[]; rows: Record<string, any>[] };
export default function DataTable({ columns, rows }: Props) {
  return (
    <div className="card card-pad overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c} className="text-left font-medium text-slate-500 pb-2 pr-6">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-200">
              {columns.map(c => (
                <td key={c} className="py-2 pr-6">{String(r[c] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );}
```

### `frontend/src/components/LineChartCard.tsx`

```tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LineChartCard({ title, data, xKey, yKey }: { title: string; data: any[]; xKey: string; yKey: string; }) {
  return (
    <div className="card card-pad">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### `frontend/src/components/BarChartCard.tsx`

```tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChartCard({ title, data, xKey, yKey }: { title: string; data: any[]; xKey: string; yKey: string; }) {
  return (
    <div className="card card-pad">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yKey} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### `frontend/src/components/SectionNav.tsx`

```tsx
import React from 'react';

export default function SectionNav({ section, setSection }: { section: string; setSection: (s: string) => void; }) {
  const tabs = [
    { id: 'plantation', label: 'Perkebunan' },
    { id: 'factory', label: 'Pabrik CPO' },
    { id: 'company', label: 'Perusahaan' }
  ];
  return (
    <div className="flex gap-2">
      {tabs.map(t => (
        <button key={t.id} onClick={() => setSection(t.id)} className={`px-4 py-2 rounded-xl border ${section===t.id? 'bg-brand text-white border-brand' : 'bg-white dark:bg-slate-800 border-slate-300'}`}>{t.label}</button>
      ))}
    </div>
  );
}
```

### `frontend/src/pages/Plantation.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import LineChartCard from '../components/LineChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Plantation() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api.plantation().then(setRows).catch(console.error) }, []);

  const totalFFB = rows.reduce((s,r)=> s + (Number(r.ffb_harvest_ton)||0), 0);
  const avgEff = rows.length? rows.reduce((s,r)=> s + (Number(r.harvest_efficiency_pct)||0),0)/rows.length : 0;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total TBS (ton)" value={Number(totalFFB.toFixed(2))} />
        <KPICard title="Rata2 Efisiensi Panen" value={Number(avgEff.toFixed(2))} unit="%" />
        <KPICard title="Blok Terpantau" value={rows.map(r=>r.estate).filter(Boolean).length} />
      </div>
      <LineChartCard title="Panen TBS per Tanggal" data={rows} xKey="date" yKey="ffb_harvest_ton" />
      <DataTable columns={["date","estate","area_ha","palm_age_year","ffb_harvest_ton","harvest_efficiency_pct","avg_bunch_weight_kg","rainfall_mm","fertilizer_index","pest_incidence_pct"]} rows={rows} />
    </div>
  );
}
```

### `frontend/src/pages/Factory.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import BarChartCard from '../components/BarChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Factory() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api.factory().then(setRows).catch(console.error) }, []);

  const avgYield = rows.length? rows.reduce((s,r)=> s + (Number(r.cpo_yield_pct)||0),0)/rows.length : 0;
  const totalIntake = rows.reduce((s,r)=> s + (Number(r.ffb_intake_ton)||0), 0);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Rata2 CPO Yield" value={Number(avgYield.toFixed(2))} unit="%" />
        <KPICard title="Total TBS Masuk" value={Number(totalIntake.toFixed(2))} />
        <KPICard title="Rata2 OEE" value={Number((rows.reduce((s,r)=> s + (Number(r.oee_pct)||0),0)/Math.max(rows.length,1)).toFixed(2))} unit="%" />
      </div>
      <BarChartCard title="Throughput (ton/jam)" data={rows} xKey="date" yKey="throughput_tph" />
      <DataTable columns={["date","mill","ffb_intake_ton","oee_pct","throughput_tph","downtime_hours","steam_pressure_bar","kernel_recovery_pct","cpo_yield_pct","fuel_consumption_litre"]} rows={rows} />
    </div>
  );
}
```

### `frontend/src/pages/Company.tsx`

```tsx
import React, { useEffect, useMemo, useState } from 'react';
import KPICard from '../components/KPICard';
import LineChartCard from '../components/LineChartCard';
import DataTable from '../components/DataTable';
import { api } from '../services/api';

export default function Company() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api.company().then(setRows).catch(console.error) }, []);

  const totals = useMemo(()=>{
    const revenue = rows.reduce((s,r)=> s + (Number(r.revenue_idr)||0), 0);
    const cogm = rows.reduce((s,r)=> s + (Number(r.cogm_idr)||0), 0);
    const opex = rows.reduce((s,r)=> s + (Number(r.opex_idr)||0), 0);
    const gp = rows.reduce((s,r)=> s + (Number(r.gross_profit_idr)|| (Number(r.revenue_idr)||0) - (Number(r.cogm_idr)||0) - (Number(r.opex_idr)||0), 0);
    return { revenue, cogm, opex, gp };
  }, [rows]);

  const qualityAlert = rows.find(r => (Number(r.cpo_ffa_pct)||0) > 5 || (Number(r.cpo_moisture_pct)||0) > 0.5);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Pendapatan (IDR)" value={totals.revenue.toLocaleString()} />
        <KPICard title="COGM (IDR)" value={totals.cogm.toLocaleString()} />
        <KPICard title="OPEX (IDR)" value={totals.opex.toLocaleString()} />
        <KPICard title="Laba Kotor (IDR)" value={totals.gp.toLocaleString()} />
      </div>
      {qualityAlert && (
        <div className="card card-pad border-amber-400 bg-amber-50 text-amber-900">
          ⚠️ **Quality Alert:** Cek FFA/Moisture di tanggal {qualityAlert.date} (Site: {qualityAlert.site})
        </div>
      )}
      <LineChartCard title="FFA (%) dari waktu ke waktu" data={rows} xKey="date" yKey="cpo_ffa_pct" />
      <DataTable columns={["date","site","cpo_ffa_pct","cpo_moisture_pct","cpo_dirt_pct","cpo_quality_grade","revenue_idr","cogm_idr","opex_idr","gross_profit_idr"]} rows={rows} />
    </div>
  );
}
```

### `frontend/src/App.tsx`

```tsx
import React, { useState } from 'react';
import SectionNav from './components/SectionNav';
import Plantation from './pages/Plantation';
import Factory from './pages/Factory';
import Company from './pages/Company';

export default function App() {
  const [section, setSection] = useState('plantation');
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Palm Oil Ops Dashboard</h1>
        <SectionNav section={section} setSection={setSection} />
      </header>
      {section === 'plantation' && <Plantation/>}
      {section === 'factory' && <Factory/>}
      {section === 'company' && <Company/>}
    </div>
  );
}
```

### `frontend/src/main.tsx`

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### `frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Palm Oil Ops Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "ES2020"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "baseUrl": ".",
    "paths": {}
  },
  "include": ["src"]
}
```

---

## ⚙️ Backend (FastAPI)

### `backend/requirements.txt`

```
fastapi==0.115.0
uvicorn[standard]==0.30.6
gspread==6.1.2
google-auth==2.34.0
pydantic==2.8.2
pandas==2.2.2
scikit-learn==1.5.2
python-dotenv==1.0.1
```

### `backend/runtime.txt`

```
python-3.11.9
```

### `backend/.env.example`

```
GOOGLE_SHEETS_CREDENTIALS_BASE64=
PLANTATION_SHEET_ID=
FACTORY_SHEET_ID=
COMPANY_SHEET_ID=
PLANTATION_TAB_NAME=Plantation
FACTORY_TAB_NAME=Factory
COMPANY_TAB_NAME=Company
PORT=8000
```

### `backend/app/config.py`

```py
import base64, json, os, tempfile
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
```

### `backend/app/sheets.py`

```py
import gspread
import pandas as pd
from .config import CREDS_PATH, settings

class SheetClient:
    def __init__(self):
        if not CREDS_PATH:
            raise RuntimeError('Missing Google credentials')
        self.gc = gspread.service_account(filename=CREDS_PATH)

    def read_records(self, sheet_id: str, tab_name: str) -> list[dict]:
        sh = self.gc.open_by_key(sheet_id)
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
```

### `backend/app/models.py`

```py
from pydantic import BaseModel

class HarvestFeatures(BaseModel):
    area_ha: float
    palm_age_year: float
    harvest_efficiency_pct: float
    avg_bunch_weight_kg: float
    rainfall_mm: float = 0.0
    fertilizer_index: float = 0.5
    pest_incidence_pct: float = 0.0
```

### `backend/app/ml.py`

```py
import math
import pandas as pd
from sklearn.linear_model import LinearRegression
from .sheets import get_plantation

class HarvestModel:
    def __init__(self):
        self.model = None
        self.trained = False
        self.train()

    def train(self):
        data = pd.DataFrame(get_plantation())
        cols = [
            'area_ha', 'palm_age_year', 'harvest_efficiency_pct',
            'avg_bunch_weight_kg', 'rainfall_mm', 'fertilizer_index', 'pest_incidence_pct'
        ]
        target = 'ffb_harvest_ton'
        if len(data) >= 30 and all(c in data.columns for c in cols + [target]):
            X = data[cols].astype(float)
            y = data[target].astype(float)
            self.model = LinearRegression().fit(X, y)
            self.trained = True
        else:
            self.trained = False

    def predict(self, f: dict) -> float:
        if self.trained and self.model is not None:
            import numpy as np
            X = np.array([[f['area_ha'], f['palm_age_year'], f['harvest_efficiency_pct'], f['avg_bunch_weight_kg'], f.get('rainfall_mm',0), f.get('fertilizer_index',0.5), f.get('pest_incidence_pct',0.0)]])
            y = self.model.predict(X)[0]
            return max(0.0, float(y))
        # fallback heuristic
        area = float(f['area_ha'])
        age = float(f['palm_age_year'])
        eff = float(f['harvest_efficiency_pct'])/100.0
        abw_ton = float(f['avg_bunch_weight_kg'])/1000.0
        rain = float(f.get('rainfall_mm', 0.0))
        fert = float(f.get('fertilizer_index', 0.5))
        pest = float(f.get('pest_incidence_pct', 0.0))/100.0
        age_factor = min(1.0, max(0.6, 1 - abs(age-8)/10))
        yhat = area * (0.6 + 0.2*eff) * abw_ton * (1 + 0.001*rain) * (0.8 + 0.2*fert) * (1 - 0.5*pest) * age_factor
        return max(0.0, yhat)

harvest_model = HarvestModel()
```

### `backend/app/main.py`

```py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .sheets import get_plantation, get_factory, get_company
from .models import HarvestFeatures
from .ml import harvest_model

app = FastAPI(title="Palm Oil Ops API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/health')
def health():
    return {"ok": True}

@app.get('/data/plantation')
def plantation():
    return get_plantation()

@app.get('/data/factory')
def factory():
    return get_factory()

@app.get('/data/company')
def company():
    return get_company()

@app.post('/predict/harvest')
def predict_harvest(feat: HarvestFeatures):
    y = harvest_model.predict(feat.model_dump())
    return {"predicted_ffb_ton": round(y, 3)}
```

---

## 🔧 GitHub Actions (CI/CD)

### `/.github/workflows/deploy-frontend.yml`

```yaml
name: Deploy Frontend to GitHub Pages
on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-frontend.yml'
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install deps
        working-directory: frontend
        run: npm ci
      - name: Build
        working-directory: frontend
        env:
          VITE_API_BASE: ${{ secrets.API_BASE_URL }}
          VITE_BASE_PATH: '/${{ github.event.repository.name }}/'
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### `/.github/workflows/ci-backend.yml`

```yaml
name: Backend CI
on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'
      - '.github/workflows/ci-backend.yml'
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - name: Install
        working-directory: backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      - name: Lint (basic import check)
        working-directory: backend
        run: python -c "import fastapi, gspread, pandas, sklearn; print('ok')"
```

> **Backend Deployment**: gunakan Render.com / Railway.app. Set ENV dari `.env.example` dan **GOOGLE_SHEETS_CREDENTIALS_BASE64** dari file `credentials.json` yang di-base64.

---

## 📘 README (root)

### Setup Cepat

1. **Siapkan Google Service Account** & `credentials.json` → share akses Editor ke Spreadsheet.
2. Encode `credentials.json` menjadi base64: `base64 -w0 credentials.json > creds.b64`
3. Isi **Secrets** di GitHub repo:

   * `API_BASE_URL` → URL backend (misal: [https://palm-oil-api.onrender.com](https://palm-oil-api.onrender.com))
   * `GOOGLE_SHEETS_CREDENTIALS_BASE64`, `*_SHEET_ID`, `*_TAB_NAME` (di hosting backend)
4. **Deploy Backend** ke Render/Railway (Python 3.11, start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
5. **Deploy Frontend**: push ke `main`, Pages otomatis aktif. Akses: `https://<username>.github.io/<repo>/`.

### Development Lokal

* Backend: `cd backend && uvicorn app.main:app --reload`
* Frontend: `cd frontend && npm install && npm run dev`
* ENV frontend: buat `.env` (opsional) berisi `VITE_API_BASE=http://localhost:8000`

### Prediksi Panen

* Endpoint: `POST /predict/harvest`
* Body:

```json
{
  "area_ha": 50,
  "palm_age_year": 7,
  "harvest_efficiency_pct": 85,
  "avg_bunch_weight_kg": 18,
  "rainfall_mm": 120,
  "fertilizer_index": 0.8,
  "pest_incidence_pct": 5
}
```

* Response: `{ "predicted_ffb_ton": 123.456 }`

---

## ✅ Checklist sebelum Live

* [ ] Service account sudah punya akses ke semua sheet
* [ ] Backend ENV benar & hidup (cek `/health`)
* [ ] Secrets GitHub: `API_BASE_URL` di-set
* [ ] Pages URL cocok dengan `VITE_BASE_PATH`

---

> Siap dipakai. Anda bisa menyalin struktur dan file-file ini ke repo GitHub Anda, lalu melakukan penyesuaian tema/branding sesuai kebutuhan. Jika ingin saya bantu isi **contoh data Google Sheets** (CSV template) atau menyesuaikan metrik tambahan (misalnya losses di sterilizer, press, klarifikasi, dsb.), beri tahu saja kolom yang diinginkan.
