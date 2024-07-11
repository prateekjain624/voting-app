import express from "express";
import {
  signUp,
  signIn,
  userProfile,
  updatePassword,
} from "../controller/user.controller.js";
import authorization from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", signUp);
userRouter.post("/login", signIn);
userRouter.get("/profile", authorization, userProfile);
userRouter.put("/profile/update-password", authorization, updatePassword);

export default userRouter;
