from pyngrok import ngrok


api_token = input("Enter your ngrok auth token: ")
# Replace with your ngrok auth token
ngrok.set_auth_token(api_token)

# Open a HTTP tunnel on port 8000
public_url = ngrok.connect(8000)
print(f" * ngrok tunnel \"{public_url}\" -> \"http://127.0.0.1:8000\"")