const { Pool } = require("pg");

class PlaylistsServices {
  constructor() {
    this._pool = new Pool();
  }

  async findById(playlistId) {
    const query = {
      text: ` SELECT 
                playlists.id as playlist_id,
                playlists.name as playlist_name, 
                songs.id as song_id,
                songs.title as song_title,
                songs.performer as song_performer
              FROM playlists 
                LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
                LEFT JOIN songs ON songs.id = playlist_songs.song_id
              WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    const playlist = {
      id: "",
      name: "",
      songs: [],
    };

    rows.forEach((row, index) => {
      if (index === 0) {
        playlist.id = row.playlist_id;
        playlist.name = row.playlist_name;
      }

      if (row.song_id) {
        playlist.songs.push({
          id: row.song_id,
          title: row.song_title,
          performer: row.song_performer,
        });
      }
    });

    return playlist;
  }
}

module.exports = PlaylistsServices;
