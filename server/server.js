import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import interviewRoutes from "./routes/interviewRoutes.js";

app.use("/api/interviews", interviewRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
  //
};

startServer();