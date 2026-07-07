/*
  Stap na Firebase:
  1. Ga in Firebase naar Project settings > Your apps > Web app.
  2. Kopieer ALLEEN het object firebaseConfig.
  3. Vervang hieronder de placeholder-waarden.

  Zolang hier nog VUL_HIER_IN staat, werkt de bingo offline op één telefoon,
  maar het live-scorebord nog niet.
*/
window.firebaseConfig = {
  apiKey: "VUL_HIER_IN",
  authDomain: "VUL_HIER_IN",
  databaseURL: "VUL_HIER_IN",
  projectId: "VUL_HIER_IN",
  storageBucket: "VUL_HIER_IN",
  messagingSenderId: "VUL_HIER_IN",
  appId: "VUL_HIER_IN"
};

// Naam van jullie spel in de database. Laat zo staan, tenzij je meerdere spellen wilt maken.
window.BINGO_GAME_ID = "lille-barcrawl-2026";

// Hostcode voor admin.html. Pas gerust aan.
window.BINGO_ADMIN_CODE = "LILLE2026";
