import db from '@/lib/db';
import { withAuth } from '../withAuth';

export default withAuth(async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { tournId} = req.query;

      await db.beginTransaction();
      
      let sql = `SELECT 
      players_registered.*,(SELECT player_name FROM players_profile WHERE userId = players_registered.playersId) AS name
      FROM
      players_registered
      WHERE 
      players_registered.tournamentId = ?`;

      let values = [tournId];

      let response = await new Promise((resolve, reject) => {
        db.query(sql, values, function (err, results, fields) {
          if (err) reject(err);
          else resolve(results);
        });
      });


      await db.commit();
      res.status(200).json({ status: 'success', message: 'Details successfully fetched!', result: response });
    } catch (err) {

 
      console.error(err);
      await db.rollback();
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ status: 'fail', message: 'Not allowed' });
  }
});
