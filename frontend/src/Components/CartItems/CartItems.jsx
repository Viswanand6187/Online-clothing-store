// import React, { useContext } from 'react'
// import './CartItem.css'
// import { ShopContext } from '../../Context/ShopContext'
// import remove_icon from '../Assets/cart_cross_icon.png'
// import { Link } from 'react-router-dom'

// export const CartItems = () => {
//   const {getTotalCartAmount,all_product,cartItems,removeFromCart} = useContext(ShopContext)
//   return (
//     <div className='cartitems'>
//       <div className="cartitems-format-main">
//         <p>Products</p>
//         <p>Title</p>
//         <p>Price</p>
//         <p>Quantity</p>
//         <p>Total</p>
//         <p>Remove</p>
//       </div>
//       <hr/>
//         {all_product.map((e)=>{
//         if(cartItems[e.id]>0)
//         {
//           return <div>
//           <div className="cartitems-format cartitems-format-main">
//             <img src={e.image} alt="" className='carticon-product-icon' />
//             <p>{e.name}</p>
//             <p>{e.new_price}</p>
//             <button className='cartitems-quantity'>{cartItems[e.id]}</button>
//             <p>{e.new_price*cartItems[e.id]}</p>
//             <img className='cartitems-remove-icon' src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt=""  />
//           </div>
//           <hr/>
//         </div>
//         }else{
//           return null
//         }
//       })}
//       <div className="cartitems-down">
//         <div className="cartitems-total">
//           <h1>cart Totals</h1>
//         <div>
//         <div className="cartitems-total-item">
//           <p>Subtotal</p>
//           <p>{getTotalCartAmount()}</p>
//         </div>
//         <hr/>
//         <div className="cartitems-total-item">
//           <p>Shipping fee</p>
//           <p>Free</p>
//         </div>
//         <hr/>
//         <div className="cartitems-total-item">
//           <h3>Total</h3>
//           <h3>{getTotalCartAmount()}</h3>
//         </div>
//       </div>
//      <Link to = '/checkout'><button>PROCEED TO CHECKOUT</button></Link> 
//     </div>
//     <div className="cartitems-promocode">
//       <p>If you have a promo code,Enter it here</p>
//       <div className="cartitems-promobox">
//         <input type="text"  placeholder='Promo code'/>
//         <button>Submit</button>
//       </div>
//     </div>
//     </div>
//     </div>
//   )
// }

import React, { useContext } from 'react';
import './CartItem.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { Link } from 'react-router-dom';

export const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, addToCart } = useContext(ShopContext);

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className='carticon-product-icon' />
                <p>{e.name}</p>
                <p>{e.new_price}</p>
                <button onClick={() => addToCart(e.id)} className='cartitems-add-button'>+</button> {/* Button to increase quantity */}
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                <img
                  className='cartitems-remove-icon'
                  src={remove_icon}
                  onClick={() => {
                    removeFromCart(e.id);
                  }}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        } else {
          return null;
        }
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{getTotalCartAmount()}</h3>
            </div>
          </div>
          <Link to='/checkout'><button>PROCEED TO CHECKOUT</button></Link>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code,Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='Promo code' />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};
