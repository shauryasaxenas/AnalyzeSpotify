// src/App.js
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  // State to hold whatever JSON comes back
  const [currentSong, setCurrentSong]       = useState(null);
  const [topTracks, setTopTracks]           = useState(null);
  const [albumCover, setAlbumCover]         = useState(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [timeRangeTrack, setTimeRangeTrack] = useState('short_term');
  const [timeRangeArtist, setTimeRangeArtist] = useState('short_term');
  const [topArtists, setTopArtists]         = useState(null);

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

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchData();
  }, [timeRangeTrack, timeRangeArtist]);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div style={{ color: 'red' }}>Error: {error}</div>;

  // Variables for current song
  const current_song = currentSong.current_song; // Displays current song user is lisening t
  const album_cover = albumCover.album_cover; // Displays album cover for current song

  const tracks = Object.values(topTracks.top_tracks);
  const albumLinksObj = topTracks.top_tracks_album_links;

  const artists = Object.values(topArtists.top_artists);
  const artistLinksObj = topArtists.top_artists_pfp_link;
  const popularity = Object.values(topArtists.top_artists_popularity);
  const followers = Object.values(topArtists.top_artists_followers);
  
  

  return (
    <div>
            <div className={"CurrentSong"}>
                <h1>Current Song</h1>
                <p>{current_song} 
                <img
                    src={album_cover}
                    alt="Album Cover For Current Song"
                    style={{ width: '100px', height: 'auto'}}
                    loading='lazy'
                    />
                </p>
            </div>
        
            <div className="content-container">
                <div className="track">
                    <h1>Top 20 Tracks</h1>
                    <div className="sort-control" style={{margin: '1em 0'}}>
                        <label htmlFor="range-select"><strong> Sort by:</strong></label>
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
                    const albumLink = albumLinksObj[(index + 1).toString()];
                    return (
                        <div className="track" key={index}>
                            {track}
                        <img
                            src={albumLink}
                            alt={`Album Cover for ${track}`}
                            style={{ width: '100px', height: 'auto' }}
                            loading='lazy'
                        />
                        </div>
                    );
                })}
            </div>

            <div className="TopArtists">
                <h1>Top 20 Artists</h1>
                <div className="sort-control" style={{margin: '1em 0'}}>
                <label htmlFor="range-select"><strong> Sort by:</strong></label>
                    <select
                        id="range-select"
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
                    const artistLink = artistLinksObj[(index + 1).toString()];
                return (
                    <div className="artist" key={index}>
                        {artist}

                        <img
                            src={artistLink}
                            alt={`Artist Cover for ${artist}`}
                            style={{ width: '100px', height: 'auto' }}
                            loading='lazy'
                        />
                        <p>Popularity: {popularity[index]}</p>
                        <p>Followers: {followers[index]}</p>
                    </div>
                );
            })}
            </div>
        </div>
    </div>
  );
}

export default App;
