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
  const [timeRange, setTimeRange] = useState('short_term');
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [expectedImages, setExpectedImages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentSongRes = await fetch('http://127.0.0.1:5000/api/current_song/');
        if (!currentSongRes.ok) throw new Error(`Current song fetch failed (${currentSongRes.status})`);
        const currentSongJson = await currentSongRes.json();
        setCurrentSong(currentSongJson);
  
        const topTracksRes = await fetch(`http://127.0.0.1:5000/api/top_tracks/?range=${timeRange}`);
        if (!topTracksRes.ok) throw new Error(`Top tracks fetch failed (${topTracksRes.status})`);
        const topTracksJson = await topTracksRes.json();
        setTopTracks(topTracksJson);
        setExpectedImages(Object.keys(topTracksJson.top_tracks_album_links).length + 1);
        setImagesLoaded(0); // Reset images loaded count when fetching new data

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
  }, [timeRange]);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div style={{ color: 'red' }}>Error: {error}</div>;


  const current_song = currentSong.current_song;
  const tracks = Object.values(topTracks.top_tracks);
  const album_cover = albumCover.album_cover;
  const albumLinksObj = topTracks.top_tracks_album_links;

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
        <div className="sort-control" style={{margin: '1em 0'}}>
            <label htmlFor="range-select"><strong> Sort by:</strong></label>
            <select
                id="range-select"
                value={timeRange}
                onChange={(e) => {
                    setLoading(true);
                    setTimeRange(e.target.value);
                }}
                >
                <option value="short_term">Short Term (last 4 weeks)</option>
                <option value="medium_term">Medium Term (last 6 months)</option>
                <option value="long_term">Long Term (all time)</option>
                </select>   
        </div>
        <div className="track">
            <h1>Top 10 Tracks</h1>
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
    </div>
  );
}

export default App;
