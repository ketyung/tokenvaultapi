# tokenvaultapi

The token vault api for DC staking project by using solana web3 js file wallet to create a token account
for a token mint, this is done in expressjs but it doesn't save to mongodb or any db
I think there isn't a need to save it as the return of the account after it's been created is just fast
and the creation of token account and setting the authority also don't take too long

So the usage is just a GET API call as follows:

http://localhost:3000/token?token=EbXx7pFwi525kLafpjB619mqwQWTLGgPYZ4HxDwzZff7
