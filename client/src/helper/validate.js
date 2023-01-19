import { toast } from "react-hot-toast";

//Validate username

export async function usernameValidate(values) {
  const error = usernameVerify({}, values);
  return error;
}

//verify username

function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username required");
  } else if (values.username === " ") {
    error.username = toast.error("Invalid Username");
  }
  return error;
}
