import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import config from "./config";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";


const app = express();
dotenv.config();

console.log(process.env.NODE_ENV);
console.log(process.env.PORT);
console.log(process.env.ALLOWED_ORIGINS);

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000', 'https://taskmaster.mrspinn.ca'];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Full URL: ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the ToDo List API");
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api", routes);

app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const port = config.port || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('*', (req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

export default app;
