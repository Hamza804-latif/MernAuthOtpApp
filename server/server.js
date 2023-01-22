import express from "express";
import cors from "cors";
import morgan from "morgan";
import Connect from "./conn.js";
import route from "./Router/route.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); //less hackers know about your stack

const port = 8000;

// apis

app.get("/", (req, resp) => {
  resp.status(201).json({ message: "Home skh" });
});

app.use("/api", route);

// starting server

Connect()
  .then((res) => {
    try {
      app.listen(port, () => {
        console.log(`server is live on http://localhost:${port}`);
      });
    } catch (err) {
      console.log("cannot connect to the server");
    }
  })
  .catch((err) => {
    console.log("invalid database connection");
  });
