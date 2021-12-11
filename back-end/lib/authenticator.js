
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')
const db = require('./db')

const fetchKeyFromOpenIDServer = async (jwks_uri, token) => {
  const header = JSON.parse( Buffer.from(
      token.split('.')[0], 'base64'
    ).toString('utf-8')
  )
  const {publicKey, rsaPublicKey} = await jwksClient({
    jwksUri: jwks_uri
  }).getSigningKey(header.kid)
  return publicKey || rsaPublicKey
}

module.exports = ({jwks_uri, test_payload_email} = {}) => {
  if(test_payload_email){
    return async (req, res, next) => {
      req.user = {
        email: test_payload_email,
      }
      next()
    }
  }
  if(!jwks_uri){
    throw Error('Invalid Settings: jwks_uri is required')
  }
  return async (req, res, next) => {
    if(req.user){
      console.log(req.url + " ALREADY AUTHENTIFIED")
      next()
      return
    }
    if(! req.headers['authorization'] ){
      res.status(401).send('Missing Access Token')
      return
    }
    const header = req.headers['authorization']
    const [type, access_token] = header.split(' ')
    if(type !== 'Bearer'){
      res.status(401).send('Authorization Not Bearer')
      return
    }
    const key = await fetchKeyFromOpenIDServer(jwks_uri, access_token)
    // Validate the payload
    try{
      const payload = jwt.verify(access_token, key)
      req.user = {
        email: payload.email
      }
      next()
    }catch(err){
      res.status(401).send('Invalid Access Token')
    }
  }
}
