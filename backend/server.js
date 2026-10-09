// import express  from 'express'
// import 'dotenv/config'
// import dbconnect from './config/db.js'
// import userRoutes from './routes/userRoutes.js'
// import productRoutes from './routes/productRoutes.js'
// import cartRoutes from './routes/cartRoutes.js'
// import cors from 'cors'
// const app=express()

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin:'http://localhost:5173',
//   credentials:true,
// }))



// app.use("/api/v1/user",userRoutes)
// app.use("/api/v1/products",productRoutes)
// app.use("/api/v1/cart",cartRoutes)

// const PORT=process.env.PORT || 3005
// app.listen(PORT,()=>{
//   dbconnect()
//   console.log("server is running on port " + PORT)
// })




import express from 'express';
import 'dotenv/config';
import helmet from 'helmet'; // 1. Added for HTTP header protection
import cors from 'cors';
import dbconnect from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();

// 2. Add Helmet middleware before your routes to prevent standard exploits
app.use(helmet());

// 3. Dynamic Production CORS configuration
const allowedOrigins = [
  'http://localhost:5173',                      // Your local Vite frontend
  process.env.FRONTEND_URL                      // Your live frontend URL (set this in production)
].filter(Boolean);                              // Removes undefined if FRONTEND_URL isn't set yet

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by Cross-Origin Resource Sharing (CORS) policy.'));
    }
  },
  credentials: true,
}));

// 4. Rate-limiting payloads to protect against large DDoS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Base routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);

// Optional: Global error handler to catch CORS/system breaks without crashing the app
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3005;

// 5. Connect to DB before listening so the server doesn't accept broken connections
dbconnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running safely on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed. Server not started.", err);
    process.exit(1);
  });
