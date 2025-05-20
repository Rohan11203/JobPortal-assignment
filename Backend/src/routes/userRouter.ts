import { Router } from "express";
import { Signin, Signout, Signup } from "../controllers/userController";
import { Userauth } from "../auth";
import passport from "passport";
import { UserModel } from "../DB";

export const UserRouter = Router();

UserRouter.post("/signup", Signup);
UserRouter.post("/signin", Signin);
UserRouter.post("/logout", Userauth, Signout);

UserRouter.get("/", Userauth, async (req: any, res) => {
  const userId = req.user._id;
console.log(userId)
  try {
    const response = await UserModel.findById(userId);
    res.json({
      response,
    });
  } catch (error) {}
});
