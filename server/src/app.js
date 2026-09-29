const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const healthRoutes = require("./routes/healthRoutes");
const donationRoutes = require("./routes/donationRoutes");
const requestRoutes = require("./routes/requestRoutes");
const matchRoutes = require("./routes/matchRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173").split(","),
  credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250 }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/health", healthRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  const port = process.env.PORT || 5000;
  await connectDB();
  app.listen(port, () => {
    console.log(`FoodBridge server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

module.exports = app;
