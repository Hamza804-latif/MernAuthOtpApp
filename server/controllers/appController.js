import UserModel from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import secret from "../config.js";
import OTPGenerator from "otp-generator";

//middlewares

export async function verifyToken(req, resp, next) {
  let token = req?.headers?.authorization?.split(" ")[1];
  if (token) {
    try {
      jwt.verify(token, secret.secretkey, (err, token) => {
        if (err) resp.send({ error: "token is not valid" });
        else {
          req.user = token?.userId;
          next();
        }
      });
    } catch (error) {
      resp.status(500).send({ error: error.message });
    }
  } else {
    resp.status(401).send({ error: "please send valid token" });
  }
}

export async function verifyUser(req, resp, next) {
  try {
    let { username } = req.method == "GET" ? req.query : req.body;
    let exist = await UserModel.findOne({ username });
    if (!exist) {
      resp.status(404).send({ error: "can't find user" });
      return;
    }
    next();
  } catch (error) {
    resp.status(500).send({ error: error.message });
    return;
  }
}

export async function localVariables(req, resp, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}

//controllers
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
          resp.status(201).send({ msg: "user save succesfully" });
          return;
        })
        .catch((error) => {
          resp.status(500).send({ error: error.message });
          return;
        });
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
}

export async function login(req, resp) {
  let { username, password } = req.body;
  try {
    let user = await UserModel.findOne({ username });
    if (user) {
      let passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        resp.status(403).send({ error: "password does not match" });
        return;
      } else {
        let token = jwt.sign(
          { userId: user._id, username: user.username },
          secret.secretkey,
          {
            expiresIn: "24h",
          }
        );
        resp
          .status(200)
          .send({ msg: "login Successfull", username: user.username, token });
        return;
      }
    } else {
      resp.status(403).send({ error: "username or Password is incorrect" });
      return;
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
    return;
  }
}

export async function getUser(req, resp) {
  let { username } = req.params;

  try {
    let user = await UserModel.findOne({ username }).select("-password");
    if (user) {
      resp.status(200).send(user);
      return;
    } else {
      resp.status(404).send({ error: "can't find user" });
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
    return;
  }
}

export async function updateUser(req, resp) {
  let id = req?.user;

  if (id) {
    console.log(id);
    let body = req.body;
    console.log(body);
    try {
      let updatedUser = await UserModel.updateOne({ _id: id }, { $set: body });
      if (updatedUser?.modifiedCount > 0) {
        resp.status(201).send({ message: "User updated successfully" });
        return;
      } else {
        resp.status(200).send({ message: "data is already same" });
        return;
      }
    } catch (error) {
      resp.status(500).send({ error: error.message });
    }
  } else {
    resp.status(401).send({ error: "please send user id" });
  }
}

export async function generateOTP(req, resp) {
  req.app.locals.OTP = await OTPGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  resp.status(201).send({ code: req?.app?.locals?.OTP });
}
export async function verifyOTP(req, resp) {
  let { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return resp.status(201).send({ msg: "OTP verified Successfully" });
  }
  return resp.status(401).send({ error: "Invalid OTP!" });
}
export async function createResetSession(req, resp) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return resp.status(200).send({ msg: "Access granted" });
  }
  return resp.status(403).send({ error: "Session Expired" });
}
export async function resetPassword(req, resp) {
  try {
    if (!req.app.locals.resetSession)
      return resp.status(403).send({ error: "Session Expired" });

    let { username, password } = req.body;
    let user = await UserModel.findOne({ username });
    if (user) {
      let hashedPassword = await bcrypt.hash(password, 10);
      let updatedUser = await UserModel.updateOne(
        { username: user.username },
        { $set: { password: hashedPassword } }
      );
      if (updatedUser?.modifiedCount > 0) {
        req.app.locals.resetSession = false;
        return resp.status(201).send({ msg: "Password reset Successfully" });
      } else {
        return resp.status(401).send({ error: "Data is already same" });
      }
    } else {
      return resp.status(404).send({ error: "User Not Found" });
    }
  } catch (error) {
    return resp.status(500).send({ error: error.message });
  }
}
