import { SecretNetworkClient, grpc } from 'secretjs'
import 'dotenv/config'
import fetch from 'node-fetch'

const grpcWebUrl = process.env.GRPC_WEB_URL;

// To create a readonly secret.js client, just pass in a gRPC-web endpoint
const secretjs = await SecretNetworkClient.create({
  grpcWebUrl,
  chainId: "secret-4",
});

// const { delegationResponses: response } = await secretjs.query.staking.validatorDelegations({validatorAddr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6', pagination: {limit:'1000000'}}, new grpc.Metadata({"x-cosmos-block-height": "4008888"}))
// let amounts = []
// for (let i = 0; i < response.length; i++) {
//   amounts.push(parseInt(response[i].balance?.amount))
// }
// let amounts2 = amounts.sort((a,b) => a-b).reverse().filter( (a) => a > 1000000 )
// let top_five = []
// for (let i = 0; i < 5; i++) {
//   const element = Math.round(amounts[i] / 1000000);
//   top_five.push(element) 
// }
// let total = amounts2.length
// console.log(`AmberDAO has ${total} delegations.`)
// console.log(amounts2.reverse().filter( (a) => a >= 1000000))

const { balance: { amount: amount} } = await secretjs.query.snip20.getBalance(
  {
    contract: {
      codeHash: "5a085bd8ed89de92b35134ddd12505a602c7759ea25fb5c089ba03c8535b3042",
      address: "secret1s09x2xvfd2lp2skgzm29w2xtena7s8fq98v852",
    },
    address: "secret1hctvs6s48yu7pr2n3ujn3wn74fr5d798daqwwg",
    auth: {
      key: "amber_rocks"
    }
  }
)

const claimed = (5110600000 - parseInt(amount)) / 1000000
console.log(`${claimed} AMBER have been claimed.`)