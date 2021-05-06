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


app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        console.log(person.length)
        response.json(person)
    })
})


app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(person => {
        const result = `<p>Phonebook has info for ${person.length} people</p><p>${date}</p>`
        return response.send(result)
    })

})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    }).catch((error) => {
        response.status(404).end()
    })


})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.deleteOne({ _id: id }, (error) => {
        response.json(error)
    })

})

app.post('/api/persons', (request, response) => {
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

    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})