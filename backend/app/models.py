from pydantic import BaseModel

class HarvestFeatures(BaseModel):
    area_ha: float
    palm_age_year: float
    harvest_efficiency_pct: float
    avg_bunch_weight_kg: float
    rainfall_mm: float = 0.0
    fertilizer_index: float = 0.5
    pest_incidence_pct: float = 0.0
