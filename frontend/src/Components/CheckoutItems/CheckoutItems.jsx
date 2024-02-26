import React, { useContext, useState } from 'react';
import './CheckoutItems.css';
import { ShopContext } from '../../Context/ShopContext';

const CheckoutItems = () => {
    const {getTotalCartAmount, all_product, cartItems } = useContext(ShopContext);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [code, setCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(''); // Default payment method
    const [orderPlaced, setOrderPlaced] = useState(false); // State to track whether the order has been placed

    const handleChangename = (e) => {
        setName(e.target.value);
    }

    const handleChangeAddress = (e) => {
        setAddress(e.target.value);
    }

    const handleChangecity = (e) => {
        setCity(e.target.value);
    }
    const handleChangeCode = (e) => {
        setCode(e.target.value);
    }

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        console.log("Payment Method Selected:", e.target.value); // Add this line to log the selected payment method
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Calculate subtotal on the client-side
        let subtotal = 0;
        let productsData = [];

        all_product.forEach((product) => {
            const quantity = cartItems[product.id];
            if (quantity > 0) {
                const total = product.new_price * quantity;
                subtotal += total;
                productsData.push({ product: { _id: product._id, ...product }, total, quantity }); // Include product _id in productsData
            }
        });
        console.log("Name:", name);
        console.log("Address:", address);
        console.log("City:", city);
        console.log("Code:", code);
        console.log("Payment Method:", paymentMethod); // Add this line to log the payment method value

        try {
            // Make the POST request to the backend with formData, subtotal, productsData, and paymentMethod
            if(localStorage.getItem('auth-token')){
            const response = await  fetch('http://localhost:4000/checkout', {
                method: 'POST',
                headers: {
                    Accept:'application/form-Data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, address, city, code, subtotal, productsData, paymentMethod }) // Pass formData, subtotal, productsData, and paymentMethod
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const data = await response.json();
            console.log(data); // Handle response from the backend
            setOrderPlaced(true); // Set orderPlaced state to true after successfully placing the order
            window.location.reload();
            window.alert('Order placed successfully!'); // Display browser alert message
        } 
        else{
            window.alert('Please login to proceed checkout');
        }
    }
    
        catch (error) {
            console.error('Error:', error);
        }
          
    };


    return (
        <div className='cartitems'>
            <h1>Deliver to:</h1>
            <form className='delivery-details'>
                <input type="text" name='name' value={name} onChange={handleChangename} placeholder="Full Name" />
                <input type="text" name='address' value={address} onChange={handleChangeAddress} placeholder="Address" />
                <input type="text" name='city' value={city} onChange={handleChangecity} placeholder="City" />
                <input type="text" name='code' value={code} onChange={handleChangeCode} placeholder="Postal Code" />
            </form>
            <h1>Your Orders</h1>
            <div className="cartitems-format-main">
                {/* Render cart items here */}
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
            </div>
            <hr/>
            {all_product.map((e)=>{
                if(cartItems[e.id]>0)
                
                {
                    return (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className='carticon-product-icon' />
                                <p>{e.name}</p>
                                <p>{e.new_price}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>{e.new_price*cartItems[e.id]}</p>
                            </div>
                            <hr/>
                        </div>
                    );
                } else {
                    return null;
                }
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Total price</h1>
                    <div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>{getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    
                    <div className="payment">
                    <h3>Payment</h3>
                     <p>Online payment is not applicable at this time</p>
                    <div>
                    <input type='radio' id='cod' name='paymentmethod' value='cashOnDelivery' onChange={handlePaymentMethodChange} /> Cash on delivery
                    </div>
                    <div>
                    <input type="radio" id='paypal' name='paymentmethod' value='paypal' onChange={handlePaymentMethodChange} /> PayPal
                    </div>
                    </div>
                    <button onClick={handleSubmit}>Order Now</button>
                </div>
                 {/* Show success message if order placed */}
            {orderPlaced && <div className="alert alert-success" role="alert">Order placed successfully!</div>}
            </div>
        </div>
    );
};

export default CheckoutItems;

