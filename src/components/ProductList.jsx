import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import config from '../config'; 
import './styles/ProductList.css'; 
import { getProductAll } from '../apis/product'; 
import artToyImage from '../../images/art-toy.jpg';

const ProductDetail = () => {
  const [ProductList, setProductList] = useState([]); 
  const url = `${config.apiBaseUrl}/product-svc/product`; 

  useEffect(() => {
    getProductAll(url).then((response) => {
      const products = extractProductList(response.data); 
      setProductList(products);
    }).catch(error => {
      console.error('Error fetching products:', error);
    });
  }, [url]);

  function extractProductList(data) {
    if (data.code === "0" && Array.isArray(data.result)) {
      const sortedProducts = data.result.sort((a, b) => a.productId - b.productId); 
      return sortedProducts.map(product => ({
        productId: product.productId,
        name: product.name,
        description: product.desc,
        price: product.price,
        isSoldOut: product.isSoldOut,
        stock: product.stock,
        imageUrl: artToyImage
      }));
    }
    return [];
  }

  return (
    <div className="product-list">
      {ProductList.length > 0 ? (
        ProductList.map(product => (
          <div key={product.productId} className={`product-box ${product.isSoldOut ? 'sold-out' : ''}`}>
            {product.isSoldOut && (
              <div className="sold-out-tab">Sold Out</div>
            )}
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <h2>{product.name}</h2>
            <h5>ID: {product.productId}</h5>
            <p>stock: {product.stock}</p>
            <Link to={`/products/${product.productId}`}>View Details</Link> {/* Link to product detail */}
          </div>
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}

export default ProductDetail;