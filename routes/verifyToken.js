const jwt = require('jsonwebtoken');

/*
 * function verifying the token from header of request
 */
function tokenVerifier(req, res, next){
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({message:'Access Denied'});
    }
    try{
        const verified = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send({message: 'Invalid Token'});
    }

}

module.exports = tokenVerifier;