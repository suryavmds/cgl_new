import db from '@/lib/db';
import { withAuth } from '../withAuth';

export default (async (req, res) => {
  if (req.method === 'GET') {
    try {
        const { userId } = req.query
      await db.beginTransaction();

      const sql = `SELECT 
      (SELECT tournaments.id FROM tournaments WHERE tournaments.id = players_registered.tournamentId) AS tournament_id,
      (SELECT tournaments.tournament_name FROM tournaments WHERE tournaments.id = players_registered.tournamentId) AS tournament_name,
      (SELECT tournaments.tournament_date FROM tournaments WHERE tournaments.id = players_registered.tournamentId) AS tournament_date,
      (SELECT tournaments.entry_fee FROM tournaments WHERE tournaments.id = players_registered.tournamentId) AS entry_fee,
      (SELECT tournaments.tournament_status FROM tournaments WHERE tournaments.id = players_registered.tournamentId) AS tournament_status,
      (SELECT tournaments.prize_money FROM tournaments WHERE tournaments.id = players_registered.tournamentId) AS prize_money
      FROM 
      players_registered WHERE
      playersId = ?;`;

      const values = [userId]

      // Executing query
      const response = await new Promise((resolve, reject) => {
        db.query(sql, values, function (err, results, fields) {
          if (err) reject(err);
          else resolve(results);
        });
      });

      await db.commit();

      res.status(200).json({
        status: 'success',
        message: 'Tournaments fetched sucessfully',
        result: response,
      });
    } catch (err) {
      console.error(err);
      await db.rollback();
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ status: 'fail', message: 'Not allowed' });
  }
});

