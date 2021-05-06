const express = require('express')
const app = express()

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

app.get('/info', (request, response) => {
    const date = new Date()
    const result = `<p>Phonebook has info for ${people.length} people</p><p>${date}</p>`
    return response.send(result)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})