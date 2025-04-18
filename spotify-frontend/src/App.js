// src/App.js
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [currentSong, setCurrentSong]       = useState(null);
  const [topTracks, setTopTracks]           = useState(null);
  const [albumCover, setAlbumCover]         = useState(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [timeRangeTrack, setTimeRangeTrack] = useState('short_term');
  const [timeRangeArtist, setTimeRangeArtist] = useState('short_term');
  const [topArtists, setTopArtists]         = useState(null);
  const [userDetails, setUserDetails]       = useState(null);
  const [previouslyListened, setPreviouslyListened] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentSongRes = await fetch('http://127.0.0.1:5000/api/current_song/');
        if (!currentSongRes.ok) throw new Error(`Current song fetch failed (${currentSongRes.status})`);
        const currentSongJson = await currentSongRes.json();
        setCurrentSong(currentSongJson);

        const topTracksRes = await fetch(`http://127.0.0.1:5000/api/top_tracks/?range=${timeRangeTrack}`);
        if (!topTracksRes.ok) throw new Error(`Top tracks fetch failed (${topTracksRes.status})`);
        const topTracksJson = await topTracksRes.json();
        setTopTracks(topTracksJson);

        const albumCoverRes = await fetch('http://127.0.0.1:5000/api/album_cover/');
        if (!albumCoverRes.ok) throw new Error(`Album cover fetch failed (${albumCoverRes.status})`);
        const albumCoverJson = await albumCoverRes.json();
        setAlbumCover(albumCoverJson);

        const topArtistsRes = await fetch(`http://127.0.0.1:5000/api/top_artists/?range=${timeRangeArtist}`);
        if (!topArtistsRes.ok) throw new Error(`Top artists fetch failed (${topArtistsRes.status})`);
        const topArtistsJson = await topArtistsRes.json();
        setTopArtists(topArtistsJson);

        const userDetailsRes = await fetch(`http://127.0.0.1:5000/api/user_details/`);
        if (!userDetailsRes.ok) throw new Error(`User details fetch failed (${userDetailsRes.status})`);
        const userDetailsJson = await userDetailsRes.json();
        setUserDetails(userDetailsJson);

        const previouslyListenedRes = await fetch("http://127.0.0.1:5000/api/previously_listened/");
        if (!previouslyListenedRes.ok) throw new Error(`Previously listened fetch failed (${previouslyListenedRes.status})`);
        const previouslyListenedJson = await previouslyListenedRes.json();
        setPreviouslyListened(previouslyListenedJson);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [timeRangeTrack, timeRangeArtist]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  const current_song = currentSong.current_song;
  const album_cover = albumCover.album_cover;

  const tracks = Object.values(topTracks.top_tracks);
  const albumLinksObj = topTracks.top_tracks_album_links;

  const artists = Object.values(topArtists.top_artists);
  const artistLinksObj = topArtists.top_artists_pfp_link;
  const popularity = Object.values(topArtists.top_artists_popularity);
  const followers = Object.values(topArtists.top_artists_followers);

  const user_name = userDetails.user_name;
  const user_email = userDetails.user_email;
  const user_pfp = userDetails.user_pfp;

  let previous_tracks = [];
  let previous_artist_links = [];
  let previous_artist = [];

  if (previouslyListened && previouslyListened.previous_songs && previouslyListened.previous_songs.length === 3) {
    previous_tracks = Object.values(previouslyListened.previous_songs[0]);
    previous_artist_links = Object.values(previouslyListened.previous_songs[1]);
    previous_artist = Object.values(previouslyListened.previous_songs[2]);
  }

  return (
    <div>
      <div className="top-bar">
        <img src="/Stats4You.png" alt="Stats4You Logo" className="app-logo" /> 

        <div className="center-content">
          <img src={album_cover} alt="Current Song Album Cover" className="cover-art" loading="lazy" />
          <h1>{current_song}</h1>
        </div>
        <img src={user_pfp} alt="User Profile" className="user-pfp" loading="lazy" />
      </div>

      <div className="content-container">
        <div className="track-section">
          <h1>Top 20 Tracks</h1>
          <div className="sort-control">
            <label htmlFor="range-select"><strong>Sort by:</strong></label>
            <select
              id="range-select"
              value={timeRangeTrack}
              onChange={(e) => {
                setLoading(true);
                setTimeRangeTrack(e.target.value);
              }}
            >
              <option value="short_term">Short Term (last 4 weeks)</option>
              <option value="medium_term">Medium Term (last 6 months)</option>
              <option value="long_term">Long Term (all time)</option>
            </select>
          </div>
          {tracks.map((track, index) => {
            const albumCover = albumLinksObj[(index + 1).toString()];
            return (
              <div className="track" key={index}>
                <img src={albumCover} alt={`Album cover for ${track}`} loading="lazy" />
                <div>
                  <div><strong>{track}</strong></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="artist-section">
          <h1>Top 20 Artists</h1>
          <div className="sort-control">
            <label htmlFor="artist-range-select"><strong>Sort by:</strong></label>
            <select
              id="artist-range-select"
              value={timeRangeArtist}
              onChange={(e) => {
                setLoading(true);
                setTimeRangeArtist(e.target.value);
              }}
            >
              <option value="short_term">Short Term (last 4 weeks)</option>
              <option value="medium_term">Medium Term (last 6 months)</option>
              <option value="long_term">Long Term (all time)</option>
            </select>
          </div>
          {artists.map((artist, index) => {
            const artistImage = artistLinksObj[(index + 1).toString()];
            return (
              <div className="artist" key={index}>
                <img src={artistImage} alt={`Profile for ${artist}`} loading="lazy" />
                <div>
                  <div><strong>{artist}</strong></div>
                  <div>Popularity Rating: {popularity[index]}</div>
                  <div>Followers: {followers[index]}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="previously-played">
          <h1>Previously Played Songs</h1>
          {previous_tracks.map((track, index) => {
            const artist = previous_artist[index];
            const albumCover = previous_artist_links[index];

            return (
              <div className="previous-song" key={index}>
                <img src={albumCover} alt={`Album cover for ${track}`} loading="lazy" />
                <div>
                  <div><strong>{track}</strong></div>
                  <div>{artist}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
