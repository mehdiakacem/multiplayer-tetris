export const GAME_STATUS = {
  WAITING: "WAITING",        // lobby, not started
  PLAYING: "PLAYING",        // alive & game running
  ELIMINATED: "ELIMINATED",  // player lost, game still running
  WON: "WON",                // player won
  ENDED: "ENDED",            // game ended, player lost
  STARTED: "STARTED"
};
