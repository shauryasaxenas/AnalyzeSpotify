from authentication import sp

# Fetch your top tracks
top_tracks = sp.current_user_top_tracks(limit=10, time_range='medium_term')  # medium_term = last 6 months

# Print results
print("🎵 Your Top 10 Tracks:")
for idx, track in enumerate(top_tracks['items']):
    name = track['name']
    artist = track['artists'][0]['name']
    print(f"{idx+1}. {name} by {artist}")

print(sp.current_user_playing_track())