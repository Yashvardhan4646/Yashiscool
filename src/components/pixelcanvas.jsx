import React, { useState, useEffect, useRef } from 'react';

export default function DossierWidget() {
    const [activeTab, setActiveTab] = useState('draw'); // 'draw' or 'music'

    // --- DRAWING BOARD STATE (OPTIMIZED WITH HTML5 CANVAS) ---
    const GRID_SIZE = 48;
    const [currentColor, setCurrentColor] = useState('#0f172a');
    const [isDrawing, setIsDrawing] = useState(false);
    
    // We keep a saved state of the grid to restore drawing when changing tabs
    const [savedGrid, setSavedGrid] = useState(() => Array(GRID_SIZE * GRID_SIZE).fill('#ffffff'));
    
    // gridRef holds the real-time pixel data to avoid React state-induced re-renders while drawing
    const gridRef = useRef([]);

    const canvasRef = useRef(null);

    // --- REAL MUSIC PLAYER STATE ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);

    // 🔴 UPDATE THESE PATHS TO POINT TO YOUR ACTUAL MP3 FILES IN YOUR public/ FOLDER
    const playlist = [
        {
            title: '9mm bang bang',
            artist: 'Memphis',
            src: '/audio/audio1.mp3'
        },
        {
            title: 'Wasted Remix',
            artist: 'Juice WRLD',
            src: '/audio/audio2.mp3'
        },
        {
            title: 'Playdate X Build A B*tch',
            artist: 'JYTS',
            src: '/audio/audio3.mp3'
        }
    ];

    // Global mouse up handler to make drawing feel natural if mouse leaves the screen
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDrawing) {
                setIsDrawing(false);
                // Save current drawing back to state to persist across tab changes
                setSavedGrid([...gridRef.current]);
            }
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('touchend', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('touchend', handleGlobalMouseUp);
        };
    }, [isDrawing]);

    // Controls audio play/pause sync safely
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch((err) => {
                console.log("Audio playback was blocked or interrupted by browser autoplay settings:", err);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    // Draw gridRef contents onto the HTML5 Canvas
    const redrawCanvas = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const cellWidth = canvas.width / GRID_SIZE;
        const cellHeight = canvas.height / GRID_SIZE;

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw each colored cell
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const color = gridRef.current[row * GRID_SIZE + col];
                if (color !== '#ffffff') {
                    ctx.fillStyle = color;
                    ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                }
            }
        }
    };

    // Redraw whenever the tab is changed back to 'draw' or savedGrid updates
    useEffect(() => {
        if (activeTab === 'draw') {
            // Restore from state
            gridRef.current = [...savedGrid];
            // Render on next frame when DOM has mounted the canvas
            requestAnimationFrame(redrawCanvas);
        }
    }, [activeTab, savedGrid]);

    // Pixel drawing action mapping coordinates to grid cells
    const drawPixel = (clientX, clientY) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Calculate normalized coordinates (0.0 to 1.0)
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;

        // Convert to cell column and row indices
        const col = Math.floor(x * GRID_SIZE);
        const row = Math.floor(y * GRID_SIZE);

        if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
            const index = row * GRID_SIZE + col;
            
            // Only update and redraw if color actually changes to prevent overhead
            if (gridRef.current[index] !== currentColor) {
                gridRef.current[index] = currentColor;

                // Draw cell directly to canvas (immediate GPU render)
                const ctx = canvas.getContext('2d');
                const cellWidth = canvas.width / GRID_SIZE;
                const cellHeight = canvas.height / GRID_SIZE;
                ctx.fillStyle = currentColor;
                ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            }
        }
    };

    // Mouse and Touch events
    const handleCanvasMouseDown = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        drawPixel(e.clientX, e.clientY);
    };

    const handleCanvasMouseMove = (e) => {
        if (isDrawing) {
            drawPixel(e.clientX, e.clientY);
        }
    };

    const handleCanvasTouchStart = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        const touch = e.touches[0];
        drawPixel(touch.clientX, touch.clientY);
    };

    const handleCanvasTouchMove = (e) => {
        if (isDrawing) {
            const touch = e.touches[0];
            drawPixel(touch.clientX, touch.clientY);
        }
    };

    // Audio lifecycle bindings
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleNextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const handlePrevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const handleProgressChange = (e) => {
        const newTime = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
        setCurrentTime(newTime);
    };

    // Helper function to format time (e.g., 75 -> "1:15")
    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Actions
    const handleClear = () => {
        const cleared = Array(GRID_SIZE * GRID_SIZE).fill('#ffffff');
        gridRef.current = cleared;
        setSavedGrid(cleared);
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleEraser = () => {
        setCurrentColor('#ffffff');
    };

    const tabStyle = {
        background: 'none',
        border: 'none',
        padding: '6px 12px',
        cursor: 'pointer',
        fontFamily: 'monospace',
        fontSize: '11px',
        outline: 'none'
    };

    const toolbarStyle = {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        padding: '5px 12px',
        borderBottom: '1px dashed rgba(15, 23, 42, 0.15)',
        background: 'rgba(15, 23, 42, 0.01)',
        fontSize: '11px',
        fontFamily: 'monospace'
    };

    const btnStyle = {
        padding: '2px 6px',
        cursor: 'pointer',
        border: '1px solid rgba(15, 23, 42, 0.3)',
        background: '#fff',
        borderRadius: '3px',
        fontSize: '10px',
        fontFamily: 'monospace'
    };

    const mediaBtnStyle = {
        background: '#fff',
        border: '1px solid rgba(15, 23, 42, 0.25)',
        borderRadius: '4px',
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontFamily: 'monospace'
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            background: '#fbfbf9',
            userSelect: 'none',
            height: '100%'
        }}>

            {/* Native HTML5 Audio Core element */}
            <audio
                ref={audioRef}
                src={playlist[currentTrackIndex].src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleNextTrack}
            />

            {/* TABS CONTROLLER */}
            <div style={{
                display: 'flex',
                borderBottom: '1.5px dashed rgba(15, 23, 42, 0.15)',
                background: 'rgba(15, 23, 42, 0.04)',
                padding: '2px 8px'
            }}>
                <button
                    onClick={() => setActiveTab('draw')}
                    style={{
                        ...tabStyle,
                        borderBottom: activeTab === 'draw' ? '2px solid #0f172a' : '2px solid transparent',
                        fontWeight: activeTab === 'draw' ? 'bold' : 'normal',
                        color: activeTab === 'draw' ? '#0f172a' : 'rgba(15, 23, 42, 0.6)'
                    }}
                >
                    🎨 Drawing Board
                </button>
                <button
                    onClick={() => setActiveTab('music')}
                    style={{
                        ...tabStyle,
                        borderBottom: activeTab === 'music' ? '2px solid #0f172a' : '2px solid transparent',
                        fontWeight: activeTab === 'music' ? 'bold' : 'normal',
                        color: activeTab === 'music' ? '#0f172a' : 'rgba(15, 23, 42, 0.6)'
                    }}
                >
                    🎵 Music Player
                </button>
            </div>

            {/* CORE CONTENT LAYOUTS */}
            <div style={{ flexGrow: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>

                {/* VIEW 1: HIGH-RES DRAWING CANVAS */}
                {activeTab === 'draw' && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                        <div style={toolbarStyle}>
                            <input
                                type="color"
                                value={currentColor}
                                onChange={(e) => setCurrentColor(e.target.value)}
                                style={{ width: '22px', height: '18px', padding: 0, border: '1px solid #0f172a', cursor: 'pointer' }}
                            />
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {['#0f172a', '#ef4444', '#3b82f6', '#22c55e'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setCurrentColor(color)}
                                        style={{
                                            width: '14px', height: '14px', background: color,
                                            border: currentColor === color ? '1.5px solid #000' : '1px solid #ccc',
                                            cursor: 'pointer', borderRadius: '2px'
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{ flexGrow: 1 }} />
                            <button
                                onClick={handleEraser}
                                style={{ ...btnStyle, background: currentColor === '#ffffff' ? '#e2e8f0' : '#fff' }}
                            >
                                Eraser
                            </button>
                            <button onClick={handleClear} style={btnStyle}>
                                Clear
                            </button>
                        </div>

                        <div style={{
                            flexGrow: 1,
                            position: 'relative',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'stretch',
                            justifyContent: 'stretch',
                            overflow: 'hidden'
                        }}>
                            <canvas
                                ref={canvasRef}
                                width={480}
                                height={480}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'block',
                                    cursor: 'crosshair',
                                    imageRendering: 'pixelated'
                                }}
                                onMouseDown={handleCanvasMouseDown}
                                onMouseMove={handleCanvasMouseMove}
                                onTouchStart={handleCanvasTouchStart}
                                onTouchMove={handleCanvasTouchMove}
                            />
                        </div>
                    </div>
                )}

                {/* VIEW 2: RETRO MUSIC INTERFACE */}
                {activeTab === 'music' && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        padding: '20px',
                        boxSizing: 'border-box',
                        fontFamily: 'monospace',
                        color: '#0f172a',
                        background: '#faf9f5'
                    }}>
                        {/* Cassette Animation Wrapper */}
                        <div style={{
                            width: '80px',
                            height: '50px',
                            background: '#0f172a',
                            borderRadius: '6px',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '24px' }}>
                                {[1, 2, 3, 4, 5].map((id) => (
                                    <div key={id} style={{
                                        width: '4px',
                                        background: '#fff',
                                        animation: isPlaying ? 'dossierBounce 0.6s ease infinite alternate' : 'none',
                                        animationDelay: `${id * 0.1}s`,
                                        height: isPlaying ? '100%' : '4px',
                                        maxHeight: '20px'
                                    }} />
                                ))}
                            </div>
                        </div>

                        {/* Track Info Labels */}
                        <div style={{ textAlign: 'center', marginBottom: '14px', width: '100%' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {playlist[currentTrackIndex].title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(15, 23, 42, 0.6)', marginTop: '2px' }}>
                                {playlist[currentTrackIndex].artist}
                            </div>
                        </div>

                        {/* Live Progress Slider Track */}
                        <div style={{ width: '80%', maxWidth: '240px', marginBottom: '16px' }}>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleProgressChange}
                                style={{
                                    width: '100%',
                                    accentColor: '#0f172a',
                                    cursor: 'pointer',
                                    margin: 0
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginTop: '4px', color: 'rgba(15, 23, 42, 0.5)' }}>
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                            {/* Controls */}
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}>
                                <button onClick={handlePrevTrack} style={mediaBtnStyle}>
                                    ⏮
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    style={{
                                        ...mediaBtnStyle,
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: '#0f172a',
                                        color: '#fff',
                                        fontSize: '14px'
                                    }}
                                >
                                    {isPlaying ? '⏸' : '▶'}
                                </button>

                                <button onClick={handleNextTrack} style={mediaBtnStyle}>
                                    ⏭
                                </button>
                            </div>

                            {/* Inject safe scoped keyframes */}
                            <style>{`
              @keyframes dossierBounce {
                0% { height: 4px; }
                100% { height: 22px; }
              }
            `}</style>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
