import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const database =  open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  })

const inMemoryDatabase =  open({
    filename: ':memory:',
    driver: sqlite3.Database
  })

export {
  database,
  inMemoryDatabase
}