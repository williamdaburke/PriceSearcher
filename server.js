const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '46c0a1e171c76bb37784d60aad4df750';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.get('/', function (req, res) {
  res.render('index', {product: null, error: null, productList: null});
})

app.get('/productdetail.html', function (req, res) {
  let post_options = {
    uri: `https://pricesearcher-frontend-test.herokuapp.com/products?product_id=${req.query.tagId}`,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': '46c0a1e171c76bb37784d60aad4df750'
        }
  };

request(post_options, function (err, response, body) {
  if(err){
    res.render('productdetail', {product: null, error: 'Error, product details not available', productList: null});
  } else {
    let productdetail = JSON.parse(body)
    console.log(productdetail)
    if(productdetail == undefined){
      res.render('productdetail', {product: null, error: 'I\'m sorry, we couldn\'t find that product', productList: null});
    } else {
      let productText = `The ${productdetail[0].product_name} from ${productdetail[0].brand}`;
      res.render('productdetail', {product: productText, error: null, productList: productdetail});
    }
  }
});

  //res.render('productdetail', {product: null, error: req.query.tagId + " hi " + req.params.id});
})

app.post('/', function (req, res) {
  let productName = req.body.productName.replace(/ /g, '+');
  //console.log(productName)
  let post_options = {
      uri: `https://pricesearcher-frontend-test.herokuapp.com/products?product_name_like=${productName}`,
      headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': '46c0a1e171c76bb37784d60aad4df750'
    	  	}
  	};

  request(post_options, function (err, response, body) {
    //console.log(response);
    //console.log(body);
    if(err){
      res.render('index', {product: null, error: 'Error, please try again', productList: null});
    } else {
      let products = JSON.parse(body)
      //console.log(products)
      if(products[0] == undefined){
        res.render('index', {product: null, error: 'I\'m sorry, we couldn\'t find that product', productList: products});
      } else {
        let productText = `${products[0].product_name} for only $${products[0].price}!`;
        res.render('index', {product: productText, error: null, productList: products});
      }
    }
  });
})

app.post('/public/productdetail', function (req, res) {
  let productID = req.body.productID;
  console.log(productID)
  let post_options = {
      uri: `https://pricesearcher-frontend-test.herokuapp.com/products?product_id=${productID}`,
      headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': '46c0a1e171c76bb37784d60aad4df750'
          }
    };

  request(post_options, function (err, response, body) {
    //console.log(response);
    //console.log(body);
    if(err){
      res.render('productdetail', {product: null, error: 'Error, please try again'});
    } else {
      let productdetail = JSON.parse(body)
      console.log(productdetail)
      if(productdetail == undefined){
        res.render('productdetail', {product: null, error: 'I\'m sorry, we couldn\'t find that product'});
      } else {
        //let productText = `${productdetail.product_name} for only $${productdetail.price}!`;
        res.render('productdetail', {product: productdetail, error: null});
      }
    }
  });
})


app.listen(3131, function () {
  console.log('Example app listening on port 3131!')
})