import os
from src.web_search import brave_search
from src.scraper import scrape_text_from_url
from src.openai_api import OpenAIAPI
import time


openai_api = OpenAIAPI()


def analyze_drug_interactions(drug1, drug2):

    search_query = f"{drug1} {drug2} interaction side effects medical"
    search_results = brave_search(search_query, 3)
    search_text_results = {}
    for result in search_results:
        url = result["url"]
        text = scrape_text_from_url(url)["scraped_text"]
        time.sleep(1)
        search_text_results[url] = {"text": text, "title": result["title"]}

    sources_text = "\n\n".join([f"## {result['title']}\n{result['text']}" for result in search_text_results.values()])
    
    
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
    
    response = openai_api.generate(prompt)
    report = f"""
        # Drug Interaction Analysis Report
        
        ## Medications Analyzed
        - Drug 1: {drug1}
        - Drug 2: {drug2}
        
        ## Results
        {response}
    """
    
    return report
