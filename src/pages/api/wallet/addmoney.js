import db from '@/lib/db'
import { withAuth } from '../withAuth';

export default withAuth(async (req, res) => {
    if(req.method == 'POST'){
        try {
            const { amount, userId, user_type } = req.body;
            const current_date = new Date()
            let user_role = (user_type === 2) ? 'players_profile' : 'host_profile'

            let data = {}
            
            await db.beginTransaction();
            let sql = `UPDATE ${user_role}
            SET wallet_balance = wallet_balance + ?
            WHERE userId = ?;
             
            `;
            const values = [amount, userId];

            const sql2 = `INSERT INTO wallet_transactions (amount, from_userId, to_userId, transaction_type, notes, date_created) VALUES (?, ?, ?, ?, ?, ?)`;
            const values2 = [amount, userId, userId, 1, 'Wallet added', current_date];

            // Executing query 1
            let response = await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                if (err) reject(err);
                else resolve(results);
                });
            });

            // Executing query 2
            let response2 = await new Promise((resolve, reject) => {
                db.query(sql2, values2, function (err, results, fields) {
                if (err) reject(err);
                else resolve(results);
                });
            });

            await db.commit();
            res.status(200).json({ 
                status: 'success', 
                message: 'Query executed successfully!'
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
