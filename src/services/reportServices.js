import axios from 'axios'
import { config } from "../config";

const url = `${config.apiUrl2}/report`;

export const fillByDate = async (body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  /* const res = await axios.get('http://localhost:3000/vehiculos', {
        params: { fechaInicio, fechaFin }
      }); */
  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}