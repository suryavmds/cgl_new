import db from '@/lib/db';
import { withAuth } from '../withAuth';
import bcrypt from 'bcrypt';

export default (async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { formValues, activeButton } = req.body;

            const { name, nickname, password, phonenumber, country, about } = formValues

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.beginTransaction();

            let sql, sql1;

            if (activeButton === 1) {
                sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
                // sql1 = `INSERT INTO players_profile (userId, player_name, nick_name, phone_number, country, about) VALUES (?, ?, ?, ?, ?, ?)`;
            } else {
                sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
                // sql1 = `INSERT INTO host_profile (userId, host_name, nick_name, phone_number, country, about) VALUES (?, ?, ?, ?, ?, ?)`;
            }

            const values = [nickname, hashedPassword, activeButton === 1 ? 2 : 3];
            const response = await new Promise((resolve, reject) => {
                db.query(sql, values, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            console.log(response.insertId)

            if (activeButton === 1) {
                // sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
                sql1 = `INSERT INTO players_profile (userId, player_name, nick_name, phone_number, country, about) VALUES (?, ?, ?, ?, ?, ?)`;
            } else {
                // sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
                sql1 = `INSERT INTO host_profile (userId, host_name, nick_name, phone_number, country, about) VALUES (?, ?, ?, ?, ?, ?)`;
            }
           
            let userId = response.insertId
            const values2 = [userId, name, nickname, phonenumber, country, about];
            const response1 = await new Promise((resolve, reject) => {
                db.query(sql1, values2, function (err, results, fields) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
           
            // console.log
            // const sql2 = `UPDATE players_profile SET userId = ? WHERE nickname = ?`
            // const values3 = [user, nickname]
            // const response2 = await new Promise((resolve, reject) => {
            //     db.query(sql2, values3, function (err, results, fields) {
            //         if (err) reject(err);
            //         else resolve(results);
            //     });
            // });


            await db.commit();
            res.status(200).json({ status: 'success', message: 'Account created successfully', result: response1 });
        } catch (err) {
            console.error(err);
            await db.rollback();
            res.status(500).json({ status: 'fail', message: err.message });
        }
    } else {
        res.status(401).json({ status: 'fail', message: 'Not allowed' });
    }
});
