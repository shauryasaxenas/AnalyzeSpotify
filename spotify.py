from authentication import sp
import time
import json


def top_10_tracks(time_range="short_term"):
    # Fetch your top tracks
    top_tracks = sp.current_user_top_tracks(limit=10, time_range=time_range)  # medium_term = last 6 months
    top_albums = top_tracks["items"]

    with open("pretty.json", "w") as f:
        json.dump(top_tracks, f, indent=4)

    tracksList, trackLinks, counter, counterTwo = {}, {}, 1, 0

    for idx, track in enumerate(top_tracks['items']):
        name, artist = track['name'], track['artists'][0]['name']

        tracksList[counter] = f"{idx+1}. {name} by {artist}"
        counter += 1

    while counterTwo < 10:
        trackLinks[counterTwo + 1] = top_albums[counterTwo]["album"]["images"][0]['url']
        counterTwo += 1

    return tracksList, trackLinks


def song_playing():
    if sp.current_user_playing_track() is not None:
        data = sp.current_user_playing_track()
        items = data["item"]

        return items["name"]


def current_song():
    if sp.current_user_playing_track() is not None:
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

        return f'You are listening to \'{song_name}\' by {artist_names}'


def get_current_album_cover():
    if sp.current_user_playing_track() is not None:
        data = sp.current_user_playing_track()
        track = data["item"]

        return track['album']['images'][0]['url']


def previous_songs(previous_10_Songs):
    songPlaying = ""
    previousSong = ""
    while True:
        songPlaying = song_playing()
        if songPlaying is not previousSong:
            previousSong = songPlaying
            if previousSong is not None:
                previous_10_Songs.insert(0, previousSong)
            if len(previous_10_Songs) > 10:
                previous_10_Songs.pop(10)
            print(previous_10_Songs, "\n")
        time.sleep(2)

        return previous_10_Songs

    
if __name__ == "__main__":
    print(top_10_tracks())
