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

const firebase = require("./firebase/index");
const app = express();

app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    express.urlencoded({ extended: true })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// app.use(express.json());

// app.get('/apple-app-site-association', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.sendFile(path.join(__dirname, 'apple-app-site-association'));
// });

app.get("/.well-known/apple-app-site-association", async (req, res) => {
  const response = await fetch(
    "https://knickknacky-marvin-unmarvelously.ngrok-free.dev/.well-known/apple-app-site-association",
    {
      headers: { "ngrok-skip-browser-warning": "1" },
    }
  );

  const text = await response.text();
  res.setHeader("Content-Type", "application/json");
  res.send(text);
});

app.use(express.static(path.join(__dirname, "public")));

// API ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/img", profileRouter);
app.use("/api/v1/group", groupRouter);
app.use("/api/v1/invitation", inviteUser);

app.get("/group/:groupId", (req, res) => {
  const userAgent = req.headers["user-agent"];
  const appStoreUrl = "https://apps.apple.com/app/id6756718235"; // your Apple App Store ID

  console.log("Running 1");
  // iOS device → redirect to App Store if app not installed
  if (userAgent) {
    console.log("App Store Url =>", appStoreUrl);
    return res.redirect(appStoreUrl);
  }
  res.send(
    `<h1>Open this link on your mobile device</h1>
     <a href="${appStoreUrl}">Download App</a>`
  );
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.all("*", (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on the server!`, 400));
});

app.use(globalErrorHandler);
console.log("😂", process.env.NODE_ENV);

module.exports = app;
