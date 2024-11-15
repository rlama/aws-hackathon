// components/CharacterControls.jsx
const CharacterControls = ({ character, onAnimate, onStop, animations }) => (
  <div>
    <h3>{character} Controls</h3>
    {Object.keys(animations).map(animationName => (
      <button 
        key={animationName}
        onClick={() => onAnimate(animationName)}
      >
        {character} {animationName.charAt(0).toUpperCase() + animationName.slice(1)}
      </button>
    ))}
    <button onClick={onStop}>Stop {character}</button>
  </div>
);

export default CharacterControls;
