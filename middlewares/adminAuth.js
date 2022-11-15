

const jwt = require('jsonwebtoken');

class AuthJwt {
    async authJwt(req, res, next) {
        try {
            if(req.cookies && req.cookies.adminToken) {
                jwt.verify(req.cookies.adminToken, 'Sohan1212', (err, data) => {
                    if(!err) {
                        console.log('dataaa...', data);
                        req.admin = data;
                        next();
                    }else{
                        console.log(err);
                        next();
                    }
                })
            }else{
                next();
            }


        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AuthJwt();