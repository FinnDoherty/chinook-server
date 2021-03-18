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
  - /artists - a list of all the available Artists and the number of Albums they have
  - /artists/:id - artist info including a list of albums and the number of tracks on each one
  - /albums - a list of all the available Albums, their Artist and number of tracks on each
  - /albums/:id - album info including details of artist and a list of tracks
  - TODO          /tracks
  - TODO          /tracks/:id
  - /playlists - a list of all the saved playlists, and number of tracks on each
  - /playlists/:id - playlist info, name, number of tracks, list of tracks with names, albums and artists
