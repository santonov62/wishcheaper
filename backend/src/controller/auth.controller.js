const express = require('express');
const jwt = require('jsonwebtoken');
const usersService = require('../service/users.service');
const md5 = require('md5');
const app = express();
const VK_SECRET_KEY = process.env.VK_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const fetch = require('node-fetch');

if (!JWT_SECRET) {
  console.error('ERROR!: Please set JWT_SECRET to .env file before running the app.');
  process.exit();
}

const authByVkToken = async (req, res) => {
  console.group(`[auth.controller] -> [authByVkToken]`);
  
  try {
    const {token: vkToken} = req.body;
    if (!vkToken)
      throw new Error(`vk token requred!`);
    
    const vkUser = await fetch(`https://api.vk.com/method/users.get?v=5.87&access_token=${vkToken}&fields=uid,domain,first_name,last_name,photo_200`, {
      method: 'GET'
    })
        .then(res => res.json())
        .then(({response, error}) => {
          if (!!error)
            throw new Error(error.error_msg);
          
          return response && response[0];
        });
    
    let user = await usersService.search({vk: vkUser.id});
    if (!user){
      const userData = {
        name: `${vkUser.first_name} ${vkUser.last_name}`,
        photo: vkUser.photo,
        vk: vkUser.id,
        login: vkUser.domain
      };
      user = await usersService.save(userData);
    }
    
    const token = generateToken(user);
    res.json({
      user: user,
      token: token
    });
    
  } catch (ex) {
    res.status(401).json(`[authByVkToken]: ${ex.message}`);
  } finally {
    console.groupEnd();
  }
};

const authByVkSession = async (req, res) => {
  console.group(`[auth.controller] -> [authByVkSession]`);
  
  try {
    const session = req.body;

    if (!isVkSessionCorrect(session))
      throw new Error(`Incorrect vk session`);

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
    res.status(401).json(`[authByVkSession]: ${ex.message}`);
  } finally {
    console.groupEnd();
  }
};

const authByJwtToken = async (req, res) => {
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

app.post('/vk', authByVkSession);
app.post('/vk/token', authByVkToken);
app.get('/from/token', authByJwtToken);

function generateToken(user) {
  const u = {
    login: user.login,
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id.toString(),
    admin: user.admin && user.admin.toString(),
    vk: user.vk && user.vk.toString()
  };
  return jwt.sign(u, JWT_SECRET, {
    expiresIn: 60 * 60 * (24 * 7) // expires in one week
  });
}

const isVkSessionCorrect = (session) => {
  return session && session.sig === md5(`expire=${session.expire}mid=${session.mid}secret=${session.secret}sid=${session.sid}${VK_SECRET_KEY}`);
};

module.exports = app;