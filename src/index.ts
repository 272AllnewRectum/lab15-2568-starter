import express from "express";
import morgan from 'morgan';
import router from "./routes/courseRoutes.js";
import router1 from "./routes/studentRoutes.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(router);
app.use(router1);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;
