import nodemailer from "nodemailer";
import mailgen from "mailgen";
import ENV from "../config.js";

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 465,
  secure: true, // true for 465, false for other ports
  secureConnection: false,
  requireTLS: true, //this parameter solved problem for me
  auth: {
    user: ENV.Email,
    pass: ENV.Password,
  },
  tls: {
    rejectUnauthorized: true,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new mailgen({
  theme: "default",
  product: {
    name: "mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req, resp) => {
  const { username, userEmail, text, subject } = req.body;

  if (!username && !userEmail)
    return resp
      .status(401)
      .send({ error: "please send username and user Email" });

  var email = {
    body: {
      name: username,
      intro: text || "this is intro",
      outro: "this is outro",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: ENV.Email,
    to: userEmail,
    subject: subject || "Signup Successfull",
    html: emailBody,
  };

  //send mail
  transporter.sendMail(message, (error, data) => {
    if (error) return resp.status(500).send({ error: error.message });
    if (data)
      return resp
        .status(200)
        .send({ msg: "You should have received an email from us" });
  });
};
