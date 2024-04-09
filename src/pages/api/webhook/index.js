// Import necessary dependencies
import { WebhookClient } from 'dialogflow-fulfillment';
import db from '@/lib/db'

// Export the handler function
export default async function handler(req, res) {
  // Create a new Dialogflow WebhookClient instance
  const agent = new WebhookClient({ request: req, response: res });


  const formatDateTime = (datetimeString) => {
    const dateTime = new Date(datetimeString);
    const date = dateTime.toLocaleDateString('en-US');
    const time = dateTime.toLocaleTimeString('en-US');
    return `${date} ${time}`;
  };

  // Function to handle the webhook logic
  async function handleWebhook(agent) {
    try{
        await db.beginTransaction();
        const sql = `SELECT tournament_name, tournament_date 
        FROM tournaments
        WHERE tournament_date > NOW();
        `;

        // Executing query
        const response = await new Promise((resolve, reject) => {
            db.query(sql, function (err, results, fields) {
            if (err) reject(err);
            else resolve(results);
            });
        });


        await db.commit();

        if (response.length > 0) {
            const stringified = response.map((row, index) => `${index + 1}. ${row.tournament_name} ${formatDateTime(row.tournament_date)} \n`).join(', ');
            agent.add(`Hey gamer! These are the upcoming tourneys: \n ${stringified}`);
          } else {
            agent.add('No upcoming tournaments found.');
          }
        } catch (err) {
          console.error('Error fetching tournaments:', err);
          await db.rollback();
          agent.add('Ouch! There is some error fetching tournaments lists right now. Please try again later');
        }
  }

  async function handleWalletBalance(agent) {
    try {
      const { userId } = agent.parameters;

      if (!userId) {
        agent.add('Could you please provide your CGL secret code?');
        return;
      }

      await db.beginTransaction();

      // Fetch wallet balance of the user based on the provided user ID
      const sql = `SELECT wallet_balance 
                   FROM players_profile
                   WHERE secret_code = ?`;

      const values = [userId]

      // Executing query with parameterized values
        const response = await new Promise((resolve, reject) => {
            db.query(sql, values, function (err, results, fields) {
            if (err) reject(err);
            else resolve(results);
            });
        });

      await db.commit();

      if (response.length > 0) {
        const walletBalance = response[0].wallet_balance;
        agent.add(`Your wallet balance is ${walletBalance}`);
      } else {
        agent.add('User not found or wallet balance not available.');
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      await db.rollback();
      agent.add('Ouch! There is some error fetching wallet balance right now. Please try again later.');
    }
  }

  async function handleMyTournaments(agent) {
    try {
      const { userId } = agent.parameters;

      if (!userId) {
        agent.add('Could you please provide your CGL secret code?');
        return;
      }

      await db.beginTransaction();

      // Fetch wallet balance of the user based on the provided user ID
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

      // Executing query with parameterized values
        const response = await new Promise((resolve, reject) => {
            db.query(sql, values, function (err, results, fields) {
            if (err) reject(err);
            else resolve(results);
            });
        });

      await db.commit();

      if (response.length > 0) {
        const stringified = response.map((row, index) => `${index + 1}. ${row.tournament_name} ${formatDateTime(row.tournament_date)} \n`).join(', ');
        agent.add(`Your registered tourneys: \n ${stringified}`);
      } else {
        agent.add('Player not found or no matches available.');
      }
    } catch (err) {
      console.error('Error fetching your registered tourneys:', err);
      await db.rollback();
      agent.add('Ouch! There is some error fetching tourneys list right now. Please try again later.');
    }
  }

  async function handleMatchesWon(agent) {
    try {
      const { userId } = agent.parameters;

      if (!userId) {
        agent.add('Could you please provide your CGL secret code?');
        return;
      }

      await db.beginTransaction();

      const sql = `SELECT * FROM tournaments WHERE winner = ?;`;

      const values = [userId]

      // Executing query with parameterized values
        const response = await new Promise((resolve, reject) => {
            db.query(sql, values, function (err, results, fields) {
            if (err) reject(err);
            else resolve(results);
            });
        });

      await db.commit();

      if (response.length > 0) {
        const stringified = response.map((row, index) => `${index + 1}. ${row.tournament_name} - Prize won:${row.prize_money} \n`).join(', ');
        agent.add(`Your registered tourneys: \n ${stringified}`);
      } else {
        agent.add('Player not found or no matches available.');
      }
    } catch (err) {
      console.error('Error fetching your tourneys list:', err);
      await db.rollback();
      agent.add('Ouch! There is some error fetching tourneys list right now. Please try again later.');
    }
  }

  // Map the intent to the corresponding handler function
  let intentMap = new Map();
  intentMap.set('upcomingTournaments', handleWebhook);
  intentMap.set('walletBalance', handleWalletBalance);
  intentMap.set('myTournaments', handleMyTournaments);
  intentMap.set('matchesWon', handleMatchesWon);
  agent.handleRequest(intentMap);
}
