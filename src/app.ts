import { SecretNetworkClient } from 'secretjs'
import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import 'dotenv/config'
import { randomInt } from 'crypto';

const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);

const grpcWebUrl: string = process.env.GRPC_WEB_URL!;
const url: string = process.env.LCD_URL!;

// To create a readonly secret.js client, just pass in a LCD endpoint
const secretjs = new SecretNetworkClient({
  url,
  chainId: "secret-4",
});

bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
});
bot.help((ctx) => {
  ctx.reply('Get Facts about AmberDAO:\n/stake - total SCRT staked\n/delegators - total number of delegators\n/whale - the largest delegation\n/top5whale - top 5 largest delegations\n/fact - get a random fact about amber\n/price - current price of $AMBER\n/claimed - amount of $AMBER claimed to-date');
});
bot.command('stake', async (ctx) => {
  const { validator: response } = await secretjs.query.staking.validator({validator_addr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6'})
  let scrt = Math.round(parseInt(response!.tokens!) / 1000000 )
  ctx.reply(`AmberDAO has ${scrt} SCRT staked.`)
});
bot.command('delegators', async (ctx) => {
  const { delegation_responses: response } = await secretjs.query.staking.validatorDelegations({validator_addr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6', pagination: {limit:'1000000'}})
  let total: number = response!.length
  ctx.reply(`AmberDAO has ${total} delegations.`)
});
bot.command('fact', (ctx) => {
  let fact: string
  let facts: string[] = [
    'Amber is a gem - but not a gemstone.',
    'The largest amber deposits in the world are in the Baltic region.',
    "Amber was once part of a tree's immune system",
    'Amber requires millions of years and proper burial conditions to form.',
    'The word electricity derives from the greek word for amber.',
    'Multiple extinct species have been identified thanks to amber.',
    'Amber has healing powers and the power to ward off witches.',
    'Humans have used amber in jewelry since at least 11,000 BCE.',
    'The oldest amber is 320 million years old.',
    'Amber has been found in more than 300 colors.',
    "It's easy to be fooled by fake amber."
  ]
  fact = facts[randomInt(11)]
  ctx.reply(fact)
});
bot.command('price', (ctx) => {
  ctx.reply(`1 $AMBER = 1 $AMBER`)
});
bot.command('whale', async (ctx) => {
  const { delegation_responses: response } = await secretjs.query.staking.validatorDelegations({validator_addr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6', pagination: {limit:'1000000'}})
  let amounts: number[] = []
  for (let i = 0; i < response!.length; i++) {
    amounts.push(parseInt(response![i].balance?.amount!))
  }
  amounts.sort((a,b) => a-b).reverse()
  let amount = Math.round(amounts[0] / 1000000)
  ctx.reply(`The largest delegation to AmberDAO is ${ amount } SCRT!`)
});
bot.command('top5whale', async (ctx) => {
  const { delegation_responses: response } = await secretjs.query.staking.validatorDelegations({validator_addr: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6', pagination: {limit:'1000000'}})
  let amounts: number[] = []
  for (let i = 0; i < response!.length; i++) {
    amounts.push(parseInt(response![i].balance?.amount!))
  }
  amounts.sort((a,b) => a-b).reverse()
  let top_five: number[] = []
  for (let i = 0; i < 5; i++) {
    const element = Math.round(amounts[i] / 1000000);
    top_five.push(element) 
  }
  ctx.reply(`The top 5 largest delegations to AmberDAO are:\n${ top_five.join(' \n') }`)
});
bot.command('wen', (ctx) => {
  ctx.reply('soon')
});
bot.command('wen_amber_then_lambo', (ctx) => {
  ctx.reply('/wen_amber_then_lambo')
});
bot.command('kent', (ctx) => {
  ctx.reply('Kent is a cool guy who made this bot')
});
bot.command('Kent', (ctx) => {
  ctx.reply('Kent is a cool guy who made this bot')
});
bot.command('claimed', async (ctx) => {
  const { balance: { amount: amount} } = await secretjs.query.snip20.getBalance(
    {
      contract: {
        code_hash: "5a085bd8ed89de92b35134ddd12505a602c7759ea25fb5c089ba03c8535b3042",
        address: "secret1s09x2xvfd2lp2skgzm29w2xtena7s8fq98v852",
      },
      address: "secret1hctvs6s48yu7pr2n3ujn3wn74fr5d798daqwwg",
      auth: {
        key: "amber_rocks"
      }
    }
  )
  const claimed = (5110600000 - parseInt(amount)) / 1000000
  ctx.reply(`${claimed} AMBER have been claimed.`)
});
// bot.command('quit', (ctx) => {
//   // Explicit usage
//   ctx.telegram.leaveChat(ctx.message.chat.id);
// // Context shortcut
//   ctx.leaveChat();
// });
// bot.command('keyboard', (ctx) => {
//   ctx.reply(
//     'Keyboard',
//     Markup.inlineKeyboard([
//       Markup.button.callback('First option', 'first'),
//       Markup.button.callback('Second option', 'second'),
//     ])
//   );
// });
// bot.on('text', (ctx) => {
//   ctx.reply(
//     'You choose the ' +
//       (ctx.message.text === 'first' ? 'First' : 'Second') +
//       ' Option!'
//   );
// });

bot.launch();
