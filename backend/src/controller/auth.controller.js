const express = require('express');
const jwt = require('jsonwebtoken');
const usersService = require('../service/users.service');
const md5 = require('md5');
const VK_SECRET_KEY = process.env.VK_SECRET_KEY;
const app = express();

const authByVk = async (req, res) => {
  console.group(`[auth.controller] -> [authByVk]`);
  
  try {
    const session = req.body;

    if (!isCorrectVKSession(session))
      throw new Error(`Error checking vk session`);

    let user = await usersService.search({vk: session.mid});
    if (!user){
      const userData = {
        name: `${session.user.first_name} ${session.user.last_name}`,
        photo: session.user.photo,
        vk: session.user.id,
        login: session.user.domain
      };
      user = await usersService.save(userData);
    }

    const token = generateToken(user);
    res.json({
      user: user,
      token: token
    });
  } catch (ex) {
    res.status(401).json(`[backend auth by vk]: ${ex.message}`);
  } finally {
    console.groupEnd();
  }
};
const authFromToken = async (req, res) => {
  console.group(`[auth.controller] -> [authFromToken]`);
  try {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token;
    if (!token) {
      return res.status(401).json({message: 'Must pass token'});
    }
    // Check token that was passed by decoding token using secret
    jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
      if (err) throw err;
      //return user using the id from w/in JWTToken
      const {id} = userData;
      const user = await usersService.search({id});
      if (user) {
        //Note: you can renew token by creating new token(i.e.
        //refresh it)w/ new expiration time at this point, but I’m
        //passing the old token back.
        // var token = utils.generateToken(user);
        res.json({
          user: user,
          token: token
        });
      }
      res.status(403).json({message: 'Error auth user.'});
    });
  } catch(e) {
    res.status(500).json(`[authFromToken]: ${ex.message}`);
  } finally {
    console.groupEnd();
  }
};

app.post('/vk', authByVk);
app.get('/from/token', authFromToken);

function generateToken(user) {
  const u = {
    login: user.login,
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id.toString(),
    admin: user.admin && user.admin.toString(),
    vk: user.vk && user.vk.toString()
  };
  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * (24 * 7) // expires in one week
  });
}

const isCorrectVKSession = (session) => {
  return session && session.sig === md5(`expire=${session.expire}mid=${session.mid}secret=${session.secret}sid=${session.sid}${VK_SECRET_KEY}`);
};

module.exports = app;