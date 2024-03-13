import db from '@/lib/db';
import { withAuth } from '../withAuth';
import { defaultIconPrefixCls } from 'antd/es/config-provider';
import { detectConflictingPaths } from 'next/dist/build/utils';
// import { NULL } from 'sass';

export default (async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { userId, tournamentId } = req.body;
            
            await db.beginTransaction();

            const sql = `SELECT * from tournaments WHERE id = 74`

            const values = [tournamentId]
            
            const sql2 = `
            SELECT 
            players_registered.*,(SELECT player_name FROM players_profile WHERE userId = players_registered.playersId) AS name
            FROM
            players_registered
            WHERE 
            players_registered.tournamentId = ?
         `
            const values2 = [tournamentId]

            const sql3 = `SELECT * FROM players_registered WHERE tournamentId = ? and playersId = ?`

            const values3 = [tournamentId, userId]

            const sql4 = `SELECT * FROM players_profile WHERE userId = ?`

            const values4 = [userId]

            
            let response = await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            
            console.log(response)
            
            await db.commit();
            res.status(200).json({ status: 'success', message: 'order created' });
        } catch (err) {
            // If any one query got an error, all the previously ran queries will be reverted
            console.error(err);
            await db.rollback();
            res.status(500).json({ status: 'fail', message: 'Internal server error' });
        }
    } else {
        res.status(401).json({ status: 'fail', message: 'Not allowed' });
    }
});

//host condittion(is_player), is_host 