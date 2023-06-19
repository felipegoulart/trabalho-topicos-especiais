export function athleteModel (database) {
  if (!database) throw new Error('Database is required')

  function findAll () {
    return database.all('SELECT * FROM athlete')
  }

  function findOne (id) {
    return database.get(`SELECT * FROM athlete WHERE id = ${id}`)
  }

  function create (athlete) {
    return database.get(`
      INSERT INTO athlete 
        (
          name, 
          email, 
          phone, 
          age, 
          gender
        ) 
        VALUES (
          "${athlete.name}", 
          "${athlete.email}", 
          "${athlete.phone}", 
          "${athlete.age}", 
          "${athlete.gender}"
        ) RETURNING *
    `)
  }

  function update (athlete) {
    return database.get(`
      UPDATE
        athlete
      SET
        name = "${athlete.name}",
        email = "${athlete.email}",
        phone = "${athlete.phone}",
        age = "${athlete.age}",
        gender = "${athlete.gender}"
      WHERE
        id = "${athlete.id}" RETURNING *
    `)
  }

  function remove (id) {
    return database.get(`DELETE FROM athlete WHERE id = "${id}"`)
  }
 
  return {
    findAll,
    findOne,
    create,
    update,
    remove
  }
}