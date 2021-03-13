const express = require('express')
const AppDAO = require('./dao')

const app = express()
const port = 3000
const databaseLocation = './database.sqlite3'

function main() {
  const dao = new AppDAO(databaseLocation)
  // the db has already been populated outside the app.

  // check database access: read, write, delete
  dao.all('SELECT * from Artist limit 5')
  .then((data) => {
    console.log(data);
  })

  dao.run('INSERT INTO Artist (Name) VALUES ("My New Band")')
  .then((data) => {
    console.log('new id is: ' + data.id);

    dao.get('SELECT * from Artist WHERE ArtistId = ?', [data.id])
    .then((data) => {
      console.log(data);
    })
  })

  dao.run('DELETE from Artist where Name = "My New Band"')
  .then((id) => {
    console.log(id);

    console.log('deleted');
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

main()
