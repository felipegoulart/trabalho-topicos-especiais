import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const database = await open({
  filename: 'database.sqlite',
  driver: sqlite3.Database
})

const server = express()

server.use(cors())
server.use(express.json())

/** Athlete */

server.get('/athletes', async (req, res) => {
  const results = await database.all('SELECT * FROM athlete')

  res.json({ results })
})

server.get('/athletes/:id', async (req, res) => {
  const { id } = req.params

  const result = await database.get('SELECT * FROM athlete WHERE id = ? ', id)

  res.json({ result })
})

server.post('/athletes', async (req, res) => {
  const { name, email, phone, age, gender } = req.body
  const paramns = {
    $name: name,
    $email: email,
    $phone: phone,
    $age: age,
    $gender: gender
  }

  const result = await database.get(`
    INSERT INTO athlete 
      (
        name, 
        email, 
        phone, 
        age, 
        gender
      ) 
      VALUES (
        $name, 
        $email, 
        $phone, 
        $age, 
        $gender
      ) RETURNING *`,
    paramns
  )

  res.json({ result })
})

server.put('/athletes/:id', async (req, res) => {
  const { name, email, phone, age, gender } = req.body
  const { id } = req.params

  const paramns = {
    $id: id,
    $name: name,
    $email: email,
    $phone: phone,
    $age: age,
    $gender: gender
  }

  const result = await database.get(`
      UPDATE
        athlete
      SET
        name = $name,
        email = $email,
        phone = $phone,
        age = $age,
        gender = $gender
      WHERE
        id = $id RETURNING *
    `,
    paramns
  )

  res.json({ result })
})

server.delete('/athletes/:id', async (req, res) => {
  const { id } = req.params

  await database.run('DELETE FROM athlete WHERE id = ?', id)

  res.sendStatus(204)
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