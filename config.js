const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const User = require('./database/models').User;

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();;
    opts.secretOrKey = process.env.SECRET || 'jwtsecretkey';
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        // console.log('jwt info', jwt_payload);
        User.findOne({where: {id: jwt_payload.id}}).then(user => {

            if (user) {
                // console.log('jwt user found', user);
                done(null, user);
            } else {
                // console.log('jwt user not found');
                done(null, false);
            }
        });
    }));
};