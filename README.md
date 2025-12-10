# Simulafy Me - Digital Health Twin Application

## Overview
A comprehensive digital health twin application that allows users to create health simulations, track calories, get AI-powered health alerts, and visualize their health metrics.

## Features Implemented

### 1. Landing Page
- Animated background with thin criss-cross grid lines that converge toward cursor
- Hero section with logo and tagline
- Vertical timeline with 5 alternating feature cards
- Three pricing tiers
- Medical-themed design with icons

### 2. Authentication
- **Register Page**: `/register`
  - Name, Email, Password, Confirm Password validation
  - Translucent form design with medical icons
  
- **Login Page**: `/login`
  - Email and Password authentication
  - Backend integration with `http://127.0.0.1:8000/api/user/login`

### 3. Digital Twin Creation (`/create-twin`)
Multi-step form with 6 pages:

#### Step 1: Basic Body Details
- Age (required)
- Gender (Male/Female radio buttons)
- Height in cm (required)
- Weight in kg (required)

#### Step 2: Vitals & Medical Parameters
- Blood Pressure (Systolic / Diastolic)
- Fasting Sugar
- Resting Heart Rate
- SpO₂
- Cholesterol

#### Step 3: Lifestyle & Habits
- Sleep Hours
- Exercise Level (0-3)
- Stress Level (0-3)
- Smoking (Yes/No)
- Alcohol Consumption (0-3)
- Screen Time (hours)
- Steps Per Day
- Outside Food per Week
- Tea/Coffee per Day
- Diet Type (Veg/Egg/Non-Veg)

#### Step 4: Work & Environment
- Work Type (Desk/Field/Mixed)
- Commute Hours
- AC Exposure Hours

#### Step 5: Income & Location
- Annual Income
- City Selection (10 major Indian cities)
- **Google Maps Integration**:
  - Interactive map with clickable pin placement
  - Automatic AQI fetching based on city or coordinates
  - Latitude & Longitude capture
  - API Key: `AIzaSyB9Zwre3aq1kgbcJVRP-HwbyzbpsoEjqqE`

#### Step 6: Medical Reports (Optional)
- File upload for medical reports
- Animated report analysis (4-5 seconds)

### 4. Main Dashboard (`/dashboard`)
- Translucent navigation bar that becomes more transparent on scroll
- Hover effects with red glowing boxes
- **Health Cards**:
  - Core Health (Heart, Metabolic, Mental Stress, Organ Load)
  - Risk-based color coding (Red/Yellow/Green)
  - Glow animations based on risk level
  - Environment Snapshot (City, AQI, Lung Risk)
  - Lifestyle Snapshot (Steps, Sleep, Screen Time, Diet)
- **Charts**:
  - Weekly Activity Bar Chart
  - Health Distribution Pie Chart
  - Monthly Health Trend Line Chart
- Profile page with user information

### 5. Future Simulation (`/simulation`)
- Input controls for simulation period (5, 10, 20 years)
- **Lifestyle Changes**:
  - Increase Exercise
  - Reduce Smoking
  - Better Sleep
  - Diet Improvement
- **Environmental Factors**:
  - Higher Pollution
  - Work Stress
  - Noise Exposure
- Year-wise health projection charts
- Final verdict card with risk level (Safe/Warning/Critical)

### 6. Health Alerts (`/alerts`)
- **AI-powered alert system**:
  - No Consultation Needed (Green)
  - Routine Checkup (Blue)
  - Specialist Required (Yellow)
  - Emergency (Red)
- Detailed explanations for each alert level
- **AI Chatbot**:
  - Expandable/collapsible interface
  - Heartbeat animation
  - Chat history storage
  - **Gemini API Integration**:
    - Add your API key in `app/alerts/page.tsx` line 8
    - Variable: `GEMINI_API_KEY`

### 7. Calorie Tracker (`/calories`)
- **Food Selection**:
  - Breakfast, Lunch, Dinner
  - Pre-defined food items
  - Quantity input
- **Real-time Tracking**:
  - Total calories consumed
  - Daily calorie goal
  - Calories remaining
  - Progress bar
- **Visualizations**:
  - Meal Distribution Pie Chart
  - Weekly Calorie Trend Line Chart

### 8. MLOps Explore (`/mlops`)
- **Health Alert Models**:
  - Active model display
  - Accuracy and F1 score metrics
  - Model training history
  - Retrain button
- **Calorie Prediction Models**:
  - Active model display
  - Accuracy and MAE metrics
  - Retrain button
- **ML Pipeline Architecture**:
  - 3-step workflow explanation
  - MLOps features overview

## Backend Integration

