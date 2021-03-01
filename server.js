const express = require('express');
const cartItems = require('./cart-items');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", cartItems);

const port = 3000;
app.listen(port, () => console.log(`Listening on port: ${port}.`));