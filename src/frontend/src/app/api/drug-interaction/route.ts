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

// New interface for the input format
interface DrugInteractionRequest {
  age?: number;
  sex?: string;
  disease?: string;
  ethnicity?: string;
  past_medications?: string[];
  current_medications?: string[];
  supplements?: string[];
  allergies?: string[];
  adverse_events?: string[];
  family_history?: string[];
  test_drug?: string;
  // Support for the previous format as well
  newDrug?: string;
  patientInfo?: {
    age?: string | number;
    sex?: string;
    conditions?: string[];
    allergies?: string[];
  };
}

// New interface for the response format
interface DrugInteractionResponse {
  severity: string;
  report: string;
  reasoning: string;
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
    'amlodipine': {
      severity: 'minor',
      sideEffects: [
        'Dizziness',
        'Headache',
        'Swelling of the ankles or feet'
      ],
      recommendations: [
        'Monitor blood pressure regularly',
        'Report any unusual side effects to your doctor',
        'Avoid alcohol consumption'
      ]
    },
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

// Helper function to generate a detailed report based on interaction data
const generateDetailedReport = (drug1: string, drug2: string, interactionData: InteractionData | null): DrugInteractionResponse => {
  if (!interactionData) {
    return {
      severity: 'Low',
      report: `No significant interactions were found between ${drug1} and ${drug2}. However, always consult with your healthcare provider before making any changes to your medication regimen.`,
      reasoning: 'Based on available data, there are no known significant interactions between these medications.'
    };
  }

  // Map our severity levels to the expected output format
  const severityMap: {[key: string]: string} = {
    'minor': 'Low',
    'moderate': 'Moderate',
    'major': 'High'
  };

  const severity = severityMap[interactionData.severity] || 'Unknown';
  
  // Generate a detailed report based on the interaction data
  const sideEffectsText = interactionData.sideEffects.join(', ');
  const recommendationsText = interactionData.recommendations.join('. ');
  
  const report = `The combination of ${drug1} and ${drug2} ${severity === 'Low' ? 'does not pose a significant risk of serious interactions' : 'may pose some risks'}, but caution is advised due to their combined effects. Patients may experience common side effects such as ${sideEffectsText}. ${recommendationsText}.`;
  
  const reasoning = `The analysis indicates that ${drug1} and ${drug2} ${interactionData.severity === 'major' ? 'have significant interactions' : 'can interact'}, and their interaction is classified as ${interactionData.severity}. ${severity === 'High' ? 'There are significant drug-drug interactions reported' : 'The potential side effects are manageable with appropriate monitoring and patient education'}. Therefore, the overall severity of interaction is assessed as ${severity.toLowerCase()}.`;
  
  return {
    severity,
    report,
    reasoning
  };
};

export async function POST(request: NextRequest) {
  try {
    const body: DrugInteractionRequest = await request.json();
    
    // Handle both input formats
    const testDrug = body.test_drug || body.newDrug || '';
    const currentMedications = body.current_medications || (body.patientInfo ? [] : []);
    
    // If using the previous format, extract current medications
    if (body.patientInfo && !body.current_medications) {
      currentMedications.push(...(body.current_medications || []));
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find interactions between the test drug and current medications
    const interactions = [];
    
    if (currentMedications && Array.isArray(currentMedications)) {
      for (const medication of currentMedications) {
        const interaction = findInteraction(testDrug, medication);
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }
    
    // Generate detailed report for the first interaction or a default response
    let detailedResponse: DrugInteractionResponse;
    
    if (interactions.length > 0) {
      const firstInteraction = interactions[0];
      detailedResponse = generateDetailedReport(
        firstInteraction.drug1, 
        firstInteraction.drug2, 
        {
          severity: firstInteraction.severity,
          sideEffects: firstInteraction.sideEffects,
          recommendations: firstInteraction.recommendations
        }
      );
    } else if (currentMedications.length > 0) {
      // Generate a mock response for testing
      detailedResponse = {
        severity: 'Low',
        report: `The combination of ${testDrug} and ${currentMedications[0]} does not pose a significant risk of serious interactions, but caution is advised due to their combined effects on blood pressure. Patients may experience common side effects such as dizziness, headache, and swelling of the ankles or feet. Serious side effects, while rare, include angioedema and severe hypotension. Regular monitoring of blood pressure and potassium levels is recommended, along with caution regarding alcohol consumption.`,
        reasoning: `The analysis indicates that while ${testDrug} and ${currentMedications[0]} can lower blood pressure, their interaction is classified as minor. There are no significant drug-drug interactions reported, and the potential side effects are manageable with appropriate monitoring and patient education. Therefore, the overall severity of interaction is assessed as low.`
      };
    } else {
      detailedResponse = {
        severity: 'Unknown',
        report: 'No current medications were provided to check for interactions.',
        reasoning: 'Unable to assess drug interactions without current medication information.'
      };
    }
    
    // Support both response formats
    return NextResponse.json({
      // New format
      ...detailedResponse,
      // Old format for backward compatibility
      interactions
    });
  } catch (error) {
    console.error('Error in drug interaction API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze drug interaction' },
      { status: 500 }
    );
  }
}
