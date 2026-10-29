export function SystemOrb() {
  const nodes = ["AI", "PQC", "WEB3", "DEFI", "CRYPTO", "SEC"];
  return (
    <div className="system-orb" aria-label="MBM technology convergence system">
      <div className="orb-grid" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="orb-core">
        <span className="core-scan" />
        <span className="core-label">MBM</span>
        <small>TECHNOLOGY<br />CONVERGENCE</small>
      </div>
      {nodes.map((node, index) => (
        <span className={`orb-node node-${index + 1}`} key={node}>
          <i />{node}
        </span>
      ))}
      <div className="orb-caption mono">
        <span>SYSTEM_01</span><span>SECURE BY CONSTRUCTION</span>
      </div>
    </div>
  );
}
