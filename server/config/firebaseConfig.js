const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json')
const dotenv = require('dotenv');
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
  
const db = admin.firestore();
const realTimeDb = admin.database()

const userRef = db.collection('users')

module.exports = {
  db,
  realTimeDb,
  userRef
};