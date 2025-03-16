# MedSafety - Drug Interaction Analyzer

MedSafety is a comprehensive application for analyzing potential drug interactions using Google's Gemini API and a PostgreSQL database of known drug interactions. The application helps users identify potential conflicts between medications and provides detailed analysis of drug interactions.

## Features

- **Patient Profile Management**: Store medical history, past and current medications, conditions, allergies, demographics, and family history
- **Drug Interaction Analysis**: Check for potential interactions between medications
- **Dual Analysis System**: 
  - Database lookup for known drug interactions
  - AI-powered analysis using Google's Gemini API for comprehensive insights
- **Modern Web Interface**: Built with Next.js and Tailwind CSS for a responsive, user-friendly experience

## Project Structure

```
drug-grammarly/
├── src/
│   ├── database.py         # Database setup script
│   ├── api_server.py       # FastAPI backend server
│   └── frontend/           # Next.js frontend application
├── drug-interaction.py     # Main drug interaction analysis logic
├── db_utils.py             # Database utility functions
└── requirements.txt        # Python dependencies
```

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.8+
- PostgreSQL database
- Google Gemini API key
- Google Custom Search API key

### Backend Setup

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```
   export GEMINI_API_KEY="your_gemini_api_key"
   export GOOGLE_SEARCH_API_KEY="your_google_search_api_key"
   ```

3. Set up the PostgreSQL database:
   ```
   python src/database.py
   ```

4. Start the FastAPI server:
   ```
   python src/api_server.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd src/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the application at http://localhost:3000

## Usage

1. Create a patient profile with your medical information
2. Enter new medications to check for potential interactions
3. Review the analysis results, including:
   - Database matches for known interactions
   - AI-powered analysis of potential risks and recommendations

## Important Note

This application is for informational purposes only and does not replace professional medical advice. Always consult with a healthcare provider before making any decisions about your medications.