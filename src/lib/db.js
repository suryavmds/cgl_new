import mysql from 'mysql'

const connection = mysql.createConnection({
//   connectionLimit: 10, // maximum number of connections
//   waitForConnections: true, // queue new connections if limit is reached
host:process.env.RDS_HOST,
port: 3306,
database:process.env.DATABASE_NAME,
user:process.env.DATABASE_USERNAME,
password:process.env.DATABASE_PASSWORD,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

module.exports = connection;