/* jshint esversion: 9 */
const { Router } = require('express');
const { check, body, validationResult } = require('express-validator');
const router = Router();
const keys = require('../keys');
const kuna = require('../v3')(keys); 

///api/kuna/me
router.get(
  '/me',
  async(req, res) => {
      try {
          let me = await kuna.private.accountInfo();
          res.status(200).json({ me });
      } catch (e) {
          res.status(500).json({ message: `Error catched: ${e.message}`});
      }
    }  
);

///api/kuna/getbalance
router.get(
    '/getbalance',
    async(req, res) => {
        try {
            let rawbalance  = await kuna.private.accountBalance();
            let balance = [];
            if (rawbalance instanceof Array) {
                rawbalance.forEach(function(currentCurrency){
                  let currentAmount = currentCurrency[currentCurrency.length-1];
                  if (currentAmount > 0) {
                    balance.push( { code: currentCurrency[1],  amount: currentAmount} );
                  }
            });
          }
            res.status(200).json({ balance});
        } catch (e) {
            res.status(500).json({ message: `Error catched: ${e.message}`});
        }
      }
);

///api/kuna/getmarkets
router.get(
  '/getmarkets',
  async(req, res) => {
      try {
          let markets  = await kuna.public.getMarkets();
          res.status(200).json({ markets});
      } catch (e) {
          res.status(500).json({ message: `Error catched: ${e.message}`});
      }
    }
);

///api/kuna/getactiveorders
router.get(
  '/getactiveorders',
  [
    check('market','Minimal market lenght 6').isLength( min = 6 )
  ],
  async(req, res) => {
      try {
          let orders  = await kuna.private.getActiveOrders(req.query.market);
          res.status(200).json({ orders});
      } catch (e) {
          res.status(500).json({ message: `Error catched: ${e.message}`});
      }
    }
);

///api/kuna/cancelorders
router.post(
  '/cancelorders',
  async(req, res) => {
      try {         
          let result  = await kuna.private.cancelOrder(req.body.orderids);
          res.status(200).json({ result});
      } catch (e) {
          res.status(500).json({ message: `Error catched: ${e.message}`});
      }
    }
);

///api/kuna/kunacode
router.get(
    '/kunacode',
    [
      check('code','Minimal kunacode lenght 5').isLength( min = 5 )
    ],
    async (req,res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
        return res.status(400).json({
          errors: errors.array(),
          message: 'incorrect kunacode data '
        });
      }

      const inkunacode = req.query.code;
      if (inkunacode.length !== 5)  {
        kuna.public.validateKunaCode(inkunacode);
      }
      var kunacodepattern1=inkunacode.slice(0, 5);
      const result = await kuna.public.checkKunaCode(kunacodepattern1);
      res.status(200).json({ kunacodeinfo: result});
    } catch (e) {
      res.status(500).json({ message: `Error catched: ${e.message}`});
    }
  }
);

///api/kuna/kunacodeactivate
router.post(
  '/kunacodeactivate',    
  [
    check('code','Minimal kunacode lenght 5')
    .isLength(min = 5)
  ],
  async (req,res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect activation data"
        }
        );
      }
    
      const {code} = req.body;
      kuna.public.validateKunaCode(code);
      var kunacodepattern1=code.slice(0, 5);
      var result = await kuna.public.checkKunaCode(kunacodepattern1);
      if (result.redeemed_at === null) {
        result = await kuna.private.activateKunaCode(code);
      }
      res.status(201).json({ kunacodeinfo: result } );
    } catch (e) {
      res.status(500).json( {message: `Error catched: ${e.message}`} );
    }
  }
);

///api/kuna/createkunacode
router.post(
  '/createkunacode',    
  [ ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data for KunaCode creation"
        }
        );
      }
     
      kunacodeinfo = {recipient: '', amount: req.body.amount, currency: req.body.currency, non_refundable_before: null, comment: null, private_comment: null};
      const result = await kuna.private.createKunacode(kunacodeinfo);

      res.status(201).json({kunacodeinfo: result});
    } catch (e) {
      res.status(500).json( {message: `Error catched: ${e.message}`} );
    }    
  }  
);

///api/kuna/withdraw
router.post(
  '/withdraw',    
  [ ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data for withdraw creation"
        }
        );
      }
     
      withdrawrequest = { withdraw_type: req.body.currency , amount: req.body.amount, gateway: 'default', withdrawall: 0, withdraw_to : req.body.cardnumber };
      const result = await kuna.private.withdrawal(withdrawrequest);

      res.status(201).json({result});
    } catch (e) {
      res.status(500).json( {message: `Error catched: ${e.message}`} );
    }    
  }  
);

///api/kuna/deposit
router.post(
  '/deposit',    
  [ ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data for deposit creation"
        }
        );
      }
     
      depositrequest = {currency : req.body.currency , amount: req.body.amount, gateway: 'default', deposit_from : req.body.cardnumber };
      const result = await kuna.private.deposit(depositrequest);

      res.status(201).json({result});
    } catch (e) {
      res.status(500).json( {message: `Error catched: ${e.message}`} );
    }    
  }  
);

///api/kuna/createorder
router.post(
  '/createorder',    
  [ ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data for order creation"
        }
        );
      }
      
      orderrequest = {symbol : req.body.symbol , type: req.body.type , amount:  req.body.amount , price : req.body.price, stop_price:  req.body.stop_price };
      const result = await kuna.private.createOrder(orderrequest);

      res.status(201).json({result});
    } catch (e) {
      res.status(500).json( {message: `Error catched: ${e.message}`} );
    }    
  }  
);



module.exports = router;