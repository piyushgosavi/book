const admin = require('firebase-admin');
const serviceAccount = require("./backend-f4e39-firebase-adminsdk-v949d-d6b7f80c64.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();
module.exports = bucket;