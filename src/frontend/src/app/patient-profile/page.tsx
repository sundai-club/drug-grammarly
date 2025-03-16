"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function PatientProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("demographics");
  const [patientData, setPatientData] = useState<PatientData>({
    history: [],
    pastMedications: [],
    currentMedications: [],
    conditions: [],
    allergies: [],
    demographics: {
      height: "",
      weight: "",
      sex: "",
      age: "",
    },
    familyHistory: [],
  });

  // Input states for adding new items
  const [newHistory, setNewHistory] = useState("");
  const [newPastMed, setNewPastMed] = useState("");
  const [newCurrentMed, setNewCurrentMed] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newFamilyHistory, setNewFamilyHistory] = useState("");

  // Function to add items to arrays
  const addItem = (field: keyof PatientData, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return;
    
    if (Array.isArray(patientData[field])) {
      setPatientData({
        ...patientData,
        [field]: [...(patientData[field] as string[]), value.trim()]
      });
      setter("");
    }
  };

  // Function to remove items from arrays
  const removeItem = (field: keyof PatientData, index: number) => {
    if (Array.isArray(patientData[field])) {
      const newArray = [...(patientData[field] as string[])];
      newArray.splice(index, 1);
      setPatientData({
        ...patientData,
        [field]: newArray
      });
    }
  };

  // Handle demographics changes
  const handleDemographicsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientData({
      ...patientData,
      demographics: {
        ...patientData.demographics,
        [name]: value
      }
    });
  };

  // Save profile data to localStorage
  const saveProfile = () => {
    localStorage.setItem('patientProfile', JSON.stringify(patientData));
    router.push('/drug-check');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Patient Profile</h1>
              <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Back to Home
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
              {["demographics", "history", "medications", "conditions", "family"].map((tab) => (
                <button
                  key={tab}
                  className={`mr-2 py-2 px-4 text-sm font-medium rounded-t-lg ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Demographics Tab */}
            {activeTab === "demographics" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={patientData.demographics.age}
                      onChange={handleDemographicsChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="Enter age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sex
                    </label>
                    <select
                      name="sex"
                      value={patientData.demographics.sex}
                      onChange={handleDemographicsChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={patientData.demographics.height}
                      onChange={handleDemographicsChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="Enter height in cm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={patientData.demographics.weight}
                      onChange={handleDemographicsChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="Enter weight in kg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Medical History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Medical History</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add Past Disease or Condition
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newHistory}
                      onChange={(e) => setNewHistory(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="E.g., Hypertension, Diabetes"
                    />
                    <button
                      onClick={() => addItem("history", newHistory, setNewHistory)}
                      className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Your Medical History</h3>
                  {patientData.history.length > 0 ? (
                    <ul className="space-y-2">
                      {patientData.history.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-800 dark:text-white">{item}</span>
                          <button
                            onClick={() => removeItem("history", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No medical history added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Medications Tab */}
            {activeTab === "medications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Medications</h2>
                
                {/* Past Medications */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Past Medications</h3>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={newPastMed}
                      onChange={(e) => setNewPastMed(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="Enter medication name"
                    />
                    <button
                      onClick={() => addItem("pastMedications", newPastMed, setNewPastMed)}
                      className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  {patientData.pastMedications.length > 0 ? (
                    <ul className="space-y-2">
                      {patientData.pastMedications.map((med, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-800 dark:text-white">{med}</span>
                          <button
                            onClick={() => removeItem("pastMedications", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No past medications added yet.</p>
                  )}
                </div>
                
                {/* Current Medications */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Current Medications</h3>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={newCurrentMed}
                      onChange={(e) => setNewCurrentMed(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="Enter medication name"
                    />
                    <button
                      onClick={() => addItem("currentMedications", newCurrentMed, setNewCurrentMed)}
                      className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  {patientData.currentMedications.length > 0 ? (
                    <ul className="space-y-2">
                      {patientData.currentMedications.map((med, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-800 dark:text-white">{med}</span>
                          <button
                            onClick={() => removeItem("currentMedications", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No current medications added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Conditions Tab */}
            {activeTab === "conditions" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Current Conditions & Allergies</h2>
                
                {/* Current Conditions */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Current Conditions</h3>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="E.g., Hypertension, Asthma"
                    />
                    <button
                      onClick={() => addItem("conditions", newCondition, setNewCondition)}
                      className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  {patientData.conditions.length > 0 ? (
                    <ul className="space-y-2">
                      {patientData.conditions.map((condition, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-800 dark:text-white">{condition}</span>
                          <button
                            onClick={() => removeItem("conditions", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No conditions added yet.</p>
                  )}
                </div>
                
                {/* Allergies */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Allergies</h3>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="E.g., Penicillin, Peanuts"
                    />
                    <button
                      onClick={() => addItem("allergies", newAllergy, setNewAllergy)}
                      className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  
                  {patientData.allergies.length > 0 ? (
                    <ul className="space-y-2">
                      {patientData.allergies.map((allergy, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-800 dark:text-white">{allergy}</span>
                          <button
                            onClick={() => removeItem("allergies", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No allergies added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Family History Tab */}
            {activeTab === "family" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Family History</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add Family Medical History
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newFamilyHistory}
                      onChange={(e) => setNewFamilyHistory(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="E.g., Father - Diabetes, Mother - Hypertension"
                    />
                    <button
                      onClick={() => addItem("familyHistory", newFamilyHistory, setNewFamilyHistory)}
                      className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Your Family History</h3>
                  {patientData.familyHistory.length > 0 ? (
                    <ul className="space-y-2">
                      {patientData.familyHistory.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-800 dark:text-white">{item}</span>
                          <button
                            onClick={() => removeItem("familyHistory", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No family history added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <Link
                href="/"
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </Link>
              <button
                onClick={saveProfile}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
