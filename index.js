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
    dao.all(`
      SELECT art.ArtistId, art.Name as 'Artist', COUNT(alb.AlbumId) as 'NumberOfAlbums'
      FROM Artist art
      LEFT JOIN Album alb ON alb.ArtistId = art.ArtistId
      GROUP BY art.ArtistId;
    `)
    .then((data) => {
      res.send(data);
    })
  })

  app.get('/artists/:id', (req, res) => {
    const { id } = req.params;
    dao.all(`
      SELECT art.Name as 'Artist', alb.AlbumId, alb.Title as 'AlbumName',
          COUNT(t.TrackId) as 'NumberOfTracks',
          COUNT(alb.AlbumId) OVER (PARTITION BY art.ArtistId) AS NumberOfAlbums
      FROM Artist art
      LEFT JOIN Album alb ON alb.ArtistId = art.ArtistId
      LEFT JOIN Track t ON t.AlbumId = alb.AlbumId
      WHERE art.ArtistId = ${id}
      GROUP BY alb.AlbumId;
    `)
    .then((data) => {
      var artistName = data[0].Artist;
      var numberOfAlbums = data[0].NumberOfAlbums;
      var albums = numberOfAlbums > 0 ? data : [];

      res.send({
        artistName: artistName,
        numberOfAlbums: numberOfAlbums,
        albums: albums
      });
    })
  })

  app.get('/albums', (req, res) => {
    dao.all(`
      SELECT alb.AlbumId, alb.Title, alb.ArtistId, art.Name as 'Artist', COUNT(t.TrackId) as 'NumberOfTracks'
      FROM Album alb
      LEFT JOIN Artist art ON art.ArtistId = alb.ArtistId
      LEFT JOIN Track t ON t.AlbumId = alb.AlbumId
      GROUP BY t.AlbumId;
    `)
    .then((data) => {
      res.send(data);
    })
  })

  app.get('/albums/:id', (req, res) => {
    const { id } = req.params;
    dao.all(`
      SELECT alb.Title, alb.ArtistId, art.Name as 'Artist', t.TrackId, t.Name as 'Track',
          COUNT(t.TrackId) OVER (PARTITION BY t.AlbumId) AS NumberOfTracks
      FROM Album alb
      LEFT JOIN Artist art ON art.ArtistId = alb.ArtistId
      LEFT JOIN Track t ON t.AlbumId = alb.AlbumId
      WHERE alb.AlbumId = ${id};
    `)
    .then((data) => {
      var albumName = data[0].Title;
      var artistName = data[0].Artist;
      var numberOfTracks = data[0].NumberOfTracks;
      var tracks = numberOfTracks > 0 ? data : [];

      res.send({
        albumName: albumName,
        artistName: artistName,
        numberOfTracks: numberOfTracks,
        tracks: tracks
      });
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
    dao.all(`
      SELECT
          t.TrackId,
          t.Name as 'Track',
          t.AlbumId,
          alb.Title as 'Album',
          alb.ArtistId,
          art.Name as 'Artist',
          substr(datetime(t.Milliseconds/1000,'unixepoch'),-8) as 'Duration'
      FROM Track t
      LEFT JOIN Album alb ON alb.AlbumId = t.AlbumId
      LEFT JOIN Artist art ON art.ArtistId = alb.ArtistId;
    `)
    .then((data) => {
      res.send(data);
    })
  })

  app.get('/tracks/:id', (req, res) => {
    const { id } = req.params;
    dao.all(`
      SELECT
          t.TrackId,
          t.Name as 'Track',
          t.AlbumId,
          alb.Title as 'Album',
          alb.ArtistId,
          art.Name as 'Artist',
          substr(datetime(t.Milliseconds/1000,'unixepoch'),-8) as 'Duration',
          json_group_object(p.PlaylistId, p.Name) as 'Playlists'
      FROM Track t
      LEFT JOIN Album alb ON alb.AlbumId = t.AlbumId
      LEFT JOIN Artist art ON art.ArtistId = alb.ArtistId
      LEFT JOIN PlaylistTrack pt ON pt.TrackId = t.TrackId
      LEFT JOIN Playlist p ON p.PlaylistId = pt.PlaylistId
      WHERE t.TrackId = ${id};
    `)
    .then((data) => {
      res.send(data);
    })
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

main()
