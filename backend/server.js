const express = require('express')
const cors = require('cors') // Import the cors module
const morgan = require('morgan')
const axios = require('axios')


const PORT = 3000
const BASE_SETS_URL = 'https://api.pokemontcg.io/v2/sets'
const BASE_CARDS_URL = 'https://api.pokemontcg.io/v2/cards'

// boosters
const boosterData = [
  {
      "id": 1,
      "name": "Silver",
      "cards": ["xy9-2", "yx9-11", "yx1-1"],
      "cardCount": 3
  },
  {
      "id": 2,
      "name": "Gold",
      "cards": ["xy5-2", "yx5-11", "yx5-1"],
      "cardCount": 3
  },
  {
      "id": 3,
      "name": "Platinium",
      "cards": ["xy3-2", "yx4-11", "yx3-1"],
      "cardCount": 3
  }
]

// manual cache
const sets = {}
const cardsForSets = {}
const cards = {}

const app = express()
app.use(cors()) // Enable CORS for all routes
app.use(morgan('dev'))

app.get('/api/sets/:setId', (req, res) => {
  const setId = req.params.setId
  const set = sets[req.params.setId]
  if (set) {
    return res.json(set)
  }
  axios
    .get(`${BASE_SETS_URL}/${req.params.setId}`)
    .then(response => {
      sets[setId] = response.data
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
  try {
    const { collectionId } = req.params
    const cardsInCache = cardsForSets[collectionId]
    if (cardsInCache) {
      return res.json(cardsInCache)
    }
    const cards = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
      params: {
        q: `id:${collectionId}-*`,
      },
    })

    cardsForSets[collectionId] = cards.data

    return res.send(cards.data)
  } catch (err) {
    return res.json({ error: err.message })
  }
})

app.get("/api/boosters/", (req, res) => {
  return res.json(boosterData);
})

app.get("/api/boosters/:boosterId", (req, res) => {
  return res.json(boosterData[req.params.boosterId]);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
