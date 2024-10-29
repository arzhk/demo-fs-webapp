import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import questionRoutes from "./routes/questions";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
