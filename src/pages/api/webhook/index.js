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
        agent.add('Could you please provide your user ID?');
        return;
      }

      await db.beginTransaction();

      // Fetch wallet balance of the user based on the provided user ID
      const sql = `SELECT wallet_balance 
                   FROM players_profile
                   WHERE userId = ?`;

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


  // Map the intent to the corresponding handler function
  let intentMap = new Map();
  intentMap.set('upcomingTournaments', handleWebhook);
  intentMap.set('walletBalance', handleWalletBalance);
  agent.handleRequest(intentMap);
}
