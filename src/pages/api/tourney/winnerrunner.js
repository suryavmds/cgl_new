import db from '@/lib/db';
import { withAuth } from '../withAuth';
import { message } from 'antd';

export default withAuth(async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { winner, tournamentId, runner } = req.body;

            console.log(req.body)
            
            await db.beginTransaction();
            const sql = `UPDATE tournaments
            SET winner = ?, runner = ?, tournament_status = ?
            WHERE id = ?;`;
           
            const values = [winner, runner, 1, tournamentId];
            
            await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            
            await db.commit();
            res.status(200).json({ status: 'success', message: ' Successfully updated'  });
        } catch (err) {
            console.error(err);
            await db.rollback();
        }
    } else {
        res.status(401).json({ status: 'fail', message: 'Not allowed' });
    }
});
