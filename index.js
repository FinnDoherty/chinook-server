const express = require('express')
const AppDAO = require('./dao')

const app = express()
const port = 3000
const databaseLocation = './database.sqlite3'

function main() {
  const dao = new AppDAO(databaseLocation)

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.get('/artists', (req, res) => {
    dao.all('SELECT * from Artist')
    .then((data) => {
      res.send(data);
    })
  })

  app.get('/artists/:id', (req, res) => {
    const { id } = req.params;
    dao.all(`SELECT * from Artist WHERE ArtistId = ${id}`)
    .then((data) => {
      res.send(data);
    })
  })

  app.get('/albums', (req, res) => {
    dao.all('SELECT * from Album')
    .then((data) => {
      res.send(data);
    })
  })

  app.get('/albums/:id', (req, res) => {
    const { id } = req.params;
    dao.all(`SELECT * from Album WHERE AlbumId = ${id}`)
    .then((data) => {
      res.send(data);
    })
  })


  app.get('/playlists', (req, res) => {
    dao.all(`
      SELECT p.PlaylistId, p.Name, COUNT(pt.TrackId) as 'NumberOfTracks'
      FROM Playlist p
      LEFT JOIN PlaylistTrack pt ON p.PlaylistId = pt.PlaylistId
      GROUP BY p.PlaylistId;
    `)
    .then((data) => {
      res.send(data);
    })
  })

  app.get('/playlists/:id', (req, res) => {
    const { id } = req.params;
    dao.all(`
      SELECT p.Name, pt.TrackId, t.Name as 'Track', alb.Title as 'Album', art.Name as 'Artist',
          COUNT(pt.TrackId) OVER (PARTITION BY pt.PlaylistId) AS 'NumberOfTracks'
      FROM Playlist p
      LEFT JOIN PlaylistTrack pt ON p.PlaylistId = pt.PlaylistId
      LEFT JOIN Track t ON pt.TrackId = t.TrackId
      LEFT JOIN Album alb ON alb.AlbumId = t.AlbumId
      LEFT JOIN Artist art ON art.ArtistId = alb.ArtistId
      WHERE p.PlaylistId = ${id};`
    )
    .then((data) => {
      var playlistName = data[0].Name;
      var numberOfTracks = data[0].NumberOfTracks;
      var tracks = numberOfTracks > 0 ? data : [];

      res.send({
        playlistName: playlistName,
        numberOfTracks: numberOfTracks,
        tracks: tracks
      });
    })
  })

  app.get('/tracks', (req, res) => {
    dao.all('SELECT * from Track')
    .then((data) => {
      res.send(data);
    })
  })

  app.get('/tracks/:id', (req, res) => {
    const { id } = req.params;
    dao.all(`SELECT * from Track WHERE TrackId = ${id}`)
    .then((data) => {
      res.send(data);
    })
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

main()
