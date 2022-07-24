const keys = require('./keys');
const kuna = require('./v3')(keys); 
const prompt = require('prompt-sync')();

function startOrder(data) {
    console.log(data);
    // [limit, market, market_by_quote]
    const inamount = prompt('Input amount: ');
    const intype = prompt('Type [limit, market, market_by_quote]: ');
    const inprice = prompt('Input price (mandatory when type = limit ): ');

    try {
    orderrequest = {symbol: 'bchuah', type: intype , amount: inamount , price :inprice};
    kuna.private.createOrder(orderrequest).then((data) => console.log(data));
    } catch (error) {
        return error.message;
    };
}

console.log(kuna.public.getMarkets().then((data) => startOrder(data)));


