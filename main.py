from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)

# ─── Load model & rebuild mapping ────────────────────────────────
svc = pickle.load(open("svc.pkl", "rb"))
train = pd.read_csv("Training.csv")
feature_cols = [c.strip() for c in train.columns if c.strip() != "prognosis"]
symptoms_dict = {sym: i for i, sym in enumerate(feature_cols)}
print("Loaded model expecting", svc.n_features_in_, "features; mapping has", len(symptoms_dict)) 

# ─── Static data CSVs ───────────────────────────────────────────
sym_des     = pd.read_csv("symtoms_df.csv")
precautions = pd.read_csv("precautions_df.csv")
workout     = pd.read_csv("workout_df.csv")
description = pd.read_csv("description.csv")
medications = pd.read_csv("medications.csv")
diets       = pd.read_csv("diets.csv")

# ─── Diseases lookup (unchanged) ────────────────────────────────
diseases_list =  {15: 'Fungal infection', 4: 'Allergy', 16: 'GERD', 9: 'Chronic cholestasis', 14: 'Drug Reaction', 33: 'Peptic ulcer disease', 1: 'AIDS', 12: 'Diabetes', 17: 'Gastroenteritis', 6: 'Bronchial Asthma', 23: 'Hypertension', 30: 'Migraine', 7: 'Cervical spondylosis', 32: 'Paralysis (brain hemorrhage)', 28: 'Jaundice', 29: 'Malaria', 8: 'Chicken pox', 11: 'Dengue', 37: 'Typhoid', 40: 'hepatitis A', 19: 'Hepatitis B', 20: 'Hepatitis C', 21: 'Hepatitis D', 22: 'Hepatitis E', 3: 'Alcoholic hepatitis', 36: 'Tuberculosis', 10: 'Common Cold', 34: 'Pneumonia', 13: 'Dimorphic hemmorhoids(piles)', 18: 'Heart attack', 39: 'Varicose veins', 26: 'Hypothyroidism', 24: 'Hyperthyroidism', 25: 'Hypoglycemia', 31: 'Osteoarthristis', 5: 'Arthritis', 0: '(vertigo) Paroymsal  Positional Vertigo', 2: 'Acne', 38: 'Urinary tract infection', 35: 'Psoriasis', 27: 'Impetigo'}

def helper(dis):
    #Get description
    desc = description[description['Disease'] == dis]['Description']
    desc = " ".join([str(w) for w in desc])  # Convert to string explicitly

    #Get precautions
    pre = precautions[precautions['Disease'] == dis][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']]
    pre_values = pre.values.tolist()  # Convert numpy array to Python list
    pre = [[str(item) for item in row] for row in pre_values]  # Convert all items to strings
    
    #Get medications - Parse string representation of list into actual list
    med = medications[medications['Disease'] == dis]['Medication']
    med_list = []
    for m in med:
        # Check if the value is a string representation of a list
        m_str = str(m)
        if m_str.startswith('[') and m_str.endswith(']'):
            # Extract items from the string representation
            items = m_str.strip('[]').split(',')
            # Clean up each item (remove quotes and extra spaces)
            items = [item.strip().strip("'\"") for item in items]
            med_list.extend(items)
        else:
            med_list.append(m_str)
    
    # Get diets - Parse string representation of list into actual list
    die = diets[diets['Disease'] == dis]['Diet']
    die_list = []
    for d in die:
        d_str = str(d)
        if d_str.startswith('[') and d_str.endswith(']'):
            items = d_str.strip('[]').split(',')
            items = [item.strip().strip("'\"") for item in items]
            die_list.extend(items)
        else:
            die_list.append(d_str)
    
    # Get workouts - Parse string representation of list into actual list
    wrkout = workout[workout['disease'] == dis]['workout']
    workout_list = []
    for w in wrkout:
        w_str = str(w)
        if w_str.startswith('[') and w_str.endswith(']'):
            items = w_str.strip('[]').split(',')
            items = [item.strip().strip("'\"") for item in items]
            workout_list.extend(items)
        else:
            workout_list.append(w_str)
    
    return desc, pre, med_list, die_list, workout_list


def get_predicted_value(patient_symptoms):
    valid_symptoms = []
    invalid_symptoms = []
    
    # Create vector with zeros
    vec = np.zeros(svc.n_features_in_, dtype=int)
    
    for s in patient_symptoms:
        idx = symptoms_dict.get(s)
        if idx is not None:
            vec[idx] = 1
            valid_symptoms.append(s)
        else:
            invalid_symptoms.append(s)
    
    # Check if we have valid symptoms
    if not valid_symptoms:
        return None, invalid_symptoms, valid_symptoms
    
    pred = int(svc.predict([vec])[0])  # Convert to regular Python int
    return diseases_list[pred], invalid_symptoms, valid_symptoms


@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json(force=True)
    user_syms = [s.strip() for s in data.get("symptoms", "").split(",") if s.strip()]
    
    disease, invalid_symptoms, valid_symptoms = get_predicted_value(user_syms)
    
    if not disease:
        return jsonify({
            "error": "No valid symptoms provided",
            "invalid_symptoms": invalid_symptoms,
            "valid_symptoms": []
        }), 400
    
    desc, pre, med, die, wrk = helper(disease)
    
    # Flatten the precautions list if it's nested
    if pre and isinstance(pre[0], list):
        pre = [item for sublist in pre for item in sublist if item]
    
    return jsonify({
        "disease": disease,
        "description": desc,
        "precautions": pre,
        "medications": med,
        "diets": die, 
        "workouts": wrk,
        "invalid_symptoms": invalid_symptoms,
        "valid_symptoms": valid_symptoms
    })


@app.route("/api/symptoms", methods=["GET"])
def get_symptoms():
    """Return a list of all valid symptoms"""
    return jsonify({
        "symptoms": list(symptoms_dict.keys())
    })


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)