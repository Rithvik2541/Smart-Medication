import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stethoscope, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import "./SymptomForm.css";

// Original symptom list is kept for general suggestions
const symptomList = [
  'itching', 'skin rash', 'nodal skin eruptions', 'continuous sneezing', 'shivering', 
  'chills', 'joint pain', 'stomach pain', 'acidity', 'ulcers on tongue', 'muscle wasting', 
  'vomiting', 'burning micturition', 'spotting  urination', 'fatigue', 'weight gain', 
  'anxiety', 'cold hands and feets', 'mood swings', 'weight loss', 'restlessness', 
  'lethargy', 'patches in throat', 'irregular sugar level', 'cough', 'high fever', 
  'sunken eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 
  'yellowish skin', 'dark urine', 'nausea', 'loss of appetite', 'pain behind the eyes', 
  'back pain', 'constipation', 'abdominal pain', 'diarrhoea', 'mild fever', 'yellow urine', 
  'yellowing of eyes', 'acute liver failure', 'swelling of stomach', 'swelled lymph nodes', 
  'malaise', 'blurred and distorted vision', 'phlegm', 'throat irritation', 'redness of eyes', 
  'sinus pressure', 'runny nose', 'congestion', 'chest pain', 'weakness in limbs', 
  'fast heart rate', 'pain during bowel movements', 'pain in anal region', 'bloody stool', 
  'irritation in anus', 'neck pain', 'dizziness', 'cramps', 'bruising', 'obesity', 
  'swollen legs', 'puffy face and eyes', 'enlarged thyroid', 'brittle nails', 
  'swollen extremeties', 'excessive hunger', 'extra marital contacts', 
  'drying and tingling lips', 'slurred speech', 'knee pain', 'hip joint pain', 
  'muscle weakness', 'stiff neck', 'swelling joints', 'movement stiffness', 
  'spinning movements', 'loss of balance', 'unsteadiness', 'weakness of one body side', 
  'loss of smell', 'bladder discomfort', 'continuous feel of urine', 'passage of gases', 
  'internal itching', 'toxic look (typhos)', 'depression', 'irritability', 'muscle pain', 
  'altered sensorium', 'red spots over body', 'belly pain', 'abnormal menstruation', 
  'watering from eyes', 'increased appetite', 'family history', 'mucoid sputum', 
  'rusty sputum', 'lack of concentration', 'visual disturbances', 'receiving blood transfusion', 
  'receiving unsterile injections', 'coma', 'stomach bleeding', 'distention of abdomen', 
  'history of alcohol consumption', 'fluid overload', 'blood in sputum', 
  'prominent veins on calf', 'palpitations', 'painful walking', 'pus filled pimples', 
  'blackheads', 'scurring', 'skin peeling', 'silver like dusting', 'small dents in nails', 
  'inflammatory nails', 'blister', 'red sore around nose', 'yellow crust ooze'
];

