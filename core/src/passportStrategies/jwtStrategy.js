const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { vars } = require('@appetism/binant-codetest-shared/src/config');

const jwtOptions = {
  secretOrKey: vars.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }

    const user = payload.sub;
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = jwtStrategy;
