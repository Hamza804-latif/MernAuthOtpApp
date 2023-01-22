import UserModel from "../models/User.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function register(req, resp) {
  try {
    const { username, password, profile, email } = req.body;

    //check for existing username
    // const existUsername = new Promise((resolve, reject) => {
    //   UserModel.findOne({ username }, (err, user) => {
    //     if (err) reject(new Error(err));
    //     if (user) reject({ error: "Please provide unique username" });

    //     resolve();
    //   });
    // });

    // //check for existing email
    // const existEmail = new Promise((resolve, reject) => {
    //   UserModel.findOne({ email }, (err, email) => {
    //     if (err) reject(new Error(err));
    //     if (email) reject({ error: "Please provide unique email" });

    //     resolve();
    //   });
    // });
    // Promise.all([existUsername, existEmail]).then(() => {
    //   if (password) {
    //     bcrypt
    //       .hash(password, 10)
    //       .then((hashedPass) => {
    //         const user = new UserModel({
    //           username,
    //           password: hashedPass,
    //           profile: profile || "",
    //           email,
    //         });
    //         //return and save user

    //         user
    //           .save()
    //           .then(() =>
    //             resp.status(201).send({ message: "user saved Successfully" })
    //           )
    //           .catch((error) => resp.status(500).send({ error }));
    //       })
    //       .catch((err) => {
    //         resp.status(500).send({ error: "Enable to hashed Password" });
    //       });
    //   }
    // });

    let userExist = await UserModel.findOne({ username });
    if (userExist) {
      resp.status(403).send({ error: "username alredy exist" });
      return;
    }
    let emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      resp.status(403).send({ error: "email alredy exist" });
      return;
    }
    if (password) {
      let hasedPassword = await bcrypt.hash(password, 10);
      let user = new UserModel({
        username,
        email,
        password: hasedPassword,
        profile: profile || " ",
      });
      user
        .save()
        .then(() => {
          resp.status(201).send({ message: "user save succesfully" });
        })
        .catch((error) => {
          resp.status(500).send({ error: error.message });
        });
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
}

export async function login(req, resp) {
  resp.status(201).json({ message: "login" });
}

export async function getUser(req, resp) {
  resp.status(201).json({ message: "get user" });
}

export async function updateUser(req, resp) {
  resp.status(201).json({ message: "update user" });
}

export async function generateOTP(req, resp) {
  resp.status(201).json({ message: "generate OTP" });
}
export async function verifyOTP(req, resp) {
  resp.status(201).json({ message: "verify OTP" });
}
export async function createResetSession(req, resp) {
  resp.status(201).json({ message: "createResetSession" });
}
export async function resetPassword(req, resp) {
  resp.status(201).json({ message: "resetPassword" });
}
