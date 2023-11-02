const express = require('express')
const cors = require('cors') // Import the cors module
const morgan = require('morgan')
const axios = require('axios')
const apicache = require('apicache')

let cache = apicache.middleware
const app = express()
const PORT = 3000
const BASE_SETS_URL = 'https://api.pokemontcg.io/v2/sets'
const BASE_CARDS_URL = 'https://api.pokemontcg.io/v2/cards'

app.use(cors()) // Enable CORS for all routes
app.use(morgan('dev'))
app.use(cache('2y'))

app.get('/api/sets/:setId', (req, res) => {
  axios
    .get(`${BASE_SETS_URL}/${req.params.setId}`)
    .then(response => {
      return res.json(response.data) // Response data from the API
    })
    .catch(error => {
      return res.json({ error: error.message })
    })
})

app.get('/api/cards/:cardId', (req, res) => {
  axios
    .get(`${BASE_CARDS_URL}/${req.params.cardId}`)
    .then(response => {
      return res.json(response.data) // Response data from the API
    })
    .catch(error => {
      return res.json({ error: error.message })
    })
})

app.get('/api/collections/:collectionId/cards', async (req, res) => {
  const { collectionId } = req.params
  const cards = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
    params: {
      q: `id:${collectionId}-*`,
    },
  })

  return res.send(cards.data)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
