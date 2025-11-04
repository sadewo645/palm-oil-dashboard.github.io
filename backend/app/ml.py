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
