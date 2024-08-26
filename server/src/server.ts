import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import config from "./config";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
const isDev = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: isDev ? 'http://localhost:3000' : 'https://mcskinmerger.mrspinn.ca',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the ToDo List API");
});

app.use("/api", routes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
