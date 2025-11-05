#!/usr/bin/env python3
"""Generate sample palm oil operational data and push it to configured Google Sheets.

Usage:
    python backend/scripts/generate_sample_data.py

The script expects the same environment variables as the FastAPI backend. It
uses the base64-encoded service account credentials to authenticate and will
create/update the worksheets defined by `*_TAB_NAME`.
"""
from __future__ import annotations

import datetime as dt
import math
import random
from dataclasses import dataclass
from typing import Callable, List

from dotenv import load_dotenv


@dataclass
class SheetTask:
  name: str
  sheet_id: str
  tab_name: str
  headers: List[str]
  generator: Callable[[], List[dict]]


def _round(value: float, digits: int = 2) -> float:
  return float(f"{value:.{digits}f}")


def generate_plantation_rows() -> List[dict]:
  estates = ['Estate Riau', 'Estate Kalbar', 'Estate Kaltim']
  today = dt.date.today()
  rows: List[dict] = []
  for day_offset in range(45):
    date = today - dt.timedelta(days=44 - day_offset)
    rainfall_base = 60 + 40 * math.sin(day_offset / 6)
    for estate in estates:
      area = random.uniform(35, 75)
      age = random.uniform(5, 13)
      efficiency = random.uniform(72, 92)
      avg_bunch_weight = random.uniform(18, 24)
      rainfall = max(0.0, rainfall_base + random.uniform(-20, 20))
      fertilizer_index = max(0.3, min(1.0, random.gauss(0.7, 0.12)))
      pest_incidence = max(0.0, min(12.0, random.gauss(4, 1.8)))
      harvest_factor = 0.58 + (efficiency / 100) * 0.45
      ffb = area * harvest_factor * (avg_bunch_weight / 15) * (1 - pest_incidence / 200)
      rows.append({
        'date': date.isoformat(),
        'estate': estate,
        'area_ha': _round(area, 2),
        'palm_age_year': _round(age, 1),
        'ffb_harvest_ton': _round(max(ffb, 0), 2),
        'harvest_efficiency_pct': _round(efficiency, 2),
        'avg_bunch_weight_kg': _round(avg_bunch_weight, 2),
        'rainfall_mm': _round(rainfall, 2),
        'fertilizer_index': _round(fertilizer_index, 3),
        'pest_incidence_pct': _round(pest_incidence, 2)
      })
  return rows


def generate_factory_rows() -> List[dict]:
  mills = ['Mill Sei Buatan', 'Mill Pelalawan']
  today = dt.date.today()
  rows: List[dict] = []
  for day_offset in range(30):
    date = today - dt.timedelta(days=29 - day_offset)
    for mill in mills:
      intake = random.uniform(480, 680)
      oee = random.uniform(72, 88)
      throughput = intake / 24 + random.uniform(-8, 8)
      downtime = max(0.5, random.gauss(2.5, 1.0))
      steam = random.uniform(18, 24)
      kernel = random.uniform(43, 48)
      yield_pct = random.uniform(21, 25)
      fuel = intake * random.uniform(4.5, 6.3)
      rows.append({
        'date': date.isoformat(),
        'mill': mill,
        'ffb_intake_ton': _round(intake, 2),
        'oee_pct': _round(oee, 2),
        'throughput_tph': _round(throughput, 2),
        'downtime_hours': _round(downtime, 2),
        'steam_pressure_bar': _round(steam, 2),
        'kernel_recovery_pct': _round(kernel, 2),
        'cpo_yield_pct': _round(yield_pct, 2),
        'fuel_consumption_litre': _round(fuel, 2)
      })
  return rows


def generate_company_rows() -> List[dict]:
  sites = ['Estate Riau', 'Mill Sei Buatan', 'Head Office']
  today = dt.date.today()
  rows: List[dict] = []
  for month_offset in range(12):
    date = (today - dt.timedelta(days=30 * (11 - month_offset))).replace(day=1)
    for site in sites:
      ffa = random.uniform(3.2, 5.8)
      moisture = random.uniform(0.25, 0.6)
      dirt = random.uniform(0.01, 0.08)
      grade = 'A' if ffa < 4.5 and moisture < 0.45 else 'B'
      revenue = random.uniform(45_000_000_000, 68_000_000_000)
      cogm = revenue * random.uniform(0.52, 0.6)
      opex = revenue * random.uniform(0.18, 0.26)
      gross_profit = revenue - cogm - opex
      rows.append({
        'date': date.isoformat(),
        'site': site,
        'cpo_ffa_pct': _round(ffa, 2),
        'cpo_moisture_pct': _round(moisture, 3),
        'cpo_dirt_pct': _round(dirt, 3),
        'cpo_quality_grade': grade,
        'revenue_idr': int(revenue),
        'cogm_idr': int(cogm),
        'opex_idr': int(opex),
        'gross_profit_idr': int(gross_profit)
      })
  return rows


def load_tasks() -> List[SheetTask]:
  load_dotenv()
  from app.config import CREDS_PATH, settings

  plantation_headers = [
    'date', 'estate', 'area_ha', 'palm_age_year', 'ffb_harvest_ton',
    'harvest_efficiency_pct', 'avg_bunch_weight_kg', 'rainfall_mm',
    'fertilizer_index', 'pest_incidence_pct'
  ]
  factory_headers = [
    'date', 'mill', 'ffb_intake_ton', 'oee_pct', 'throughput_tph',
    'downtime_hours', 'steam_pressure_bar', 'kernel_recovery_pct',
    'cpo_yield_pct', 'fuel_consumption_litre'
  ]
  company_headers = [
    'date', 'site', 'cpo_ffa_pct', 'cpo_moisture_pct', 'cpo_dirt_pct',
    'cpo_quality_grade', 'revenue_idr', 'cogm_idr', 'opex_idr', 'gross_profit_idr'
  ]

  return [
    SheetTask('Plantation', settings.plantation_sheet_id, settings.plantation_tab, plantation_headers, generate_plantation_rows),
    SheetTask('Factory', settings.factory_sheet_id, settings.factory_tab, factory_headers, generate_factory_rows),
    SheetTask('Company', settings.company_sheet_id, settings.company_tab, company_headers, generate_company_rows),
  ]


def main() -> None:
  tasks = load_tasks()
  from app.config import CREDS_PATH
  if not CREDS_PATH:
    raise RuntimeError('GOOGLE_SHEETS_CREDENTIALS_BASE64 is required to build credentials.')

  import gspread
  from gspread.exceptions import WorksheetNotFound

  client = gspread.service_account(filename=CREDS_PATH)

  for task in tasks:
    if not task.sheet_id:
      print(f"[skip] {task.name}: sheet id missing")
      continue

    worksheet = None
    spreadsheet = client.open_by_key(task.sheet_id)
    try:
      worksheet = spreadsheet.worksheet(task.tab_name)
    except WorksheetNotFound:
      worksheet = spreadsheet.add_worksheet(title=task.tab_name, rows="500", cols=str(len(task.headers)))

    rows = task.generator()
    values: List[List[object]] = [[row.get(header, '') for header in task.headers] for row in rows]
    worksheet.clear()
    worksheet.update([task.headers] + values, value_input_option='USER_ENTERED')
    print(f"[ok] {task.name}: wrote {len(rows)} rows to '{task.tab_name}'")
if __name__ == '__main__':
  main()

