import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stethoscope, ArrowRight, Loader2 } from "lucide-react";
import "./SymptomForm.css";

export default function SymptomForm({ onSubmit }) {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [commonSymptoms] = useState([
    "headache", "fever", "fatigue", "cough", "nausea", 
    "dizziness", "chest pain", "shortness of breath", "itching", 
    "rash", "joint pain", "muscle weakness"
  ]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => setSymptoms(e.target.value);
  
  const addSymptom = (symptom) => {
    if (symptoms) {
      if (!symptoms.split(",").map(s => s.trim()).includes(symptom)) {
        setSymptoms(prevSymptoms => `${prevSymptoms}, ${symptom}`);
      }
    } else {
      setSymptoms(symptom);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post("/api/predict", { symptoms });
      onSubmit(res.data);
    } catch (err) {
      alert("Failed to fetch prediction. Is your Flask server running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`symptom-form-container ${isVisible ? 'visible' : ''}`}>
      <div className="form-header">
        <Stethoscope size={28} className="stethoscope-icon" />
        <h2>Symptom <span className="highlight">Analysis</span></h2>
      </div>
      
      <p className="form-description">
        Enter your symptoms below, separated by commas. Our AI will analyze them
        and provide personalized recommendations based on clinical data.
      </p>
      
      <form className="symptom-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="symptoms">Your symptoms:</label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={handleChange}
            placeholder="e.g. itching, headache, fatigue"
            required
          />
          <div className="input-backdrop"></div>
        </div>
        
        <div className="common-symptoms">
          <p>Common symptoms:</p>
          <div className="symptom-tags">
            {commonSymptoms.map((symptom, index) => (
              <button 
                type="button" 
                key={index} 
                className="symptom-tag"
                onClick={() => addSymptom(symptom)}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className="submit-button" 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="spinner" size={16} />
              Analyzing...
            </>
          ) : (
            <>
              Predict 
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
      
      <div className="form-footer">
        <p>
          Note: This analysis is meant to provide general guidance only. 
          Always consult with a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
}