### Base URL
\`\`\`
http://127.0.0.1:8000
\`\`\`

### API Endpoints

#### User Routes
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login

#### Twin Routes
- `POST /api/twin/create` - Create digital twin
- `GET /api/twin/{user_id}` - Get twin data
- `GET /api/twin/aqi?lat={lat}&lon={lon}` - Fetch AQI for location

#### Alert Routes
- `GET /api/alerts/status/{user_id}` - Get health alert status

#### Calorie Routes
- `POST /api/calories/meal` - Log meal
- `GET /api/calories/mlops/models` - Get calorie models
- `GET /api/calories/mlops/status` - Get calorie model status
- `POST /api/calories/mlops/retrain` - Retrain calorie model

#### MLOps Routes
- `GET /api/mlops/models` - Get health models
- `GET /api/mlops/model-status` - Get active model status
- `POST /api/mlops/retrain` - Retrain health model

## Design Features

### Color Palette
- **Primary**: Black (#000000)
- **Secondary**: Dark Grey (#666666)
- **Accent**: Soft Red Gradient (oklch based)
- **Warning**: Yellow
- **Info**: Blue
- **Success**: Green

### Typography
- **Primary Font**: Manrope
- **Fallback**: Open Sans, system-ui

### Animations
- Grid background convergence on cursor movement
- Fade-in-up animations on page load
- Heartbeat animation for loading states
- Glow border effects on hover
- Risk-based color animations

### Theme
- White background with thin criss-cross grid lines
- Medical icons throughout (stethoscope, heartbeat, hospital, pills)
- Translucent card backgrounds with backdrop blur
- Consistent spacing and padding
- Responsive design for all screen sizes

## Google Maps Integration

### API Key
\`\`\`
AIzaSyB9Zwre3aq1kgbcJVRP-HwbyzbpsoEjqqE
\`\`\`

### Features
- Interactive map in Step 5 of twin creation
- Click to place marker
- Automatic latitude/longitude capture
- AQI fetching based on coordinates
- Pre-configured AQI data for 10 major Indian cities

### City AQI Data
- Delhi: AQI 234
- Mumbai: AQI 156
- Bangalore: AQI 98
- Chennai: AQI 112
- Kolkata: AQI 187
- Hyderabad: AQI 134
- Pune: AQI 145
- Ahmedabad: AQI 167
- Jaipur: AQI 178
- Lucknow: AQI 198

## Gemini API Integration

### Location
File: `app/alerts/page.tsx`
Line: 8

### Setup
\`\`\`typescript
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"
\`\`\`

Replace with your actual Gemini API key to enable AI-powered health assistant responses.

## Loading Animations

All pages include loading states:
- **Dashboard**: Heartbeat icon animation
- **Create Twin**: Multi-step form with animated report analysis
- **Simulation**: "Running simulation..." with heartbeat animation
- **Alerts**: "Analyzing your health..." with heartbeat animation
- **Calories**: "Logging..." state on meal submission
- **MLOps**: "Retraining model..." states

## Required Fields in Digital Twin Form

All fields marked with * are required:
- Age
- Gender
- Height (cm)
- Weight (kg)
- Systolic BP
- Diastolic BP
- Fasting Sugar
- Resting Heart Rate
- SpO₂
- Cholesterol
- Sleep Hours
- Exercise Level
- Stress Level
- Screen Time
- Steps Per Day
- Outside Food per Week
- Tea/Coffee per Day
- Diet Type
- Work Type
- Commute Hours
- AC Exposure Hours
- Annual Income
- City

Medical reports are optional.

## Files to Reference for v0

For better understanding and future modifications, share these backend files with v0:

1. `main-wrftk.py` - Main FastAPI application setup
2. `twin_routes-kxv7J.py` - Digital twin creation endpoints
3. `alert_routes-NsUX4.py` - Health alert prediction
4. `calorie_routes-Peh9k.py` - Calorie tracking endpoints
5. `mlops_routes-khHuW.py` - ML operations endpoints
6. `user_routes-xqNuz.py` - User authentication
7. `tracker_routes-QXhKD.py` - Health tracking
8. `pasted-text-B80BX.txt` - Complete API documentation

## Running the Application

### Development
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### Build
\`\`\`bash
npm run build
\`\`\`

### Start Production
\`\`\`bash
npm start
\`\`\`

## Environment Variables

The application uses environment variables for:
- Backend API base URL (default: `http://127.0.0.1:8000`)
- Google Maps API key (hardcoded in create-twin page)
- Gemini API key (to be added in alerts page)

## Browser Compatibility

Tested on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

## Known Issues

- Gemini API key needs to be manually added in the code
- Backend must be running at `http://127.0.0.1:8000`
- Google Maps requires active API key with Maps JavaScript API enabled

## Future Enhancements

- 3D human model for health visualization
- More detailed meal logging with image recognition
- Social features for sharing progress
- Integration with wearable devices
- Multi-language support

## Credits

- **Design**: Medical-themed with criss-cross grid animation
- **Fonts**: Manrope, Open Sans
- **Icons**: Custom SVG medical icons
- **Charts**: Recharts library
- **Maps**: Google Maps JavaScript API
- **Framework**: Next.js 16, React 19

---

**Note**: This application is for educational and demonstration purposes. Always consult with healthcare professionals for medical advice.
