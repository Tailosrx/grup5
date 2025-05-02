import { Router } from 'express';
import pg from 'pg';
import dbconnection from '../../dbconnection.js';

const router = Router();

router.get('/', async (req, res) => {
    let pgClient = new pg.Client(dbconnection);
    await pgClient.connect();
    let query = await pgClient.query('SELECT * FROM employees');
    res.json(query.rows);
    await pgClient.end();
});


router.get('/:id', async (req, res) => {
    let pgClient = new pg.Client(dbconnection);
    await pgClient.connect();
    let query = await pgClient.query(`SELECT * FROM employees WHERE "EmployeeID" = $1`, [req.params.id]);
    res.json(query.rows[0]) || res.status(404).json({ error: 'Empleado no encontrado' });
    await pgClient.end();
});

router.put('/:id', async (req, res) => {
    const employeeId = req.params.id;
    const { LastName, FirstName, Title, HireDate, City, Region } = req.body;

    try {
        const result = await db.query(
            `UPDATE employees
             SET "LastName" = $1, "FirstName" = $2, "Title" = $3, "HireDate" = $4, "City" = $5, "Region" = $6
             WHERE "EmployeeID" = $7
             RETURNING *`,
            [LastName, FirstName, Title, HireDate, City, Region, employeeId]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Failed to update employee');
        
    }
});

// Si deja el profe cambiar el id para que sea autoincremental con GENERATED ALWAYS AS IDENTITY
router.post('/', async (req, res) => {
    const { LastName, FirstName, Title, HireDate, City, Region } = req.body;

    let pgClient = new pg.Client(dbconnection);
    await pgClient.connect();

    let wrapper = {
        status: 'ok',
        errorText: '',
        data: null,
    };

    try {
        const maxIdResult = await pgClient.query('SELECT MAX("EmployeeID") AS max_id FROM employees');
        const nextEmployeeID = (maxIdResult.rows[0].max_id || 0) + 1;

        const query = `
            INSERT INTO employees ("EmployeeID", "LastName", "FirstName", "Title", "HireDate", "City", "Region")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [nextEmployeeID, LastName, FirstName, Title, HireDate, City, Region];
        const result = await pgClient.query(query, values);

        wrapper.data = result.rows[0];
        res.status(201).json(wrapper);
    } catch (error) {
        console.error('Error creating employee:', error);
        wrapper.status = 'error';
        wrapper.errorText = 'Failed to create employee';
        res.status(500).json(wrapper);
    } finally {
        await pgClient.end();
    }
});


router.delete('/:id', async (req, res) => {
    const employeeId = req.params.id;
    let pgClient = new pg.Client(dbconnection);
    await pgClient.connect();


    try {
        const query = 'DELETE FROM employees WHERE "EmployeeID" = $1';
        const result = await pgClient.query(query, [employeeId]);

        if (result.rowCount > 0) {
            res.status(200).send('Employee deleted successfully');
        } else {
            res.status(404).send('Employee not found');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).send('Failed to delete employee');
    } finally {
        await pgClient.end();
    }
});

export default router;