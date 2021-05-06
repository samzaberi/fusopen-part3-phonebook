const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('req-body', (req, res) => JSON.stringify(req.body))


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let people = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-532352"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary popendick",
        number: "39-23-643122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(people)
})

const generateId = (min, max) => Math.floor(Math.random() * (max - min) + min)

app.get('/info', (request, response) => {
    const date = new Date()
    const result = `<p>Phonebook has info for ${people.length} people</p><p>${date}</p>`
    return response.send(result)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const valid = people.some(person => person.id === id)

    if (valid) {
        people = people.filter(person => person.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name && !person.number) {
        return response.status(400).json({
            error: 'name and number missing'
        })
    }
    const nameExists = () => {
        return people.some(p => p.name === person.name)
    }
    if (nameExists) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    person.id = generateId(5, 100)
    people = people.concat(person)

    console.log(people)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})