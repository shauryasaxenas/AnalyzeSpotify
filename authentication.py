import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")
REDIRECT_URI = os.environ.get("REDIRECT_URI")

scope = scope = (
    "user-read-private "
    "user-read-email "
    "user-library-read "
    "user-library-modify "
    "user-read-playback-state "
    "user-modify-playback-state "
    "user-read-currently-playing "
    "user-read-recently-played "
    "user-top-read "
    "playlist-read-private "
    "playlist-read-collaborative "
    "playlist-modify-public "
    "playlist-modify-private "
    "app-remote-control "
    "streaming"
)

if os.path.exists(".cache"):
    os.remove(".cache")
    print("Cache cleared!")


# Set up Spotify authentication
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope=scope
    ), 
    requests_timeout=10

)

user_data = sp.current_user()

print("You are logged in as: ")
print("DIspla")
print("Email: ", user_data.get("email"))