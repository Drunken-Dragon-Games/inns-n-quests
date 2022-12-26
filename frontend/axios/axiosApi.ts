import axios from "axios";
import { v4 } from "uuid"

export const axiosCustomInstance = (endpoint: string) => {
  const traceId = v4()
  const baseURL = process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "http://localhost:5000"
  if (baseURL.includes("acceptance.") || baseURL.includes("testnet.") || baseURL.includes("localhost"))
    console.log({ endpoint, traceId })
  return axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "Trace-ID": traceId
    },
    withCredentials: true,
  })
};


export const axiosCustomFilesInstance = axios.create({
  baseURL: typeof process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"]  == "string" ? process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"]! : "http://localhost:5000",
  timeout: 5000,
  headers: {
    "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary3Ns3IAaUwDCBFQuZ",
    accept: "application/json",
  },
  withCredentials: true,
});
