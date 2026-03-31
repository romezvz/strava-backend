import "dotenv/config";
import cors from "cors";
import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.get("/", (req, res) => {
  res.send("Strava backend running 🚀");
});

app.get("/exchange_token", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send({ error: "Missing code" });

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.error("Token exchange error:", err);
    res.status(500).send({ error: "Error exchanging token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
