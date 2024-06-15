const bcrypt = require('bcryptjs');

function hashPassword(pass){
    bcrypt
    .genSalt(10)
    .then(salt=> {
        return bcrypt.hash(pass, salt)
    })
}

function validate(pass,hash){
    bcrypt
    .compare(pass, hash)
    .then(res =>{
        return res;
    })
}
module.exports={
    hashPassword,validate
} 