const jwt = require('jsonwebtoken');

const secret = 'thisismysecretskeysshhhhhhh';

function verifySignature(token) {
    if(token){
        try{
            var result = jwt.verify(token, secret);
            var signature = {
                state: true,
                description: 'verified'
            }
        } catch(err) {
            console.log(err);
            var signature =  {
                state: false,
                description: err.message
            }
        }
          console.log(signature)

    }
    return signature;
}


module.exports = { verifySignature };