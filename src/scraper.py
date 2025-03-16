import requests
from bs4 import BeautifulSoup


def scrape_text_from_url(url):
    try:
        response = requests.get(url, timeout=5_000, verify=False)
        response.raise_for_status()  # Check that the request was successful

        soup = BeautifulSoup(response.content, "html.parser")

        paragraphs = soup.find_all(["p", "h1", "h2", "h3", "h4", "h5", "h6"])

        scraped_text = []
        for paragraph in paragraphs:
            text = paragraph.get_text().strip()
            if text:  # Only add non-empty text
                scraped_text.append(text)

        scraped_text = "\n\n".join(scraped_text)

        return {"url": url, "scraped_text": scraped_text}

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None