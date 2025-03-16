from src.openai_api import OpenAIAPI
import re
import ast

openai_api = OpenAIAPI()

def parse_response(response):
    try:
        response = re.findall(r'```json(.*?)```', response, re.DOTALL)
    except Exception as e:
        print(e)
        return None
    return ast.literal_eval(response[0])


def generate_final_report(db_results, report):
    prompt = """
    Task: Generate a final report based on the provided drug interaction data and medical knowledge.

    Drug Interaction Data:
    {db_results}

    Medical Knowledge:
    {report}

    Analyse the given data which summarizes the potential interactions and side effects between the drugs being taken by the patient.
    Based on your analysis, give the output in the following format:

    Output Format:
    ```json
    {{"severity": "Severity", "report": "Report", "reasoning": "Reasoning"}}
    ```

    The severity should be one of - High, Moderate, Low, No Interaction

    Support your claim by providing a final report and detailed reasoning for your decision.

    Output:
    """

    prompt = prompt.format(db_results=db_results, report=report)
    response = openai_api.generate(prompt)
    return parse_response(response)