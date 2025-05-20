import axios from "axios";
axios.defaults.withCredentials = true;

interface AuthDataInterface {
  name?: string;
  email: string;
  password: string;
}
export async function onSignup(data: AuthDataInterface) {
  console.log("Signup data:", data);
  return await axios.post("http://localhost:3000/api/v1/users/signup", data);
}

export async function onSignin(data: AuthDataInterface) {
  return await axios.post("http://localhost:3000/api/v1/users/signin", data);
}

export async function onLogout() {
  return await axios.post("http://localhost:3000/api/v1/users/logout");
}

export async function getJobs({ q, category }: any) {
  return await axios.get("http://localhost:3000/api/v1/job/", {
    params: { q, category },
  });
}

export async function jobById(jobId:any) {
  console.log(jobId)
  return await axios.get(`http://localhost:3000/api/v1/job/${jobId}`);
}

export async function AddJob(data:any) {
  return await axios.post(`http://localhost:3000/api/v1/job/add`,data);
}

export async function GetUser() {
  return await axios.get("http://localhost:3000/api/v1/users/");
}