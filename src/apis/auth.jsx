import axios from "axios";

export async function signIn(url, email, password) {
  // Create a data object in JSON format
  const data = {
    email: email,
    password: password,
  };

  console.log('Sending JSON:', JSON.stringify(data));


  // Send the POST request with the JSON data
  return await axios.post(url, data);
}

export const signOut = async (url) => {
  return await axios.post(url); // Assuming it's a POST request for logging out
};