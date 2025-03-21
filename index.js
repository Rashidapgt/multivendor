const express=require('express')
const cors=require('cors')
require('dotenv').config()
const connectDB=require('./src/config/db')
connectDB()
const cookieParser = require("cookie-parser");
const app=express()
const userRoute = require('./src/routes/userroute')
const productRoute = require('./src/routes/productroute');
const orderRoute = require('./src/routes/orderroute');
const cartRoute = require('./src/routes/cartroute');
const categoryRoute = require('./src/routes/categoryroute');
const paymentRoute = require('./src/routes/paymentroute');
const reviewRoute=require('./src/routes/reviewroute')
const adminRoute=require('./src/routes/adminroute')
const dashboardRoute=require('./src/routes/dashboardroute')
const couponRoute=require('./src/routes/couponroute')
const notificationRoute=require('./src/routes/notificationroute')
const { auth } = require('./src/middlewares/auth');
const {cloudinary}=require('./src/config/cloudinary')

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}))


app.use('/api/users',  userRoute);
app.use('/api/products',  productRoute);
app.use('/api/orders',  orderRoute);
app.use('/api/cart', cartRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/payments',  paymentRoute);
app.use('/api/reviews',reviewRoute)
app.use('/api/admin',adminRoute)
app.use('/api',dashboardRoute)
app.use('/api/dashboard', auth, dashboardRoute);
app.use('/api/coupons', couponRoute);
app.use("/api/notifications", notificationRoute);

app.get('/',(req,res)=>{
    res.send("My Project")
})

const PORT=process.env.PORT||1000
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`)
})
