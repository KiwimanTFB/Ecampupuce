const axios = require('axios');
(async () => {
    try {
        const res = await axios.post('http://localhost:3000/api/login/admin', {
            email: 'admin@ecampupuce.fr',
            password: 'admin123'
        });
        console.log("SUCCESS:", res.data);
    } catch(err) {
        if(err.response) console.error("ERROR DATA:", err.response.data);
        else console.error("ERROR STACK:", err.message);
    }
})();
