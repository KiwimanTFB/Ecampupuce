const bcrypt = require('bcrypt');
const hash = '$2a$10$wO36/R4YqRyH3J/x3Z/j/Oc23YI.V2V4g1gY5O4gQj.P.uI68aE3m';
const password = 'password123';

bcrypt.compare(password, hash).then(res => {
  console.log('Match :', res);
  if (!res) {
     bcrypt.hash(password, 10).then(newHash => {
         console.log('Nouveau hash attendu :', newHash);
     });
  }
});
