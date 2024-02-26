const port =4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database Connection with Mongodb
mongoose.connect("mongodb+srv://mkviswanand:viswamongodb@cluster0.3xxeusr.mongodb.net/e-commerce")

const moment = require('moment-timezone');

// Get the current time in India Standard Time (IST)
const currentTime = moment().tz('Asia/Kolkata').toDate();


//API creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image Storoage Engine

const storage =  multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        require: true,
    },
    name:{
        type: String,
        require: true
    },
    image:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true,
    },
    new_price:{
        type:Number,
        require:true,
    },
    old_price:{
        type:Number,
        require:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    })
    console.log(product);
    await product.save();
    console.log("Saved")
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating API for deleting Products

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

// Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All products Fetched")
    res.send(products);
})

//Schema creating for User model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating Endpoint for registering the user
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

})

//Creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"Wrong Password"})
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

//Creating endpoint for newcollection data
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})


//Creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//Creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"Please authenticate using a valid token"})
            
        }
    }

}

//Creating endpoint for adding product in cartData
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")
})

//creating endpoint to remove product from cartData
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    console.log("Remove from cart:",userData);
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})

// Creating endpoint to get cartdata
app.post('/getcart',fetchUser, async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


//Schema for Order
const Order = mongoose.model("Order", {
    name: String,
    address: String,
    city: String,
    code: String,
    userData: [{
        userId: mongoose.Schema.Types.ObjectId
    }],
    products: [{
        productId: mongoose.Schema.Types.ObjectId, // Use mongoose Schema.Types.ObjectId for MongoDB _id
        productnormalId: Number,
        productName: String,
        productImage: String,
        productPrice: Number,
        quantity: Number,
        total: Number
    }],
    subtotal: Number,
    paymentMethod: String,
    date: {
        type: Date,
        default: Date.now
    }
});

//API creation for the storing the order details to database
app.post('/checkout',fetchUser, async (req, res) => {
    try {
        console.log("User object:", req.user);
        
        // Log req.user.id
        console.log("User ID:", req.user.id);

        let userData = await Users.findOne({_id:req.user.id});
        console.log(" Checkout user:",userData);
        const { name, address, city, code, subtotal, productsData, paymentMethod } = req.body;

        // Map productsData to the format expected in the order schema
        const products = productsData.map(({ product, total, quantity }) => ({
            productId: product._id, // Use product._id for MongoDB _id
            productnormalId: product.id,
            productName: product.name,
            productImage: product.image,
            productPrice: product.new_price,
            quantity: quantity, // Use the quantity passed from the frontend
            total: total
        }));
        //console.log(products);

        // Create a new order instance
        const order = new Order({
            name,
            address,
            city,
            code,
            userData,
            products,
            subtotal,
            paymentMethod
        });

        console.log(order);

        // Save the order to the database
        await order.save();
        res.json({ success: true, message:"Order placed successfully!" });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, error: "Failed to place order" });
    }
});

app.get('/order',fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({_id:req.user.id});
        userId = userData._id;
      // Find orders where userData array contains the userId
      const orders = await Order.find({ 'userData._id': userId });
  
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


app.listen(port,(error)=>{
   if(!error){
    console.log("Server running on Port" +port)
   }
   else{
    console.log("error : "+error)
   }
})