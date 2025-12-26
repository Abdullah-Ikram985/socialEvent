const express = require("express");
require("dotenv").config({ path: "./config.env" });
const path = require("path");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const profileRouter = require("./routes/singleImgRoutes");
const groupRouter = require("./routes/groupRoutes");
const inviteUser = require("./routes/invitationRoutes");

const app = express();

app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    express.urlencoded({ extended: true })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// app.use(express.json());

app.get("/apple-app-site-association", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "apple-app-site-association"));
});

// API ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/img", profileRouter);
app.use("/api/v1/group", groupRouter);
app.use("/api/v1/invitation", inviteUser);

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on the server!`, 400));
});

app.use(globalErrorHandler);
console.log("😂", process.env.NODE_ENV);

module.exports = app;