// Map of symptom co-occurrence relationships derived from the training data
// This maps symptoms to related symptoms that frequently appear together
const relatedSymptomsMap = {
  'itching': ['skin rash', 'nodal skin eruptions', 'dischromic patches'],
  'skin rash': ['itching', 'nodal skin eruptions', 'skin peeling', 'pus filled pimples'],
  'nodal skin eruptions': ['itching', 'skin rash'],
  'continuous sneezing': ['runny nose', 'congestion', 'chills', 'watering from eyes'],
  'shivering': ['chills', 'high fever', 'sweating'],
  'chills': ['shivering', 'fatigue', 'high fever', 'sweating'],
  'joint pain': ['muscle pain', 'swelling joints', 'movement stiffness', 'knee pain', 'hip joint pain'],
  'stomach pain': ['abdominal pain', 'acidity', 'vomiting', 'diarrhoea'],
  'acidity': ['stomach pain', 'indigestion', 'ulcers on tongue'],
  'ulcers on tongue': ['acidity', 'vomiting', 'patches in throat'],
  'muscle wasting': ['fatigue', 'muscle weakness', 'weight loss'],
  'vomiting': ['nausea', 'headache', 'abdominal pain', 'diarrhoea'],
  'burning micturition': ['spotting urination', 'bladder discomfort', 'foul smell of urine'],
  'spotting urination': ['burning micturition', 'bladder discomfort', 'continuous feel of urine'],
  'fatigue': ['weakness in limbs', 'lethargy', 'muscle weakness', 'malaise'],
  'weight gain': ['obesity', 'swollen legs', 'puffy face and eyes'],
  'anxiety': ['depression', 'irritability', 'restlessness'],
  'cold hands and feets': ['chills', 'fatigue'],
  'mood swings': ['anxiety', 'depression', 'irritability'],
  'weight loss': ['loss of appetite', 'fatigue', 'nausea'],
  'restlessness': ['anxiety', 'irritability', 'insomnia'],
  'lethargy': ['fatigue', 'malaise', 'weakness in limbs'],
  'patches in throat': ['throat irritation', 'cough', 'ulcers on tongue'],
  'irregular sugar level': ['excessive hunger', 'fatigue', 'increased appetite'],
  'cough': ['sore throat', 'breathlessness', 'high fever', 'congestion', 'phlegm'],
  'high fever': ['chills', 'sweating', 'headache', 'fatigue', 'mild fever'],
  'breathlessness': ['chest pain', 'fast heart rate', 'cough'],
  'sweating': ['high fever', 'chills', 'fatigue'],
  'dehydration': ['vomiting', 'diarrhoea', 'fatigue', 'dark urine'],
  'indigestion': ['stomach pain', 'acidity', 'nausea'],
  'headache': ['dizziness', 'pain behind the eyes', 'high fever', 'nausea'],
  'yellowish skin': ['yellowing of eyes', 'dark urine', 'yellow urine', 'jaundice'],
  'dark urine': ['yellowish skin', 'yellow urine', 'yellowing of eyes'],
  'nausea': ['vomiting', 'headache', 'loss of appetite'],
  'loss of appetite': ['nausea', 'weight loss', 'fatigue'],
  'pain behind the eyes': ['headache', 'watering from eyes', 'redness of eyes'],
  'back pain': ['neck pain', 'joint pain', 'muscle pain'],
  'constipation': ['abdominal pain', 'stomach pain', 'indigestion'],
  'abdominal pain': ['stomach pain', 'diarrhoea', 'vomiting', 'nausea'],
  'diarrhoea': ['abdominal pain', 'vomiting', 'stomach pain', 'dehydration'],
  'mild fever': ['high fever', 'sweating', 'chills'],
  'yellow urine': ['dark urine', 'yellowish skin', 'yellowing of eyes'],
  'yellowing of eyes': ['yellowish skin', 'dark urine', 'yellow urine'],
  'cough': ['throat irritation', 'phlegm', 'breathlessness', 'congestion'],
  'throat irritation': ['cough', 'patches in throat', 'phlegm'],
  'redness of eyes': ['watering from eyes', 'pain behind the eyes', 'blurred and distorted vision'],
  'sinus pressure': ['headache', 'runny nose', 'congestion'],
  'runny nose': ['continuous sneezing', 'congestion', 'watering from eyes'],
  'congestion': ['runny nose', 'continuous sneezing', 'cough'],
  'chest pain': ['breathlessness', 'fast heart rate', 'sweating'],
  'weakness in limbs': ['fatigue', 'muscle weakness', 'joint pain'],
  'fast heart rate': ['chest pain', 'breathlessness', 'palpitations'],
  'pain during bowel movements': ['constipation', 'abdominal pain', 'bloody stool'],
  'pain in anal region': ['bloody stool', 'irritation in anus', 'pain during bowel movements'],
  'neck pain': ['back pain', 'stiff neck', 'headache'],
  'dizziness': ['headache', 'loss of balance', 'spinning movements'],
  'cramps': ['muscle pain', 'abdominal pain', 'joint pain'],
  'bruising': ['muscle pain', 'joint pain', 'fatigue'],
  'muscle weakness': ['fatigue', 'weakness in limbs', 'muscle wasting'],
  'knee pain': ['joint pain', 'hip joint pain', 'swelling joints'],
  'stiff neck': ['neck pain', 'headache', 'back pain'],
  'swelling joints': ['joint pain', 'movement stiffness', 'knee pain'],
  'movement stiffness': ['joint pain', 'swelling joints', 'stiff neck'],
  'loss of balance': ['dizziness', 'spinning movements', 'unsteadiness'],
  'bladder discomfort': ['burning micturition', 'spotting urination', 'continuous feel of urine'],
  'foul smell of urine': ['burning micturition', 'bladder discomfort', 'dark urine'],
  'continuous feel of urine': ['burning micturition', 'bladder discomfort', 'spotting urination'],
  'internal itching': ['itching', 'skin rash', 'irritability'],
  'depression': ['anxiety', 'mood swings', 'irritability'],
  'irritability': ['anxiety', 'depression', 'mood swings'],
  'muscle pain': ['joint pain', 'fatigue', 'muscle weakness'],
  'red spots over body': ['skin rash', 'itching', 'nodal skin eruptions'],
  'belly pain': ['abdominal pain', 'stomach pain', 'nausea'],
  'abnormal menstruation': ['fatigue', 'mood swings', 'abdominal pain'],
  'watering from eyes': ['continuous sneezing', 'redness of eyes', 'runny nose'],
};

