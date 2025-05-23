import axios from 'axios'
import { config } from "../config";

const url = `${config.apiUrl2}/backup`;

export const createBackUp = async () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.post(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}