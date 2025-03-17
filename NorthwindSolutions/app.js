import express from 'express';
import dbconnection from './dbconnection.js';
//TODO: import routes
import product from './backend/routes/products.js';
import customers from './backend/routes/customers.js';

const PORT = 3000;
// const { Pool } = pkg;
// import pg from 'pg';
// import cors from 'cors';

const app = express();

// app.use(cors({origin: '*'}));
app.use(express.static('public'));
// app.use(express.json());
app.use('/products', product);
app.use('/customers', customers);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