export default function SymptomForm({ onSubmit }) {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [relatedSuggestions, setRelatedSuggestions] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [currentSymptomsList, setCurrentSymptomsList] = useState([]);
  
  const [commonSymptoms] = useState([
    "headache", "high fever", "fatigue", "cough", "nausea", 
    "dizziness", "chest pain", "breathlessness", "itching", 
    "skin rash", "joint pain", "muscle weakness"
  ]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Update the current symptoms list whenever the symptoms text changes
  useEffect(() => {
    const symptomsArray = symptoms
      .split(",")
      .map(s => s.trim())
      .filter(s => s);
    
    setCurrentSymptomsList(symptomsArray);
    
    // Find related symptoms for all current symptoms
    const allRelatedSuggestions = new Set();
    symptomsArray.forEach(symptom => {
      const related = relatedSymptomsMap[symptom] || [];
      related.forEach(rel => {
        // Only add if not already in the current symptoms list
        if (!symptomsArray.includes(rel)) {
          allRelatedSuggestions.add(rel);
        }
      });
    });

    // Convert set to array and limit to top 5
    setRelatedSuggestions(Array.from(allRelatedSuggestions).slice(0, 5));
  }, [symptoms]);

  const handleChange = (e) => {
    const input = e.target.value;
    setSymptoms(input);

    // Extract the last word user is typing
    const parts = input.split(",");
    const lastWord = parts[parts.length - 1].trim().toLowerCase();

    // Filter suggestions
    if (lastWord.length > 0) {
      const matches = symptomList.filter(symptom =>
        symptom.toLowerCase().includes(lastWord)
      );
      // Sort matches: exact matches first, then those that start with the input
      const sortedMatches = matches.sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(lastWord);
        const bStartsWith = b.toLowerCase().startsWith(lastWord);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return 0;
      });
      
      setSuggestions(sortedMatches.slice(0, 5)); // show top 5 matches
    } else {
      setSuggestions([]);
    }
  };
  
  const addSymptom = (symptom) => {
    const currentSymptoms = symptoms
      .split(",")
      .map(s => s.trim())
      .filter(s => s);

    if (!currentSymptoms.includes(symptom)) {
      currentSymptoms.push(symptom);
      setSymptoms(currentSymptoms.join(", ") + (currentSymptoms.length > 0 ? ", " : ""));
      setSuggestions([]); // hide suggestions after adding
    }
  };

  const handleSuggestionClick = (symptom) => {
    // Split the current symptoms by comma
    const parts = symptoms.split(',');
    
    // Remove the last part (the one we're currently typing)
    parts.pop();
    
    // Add the selected suggestion as a new part
    parts.push(symptom);
    
    // Join everything back together with commas and add a trailing comma + space
    setSymptoms(parts.map(part => part.trim()).join(', ') + (parts.length > 0 ? ', ' : ''));
    
    // Clear suggestions
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    // Extract and count unique symptoms
    const uniqueSymptoms = [...new Set(
      symptoms.split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0)
    )];
    
    // Validate minimum symptoms requirement
    if (uniqueSymptoms.length < 3) {
      setValidationError("Please enter at least 3 different symptoms for a more accurate analysis.");
      return;
    }
    
    // Clear any previous errors
    setValidationError("");
    setLoading(true);
    
    try {
      // Convert to backend format: replace spaces with underscores
      const formattedSymptoms = uniqueSymptoms
        .map(s => s.toLowerCase().replace(/\s+/g, "_"))
        .join(",");

      const res = await axios.post("/api/predict", { symptoms: formattedSymptoms });
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
          {validationError && (
            <div className="validation-error">
              <AlertCircle size={16} />
              {validationError}
            </div>
          )}
          
          {/* Dropdown suggestions for currently typing */}
          {suggestions.length > 0 && (
            <ul className="suggestion-list">
              {suggestions.map((symptom, index) => {
                // Find the matching part to highlight
                const lastWord = symptoms.split(',').pop().trim().toLowerCase();
                const matchIndex = symptom.toLowerCase().indexOf(lastWord);
                
                if (matchIndex >= 0 && lastWord.length > 0) {
                  const beforeMatch = symptom.slice(0, matchIndex);
                  const match = symptom.slice(matchIndex, matchIndex + lastWord.length);
                  const afterMatch = symptom.slice(matchIndex + lastWord.length);
                  
                  return (
                    <li key={index} onClick={() => handleSuggestionClick(symptom)}>
                      {beforeMatch}<span className="suggestion-match">{match}</span>{afterMatch}
                    </li>
                  );
                }
                
                return (
                  <li key={index} onClick={() => handleSuggestionClick(symptom)}>
                    {symptom}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Related symptoms section - only show if we have current symptoms and related suggestions */}
        {currentSymptomsList.length > 0 && relatedSuggestions.length > 0 && (
          <div className="related-symptoms">
            <p style={{marginBottom: "8px", color: "gray"}}>Related symptoms you might also have:</p>
            <div className="symptom-tags">
              {relatedSuggestions.map((symptom, index) => (
                <button 
                  type="button" 
                  key={index} 
                  className="symptom-tag related-tag"
                  onClick={() => addSymptom(symptom)}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        )}
        
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