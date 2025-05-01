import React, { useState, useEffect } from "react";
import { AlertCircle, Coffee, Dumbbell, Pill, ChevronLeft } from "lucide-react";
import "./ResultModal.css";

export default function ResultModal({ data, onBack }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!data) return null;
  
  // Create utility function to ensure we're working with arrays
  const ensureArray = (item) => {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
  };
  
  // Ensure all our lists are arrays
  const precautions = ensureArray(data.precautions);
  const medications = ensureArray(data.medications);
  const diets = ensureArray(data.diets);
  const workouts = ensureArray(data.workouts);
  
  return (
    <div className={`result-modal ${isVisible ? 'visible' : ''}`}>
      <div className="result-header">
        <h2>Diagnosis: <span className="highlight">{data.disease}</span></h2>
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={18} />
          Try Again
        </button>
      </div>

      <div className="description-card">
        <div className="card-icon">
          <AlertCircle size={20} />
        </div>
        <div className="description-content">
          <h3>Description</h3>
          <p>{data.description}</p>
        </div>
      </div>

      <div className="result-cards">
        <div className="result-card precautions-card">
          <div className="card-header">
            <AlertCircle size={20} className="card-icon" />
            <h3>Precautions</h3>
          </div>
          <div className="card-content">
            {precautions.length > 0 ? (
              <ul>
                {precautions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No precautions available</p>
            )}
          </div>
        </div>

        <div className="result-card diet-card">
          <div className="card-header">
            <Coffee size={20} className="card-icon" />
            <h3>Diet</h3>
          </div>
          <div className="card-content">
            {diets.length > 0 ? (
              <ul>
                {diets.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No diet recommendations available</p>
            )}
          </div>
        </div>

        <div className="result-card workout-card">
          <div className="card-header">
            <Dumbbell size={20} className="card-icon" />
            <h3>Workout</h3>
          </div>
          <div className="card-content">
            {workouts.length > 0 ? (
              <ul>
                {workouts.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No workout recommendations available</p>
            )}
          </div>
        </div>

        <div className="result-card medication-card">
          <div className="card-header">
            <Pill size={20} className="card-icon" />
            <h3>Recommended Medicine</h3>
          </div>
          <div className="card-content">
            {medications.length > 0 ? (
              <div className="medication-grid">
                {medications.map((m, i) => (
                  <div className="medication-item" key={i}>
                    <Pill size={16} />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No medications available</p>
            )}
          </div>
          <div className="medication-disclaimer">
            *Always consult with a healthcare professional before taking any medication
          </div>
        </div>
      </div>
    </div>
  );
}