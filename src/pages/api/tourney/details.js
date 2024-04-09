import db from '@/lib/db';
import { withAuth } from '../withAuth';
// import { NULL } from 'sass';

export default (async (req, res) => {
    if (req.method === 'POST') {
        try {
            let { userId, tournamentId } = req.body;

            console.log(req.body)

            // tournamentId = parseInt(tournamentId)
            
            await db.beginTransaction();

            const sql = `SELECT * from tournaments WHERE id = ?`

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

            const sql5 = `SELECT * FROM host_profile WHERE userId = ?`

            
            let response = await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            let response2 = await new Promise((resolve, reject) => {
                db.query(sql2, values2, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            let response3 = await new Promise((resolve, reject) => {
                db.query(sql5, values4, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            const is_player = response2.some(item => {
                return item.playersId === parseInt(userId)
            })

            let t_details = response.length ? response[0] : {}

            let is_host = t_details.hostId === parseInt(userId)
            
            await db.commit();
            res.status(200).json({ status: 'success', message: 'Details fetched successfully', 
            tourmey_details: t_details, 
            is_host: is_host, 
            players_registered: response2,
            is_player_registered : is_player,
            is_current_user_a_hoster: response3.length ? true : false
            });
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