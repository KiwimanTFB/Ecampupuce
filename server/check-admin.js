const db = require('./db.js');

async function checkAdmin() {
    try {
        const row = await db.getAsync('SELECT * FROM utilisateurs WHERE email = "admin@ecampupuce.fr"');
        console.log("Admin record:", row);
    } catch(e) {
        console.error(e);
    }
}
checkAdmin();
