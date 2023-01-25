import { Router } from "express";
import * as controllers from "../controllers/appController.js";
import { registerMail } from "../controllers/mailer.js";

const route = Router();

//get apis
route.route("/user/:username").get(controllers.getUser); //get user with username
route
  .route("/generate-otp")
  .get(
    controllers.verifyUser,
    controllers.localVariables,
    controllers.generateOTP
  ); //generate random otp
route.route("/verify-otp").get(controllers.verifyUser, controllers.verifyOTP); //to verify generated otp
route.route("/create-reset-session").get(controllers.createResetSession); //reset all the variables

//post apis
route.route("/register").post(controllers.register); //register user
route.route("/registerMail").post(registerMail); //send the email
route.route("/authenticate").post(controllers.verifyUser, (req, resp) => {
  resp.send("auth");
}); //authenticate user
route.route("/login").post(controllers.verifyUser, controllers.login); // login  in app

//put apis

route
  .route("/update-user")
  .put(controllers.verifyToken, controllers.updateUser); //use to update user profile
route
  .route("/reset-password")
  .put(controllers.verifyUser, controllers.resetPassword); //to reset password

export default route;
