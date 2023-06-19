import { athleteModel } from '../model/athletesModel.js'
import { database, inMemoryDatabase } from '../database/index.js'

export function athleteController (http) {
  if (!http) throw new Error('Http methods instance is required')

  const athlete = athleteModel(database)
  const inMemoryAthlete = athleteModel(inMemoryDatabase)

  http.get('/athletes', async (_, response) => {
    const results = await athlete.findAll()

    response.json({ results })
  })

  http.get('/test/athletes', async (_, response) => {
    const results = await inMemoryAthlete.findAll()

    response.json({ results })
  })

  http.get('/athletes/:id', async (req, res) => {
    const { id } = req.params
  
    const result = await athlete.findOne(id)
  
    res.json({ result })
  })

  http.get('/test/athletes/:id', async (req, res) => {
    const { id } = req.params
  
    const result = await inMemoryAthlete.findOne(id)
  
    res.json({ result })
  })
  
  http.post('/athletes', async (req, res) => {
    const { name, email, phone, age, gender } = req.body
  
    const result = await athlete.create({ name, email, phone, age, gender })

    res.json({ result })
  })

  http.post('/test/athletes', async (req, res) => {
    const { name, email, phone, age, gender } = req.body
  
    const result = await inMemoryAthlete.create({ name, email, phone, age, gender })

    res.json({ result })
  })
  
  http.put('/athletes/:id', async (req, res) => {
    const { name, email, phone, age, gender } = req.body
    const { id } = req.params
  
    const result = await athlete.update({id, name, email, phone, age, gender })
  
    res.json({ result })
  })

  http.put('/test/athletes/:id', async (req, res) => {
    const { name, email, phone, age, gender } = req.body
    const { id } = req.params
  
    const result = await inMemoryAthlete.update({id, name, email, phone, age, gender })
  
    res.json({ result })
  })
  
  http.delete('/athletes/:id', async (req, res) => {
    const { id } = req.params
  
    await athlete.remove(id)
  
    res.sendStatus(204)
  })

  http.delete('/test/athletes/:id', async (req, res) => {
    const { id } = req.params
  
    await inMemoryAthlete.remove(id)
  
    res.sendStatus(204)
  })
  


}