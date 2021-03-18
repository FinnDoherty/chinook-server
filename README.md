# Chinook-server

requires Node.js

install the node modules with npm install

## Setup the sqlite database
install sqlite3 cli tools:

`sudo apt-get install sqlite3`

create and populate the chinook database included:

`sqlite3 --batch database.sqlite3  ".read chinook-db-creation/Chinook_Sqlite.sql"`


## DB access server
to run the server `npm start`
and navigate to localhost:3000 in a browser

### Endpoints
  #### READ endpoints
  - TODO          /artists
  - TODO          /artists/:id
  - TODO          /albums
  - TODO          /albums/:id
  - TODO          /tracks
  - TODO          /tracks/:id
  - /playlists - a list of all the saved playlists, and number of tracks on each
  - /playlists/:id - playlist info, name, number of tracks, list of tracks with names, albums and artists
