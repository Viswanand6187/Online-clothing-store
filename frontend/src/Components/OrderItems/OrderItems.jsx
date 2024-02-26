import React, { useEffect, useState } from 'react'
import './OrderItem.css';

const OrderItems = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if(localStorage.getItem('auth-token')){
        const response = await fetch('http://localhost:4000/order', {
          method: 'GET',
          headers: {
            Accept:'application/form-Data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
            // You can add any additional headers here if required
          },
        });
        const data = await response.json();
        setOrders(data);
        console.log(data);
      }
      else{
        window.alert("Please login to get your orders")
      }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array to run once on component mount

  return (
    <div className="orders-container">
      <h1 className="orders-title">WELCOME TO ORDERS SECTION</h1>
      <h2>Delivery in 3 days...!</h2>
      {orders.map((order, index) => (
        <div key={index} className="order-details">
          <h2 className="order-details-title">Order Details</h2>
          <table className="order-table">
            <tbody>
            <tr>
                <td className="label">Name:</td>
                <td>{order.name}</td>
              </tr>
              <tr>
                <td className="label">Address:</td>
                <td>{order.address}</td>
              </tr>
              <tr>
                <td className="label">City:</td>
                <td>{order.city}</td>
              </tr>
              <tr>
                <td className="label">Code:</td>
                <td>{order.code}</td>
              </tr>
              <tr>
                <td className="label">Date:</td>
                <td>{order.date}</td>
              </tr>
              <tr>
                <td className="label">Products:</td>
                <td>
                  <table className="products-table">
                    <tbody>
                      {order.products.map((product, index) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={product.productImage}
                              alt={product.productName}
                              className="product-image"
                            />
                          </td>
                          <td>Product Name: {product.productName}</td>
                          <td>Product Price: {product.productPrice}</td>
                          <td>Quantity: {product.quantity}</td>
                          <td>Total: {product.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td className="label">Payment Method:</td>
                <td>{order.paymentMethod}</td>
              </tr>
              <tr>
                <td className="label">Subtotal:</td>
                <td>{order.subtotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
  
  
};


export default OrderItems