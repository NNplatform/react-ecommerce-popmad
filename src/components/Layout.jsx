import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import './styles/Layout.css';
import logo from '../../images/popmad-logo.jpg'; 

const Layout = () => {
  const { cartItemCount } = useContext(CartContext);
  const { wishlistItemCount } = useContext(WishlistContext);
  const { role } = useAuth();

  return (
    <div>
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/home">
              <img src={logo} alt="Logo" className="logo" /> {/* Add the logo */}
            </Link>
          </li>
          <li><Link to="/products">Products</Link></li>
          <li>
            <Link to="/cart" className="cart-link">
              <ShoppingCartOutlined className="cart-icon" />
              {cartItemCount > 0 && <span className="cart-item-count">{cartItemCount}</span>}
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className="wishlist-link">
              <HeartOutlined className="wishlist-icon" />
              {wishlistItemCount > 0 && <span className="wishlist-item-count">{wishlistItemCount}</span>}
            </Link>
          </li>
          <li><Link to="/login">Login</Link></li>
          {role === 'ROLE_ADMIN' && (
            <li><Link to="/admin">Admin</Link></li>
          )}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
