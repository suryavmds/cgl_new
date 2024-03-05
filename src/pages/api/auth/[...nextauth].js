import NextAuth from "next-auth/next";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import db from "@/lib/db"
import jwt from 'jsonwebtoken';

export default NextAuth({
    secret : process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,
        maxAge: 24 * 60 * 60,
    },
    providers : [
        CredentialsProvider({
            type : 'credentials',
            credentials: {},
            authorize: async (credentials, req) => {

                const {email, password, mode} = credentials;
                
                var sql = `SELECT * FROM users WHERE username = ? LIMIT 1`

                try{
                    await db.beginTransaction();
                    let dbResponse = await new Promise((resolve, reject) => {
                        db.query(sql,[email], function (err, results, fields) {
                        if (err) reject(err);
                        else resolve(results);
                        });
                    });
                    await db.commit();
                    if(dbResponse.length){
                        const result = await bcrypt.compare(password, dbResponse[0]["password"])
                        if(result == true){
                            const user = {
                                id: dbResponse[0]["id"],
                                name: dbResponse[0]["name"],
                                email: dbResponse[0]["username"],
                                isAdmin: true
                            };

                            // Generate the JWT token
                            const token = jwt.sign(
                                {
                                ...user
                                },
                                process.env.NEXTAUTH_SECRET,
                                {
                                expiresIn: '1d',
                                issuer: 'your-app',
                                audience: 'your-app',
                                }
                            );
                            user.token = token;

                            return user;

                        }else{
                            throw new Error("Password is incorrect!");
                        }
                    }else{
                        throw new Error("User not found!");
                    }
                }catch(er){
                    console.log('error',er)
                    throw new Error(er.message);
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login',
        signOut: '/login',
    }
})