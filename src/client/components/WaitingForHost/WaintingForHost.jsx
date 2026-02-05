import "./WaitingForHost.css";

function WaitingForHost({restart}) {
  return (
    <div className="waiting-for-host-container">
      <p>Waiting for host to {restart ? "restart" : "start"} the game...</p>
    </div>
  );
}

export default WaitingForHost;
