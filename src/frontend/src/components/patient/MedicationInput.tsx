"use client";

import React, { useState } from 'react';

interface MedicationInputProps {
  onAddMedication: (medication: string) => void;
  placeholder?: string;
  label?: string;
}

export default function MedicationInput({ 
  onAddMedication,
  placeholder = "Enter medication name",
  label = "Add Medication"
}: MedicationInputProps) {
  const [medication, setMedication] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medication.trim()) {
      onAddMedication(medication.trim());
      setMedication('');
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          placeholder={placeholder}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </form>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enter your medications one at a time. Include dosage information if available.
      </p>
    </div>
  );
}
