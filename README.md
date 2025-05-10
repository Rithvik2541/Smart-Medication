# Smart Medication System

**Smart Medication System**, a healthcare-oriented web application built with Flask and machine learning to provide personalized disease predictions and recommendations.

## Key Features

### 1. Disease Prediction
- Utilizes a trained Support Vector Classifier (SVC) model to predict diseases based on user-provided symptoms.
- The model is trained on a comprehensive dataset to ensure high accuracy and reliability.

### 2. Recommendations
- **Description**: A detailed description of the predicted disease.
- **Precautions**: Suggested precautions to manage or prevent the condition.
- **Medications**: Recommended medications tailored to the diagnosed disease.
- **Workout Routines**: Fitness routines to improve overall health.
- **Diet Plans**: Custom dietary recommendations for better recovery and well-being.

### 3. Data Security
- The system ensures user data privacy by handling sensitive health information with utmost confidentiality.

## Technical Overview

### Backend
- **Framework**: Flask
- **Machine Learning**: Pre-trained SVC model loaded via `pickle`.
- **Data Handling**: Processes CSV files, including:
  - Symptoms Mapping
  - Disease Descriptions
  - Precautions
  - Medications
  - Diets
  - Workout Routines

### Frontend
- Integrated with a user-friendly React.js interface (details in `client/README.md`).

## Installation and Setup

### Prerequisites
- Python 3.8 or higher
- Node.js (for frontend)
- Required Python libraries listed in `requirements.txt`

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/Rithvik2541/Smart-Medication.git
   cd Smart-Medication
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```bash
   python main.py
   ```
4. Navigate to the React client directory (`client`) and start the frontend:
   ```bash
   cd client
   npm install
   npm start
   ```

## Future Enhancements
- Incorporate more advanced models for disease prediction.
- Add multilingual support.
- Enable secure user authentication for personalized health tracking.


---

Take control of your health today with the **Smart Medication System**! 🚀
