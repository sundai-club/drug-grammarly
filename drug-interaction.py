import os
import google.generativeai as genai
from IPython.display import Markdown, display
import requests
import json
import time
import html

# Function to display markdown in a nicer format
def display_md(text):
    display(Markdown(text))

# Set up Google Gemini API
def setup_gemini(api_key):
    """Set up the Gemini API with your API key."""
    genai.configure(api_key=api_key)
    
    # Configure the model
    generation_config = {
        "temperature": 0.2,  # Lower temperature for more factual responses
        "top_p": 0.8,
        "top_k": 40,
        "max_output_tokens": 2048,
    }
    
    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    ]
    
    # Initialize the model
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=generation_config,
        safety_settings=safety_settings
    )
    
    return model

# Web search function using Google Custom Search API
def web_search(query, search_api_key, num_results=5):
    """
    Perform a web search for drug interaction information using Google Custom Search API.
    
    Args:
        query (str): The search query string
        search_api_key (str): Your Google Custom Search API key
        num_results (int): Number of search results to return
        
    Returns:
        dict: A dictionary containing search results
    """
    # Google Custom Search Engine ID - you need to create this in Google Cloud Console
    # For medical searches, you might want to create a custom search engine focused on trusted medical sources
    cx = "YOUR_CUSTOM_SEARCH_ENGINE_ID"  # Replace with your custom search engine ID
    
    # Google Custom Search API endpoint
    search_url = "https://www.googleapis.com/customsearch/v1"
    
    # Parameters for the search request
    params = {
        'key': search_api_key,
        'cx': cx,
        'q': query,
        'num': num_results
    }
    
    try:
        # Make the API request
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        
        # Parse the JSON response
        search_results = response.json()
        
        # Extract and format the relevant information from the search results
        formatted_results = []
        if 'items' in search_results:
            for item in search_results['items']:
                formatted_results.append({
                    'title': item.get('title', ''),
                    'link': item.get('link', ''),
                    'snippet': item.get('snippet', ''),
                    'source': item.get('displayLink', '')
                })
        
        return {
            "query": query,
            "results": formatted_results
        }
    except Exception as e:
        return {"error": str(e), "query": query}

# Function to extract information from search results
def extract_drug_info(search_results, drug1, drug2):
    """
    Extract relevant information from the search results.
    
    Args:
        search_results (dict): The results from the web search
        drug1 (str): First drug name
        drug2 (str): Second drug name
        
    Returns:
        dict: Structured information about the drug interaction
    """
    # Process the search results to extract relevant information
    # In a real application, you might want to do more sophisticated processing
    
    # Check if there was an error in the search
    if "error" in search_results:
        return {
            "drugs": [drug1, drug2],
            "error": search_results["error"],
            "sources": []
        }
    
    # Extract relevant search results
    sources = []
    for result in search_results.get("results", []):
        sources.append({
            "title": result.get("title", ""),
            "url": result.get("link", ""),
            "snippet": result.get("snippet", ""),
            "source": result.get("source", "")
        })
    
    return {
        "drugs": [drug1, drug2],
        "query": search_results.get("query", ""),
        "sources": sources
    }

# Main function to analyze drug interactions using Gemini
def analyze_drug_interactions(model, drug1, drug2, search_api_key):
    """
    Use Gemini to analyze potential drug interactions and side effects.
    
    Args:
        model: The initialized Gemini model
        drug1 (str): First drug name
        drug2 (str): Second drug name
        search_api_key (str): Google Custom Search API key
        
    Returns:
        str: Analysis of drug interactions
    """
    # First, perform a web search
    search_query = f"{drug1} {drug2} interaction side effects medical"
    search_results = web_search(search_query, search_api_key)
    
    # Extract relevant information
    drug_info = extract_drug_info(search_results, drug1, drug2)
    
    # Format the sources for the prompt
    sources_text = ""
    for i, source in enumerate(drug_info['sources'], 1):
        # Use html.escape to safely handle any special characters in the snippets
        safe_snippet = html.escape(source['snippet'])
        sources_text += f"""
        Source {i}:
        - Title: {source['title']}
        - URL: {source['url']}
        - Description: {safe_snippet}
        - Website: {source['source']}
        """
    
    # Craft a prompt for Gemini
    prompt = f"""
    Task: Research potential interactions and side effects between {drug1} and {drug2}.
    
    Search information: 
    - Drugs being analyzed: {drug1} and {drug2}
    - Search query: "{search_query}"
    
    Here are the search results I found:
    {sources_text}
    
    Based on these search results and your medical knowledge, please:
    1. Identify if there are any known interactions between these two medications
    2. List the potential side effects that could occur when taking these medications together
    3. Rate the severity of the interaction (Minor, Moderate, Major)
    4. Provide any recommendations for patients taking both medications
    
    Present your findings in a structured format with headings. Cite the sources from the search results to support your claims.
    Include a disclaimer about consulting healthcare professionals.
    
    If there isn't enough information in the search results, acknowledge the limitations and provide general information about drug interactions while emphasizing the importance of consulting a healthcare provider.
    """
    
    # Generate response from Gemini
    response = model.generate_content(prompt)
    
    return response.text

# Main class for the Drug Interaction AI Agent
class DrugInteractionAgent:
    def __init__(self, api_key, search_api_key):
        """Initialize the agent with the Gemini API key and Search API key."""
        self.model = setup_gemini(api_key)
        self.search_api_key = search_api_key
    
    def analyze_interaction(self, drug1, drug2):
        """Analyze the interaction between two drugs."""
        print(f"Analyzing interaction between {drug1} and {drug2}...")
        result = analyze_drug_interactions(self.model, drug1, drug2, self.search_api_key)
        return result

    def generate_report(self, drug1, drug2):
        """Generate a comprehensive report on drug interactions."""
        analysis = self.analyze_interaction(drug1, drug2)
        
        report = f"""
        # Drug Interaction Analysis Report
        
        ## Medications Analyzed
        - Drug 1: {drug1}
        - Drug 2: {drug2}
        
        ## Results
        {analysis}
        
        ## Important Note
        This analysis is generated using AI and should not replace professional medical advice.
        Always consult with a healthcare provider before making any decisions about your medications.
        """
        
        return report

# Example usage in Jupyter Notebook
# -------------------------------

# Set your API keys
# In a Jupyter notebook, you might want to use environment variables or a more secure method
api_key = "ADD YOU GEMINI API KEY"  # Replace with your actual Gemini API key
search_api_key = "ADD YOUR GOOGLE CUSTOM SEARCH API"  # Your Google Custom Search API key

# Initialize the agent with both API keys
agent = DrugInteractionAgent(api_key, search_api_key)

# Example drugs to check
drug1 = "ibuprofen"
drug2 = "aspirin"

# Get and display the report
report = agent.generate_report(drug1, drug2)
display_md(report)

