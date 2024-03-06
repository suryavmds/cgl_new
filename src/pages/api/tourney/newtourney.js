import db from '@/lib/db';
import { withAuth } from '../withAuth';

export default withAuth(async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { tournament_name, tournament_description, prize_money, tournament_date, entry_fee, hostId } = req.body;

            let tournamentDate =  tournament_date ? new Date(tournament_date) : null;
            const formattedTournamentDate = tournamentDate ? tournamentDate.toISOString().split('.')[0] : null;
            
            await db.beginTransaction();
            const sql = `INSERT INTO tournaments (date_created, tournament_name, tournament_description, prize_money, tournament_date, entry_fee, hostId) 
                        VALUES (CONVERT_TZ(CURRENT_TIMESTAMP(), @@session.time_zone, '+05:30'), ?, ?, ?, ?, ?, ?)`;
           
            const values = [tournament_name, tournament_description, prize_money, formattedTournamentDate, entry_fee, hostId];
            
            let response = await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            
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
