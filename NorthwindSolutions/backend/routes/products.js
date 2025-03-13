import { Router } from 'express';
import pg from 'pg';
import dbconnection from '../../dbconnection.js';

const router = Router();


// router.get('/', (req, res) => {
//   res.send('Hello World');
// });



router.get('/', async (req, res) => {
    let pgClient = new pg.Client(dbconnection);
    await pgClient.connect();
    let query = await pgClient.query('SELECT * FROM products');
    res.json(query.rows);
    await pgClient.end();
});

// router.get('/:id', async (req, res) => {
//     let pgClient = new pg.Client(dbconnection);
//     await pgClient.connect();
//     let query = await pgClient.query(`SELECT * FROM products WHERE productid = ${req.params.id}`);
//     res.json(query.rows);
//     await pgClient.end();
// });




export default router;