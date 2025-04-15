from authentication import sp
import time
import json

# Fetch your top tracks
top_tracks = sp.current_user_top_tracks(limit=10, time_range='medium_term')  # medium_term = last 6 months

# Print results
print("🎵 Your Top 10 Tracks:")
for idx, track in enumerate(top_tracks['items']):
    name = track['name']
    artist = track['artists'][0]['name']
    print(f"{idx+1}. {name} by {artist}")


with open("schema.dat", "w") as file:
    current_track = sp.current_user_playing_track()
    file.write(json.dumps(current_track, indent=2))


def song_playing():
    if sp.current_user_playing_track() is None:
        pass
    else:
        data = sp.current_user_playing_track()
        items = data["item"]

        return items["name"]


def current_song():
    if sp.current_user_playing_track() is None:
        pass
    else:
        artist_names = ""
        data = sp.current_user_playing_track()
        items = data["item"]
        album = items["album"]
        artists = album["artists"]
        song_name = items["name"]

        if len(artists) == 1:
            artist_names = artists[0]["name"]
        else:
            for i in range(len(artists)):
                if i == (len(artists) - 1):
                    artist_names += artists[i]["name"]
                else:
                    artist_names += artists[i]["name"] + ", "

        print(f'You are listening to \'{song_name}\' by {artist_names}')


if __name__ == "__main__":

    songPlaying = ""
    previousSong = ""
    previous_10_Songs = []
    while True:
        songPlaying = song_playing()
        if songPlaying == previousSong:
            pass
        else:
            current_song()
            previousSong = songPlaying
            previous_10_Songs.insert(0, previousSong)
            if len(previous_10_Songs) > 10:
                previous_10_Songs.pop(10)
            print(previous_10_Songs)
        time.sleep(1)
