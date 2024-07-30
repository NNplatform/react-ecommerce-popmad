import axios from "axios";

export async function checkout(url, userId) {
    const fullUrl = `${url}?userId=${userId}`;
    return await axios.post(fullUrl);
}