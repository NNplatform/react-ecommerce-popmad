import axios from "axios";

export async function addProductToCart(url, productId, quantity) {
    return await axios.post(url, {
        productId,
        quantity,
    })
  }

  export async function getCartItem(url) {
    return await axios.get(url)
  }


  export async function removeProductInCart(url, productId, quantity) {
    return await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        productId,
        quantity,
      },
    });
  }

  