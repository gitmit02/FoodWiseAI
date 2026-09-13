import axios from "axios";

const API_BASE_URL = "https://foodwiseai.onrender.com";

export async function analyzeFoodWaste(payload) {
  const res = await axios.post(`${API_BASE_URL}/api/analyze`, payload);
  return res.data;
}

export async function fetchWasteHistory() {
  const res = await axios.get(`${API_BASE_URL}/api/history`);
  return res.data;
}
