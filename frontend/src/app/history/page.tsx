"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function History() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState({
    age: "",
    sex: "",
    disease: "",
    ethnicity: "",
    past_medications: "",
    current_medications: "",
    supplements: "",
    allergies: "",
    adverse_events: "",
    family_history: "",
    test_drug: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Convert string arrays to actual arrays and format data
      const formattedData = {
        ...patientData,
        age: parseInt(patientData.age) || 0,
        past_medications: patientData.past_medications.split(',').map(item => item.trim()),
        current_medications: patientData.current_medications.split(',').map(item => item.trim()),
        supplements: patientData.supplements.split(',').map(item => item.trim()),
        allergies: patientData.allergies.split(',').map(item => item.trim()),
        adverse_events: patientData.adverse_events.split(',').map(item => item.trim()),
        family_history: patientData.family_history.split(',').map(item => item.trim())
      };

      await router.replace(`/check-medications?${new URLSearchParams({
        data: JSON.stringify(formattedData)
      }).toString()}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col items-center justify-center p-6 font-sans text-white">
      <h1 className="text-5xl font-bold mb-6">Enter Your Medical History</h1>
      <p className="text-lg text-gray-300 mb-8">Fill in your medical information and medications.</p>

      <div className="flex flex-col space-y-6 w-full max-w-lg">
        <input type="number" name="age" placeholder="Age" value={patientData.age} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
        <select name="sex" value={patientData.sex} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white">
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" name="disease" placeholder="Primary Disease/Condition" value={patientData.disease} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
        <input type="text" name="ethnicity" placeholder="Ethnicity" value={patientData.ethnicity} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
        <input type="text" name="past_medications" placeholder="Past Medications (comma-separated)" value={patientData.past_medications} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
        <input type="text" name="current_medications" placeholder="Current Medications (comma-separated)" value={patientData.current_medications} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
        <input type="text" name="supplements" placeholder="Supplements (comma-separated)" value={patientData.supplements} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
        <input type="text" name="allergies" placeholder="Allergies (comma-separated)" value={patientData.allergies} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
        <input type="text" name="adverse_events" placeholder="Adverse Events (comma-separated)" value={patientData.adverse_events} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
        <textarea name="family_history" placeholder="Family History (comma-separated)" value={patientData.family_history} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"></textarea>
        <input type="text" name="test_drug" placeholder="Drug to Test for Interactions" value={patientData.test_drug} onChange={handleChange} className="w-full p-3 rounded bg-gray-800 border border-gray-500 text-white"/>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={isLoading}
        className={`mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Loading...' : 'Check Drug Interactions'}
      </button>
    </div>
  );
}
