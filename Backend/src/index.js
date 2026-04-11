//continue of 2nd way to connect to db
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { app } from "./app.js";
import connectDB from "./db/index.js";

//jb async function complete hota hai tou woh aik promise return karta hai
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDb Connection Failed! ", error);
  });

export default app;
