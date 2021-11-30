import express, { Request, Response, NextFunction } from 'express';
import { getPayer } from './utils/utils';
import {createTokenVaultAndSetAuthority, toLogIt} from './utils/funcs';
import {Keypair} from '@solana/web3.js';

const app = express();
const port = 3000;

interface Wallet {

    publicKey : string; 
}

const pubKeyResp = async (_request : Request, response : Response, _next : NextFunction) => {

     const res = await getPayer();
     
     if ( res instanceof Keypair){

        let wallet  : Wallet = { publicKey: res.publicKey.toBase58()};

        response.status(200).json(  wallet );

     }
     else {

        response.status(200);

     }
}

const createResp =  async (request : Request, response : Response, _next : NextFunction) => {

     let tk = request.query.token;

     if (toLogIt) console.log("tk::", tk);

     const res = await createTokenVaultAndSetAuthority(tk.toString());

     response.status(200).json(  res );

}

//app.get('/publicKey', pubKeyResp);

app.get('/token', createResp);


app.listen(port, () => {
  console.log(`Token vault API is running on port ${port}.`);
});