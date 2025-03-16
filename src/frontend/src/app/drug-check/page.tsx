"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PatientSummary from '@/components/patient/PatientSummary';
import InteractionAlert from '@/components/drug/InteractionAlert';

interface Demographics {
  height: string;
  weight: string;
  sex: string;
  age: string;
}

interface PatientData {
  history: string[];
  pastMedications: string[];
  currentMedications: string[];
  conditions: string[];
  allergies: string[];
  demographics: Demographics;
  familyHistory: string[];
}

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major';
  sideEffects: string[];
  recommendations: string[];
}

export default function DrugCheck() {
  const [patientData, setPatientData] = useState<PatientData>({
    history: [],
    pastMedications: [],
    currentMedications: [],
    conditions: [],
    allergies: [],
    demographics: {
      height: '',
      weight: '',
      sex: '',
      age: '',
    },
    familyHistory: [],
  });

  const [newDrug, setNewDrug] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load patient data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('patientProfile');
    if (savedProfile) {
      try {
        setPatientData(JSON.parse(savedProfile));
      } catch (err) {
        console.error('Error parsing patient data:', err);
      }
    }
  }, []);

  const analyzeDrugInteractions = async () => {
    if (!newDrug.trim()) {
      setError('Please enter a drug name');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call our mock API endpoint
      const response = await fetch('/api/drug-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newDrug,
          currentMedications: patientData.currentMedications,
          patientInfo: {
            age: patientData.demographics.age,
            sex: patientData.demographics.sex,
            conditions: patientData.conditions,
            allergies: patientData.allergies
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze drug interactions');
      }

      const data = await response.json();
      setInteractions(data.interactions || []);
    } catch (err) {
      console.error('Error analyzing drug interactions:', err);
      setError('Failed to analyze drug interactions. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Drug Interaction Check</h1>
              <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Back to Home
              </Link>
            </div>

            {/* Patient Summary */}
            <div className="mb-8">
              <PatientSummary
                demographics={patientData.demographics}
                currentMedications={patientData.currentMedications}
                conditions={patientData.conditions}
                allergies={patientData.allergies}
              />
            </div>

            {/* Drug Input */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Check New Medication</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter Medication Name
                  </label>
                  <input
                    type="text"
                    value={newDrug}
                    onChange={(e) => setNewDrug(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="E.g., Aspirin, Lisinopril"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={analyzeDrugInteractions}
                    disabled={isAnalyzing}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Check Interactions'}
                  </button>
                </div>
              </div>
              {error && (
                <p className="mt-2 text-red-500">{error}</p>
              )}
            </div>

            {/* Results */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Results</h2>
              
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Analyzing potential drug interactions...</p>
                </div>
              ) : interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions.map((interaction, index) => (
                    <InteractionAlert
                      key={index}
                      severity={interaction.severity}
                      drug1={interaction.drug1}
                      drug2={interaction.drug2}
                      sideEffects={interaction.sideEffects}
                      recommendations={interaction.recommendations}
                    />
                  ))}
                </div>
              ) : newDrug ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-400">
                        No interactions found with your current medications.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Enter a medication name to check for potential interactions with your current medications.
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <Link
                href="/patient-profile"
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Edit Profile
              </Link>
              <Link
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
