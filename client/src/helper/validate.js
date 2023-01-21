import { toast } from "react-hot-toast";

//Validate username

export async function usernameValidate(values) {
  const error = usernameVerify({}, values);
  return error;
}

//Validate password

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  return errors;
}

//validate reset password
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password does not match");
  }
  return errors;
}

//validate register form

export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

//validate profile page

export async function profileValidaton(values) {
  const errors = emailVerify({}, values);
  return errors;
}

// *********************************************************

//verify password
function passwordVerify(errors = {}, values) {
  if (!values.password) {
    errors.password = toast.error("Password Requires...!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Invalid Password");
  } else if (values.password.length < 9) {
    errors.password = toast.error("Password must be greater than 8 characters");
  }

  return errors;
}

//verify username

function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username required");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username");
  }
  return error;
}

//verify email

function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Please provide Email");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Email is not valid");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...");
  }
  return error;
}
