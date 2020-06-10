const express = require("express");
const port = process.env.PORT || 80;
const app = express();

const admin = require("firebase-admin");
const serviceAccount = require("./firebase/veggie-shop-firebase-adminsdk-vjdom-4f9603ad17.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://veggie-shop.firebaseio.com",
});
const fs = admin.firestore();


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  return res.json({ value: 'good'});
})

app.get("/users", (req, res) => {
  const ref = fs.collection('users').get().then((data)=> {

  });
});
