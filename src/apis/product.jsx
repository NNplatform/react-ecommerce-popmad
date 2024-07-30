// src/apis/product.jsx
import axios from "axios";

export async function getProductAll(url) {
    const response = await axios.get(url);
    return response;
}

export async function getProductById(url) {
    const response = await axios.get(url);
    return response;
}

export async function getWishList(url) {
    const response = await axios.get(url);
    return response;
}

export async function addWishList(url) {
    const response = await axios.post(url);
    return response;
}

export async function removeWishList(url) {
    const response = await axios.delete(url);
    return response;
}

