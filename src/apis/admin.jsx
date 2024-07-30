// src/apis/admin.jsx
import axios from "axios";

export async function getAdminPageResult(url) {
    const response = await axios.get(url);
    return response;
}