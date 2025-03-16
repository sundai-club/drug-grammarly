from openai import OpenAI
import os


class OpenAIAPI:
    def __init__(self):
        self.client = OpenAI()

    def generate(self, prompt):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4096,
            temperature=0.2,
        )
        return response.choices[0].message.content
    