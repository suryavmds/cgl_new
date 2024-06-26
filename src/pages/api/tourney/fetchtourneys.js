import db from '@/lib/db';
import { withAuth } from '../withAuth';

export default (async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      await db.beginTransaction();

      let sql = `SELECT tournaments.*, users.username, COALESCE((SELECT COUNT(players_registered.hostId)
      FROM players_registered
      WHERE players_registered.tournamentId = tournaments.id
      GROUP BY players_registered.tournamentId, players_registered.hostId 
      ), 0) AS count
      FROM tournaments
      JOIN users ON tournaments.hostId = users.id;`;

      let values = []

      if(userId){
        sql = `SELECT tournaments.*, users.username, COALESCE((SELECT COUNT(players_registered.hostId)
      FROM players_registered
      WHERE players_registered.tournamentId = tournaments.id
      GROUP BY players_registered.tournamentId, players_registered.hostId 
      ), 0) AS count
      FROM tournaments
      JOIN users ON tournaments.hostId = users.id 
      WHERE tournaments.hostId = ?;`;
      values.push(userId)
      }


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

