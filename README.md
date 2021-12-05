# tokenvaultapi

Just a simple token vault api example that was built during the DC staking project by using solana web3 js file wallet to create a token account for a token mint, this is done in expressjs, it accepts a token mint, checks if a token account exists, if not it will create an associated token account for the token and set the authority of the token account to a PDA (Program Derived Address) in Solana. 

To run <br/>
<p>npm run server</p>

You may need to do<br/> 

<p>npm install</p>

<br/>to install all the packages first


So the usage is just a GET API call as follows:

http://localhost:3008/token?token=EbXx7pFwi525kLafpjB619mqwQWTLGgPYZ4HxDwzZff7

http://localhost:3008/token?token=BuhhWXjHSRgo1cy1DSxUFXiv3pTZP6gKw4ZbWjCfXreG


