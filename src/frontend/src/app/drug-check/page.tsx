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

interface AnalysisResult {
  severity: string;
  report: string;
  reasoning: string;
  interactions?: DrugInteraction[];
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);

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
    setAnalysisResult(null);

    try {
      // Call our mock API endpoint
      const response = await fetch('/api/drug-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_drug: newDrug,
          current_medications: patientData.currentMedications,
          past_medications: patientData.pastMedications,
          age: parseInt(patientData.demographics.age) || 0,
          sex: patientData.demographics.sex,
          disease: patientData.conditions.join(', '),
          allergies: patientData.allergies,
          family_history: patientData.familyHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze drug interactions');
      }

      const data = await response.json();
      setAnalysisResult(data);
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
              ) : analysisResult ? (
                <div className="space-y-6">
                  {/* Severity Indicator */}
                  <div className={`p-4 rounded-lg ${
                    analysisResult.severity === 'High' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                    analysisResult.severity === 'Moderate' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                    'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  }`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {analysisResult.severity === 'High' ? (
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : analysisResult.severity === 'Moderate' ? (
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-lg font-medium ${
                          analysisResult.severity === 'High' ? 'text-red-800 dark:text-red-400' :
                          analysisResult.severity === 'Moderate' ? 'text-yellow-800 dark:text-yellow-400' :
                          'text-green-800 dark:text-green-400'
                        }`}>
                          {analysisResult.severity === 'High' ? 'High Risk Interaction' :
                           analysisResult.severity === 'Moderate' ? 'Moderate Risk Interaction' :
                           'Low Risk Interaction'}
                        </h3>
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <p>{analysisResult.report}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reasoning Toggle */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <span>{showReasoning ? 'Hide Analysis Details' : 'Show Analysis Details'}</span>
                      <svg 
                        className={`ml-1 h-5 w-5 transform ${showReasoning ? 'rotate-180' : ''} transition-transform`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Reasoning Details */}
                  {showReasoning && (
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Analysis Reasoning</h4>
                      <p className="text-gray-700 dark:text-gray-300">{analysisResult.reasoning}</p>
                    </div>
                  )}

                  {/* Individual Interactions */}
                  {analysisResult.interactions && analysisResult.interactions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Detailed Interactions</h4>
                      <div className="space-y-4">
                        {analysisResult.interactions.map((interaction, index) => (
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
                    </div>
                  )}
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
