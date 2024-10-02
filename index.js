const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny')) //ottaa morganin käyttöön "tiny" -formaatissa

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
  ]
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  //kaikki henkilöt
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

//info ja pyynnön aika
  app.get('/info', (request, response) => {
    const numberContacts = persons.length;
    const time = new Date().toString();
    const info = `<p>Phonebook has info for ${numberContacts} people</p>
    <p>${time}</p>`;
    response.send(info);
  })
// yksittäinen henkilö
  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end() //mikäli ei löydy
    }
  })
    //poistaa henkilön
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  //generoi id
  const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    return String(id)
  }
  
  //lisää henkilön
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    //tarkistaa puuuttuuko nimi tai numero
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
      }
    
    //tarkistaa onko nimi jo yhteystiedoissa
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name already in the phonebook'
        })
    }

    //luo uuden henkilön
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    
    persons = persons.concat(person)
  
    response.json(person)
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })