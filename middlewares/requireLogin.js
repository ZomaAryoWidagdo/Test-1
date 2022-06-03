const { readToken } = require("../helpers/jwt");
const { User } = require("../models/");

async function authentication(req, res, next) {
  try {
    const { accesstoken } = req.headers;

    const payload = readToken(accesstoken);

    const userTrue = await User.findOne({
      where: {
        id: payload.id,
        email: payload.email,
      },
    });

    if (!userTrue) {
      throw "TokenError";
    }

    req.user = {
      id: userTrue.id,
      email: userTrue.email,
      name: userTrue.username,
    };
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authentication,
};
