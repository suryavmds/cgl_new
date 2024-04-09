import db from '@/lib/db'
import { withAuth } from '../withAuth';

export default withAuth(async (req, res) => {
    if(req.method == 'POST'){
        try {
            const { username } = req.body;

            let data = {}
            
            await db.beginTransaction();
            let sql = `SELECT player_name, nick_name, phone_number, country, about, wallet_balance, secret_code 
            FROM players_profile
            WHERE userId = ?
            `;
            const values = [];

            const sql2 = `SELECT role, id 
            FROM users
            WHERE username = ? 
            `;
            const values2 = [username];

            // Executing query 1
            let response = await new Promise((resolve, reject) => {
                db.query(sql2, values2, function (err, results, fields) {
                if (err) reject(err);
                else resolve(results);
                });
            });

            values.push(response[0]?.id)
            data = {...data, user_id: response[0]?.id, user_role: response[0]?.role}

            if(response[0]?.role == 3){
                sql = `SELECT host_name, nick_name, phone_number, country, about, wallet_balance, secret_code 
                FROM host_profile
                WHERE userId = ?
                `;
            }

            // Executing query 2
            let response2 = await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                if (err) reject(err);
                else resolve(results);
                });
            });

            let user_details = response2[0]
            data = {...data, user_details}
            console.log(data)
            await db.commit();
            res.status(200).json({ 
                status: 'success', 
                message: 'Query executed successfully!', 
                result: data
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
