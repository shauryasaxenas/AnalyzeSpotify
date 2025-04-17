// src/App.js
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  // State to hold whatever JSON comes back
  const [currentSong, setCurrentSong]       = useState(null);
  const [topTracks, setTopTracks]           = useState(null);
  const [albumCover, setAlbumCover]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentSongRes = await fetch('http://127.0.0.1:5000/api/current_song/');
        if (!currentSongRes.ok) throw new Error(`Current song fetch failed (${currentSongRes.status})`);
        const currentSongJson = await currentSongRes.json();
        setCurrentSong(currentSongJson);
  
        const topTracksRes = await fetch('http://127.0.0.1:5000/api/top_tracks/');
        if (!topTracksRes.ok) throw new Error(`Top tracks fetch failed (${topTracksRes.status})`);
        const topTracksJson = await topTracksRes.json();
        setTopTracks(topTracksJson);

        const albumCoverRes = await fetch('http://127.0.0.1:5000/api/album_cover/');
        if (!albumCoverRes.ok) throw new Error(`Album cover fetch failed (${albumCoverRes.status})`);
        const albumCoverJson = await albumCoverRes.json();
        setAlbumCover(albumCoverJson);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchData();
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div style={{ color: 'red' }}>Error: {error}</div>;


  const current_song = Object.values(currentSong || {});
  const tracks = Object.values(topTracks.top_tracks);
  const album_cover = Object.values(albumCover.album_cover);

  return (
    <div>
        <div className={"CurrentSong"}>
            <h1>Current Song</h1>
            <p>{current_song}</p>

            <h2>Album Cover</h2>
                {album_cover ? (
                <img
                    src={`http://localhost:5000/proxy-image?url=${encodeURIComponent(album_cover)}`}
                    alt="Album Cover"
                    style={{ width: '300px', height: 'auto' }}
                />
                ) : (
                <p>No album cover available</p>
                )}
                <p>Album cover URL: {album_cover}</p>
        </div>

        <div className="track">
            <h1>Top 10 Tracks</h1>
            {tracks.map((track, songNum) => (
                <div className="track" key={songNum}>
                    {track}
                </div>
            ))}
        </div>
    </div>
  );
}

export default App;
