const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 80;
const app = express();
app.use(bodyParser.json());

const admin = require("firebase-admin");
const serviceAccount = require("./firebase/veggie-shop-firebase-adminsdk-vjdom-4f9603ad17.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://veggie-shop.firebaseio.com",
});
const fs = admin.firestore();

// it will not work with port addition
const corsOptions = {
  origin: ["http://localhost", "https://veggie-shop.web.app"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  return res.json({ value: "good" });
});

app.get("/users", async (req, res) => {
  const users = [];
  const querySnapshot = await fs.collection("users").get();
  querySnapshot.forEach((doc) =>
    users.push({
      id: doc.id,
      ...doc.data(),
    })
  );

  return res.json(users);
});

// grant admin permission to a user
app.post("/admin", async (req, res) => {
  const uid = req.body.uid;
  console.log(uid);
  try {
    const ref = fs
      .collection("roles")
      .doc("admin")
      .collection("role-users")
      .doc(uid);

    await ref.set({
      active: false,
    });

    return res.send(true);
  } catch {
    return res.send(false);
  }
});

// activate / deactive an admin
app.put("/admin/:uid/:status", async (req, res) => {
  const uid = req.params.uid;
  const status = req.params.status;

  try {
    const ref = fs
      .collection("roles")
      .doc("admin")
      .collection("role-users")
      .doc(uid);

    if (status == "true") {
      await ref.update({
        active: true,
      });
    } else if (status == "false") {
      await ref.update({
        active: false,
      });
    } else {
      throw new Error("Invalid params");
    }
    return res.send(true);
  } catch {
    return res.send(false);
  }
});

// delete an admin
app.delete("/admin/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const ref = fs
      .collection("roles")
      .doc("admin")
      .collection("role-users")
      .doc(uid);

    await ref.delete();

    return res.send(true);
  } catch {
    return res.send(false);
  }
});

// block / unblock a user
app.put("/user/:uid/:status", async (req, res) => {
  const uid = req.params.uid;
  const status = req.params.status;

  try {
    const ref = fs.collection("blocked-users").doc(uid);

    if (status == "true") {
      await ref.set();
    } else if (status == "false") {
      await ref.delete();
    } else {
      throw new Error("Invalid params");
    }
    return res.send(true);
  } catch {
    return res.send(false);
  }
});
