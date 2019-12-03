const bcrypt = require('bcrypt')

async function hP(p){
    return new Promise((resolve, reject) => {
        bcrypt.hash(p, parseInt(process.env.SALTROUNDS),function(err, hashedPassword) {
           if (err) {
               return reject(err)
           } else {
               return resolve(hashedPassword)
           }
       })
    })
}

async function iCP(password, hash){
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, res) {
            if(err) return reject(err)
            else {
                return resolve(res)
            }
        })
    })
}

module.exports = {
    hashPassword: hP,
    isCorrectPassword: iCP
}
