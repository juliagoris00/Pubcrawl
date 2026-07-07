/*
  Stap na Firebase:
  1. Ga in Firebase naar Project settings > Your apps > Web app.
  2. Kopieer ALLEEN het object firebaseConfig.
  3. Vervang hieronder de placeholder-waarden.

  Zolang hier nog VUL_HIER_IN staat, werkt de bingo offline op één telefoon,
  maar het live-scorebord nog niet.
*/
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-12nHZdCoexowpc7fSXLLUXQA7Jri_qc",
  authDomain: "pubcrawl-lille.firebaseapp.com",
  databaseURL: "https://pubcrawl-lille-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pubcrawl-lille",
  storageBucket: "pubcrawl-lille.firebasestorage.app",
  messagingSenderId: "872077181161",
  appId: "1:872077181161:web:66f80d6c2d9c394eaeb078",
  measurementId: "G-RCJ4736W5V"
};

// Naam van jullie spel in de database. Laat zo staan, tenzij je meerdere spellen wilt maken.
window.BINGO_GAME_ID = "lille-barcrawl-2026";

// Hostcode voor admin.html. Pas gerust aan.
window.BINGO_ADMIN_CODE = "LILLE2026";
