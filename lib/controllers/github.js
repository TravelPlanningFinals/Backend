const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const IS_DEPLOYED = process.env.NODE_ENV === 'production';
console.log('first', process.env.NODE_ENV);
module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const token = await exchangeCodeForToken(code);
      const { username, email, avatar_url } = await getGithubProfile(token);
      let user = await GithubUser.findByUsername(username);

      if (!user)
        user = await GithubUser.insert({
          username,
          email,
          avatar: avatar_url,
        });

      const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          secure: IS_DEPLOYED,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect(`${process.env.FRONT_END}/trips`);
      //front end route to trips page
      //front end will have to fetch from api/v1/trips(controller)
    } catch (error) {
      next(error);
    }
  })
  .get('/me', authenticate, async (req, res) => {
    res.send(req.user);
  })
  .delete('/login', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Successfully signed out' });
  });
