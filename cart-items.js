const express = require("express");
const cartItems = express.Router();

const cart = [
  {
    id: 1,
    product: "frame",
    price: 19.99,
    quantity: 1
  },
  {
    id: 2,
    product: "candle",
    price: 11.99,
    quantity: 3
  },
  {
    id: 3,
    product: "blanket",
    price: 49.99,
    quantity: 1
  },
  {
    id: 4,
    product: "book",
    price: 8.99,
    quantity: 2
  },
  {
    id: 5,
    product: "fancy slippers",
    price: 22,
    quantity: 2
  },
  {
    id: 6,
    product: "notebook",
    price: 12,
    quantity: 3
  },
  {
    id: 7,
    product: "pen",
    price: 2.99,
    quantity: 10
  },
  {
    id: 8,
    product: "nail polish",
    price: 7.99,
    quantity: 3
  },
  {
    id: 9,
    product: "mug",
    price: 7.99,
    quantity: 2
  },
  {
    id: 10,
    product: "pillow",
    price: 24,
    quantity: 2
  },
  {
    id: 11,
    product: "hair spray",
    price: 3.99,
    quantity: 3
  },
  {
    id: 12,
    product: "fancy bookmark",
    price: 9.99,
    quantity: 4
  },
  {
    id: 13,
    product: "pencil",
    price: 1.25,
    quantity: 2
  },
];

cartItems.get("/", (req, res) => {

    let filteredCart = cart;
    const maxPrice = req.query.maxPrice;
    const prefix = req.query.prefix;
    const pageSize = req.query.pageSize;

  if (maxPrice) {
    filteredCart = filteredCart.filter((item) => {
      return item.price <= maxPrice;
    });
  } 
  
  if (prefix) {
    filteredCart = filteredCart.filter((item) => {
      return item.product.toLowerCase().startsWith(prefix.toLowerCase());
    });
  } 

  if (pageSize) {
    if (filteredCart.length > pageSize) {
        filteredCart.length = pageSize;
    }
  } 
    res.status(200);
    res.json(filteredCart);
  }
);

cartItems.get("/:id", (req, res) => {
    const item = cart.find(i => i.id == req.params.id);

    if(!item) {
        res.status(404).send("ID Not Found");
    }
        res.status(200);
        res.json(item);
});

cartItems.post("/", (req, res) => {
    let item = req.body;
    item.id = cart.length + 1;
    cart.push(req.body);
    res.status(201);
    res.json(item);
});

cartItems.put("/:id", (req, res) => {
    const index = cart.findIndex(i => i.id == req.params.id);
    const selectedItem = cart[index];

    if (index >= 0) {
        const newItem = {};
        newItem.id = selectedItem.id;
        newItem.product = req.body.product;
        newItem.price = req.body.price;
        newItem.quantity = req.body.quantity;
        cart.splice(index, 1, newItem);
        res.status(200);
        res.json(newItem);
    }
        res.status(404).send("ID Not Found"); // added this so Postman would resolve the request
    });

cartItems.delete("/:id", (req, res) => {
    const index = cart.findIndex(i => i.id == req.params.id);

    if (index >= 0) {
        cart.splice(index, 1);
        res.status(204);
        res.json(cart[index]);
    }
        res.status(404).send("ID Not Found");  // added this so Postman would resolve the request
});

module.exports = cartItems;
