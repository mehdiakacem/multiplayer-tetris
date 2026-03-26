export function createGameSocketMiddleware(socket) {
  const listeners = new Map();

  const joinRoom = (room, playerName) => {
    socket.emit("join-room", { room, playerName });
  };

  const startGame = () => {
    socket.emit("start-game");
  };

  const sendPlayerInput = (action, clientActionId) => {
    const payload = { action };
    if (typeof clientActionId === "number") {
      payload.clientActionId = clientActionId;
    }
    socket.emit("player-input", payload);
  };

  /**
   * Register event listeners
   */
  const on = (event, callback) => {
    socket.on(event, callback);
    
    // Store listener for cleanup
    if (!listeners.has(event)) {
      listeners.set(event, []);
    }
    listeners.get(event).push(callback);
  };

  /**
   * Remove a specific event listener
   */
  const off = (event, callback) => {
    socket.off(event, callback);
    
    const eventListeners = listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  };

  /**
   * Remove all listeners for an event
   */
  const removeAllListeners = (event) => {
    if (event) {
      socket.removeAllListeners(event);
      listeners.delete(event);
    } else {
      socket.removeAllListeners();
      listeners.clear();
    }
  };


  const connect = () => {
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const getId = () => socket.id;


  const isConnected = () => socket.connected;

  const cleanup = () => {
    removeAllListeners();
    disconnect();
  };

  // Return public API
  return {
    // Actions (emit)
    joinRoom,
    startGame,
    sendPlayerInput,
    
    // Event handling
    on,
    off,
    removeAllListeners,
    
    // Connection management
    connect,
    disconnect,
    cleanup,
    
    // Getters
    getId,
    isConnected,
  };
}
