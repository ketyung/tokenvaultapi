import * as web3 from '@solana/web3.js';
// import spl token package, yarn add or npm install it if you don't have 
import * as splToken from "@solana/spl-token";
import { getRpcUrl , getPayer} from './utils';
//let util= require('util');

export const toLogIt = true ;

// you'll need the associated token program ID
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: web3.PublicKey = new web3.PublicKey(
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',);

// the program id of my Rust smart contract
export const programId : web3.PublicKey = new web3.PublicKey("5E4MATRbVPrHsHKWyYUu1HvLS5dhhajuETdSCeuqDf64");




let connection : web3.Connection; 


export interface TokenVaultPair {

    mint : string;

    account : string;
}

export async function establishConnection(): Promise<void> {
    const rpcUrl = await getRpcUrl();
    connection = new web3.Connection(rpcUrl, 'confirmed');
    const version = await connection.getVersion();
    console.log('Connection to cluster established:', rpcUrl, version);
}

// this function allows a wallet to find an associated token account 
// for a token 
export async function findAssociatedTokenAddress(walletAddress: web3.PublicKey, 
tokenMintAddress: web3.PublicKey): Promise<web3.PublicKey> {
    return (await web3.PublicKey.findProgramAddress(
        [
            walletAddress.toBuffer(),
            splToken.TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    ))[0];
}


      

export async function createTokenVaultAndSetAuthority(nftMintStr : String) : Promise <TokenVaultPair>{

    establishConnection();

    let payer = await getPayer();

    let walletKey = payer.publicKey;

    let nftMint = new web3.PublicKey(nftMintStr);


    let nftVaultAccount = await findAssociatedTokenAddress(walletKey, nftMint );

      
    if (toLogIt) console.log("The associated token account is :", nftVaultAccount.toBase58());

    const allTxs = new web3.Transaction();
        
       // check if the token account exists 
    if ( await connection.getAccountInfo(nftVaultAccount) == null ){

          // if not, add and instruction of creating the associated token account to
          // web3 transaction to create it 
            allTxs.add(

                splToken.Token.createAssociatedTokenAccountInstruction(
                    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID,
                    nftMint,nftVaultAccount, walletKey, walletKey),
    
            );
     }
     else {

        if (toLogIt) console.log("Token Account already exists!");

        let t : TokenVaultPair = ({ mint : nftMint.toBase58(), account : nftVaultAccount.toBase58()});        
        return t; 
     }

     // create a PDA derived from token mint
   
     //new util.TextEncoder().encode(nftMintStr)

     let pdaAccount = await web3.PublicKey.findProgramAddress(
      [new web3.PublicKey(nftMintStr).toBytes()], programId);

      if (toLogIt) console.log("The PDA :", pdaAccount[0].toBase58());

     // create the set authority instruction
     // to change the authority to the PDA
     let setAuthIns = splToken.Token.createSetAuthorityInstruction(
         new web3.PublicKey(splToken.TOKEN_PROGRAM_ID), 
        nftVaultAccount, pdaAccount[0], "AccountOwner", walletKey, [payer]);
     

    allTxs.add( setAuthIns );

    
    // send the tx 
    let res = await web3.sendAndConfirmTransaction( connection, allTxs, [payer]);
    
    if (toLogIt) console.log("sent tx res::", res);

  
    let t : TokenVaultPair = ({ mint : nftMint.toBase58(), account : nftVaultAccount.toBase58()});        
    return t; 


}