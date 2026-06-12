import axios from "axios";

const url = "http://localhost:8040/api/auth";

export const SignInProcess = async (signIn: any) => {
  try {
    const response = await axios.post(`${url}/signin`, signIn);
    console.log("LOGIN RESPONSE:", response.data);
    return response.data.token || response.data;

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    throw err; 
  }
};

export const SignUpProcess = async (signUp: any) => {
  try {
    const response = await axios.post(`${url}/signup`, signUp);
    console.log("SIGNUP RESPONSE:", response.data);
    return response.data.token || response.data;

  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    throw err;
  }
};