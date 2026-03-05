from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()

icu_model = joblib.load("icu_model.pkl")
# arima_model = joblib.load("arima_model.pkl")


@app.post("/predict-icu-risk")
def predict_icu(data: dict):
    try:
        features = np.array([[
            float(data["age"]),
            float(data["severity_score"]),
            float(data["oxygen_level"]),
            float(data["heart_rate"]),
            float(data["comorbidities"])
        ]], dtype=float)

        prob = icu_model.predict_proba(features)[0][1]

        return {"risk": float(prob)}

    except Exception as e:
        return {"error": str(e)}


from statsmodels.tsa.arima.model import ARIMA

@app.post("/predict-inflow")
def predict_inflow(data: dict):
    history = data["history"]

    model = ARIMA(history, order=(2,1,2))
    fit = model.fit()

    forecast = fit.forecast(steps=5)

    return {"forecast": forecast.tolist()}