const jwt = require('jsonwebtoken');


const token = jwt.sign('sdhfsdjkhfjksd', 'thinh')

console.log(jwt.verify(token, 'thinh'));