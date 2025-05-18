import React, { useState, useEffect } from "react";
import { ArrowRight, Brain, Heart, Activity, Pill, Shield, Settings } from "lucide-react";
import "./LandingPage.css";

export default function LandingPage({ onStart }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Brain className="feature-icon" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models accurately predict diseases based on your symptoms."
    },
    {
      icon: <Pill className="feature-icon" />,
      title: "Medication Recommendations",
      description: "Receive personalized suggestions for the top 5 medicines with prescription details."
    },
    {
      icon: <Activity className="feature-icon" />,
      title: "Lifestyle Guidance",
      description: "Get tailored workout routines and dietary advice based on your health condition."
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Privacy & Security",
      description: "Your health information is handled with the utmost confidentiality and security."
    },
    {
      icon: <Settings className="feature-icon" />,
      title: "Continuous Improvement",
      description: "Our ML models evolve over time to provide increasingly accurate recommendations."
    },
    {
      icon: <Heart className="feature-icon" />,
      title: "User-Friendly Interface",
      description: "Intuitive design allows you to input symptoms and receive guidance effortlessly."
    }
  ];

  const testimonials = [
    {
      text: "This platform helped me understand my symptoms before visiting my doctor. Highly recommend!",
      name: "Sarah J."
    },
    {
      text: "The medication recommendations were spot on with what my physician later prescribed.",
      name: "Michael T."
    },
    {
      text: "I love how the app suggests specific dietary changes based on my condition.",
      name: "Elena R."
    }
  ];

  return (
    <div className={`landing ${isVisible ? 'visible' : ''}`}>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Smart</span> Medication <br />
            <span className="highlight">Recommender</span>
          </h1>
          <p className="hero-description">
            Our AI-driven system analyzes your symptoms and suggests the most
            relevant disease diagnosis, precautions, medications, diets, and
            workouts—backed by real clinical data.
          </p>
          <button className="btn-primary" onClick={onStart}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>
        <div className="hero-visual">
          <div className="pulse-circle"></div>
          <div className="brain-animation">
            <Brain size={120} className="brain-icon" />
          </div>
        </div>
      </div>

      <div className="marquee-container">
        <div className="marquee">
          <div className="marquee-content">
            {["AI-Powered", "Personalized", "Evidence-Based", "Secure", "User-Friendly", "Comprehensive", "AI-Powered", "Personalized", "Evidence-Based"].map((text, index) => (
              <div key={index} className="marquee-item">{text}</div>
            ))}
          </div>
        </div>
      </div>

      <section className="about-section">
        <h2>About Our <span className="highlight">Platform</span></h2>
        <p className="about-description">
          Welcome to our cutting-edge Personalized Medical Recommendation System, a powerful platform designed to assist users in understanding and managing their health. Leveraging the capabilities of machine learning, our system analyzes user-input symptoms to predict potential diseases accurately.
        </p>
      </section>

      <section className="features-section">
        <h2>Key <span className="highlight">Features</span></h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Take Charge of Your <span className="highlight">Health</span></h2>
        <p>
          Experience our Personalized Medical Recommendation System. Your well-being is our priority, and we're dedicated to providing you with the tools and insights you need for a healthier, happier life.
        </p>
        <button className="btn-primary" onClick={onStart}>
          Get Started <ArrowRight size={16} />
        </button>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Smart Medication Recommender. All rights reserved.</p>
        <p className="footer-disclaimer">
          Note: This platform is designed to assist, not replace, professional medical advice. 
          Always consult with a healthcare professional for medical concerns.
        </p>
      </footer>
    </div>
  );
}
