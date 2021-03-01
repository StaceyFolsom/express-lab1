const express = require("express");
const cartItems = express.Router();
const pool = require("./pg-connection-pool");

cartItems.get("/cart-items", (req, res) => {

  const maxPrice = req.query.maxPrice;
  let prefix = req.query.prefix;
  const pageSize = req.query.pageSize;

  let query = "SELECT * FROM shopping_cart WHERE 1=1";
  let vars = [];

  if (maxPrice) {
    vars.push(maxPrice);
    query += ` AND price <= $${vars.length}`;
  }

  if (prefix) {
    prefix = (prefix.concat('%')).toLowerCase();
    vars.push(prefix);
    query += ` AND product LIKE $${vars.length}`; 
  }

  if (pageSize) {
    vars.push(pageSize);
    query += ` LIMIT $${vars.length}`;
  }

    // console.log(query, vars);
    pool.query(query, vars).then((results) => {
    res.json(results.rows);
    })
});

cartItems.get("/cart-items/:id", (req, res) => {

    const id = parseInt(req.params.id);
    pool.query("SELECT * FROM shopping_cart WHERE id = $1", [id]).then((results) => {

    if (results.rowCount > 0) {
      res.json(results.rows);
    } else {
      res.status(404).json('Not found');
    }
  });

});

cartItems.post("/cart-items", (req, res) => {
   
    const item = req.body;
    pool.query("INSERT INTO shopping_cart (product, price, quantity) VALUES ($1, $2, $3);", 
    [
      item.product,
      item.price,
      item.quantity
    ]).then(() => {
      res.status(201);
      res.json(item);
    })
});

cartItems.put("/cart-items/:id", (req, res) => {

    let item = req.body;
    let id = req.params.id;
    
    pool.query("UPDATE shopping_cart SET product = $1, price = $2, quantity = $3 WHERE id = $4;", [item.product, item.price, item.quantity, id]).then((results) => {
    res.status(200);
    res.json(results);
    })
  });

cartItems.delete("/cart-items/:id", (req, res) => {

    let id = req.params.id;
    console.log(id);
    pool.query("DELETE FROM shopping_cart WHERE id = $1;", [id]).then(() => {
      res.status(204);
      res.json();
    })
});

module.exports = cartItems;





// -------------------------------------------------------------------


// ALT GET METHOD THAT ONLY MAKES ONE CALL TO THE DATABASE AND THEN QUERIES THE RESULTS (DON'T RECALL IF IT ALL WORKS OR NOT)
// const express = require("express");
// const cartItems = express.Router();
// const pool = require("./pg-connection-pool");

// cartItems.get("/cart-items", (req, res) => {

//   pool.query("SELECT * FROM shopping_cart;").then((results) => {

//     let cart = results.rows.map((result) => {
//       let newResult = result;
//       return newResult;
//     });

//   let filteredCart = cart;
//   const maxPrice = req.query.maxPrice;
//   let prefix = req.query.prefix;
//   const pageSize = req.query.pageSize;

//   if (maxPrice) {
//     filteredCart = filteredCart.filter((item) => {
//       if (item.price <= parseInt(maxPrice) ) {
//       return item;
//       }
//     })};

//   if (prefix) {
//     filteredCart = filteredCart.filter((item) => {
//       return item.product.toLowerCase().startsWith(prefix.toLowerCase());
//     })};

//   if (pageSize) {
//     if (filteredCart.length > pageSize) {
//     filteredCart.length = pageSize;
//   }};

//   res.status(200);
//   res.json(filteredCart);
//   })
// });

//     module.exports = cartItems;

// cartItems.get("/cart-items/:id", (req, res) => {
//   const item = parseInt(req.query.id);

//   pool.query("SELECT * FROM shopping_cart WHERE id = $1", [item]).then((results) => {
//     console.log(item);
//     res.json(results.rows);
//   })
// });
