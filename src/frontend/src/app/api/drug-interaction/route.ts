import { NextRequest, NextResponse } from 'next/server';

interface InteractionData {
  severity: string;
  sideEffects: string[];
  recommendations: string[];
}

interface DrugInteractions {
  [drug: string]: {
    [interactingDrug: string]: InteractionData;
  };
}

// Mock data for drug interactions
const mockInteractions: DrugInteractions = {
  'aspirin': {
    'lisinopril': {
      severity: 'moderate',
      sideEffects: [
        'Decreased blood pressure',
        'Reduced effectiveness of lisinopril',
        'Possible kidney function impairment'
      ],
      recommendations: [
        'Monitor blood pressure regularly',
        'Consider alternative pain relievers',
        'Consult with your healthcare provider before combining these medications'
      ]
    },
    'warfarin': {
      severity: 'major',
      sideEffects: [
        'Increased risk of bleeding',
        'Gastrointestinal bleeding',
        'Prolonged bleeding time'
      ],
      recommendations: [
        'Avoid this combination if possible',
        'If necessary, use the lowest effective dose of aspirin',
        'Regular monitoring of INR levels is essential',
        'Watch for signs of bleeding'
      ]
    },
    'ibuprofen': {
      severity: 'moderate',
      sideEffects: [
        'Increased risk of gastrointestinal bleeding',
        'Reduced cardioprotective effects of aspirin',
        'Potential kidney damage'
      ],
      recommendations: [
        'Take ibuprofen at least 8 hours before or 30 minutes after aspirin',
        'Consider alternative pain relievers like acetaminophen',
        'Monitor for signs of stomach irritation or bleeding'
      ]
    }
  },
  'lisinopril': {
    'potassium supplements': {
      severity: 'moderate',
      sideEffects: [
        'Hyperkalemia (high potassium levels)',
        'Irregular heartbeat',
        'Muscle weakness'
      ],
      recommendations: [
        'Monitor potassium levels regularly',
        'Avoid potassium-rich foods when taking this medication',
        'Consult with your doctor before taking potassium supplements'
      ]
    },
    'spironolactone': {
      severity: 'moderate',
      sideEffects: [
        'Hyperkalemia (high potassium levels)',
        'Acute kidney injury',
        'Hypotension (low blood pressure)'
      ],
      recommendations: [
        'Regular monitoring of kidney function and potassium levels',
        'Start with lower doses of both medications',
        'Stay well-hydrated'
      ]
    }
  },
  'metformin': {
    'alcohol': {
      severity: 'moderate',
      sideEffects: [
        'Lactic acidosis',
        'Hypoglycemia (low blood sugar)',
        'Impaired liver function'
      ],
      recommendations: [
        'Limit alcohol consumption',
        'Never drink alcohol on an empty stomach while taking metformin',
        'Monitor blood glucose levels more frequently when consuming alcohol'
      ]
    }
  }
};

// Helper function to normalize drug names for comparison
const normalizeDrugName = (name: string): string => {
  return name.toLowerCase().trim();
};

// Helper function to find interactions
const findInteraction = (drug1: string, drug2: string) => {
  const normalizedDrug1 = normalizeDrugName(drug1);
  const normalizedDrug2 = normalizeDrugName(drug2);
  
  // Check if drug1 has interactions with drug2
  if (mockInteractions[normalizedDrug1] && mockInteractions[normalizedDrug1][normalizedDrug2]) {
    return {
      drug1,
      drug2,
      ...mockInteractions[normalizedDrug1][normalizedDrug2]
    };
  }
  
  // Check if drug2 has interactions with drug1
  if (mockInteractions[normalizedDrug2] && mockInteractions[normalizedDrug2][normalizedDrug1]) {
    return {
      drug1,
      drug2,
      ...mockInteractions[normalizedDrug2][normalizedDrug1]
    };
  }
  
  // No interaction found
  return null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newDrug, currentMedications, patientInfo } = body;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find interactions between the new drug and current medications
    const interactions = [];
    
    if (currentMedications && Array.isArray(currentMedications)) {
      for (const medication of currentMedications) {
        const interaction = findInteraction(newDrug, medication);
        if (interaction) {
          interactions.push(interaction);
        }
      }
      
      // If no specific interactions found, generate random ones for testing
      if (interactions.length === 0 && currentMedications.length > 0) {
        const severityLevels = ['minor', 'moderate', 'major'];
        
        for (const medication of currentMedications) {
          // Only add random interactions for some medications to make it more realistic
          if (Math.random() > 0.3) {
            const randomSeverity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
            
            interactions.push({
              drug1: newDrug,
              drug2: medication,
              severity: randomSeverity,
              sideEffects: [
                'This is a mock interaction for testing purposes',
                'Side effect based on patient profile: ' + (patientInfo?.age ? `Age ${patientInfo.age}` : 'Unknown age'),
                randomSeverity === 'major' ? 'Potentially serious side effect' : 'Mild to moderate side effect'
              ],
              recommendations: [
                'Consult with your healthcare provider',
                'Monitor for side effects',
                'Consider alternative medications if appropriate'
              ]
            });
          }
        }
      }
    }
    
    return NextResponse.json({ interactions });
  } catch (error) {
    console.error('Error in drug interaction API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze drug interaction' },
      { status: 500 }
    );
  }
}
