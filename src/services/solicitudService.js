import axios from 'axios'
import { config } from "../config";

const url = `${config.apiUrl2}/solicitud`;

export const findSolicitudes = async () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const findOneSolicitud = async (id) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.get(`${url}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const createSolicitud = async (body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const createMultipleSolicitud = async (body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.post(`${url}/multiple`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const createWithDiffPlaca = async (body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.post(`${url}/placas/diferentes`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const updateSolicitud = async (id, body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.patch(`${url}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}