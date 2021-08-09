const firebase = require("firebase/app").default;
require("firebase/auth");

module.exports = firebase.initializeApp({
  apiKey: "AIzaSyD3lZsYCPF2bvnoEKSPhsDznJrk9eHnv1Q",
  authDomain: "trackex-app.firebaseapp.com",
  projectId: "trackex-app",
  storageBucket: "trackex-app.appspot.com",
  messagingSenderId: "994479060086",
  appId: "1:994479060086:web:c07b47a3aee197ff2fdb57",
});
