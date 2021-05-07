require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())

morgan.token('req-body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(cors())
app.use(express.static('build'))



app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(person => {
        console.log(person.length)
        response.json(person)
    }).catch(error => next(error))
})


app.get('/info', (request, response, next) => {
    const date = new Date()
    Person.find({}).then(person => {
        const result = `<p>Phonebook has info for ${person.length} people</p><p>${date}</p>`
        return response.send(result)
    }).catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }).catch(error => next(error))


})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        "name": body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.deleteOne({ _id: id }).then(result => {
        response.status(204).end()
    }).catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
    const rb = request.body

    if (!rb.name && !rb.number) {
        return response.status(400).json({
            error: 'name and number missing'
        })
    }
    // const nameExists = () => {
    //     return people.some(p => p.name === person.name)
    // }
    // if (nameExists) {
    //     return response.status(400).json({
    //         error: 'name already exists'
    //     })
    // }
    const person = new Person({
        "name": rb.name,
        number: rb.number
    })
    person.save().then(result => {
        console.log('note saved!')
        response.json(result)

    }).catch(error => {
        next(error)
    })
})

const errorHandler = (error, request, response, next) => {
    console.log("recieved error")
    console.error(error.message)

    if (error.name === 'ValidationError') {
        return response.status(500).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})