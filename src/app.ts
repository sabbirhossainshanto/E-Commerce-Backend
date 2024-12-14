import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./utils/globalErrorHandler";
import notFound from "./utils/notFound";
import router from "./app/routes";
const app: Application = express();

//middleware
app.use(
  cors({
    credentials: true,
    origin: [
      "https://multivendor-e-commerce.netlify.app",
      "http://localhost:3001",
      "https://e-commerce-rho-nine.vercel.app",
    ],
  })
);
// Handle preflight requests explicitly (if needed)
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// module route
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
