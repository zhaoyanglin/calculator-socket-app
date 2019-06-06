const express = require('express')
const http = require('http')
const socketIO = require('socket.io')


const port = process.env.PORT || 4001;

const app = express()

app.use(express.static('build'));


const server = http.createServer(app)

server.listen(port, () => console.log(`Listening on port ${port}`))

const io = socketIO(server)

class CalculationModel {
    constructor(firstValue, secondValue, result, operation) {
        this.firstValue = firstValue;
        this.secondValue = secondValue;
        this.result = result;
        this.operation = operation;
    }

    toString() {
        return `${this.firstValue} ${this.operation} ${this.secondValue} = ${this.result}`
    }
}

let calculations = [];


io.on('connection', socket => {

    socket.on('add calculation', (event) => {
console.log('this is the event=============', event);

        const newCalc = new CalculationModel(event.firstValue, event.secondValue, event.result, event.operation).toString()

        if(calculations.length < 10) {
            calculations.push(newCalc)
        } else {
            calculations.shift()
            calculations.push(newCalc)
        }

        io.sockets.emit('calc', calculations.reverse())
    })

    socket.on('new user', () => {
        io.sockets.emit('calc', calculations.reverse())
    })

    // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})
