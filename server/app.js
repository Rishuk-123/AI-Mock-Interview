import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Mock Interview API Running "
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "Server Healthy"
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;