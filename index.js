const express=require('express')
require('dotenv').config()
const connectDB=require('./src/config/db')
connectDB()
const cookieParser = require("cookie-parser");
const app=express()
const userRoute = require('./routes/userroute')
const productRoute = require('./routes/productroute');
const orderRoute = require('./routes/orderroute');
const cartRoute = require('./routes/cartroute');
const categoryRoute = require('./routes/categoryroute');
const paymentRoute = require('./routes/paymentroute');
const reviewRoute=require('./routes/reviewroute')
const adminRoute=require('./routes/adminroute')
const dashboardRoute=require('./routes/dashboardroute')
const couponRoute=require('./routes/couponroute')
const { auth } = require('./middlewares/auth');

app.use(express.json())
app.use(cookieParser());

app.use('/api/users', /*authenticateToken,*/ userRoute);
app.use('/api/products', /*authenticateToken,*/ productRoute);
app.use('/api/orders', /*authenticateToken,*/ orderRoute);
app.use('/api/cart', /*authenticateToken,*/ cartRoute);
app.use('/api/categories', /*authenticateToken,*/ categoryRoute);
app.use('/api/payments', /*authenticateToken,*/ paymentRoute);
app.use('/api/reviews',reviewRoute)
app.use('/api/admin',adminRoute)
app.use('/api',dashboardRoute)
app.use('/api/dashboard', auth, dashboardRoute);
app.use('/api/coupons', couponRoute);

app.get('/',(req,res)=>{
    res.send("My Project")
})

const PORT=process.env.PORT||1000
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`)
})
