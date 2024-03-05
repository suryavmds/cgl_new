import db from '@/lib/db'
import { withAuth } from '../withAuth';

export default withAuth(async (req, res) => {
    if(req.method == 'POST'){
        try {
            const { username } = req.body;
            
            await db.beginTransaction();
            const sql = `SELECT users.id, users.name, users.is_admin 
            FROM users
            WHERE users.username = ? AND users.active = 1
            `;
            const values = [username];

            // Executing query 1
            let response = await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                if (err) reject(err);
                else resolve(results);
                });
            });

            await db.commit();
            res.status(200).json({ 
                status: 'success', 
                message: 'Query executed successfully!', 
                result: response
            });
        } catch (err) {
          
          // If any one query got an error, all the previously ran queries will be reverted
          console.error(err);
          await db.rollback();
          res.status(500).json({ status : 'fail', message: 'Internal server error' });
        }
    }else{
        res.status(401 ).json({ status : 'fail', message: 'Not allowed' });
    }
})
