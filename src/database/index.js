import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const [database, inMemoryDatabase] = await Promise.all([
  open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  }),
  open({
    filename: ':memory:',
    driver: sqlite3.Database
  })
])

export {
  database,
  inMemoryDatabase
}