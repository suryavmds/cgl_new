import db from '@/lib/db';

export default (async (req, res) => {
    if (req.method === 'POST') {
        try {
            let { userId, tournamentId, status } = req.body;
            
            await db.beginTransaction();

            const sql = `SELECT * from tournaments WHERE id = ?`

            const values = [tournamentId]

            let response = await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            // console.log(response)

            let hostid = response[0]?.hostId
            let entry_fee = response[0]?.entry_fee
            console.log(hostid)
            console.log(entry_fee)

            if(status == true){

                const sql3 = `UPDATE players_profile
                SET wallet_balance = wallet_balance - ?
                WHERE userId = ? AND wallet_balance >= ? `

                const values3 = [entry_fee, userId, entry_fee]

                const sql2 = `INSERT INTO players_registered (tournamentId, hostId, playersId)
                VALUES (?, ?, ?)`

                const values2 = [tournamentId, hostid, userId ]

                let response3 = await new Promise((resolve, reject) => {
                    db.query(sql3, values3, function (err, results, fields) {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });

                console.log(response3)

                if(!response3.affectedRows){
                    throw ("Insufficient Funds to join")
                }

                let response2 = await new Promise((resolve, reject) => {
                    db.query(sql2, values2, function (err, results, fields) {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });

            }else if(status == false){

                const sql4 = `UPDATE players_profile
                SET wallet_balance = wallet_balance + ? WHERE userId = ?`

                const values4 = [entry_fee, userId ]

                const sql3 = `DELETE FROM players_registered where tournamentId = ? AND hostId = ? AND playersId = ?`

                const values3 = [tournamentId, hostid, userId]

                let response4 = await new Promise((resolve, reject) => {
                    db.query(sql4, values4, function (err, results, fields) {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });

                let response3 = await new Promise((resolve, reject) => {
                    db.query(sql3, values3, function (err, results, fields) {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });

            }
            
            await db.commit();
            res.status(200).json({ status: 'success', message: 'Query executed'});
        } catch (err) {
            // If any one query got an error, all the previously ran queries will be reverted
            console.error(err);
            await db.rollback();
            if(err=='Insufficient Funds to join'){
                res.status(500).json({ status : 'fail', message: 'Insufficient Funds to join' });
            }else{
                res.status(500).json({ status : 'fail', message: 'Internal server error' });
            }
        }
    } else {
        res.status(401).json({ status: 'fail', message: 'Not allowed' });
    }
});

//host condittion(is_player), is_host 