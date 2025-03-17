"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface DrugInteractionResponse {
  severity: string;
  report: string;
  reasoning: string;
}

export default function CheckMedication() {
  const searchParams = useSearchParams();
  const [patientData, setPatientData] = useState<any>(null);
  const [medicationToCheck, setMedicationToCheck] = useState("");
  const [response, setResponse] = useState<DrugInteractionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  useEffect(() => {
    try {
      const data = searchParams.get('data');
      if (data) {
        setPatientData(JSON.parse(data));
      }
    } catch (err) {
      setError('Error parsing patient data');
      console.error(err);
    }
  }, [searchParams]);

  const checkDrugInteraction = async () => {
    if (!medicationToCheck.trim()) {
      setError('Please enter a medication to check');
      return;
    }

    setLoading(true);
    setError(null);
    setShowReport(false);
    setShowReasoning(false);
    
    try {
      const response = await fetch('https://407c-34-31-74-43.ngrok-free.app/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...patientData,
          test_drug: medicationToCheck
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze drug interaction');
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError('Failed to check drug interaction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-200 text-red-900';
      case 'moderate':
        return 'bg-orange-200 text-orange-900';
      case 'low':
        return 'bg-yellow-100 text-yellow-900';
      case 'no interaction':
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-700 flex flex-col items-center justify-center p-6 font-sans text-white">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center justify-center p-6 font-sans text-white">
      <h1 className="text-5xl font-bold mb-6">Drug Interaction Check</h1>
      
      {/* Results Section */}
      {loading ? (
        <div className="text-xl">Analyzing drug interactions...</div>
      ) : response ? (
        <div className="w-full max-w-3xl space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            {/* Severity Box */}
            <div className={`p-4 rounded-lg ${getSeverityColor(response.severity)}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold">Medication: </span>
                  <span>{medicationToCheck}</span>
                </div>
                <div>
                  <span className="font-bold">Severity: </span>
                  <span>{response.severity}</span>
                </div>
              </div>
            </div>

            {/* New Drug Input Below Severity Box */}
            <div className="mt-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={medicationToCheck}
                  onChange={(e) => setMedicationToCheck(e.target.value)}
                  placeholder="Enter medication name"
                  className="flex-1 p-3 rounded bg-gray-900 border border-gray-600 text-white"
                />
                <button
                  onClick={checkDrugInteraction}
                  disabled={loading}
                  className={`px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Checking...' : 'Check Interactions'}
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Report Section */}
          <div className="border border-gray-600 rounded-lg overflow-hidden">
            <button 
              onClick={() => setShowReport(!showReport)}
              className="w-full p-4 text-left bg-gray-900 hover:bg-gray-800 transition flex justify-between items-center"
            >
              <span className="text-lg font-semibold">Report</span>
              <span>{showReport ? '▼' : '▶'}</span>
            </button>
            {showReport && (
              <div className="p-4 bg-gray-800">
                <p className="text-gray-300 leading-relaxed">{response.report}</p>
              </div>
            )}
          </div>

          {/* Collapsible Reasoning Section */}
          <div className="border border-gray-600 rounded-lg overflow-hidden">
            <button 
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full p-4 text-left bg-gray-900 hover:bg-gray-800 transition flex justify-between items-center"
            >
              <span className="text-lg font-semibold">Reasoning</span>
              <span>{showReasoning ? '▼' : '▶'}</span>
            </button>
            {showReasoning && (
              <div className="p-4 bg-gray-800">
                <p className="text-gray-300 leading-relaxed">{response.reasoning}</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setMedicationToCheck("");
                setResponse(null);
                setShowReport(false);
                setShowReasoning(false);
                setError(null);
              }} 
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Check Another Medication
            </button>
          </div>
        </div>
      ) : (
        /* Initial Drug Input Section */
        <div className="w-full max-w-3xl mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex flex-col space-y-4">
              <label className="text-lg">Enter Medication to Check:</label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={medicationToCheck}
                  onChange={(e) => setMedicationToCheck(e.target.value)}
                  placeholder="Enter medication name"
                  className="flex-1 p-3 rounded bg-gray-900 border border-gray-600 text-white"
                />
                <button
                  onClick={checkDrugInteraction}
                  disabled={loading}
                  className={`px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Checking...' : 'Check Interactions'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
