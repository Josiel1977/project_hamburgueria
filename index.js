const express = require('express')
const { v4: uuidv4 } = require('uuid')
const port = 3000

const app = express()
app.use(express.json())

const orders = []

// Middleware para verificar se o ID existe
const checkOrderIdExists = (req, res, next) => {
  const { id } = req.params
  const order = orders.find((order) => order.id === id)

  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' })
  }

  next()
}

// Middleware de log das requisições
const logger = (req, res, next) => {
  console.log(`[${req.method}] - ${req.url}`)
  next()
}

app.use(logger);

app.post('/order', (req, res) => {
  const { order, clientName, price } = req.body;
  const id = uuidv4();
  const newOrder = {
    id,
    order,
    clientName,
    price,
    status: 'Em preparação'
  };
  orders.push(newOrder);

  res.json(newOrder);
});

app.get('/order', (req, res) => {
  res.json(orders);
});

app.put('/order/:id', checkOrderIdExists, (req, res) => {
  const { id } = req.params;
  const { order, clientName, price } = req.body;

  const orderIndex = orders.findIndex((order) => order.id === id);

  orders[orderIndex] = {
    ...orders[orderIndex],
    order: order || orders[orderIndex].order,
    clientName: clientName || orders[orderIndex].clientName,
    price: price || orders[orderIndex].price
  };

  res.json(orders[orderIndex]);
});

app.delete('/order/:id', checkOrderIdExists, (req, res) => {
  const { id } = req.params;

  const orderIndex = orders.findIndex((order) => order.id === id);
  const deletedOrder = orders.splice(orderIndex, 1);

  res.json(deletedOrder[0]);
});

app.get('/order/:id', checkOrderIdExists, (req, res) => {
  const { id } = req.params;

  const order = orders.find((order) => order.id === id);

  res.json(order);
});

app.patch('/order/:id', checkOrderIdExists, (req, res) => {
  const { id } = req.params;

  const order = orders.find((order) => order.id === id);
  order.status = 'Pronto';

  res.json(order);
})

app.listen(3000, () => {
    console.log(`🎯Server started on port ${port}🚀`)
})

