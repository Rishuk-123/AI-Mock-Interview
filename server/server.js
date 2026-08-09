import "dotenv/config";

import interviewRoutes from "./routes/interviewRoutes.js";
import app from "./app.js";
import connectDB from "./config/db.js";

app.use("/api/interviews", interviewRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});