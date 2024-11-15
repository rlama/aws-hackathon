// components/PlayPauseButton.jsx
const PlayPauseButton = ({ isPlaying, onClick }) => (
    <button 
      onClick={onClick}
      style={{
        marginBottom: '10px',
        padding: '8px 16px',
        backgroundColor: isPlaying ? '#ff4444' : '#44ff44',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      {isPlaying ? (
        <>
          <PauseIcon /> Pause
        </>
      ) : (
        <>
          <PlayIcon /> Play
        </>
      )}
    </button>
  );
  
  // Simple icon components
  const PauseIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
      <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
    </svg>
  );
  
  const PlayIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" fill="currentColor"/>
    </svg>
  );
  
  export default PlayPauseButton;
  