const express = require('express')
const uuid = require('uuid')              // Armazenamos nossa biblioteca - gera um ID UNICO! Para cada usuario diferente
const cors = require('cors')
const port = 3002
const app = express()
app.use(express.json())
app.use(cors())

const orders = []

const checkOrderID = (request, response, next) => {
    const { id } = request.params    // Pegar o ID

    const index = orders.findIndex(order => order.id === id)
    
    if(index < 0) {
        return response.status(404).json({ error: "User not found"})
    } 

    request.orderIndex = index
    request.orderID = id

    next()
}

const checkOrderStatus = (request, response, next) => {

    const method = request.method;
    const url = request.url;
    
    console.log(`Método: ${request.method}, URL: ${request.originalUrl}`)

    next() // Chama o próximo middleware na cadeia
}



app.post('/orders', checkOrderStatus,(request, response) => {

        const { application, clientName, price } = request.body
        const status = "Em preparação"

        const order = {id:uuid.v4(), application, clientName, price, status}     // V4 - ID aleatorio
        
        orders.push(order)

        return response.status(202).json(order)
        
})

app.get('/orders', checkOrderStatus, (request, response) => {

    return response.json(orders)
})

app.put('/orders/:id', checkOrderID, checkOrderStatus,(request, response) => {
    const {application, clientName, price} = request.body
    const status = "Em preparação"
    const index = request.orderIndex
    const id = request.orderID

    const upadatedOrder = { id, application, clientName, price, status}



    orders[index] = upadatedOrder
    return response.json(upadatedOrder)
})

app.delete('/orders/:id', checkOrderStatus,(request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(208).json()
})

app.get('/orders/:id', checkOrderID, checkOrderStatus,  (request, response) => {
    const index = request.orderIndex;

    return response.json(orders[index])             // Mostra o pedido especifico, pela posição
})

app.patch('/orders/:id', checkOrderID,  checkOrderStatus, (request, response) => {
    const {application, clientName, price} = request.body;
    const status = "Pedido pronto"
    const index = request.orderIndex
    const id = request.orderId

    const currentOrder = orders[index];

    const updatedOrder = {
      ...currentOrder, 
      status: status 
    };

    orders[index] = updatedOrder;

     return response.json(updatedOrder); 

    
})

app.listen(port, () => {
    console.log(`👌 Servidor rodando na porta ${port}`)
})