const express = require("express");
const port = process.env.PORT || 80;

const admin = require("firebase-admin");
const serviceAccount = require("firebase/veggie-shop-firebase-adminsdk-vjdom-4f9603ad17.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://veggie-shop.firebaseio.com",
});

const app = express();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/users", (req, res) => {});
