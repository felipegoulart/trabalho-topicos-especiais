import express from 'express'
import cors from 'cors'
import { database } from './database/index.js'
import { athleteController } from './controller/athletesController.js'

const server = express()

server.use(cors())
server.use(express.json())

athleteController(server)

server.get('/clear-database', async (req, res) => {
  await Promisse.all([
    database.exec(`
      DELETE FROM athlete;
    `),
    database.exec(`
      DELETE FROM training;
    `),
    database.exec(`
      DELETE FROM exercise;
    `),
    database.exec(`
      DELETE FROM training_exercise;
    `)
  ])

  res.send('cleared')
})

server.get('/migrate', async (req, res) => {
  const { migrated } = await database.get('SELECT * FROM migration')

  if (migrated) return res.send("It was migrated")

  await database.run(`
    CREATE TABLE IF NOT EXISTS migration (
      migrated BOOLEAN
    );

    CREATE TABLE IF NOT EXISTS athlete (
      id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      age INTEGER,
      gender TEXT
    );
    
    CREATE TABLE IF NOT EXISTS training (
      id INTEGER PRIMARY KEY,
      name TEXT,
      athlete_id INTEGER,
      observation TEXT,
      FOREIGN KEY (athlete_id) REFERENCES athlete (id)
    );
    
    CREATE TABLE IF NOT EXISTS exercise (
      id INTEGER PRIMARY KEY,
      name TEXT,
      observation TEXT,
      video TEXT
    );
    
    CREATE TABLE IF NOT EXISTS training_exercise (
      id INTEGER PRIMARY KEY,
      training_id INTEGER,
      exercise_id INTEGER,
      num_sets INTEGER,
      num_reps INTEGER,
      rest_time INTEGER,
      FOREIGN KEY (training_id) REFERENCES training (id),
      FOREIGN KEY (exercise_id) REFERENCES exercise (id)
    )
  `),

  database.run(`INSERT INTO migration VALUES (true)`)

  res.send('Migrated')
})

/** Training */

server.get('/trainings', async (req, res) => {
  const results = await database.all(`
  SELECT
    t.id,
    t.name,
    t.observation,
    a.name AS athlete_name
  FROM
    training t
    JOIN athlete a ON t.athlete_id = a.id
  `)

  res.json({ results })
})

server.get('/trainings/:id', async (req, res) => {
  const { id } = req.params

  const training = await database.get(`
      SELECT 
        t.id, t.name AS name, 
        t.observation, 
        a.name AS athlete_name,
        a.id AS athlete_id
      FROM training t
      JOIN athlete a ON t.athlete_id = a.id
      WHERE t.id = ${id}
    `
  )

  const exercises = await database.all(`
    SELECT
      te.id,
      e.id AS exercise_id,
      e.name,
      e.observation,
      e.video,
      te.num_sets,
      te.num_reps,
      te.rest_time
    FROM
      training_exercise te
      JOIN exercise e ON e.id = te.exercise_id
    WHERE
      training_id = ${training.id}
  `)

  const result = {
    ...training,
    exercises
  }

  res.json({ result })
})

server.post('/trainings', async (req, res) => {
  const { name, observation, athlete_id, exercises } = req.body

  const trainingResult = await database.get(`
    INSERT INTO 
      training ( name, observation, athlete_id )
    VALUES 
      ( '${name}', '${observation}', '${athlete_id}' ) RETURNING *
  `)

  const exerciceResults = []

  for await (const exercise of exercises) {
    const {
      exercise_id,
      num_sets,
      num_reps,
      rest_time,
    } = exercise

    const trainingExerciceResult = await database.get(`
      INSERT INTO training_exercise 
        ( training_id, exercise_id, num_sets,num_reps, rest_time ) 
      VALUES
        ( ${trainingResult.id}, ${exercise_id}, ${num_sets}, ${num_reps}, ${rest_time} ) RETURNING *
    `)

    exerciceResults.push(trainingExerciceResult)
  }

  const result = {
    ...trainingResult,
    exercises: exerciceResults
  }

  res.json({ result })
})

server.put('/trainings/:id', async (req, res) => {
  const { id } = req.params
  const { name, observation, athlete_id, exercises } = req.body

  const trainingResult = await database.get(`
      UPDATE 
        training
      SET 
        name = '${name}',
        observation = '${observation}',
        athlete_id = ${athlete_id}
      WHERE id = ${id}
      RETURNING *
    `)

  const exerciceResults = []

  for await (const exercise of exercises) {
    const {
      id,
      exercise_id,
      num_sets,
      num_reps,
      rest_time,
      destroyed
    } = exercise

    if (destroyed) {
      await database.run(`DELETE FROM training_exercise WHERE id = ${id}`)

      continue
    }

    if (!id) {
      const trainingExerciceResult = await database.get(`
        INSERT INTO training_exercise 
          ( training_id, exercise_id, num_sets, num_reps, rest_time ) 
        VALUES
          ( ${trainingResult.id}, ${exercise_id}, ${num_sets}, ${num_reps}, ${rest_time} ) RETURNING *
      `)
      
      exerciceResults.push(trainingExerciceResult)

      continue
    }

    const trainingExerciceResult = await database.get(`
      UPDATE
        training_exercise 
      SET
        training_id = ${trainingResult.id}, 
        exercise_id = ${exercise_id}, 
        num_sets = ${num_sets},
        num_reps = ${num_reps},
        rest_time = ${rest_time}
      WHERE id = ${id}
      RETURNING *`
    )

    exerciceResults.push(trainingExerciceResult)
  }

  const result = {
    ...trainingResult,
    exercises: exerciceResults
  }

  res.json({ result })
})

/** Exercises */

server.get('/exercises', async (req, res) => {
  const results = await database.all('SELECT * FROM exercise')

  res.json({ results })
})

server.post('/exercises', async (req, res) => {
  const { name, observation, video } = req.body

  const result = await database.get(`
    INSERT INTO exercise 
      (
        name, 
        observation, 
        video
      )
      VALUES (
        '${name}',
        '${observation}',
        '${video}'
      )
      RETURNING *`
  )

  res.status(201).json({ result })
})

server.get('/exercises/:id', async (req, res) => {
  const { id } = req.params

  const result = await database.get(`SELECT * FROM exercise WHERE id = ${id}`)

  res.json({ result })
})

server.put('/exercises/:id', async (req, res) => {
  const { name, observation, video } = req.body
  const { id } = req.params

  const result = await database.get(`
    UPDATE exercise 
      SET 
        name = '${name}', 
        observation = '${observation}', 
        video = '${video}'
      WHERE id = ${id}
      RETURNING *`
  )

  res.json({ result })
})

server.delete('/exercises/:id', async (req, res) => {
  const { id } = req.params

  await database.run(`DELETE FROM exercise WHERE id = ${id}`)

  res.sendStatus(204)
})

server.listen(3000, () => console.log('Running on the port 3000'))