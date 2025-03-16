"use client";

import React from 'react';
import Link from 'next/link';

interface Demographics {
  height: string;
  weight: string;
  sex: string;
  age: string;
}

interface PatientSummaryProps {
  demographics: Demographics;
  currentMedications: string[];
  conditions: string[];
  allergies: string[];
  compact?: boolean;
}

export default function PatientSummary({
  demographics,
  currentMedications,
  conditions,
  allergies,
  compact = false
}: PatientSummaryProps) {
  return (
    <div className={`${compact ? 'p-3' : 'p-4'} bg-blue-50 dark:bg-blue-900/30 rounded-lg`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-800 dark:text-white`}>
          Patient Summary
        </h2>
        <Link 
          href="/patient-profile" 
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Edit Profile
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300`}>
            <span className="font-medium">Age:</span> {demographics.age}
          </p>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300`}>
            <span className="font-medium">Sex:</span> {demographics.sex}
          </p>
          {!compact && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Height:</span> {demographics.height} cm
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Weight:</span> {demographics.weight} kg
              </p>
            </>
          )}
        </div>
        
        <div>
          <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300`}>
            <span className="font-medium">Current Medications:</span>{" "}
            {currentMedications.length > 0 ? (
              <span className="inline-block">
                {currentMedications.slice(0, compact ? 2 : 3).join(", ")}
                {currentMedications.length > (compact ? 2 : 3) && " ..."}
              </span>
            ) : (
              "None"
            )}
          </div>
          
          <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300`}>
            <span className="font-medium">Conditions:</span>{" "}
            {conditions.length > 0 ? (
              <span className="inline-block">
                {conditions.slice(0, compact ? 2 : 3).join(", ")}
                {conditions.length > (compact ? 2 : 3) && " ..."}
              </span>
            ) : (
              "None"
            )}
          </div>
          
          {!compact && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Allergies:</span>{" "}
              {allergies.length > 0 ? allergies.join(", ") : "None"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
