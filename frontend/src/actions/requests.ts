import axios from "axios";
import { BACKEND_URL } from "../config";

export async function fetchTemplateData(prompt: string) {
    const response = await axios.post(`${BACKEND_URL}/template`, { prompt: prompt.trim() });
    return response.data;
}
  
export  async function fetchChatData(messages: { role: string, content: string }[]) {
    const response = await axios.post(`${BACKEND_URL}/chat`, { messages });
    return response.data;
}
  