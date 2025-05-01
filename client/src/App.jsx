import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import SymptomForm from "./components/SymptomForm";
import ResultModal from "./components/ResultModal";
import "./App.css";

function App() {
  const [step, setStep] = useState("landing");  // landing → form → result
  const [result, setResult] = useState(null);

  const handleStart = () => setStep("form");
  const handleSubmit = (data) => {
    setResult(data);
    setStep("result");
  };
  const handleBack = () => {
    setResult(null);
    setStep("form");
  };

  return (
    <div className="App">
      {step === "landing" && <LandingPage onStart={handleStart} />}
      {step === "form"    && <SymptomForm onSubmit={handleSubmit} />}
      {step === "result"  && <ResultModal data={result} onBack={handleBack} />}
    </div>
  );
}

export default App;
