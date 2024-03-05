import db from '@/lib/db'
import { withAuth } from '../withAuth';

export default withAuth(async (req, res) => {
    if(req.method == 'POST'){
        try {
            const { name, nickname, password, phonenumber, country, about, activeButton  } = req.body;

            console.log("this isnthe stuff", name)
            
            await db.beginTransaction();

            // // Executing query 1
            // let response = await new Promise((resolve, reject) => {
            //     db.query(sql, values, function (err, results, fields) {
            //     if (err) reject(err);
            //     else resolve(results);
            //     });
            // });

            await db.commit();
            res.status(200).json({ status: 'success', message: 'Account created successfully', result: response });
        } catch (err) {
          
          // If any one query got an error, all the previously ran queries will be reverted
          console.error(err);
          await db.rollback();
        //   if(err.code === 'ER_DUP_ENTRY'){
        //     errMessage = "Customer with same name already present"
        //   }
          res.status(500).json({ status : 'fail', message: errMessage });
        }
    }else{
        res.status(401 ).json({ status : 'fail', message: 'Not allowed' });
    }
})
