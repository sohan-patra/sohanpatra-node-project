const jwt = require('jsonwebtoken');

class AuthJwt {
    async authJwt(req, res, next) {
        try {
            if(req.cookies && req.cookies.userToken) {
                jwt.verify(req.cookies.userToken, 'Sohan1414', (err, data) => {
                    if(!err) {
                        console.log('dataaa2...', data);
                        req.user = data;
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