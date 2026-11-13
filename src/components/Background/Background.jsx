import "./Background.css";

function Background() {
  return (
    <div className="gaming-background" aria-hidden="true">
      <div className="ambient-glow glow-one"></div>
      <div className="ambient-glow glow-two"></div>
      <div className="ambient-glow glow-three"></div>

      <div className="background-grid"></div>

      {Array.from({ length: 22 }, (_, index) => (
        <span
          key={index}
          className="background-particle"
          style={{
            "--particle-index": index,
            "--particle-delay": `${index * -0.7}s`,
          }}
        />
      ))}
    </div>
  );
}

export default Background;