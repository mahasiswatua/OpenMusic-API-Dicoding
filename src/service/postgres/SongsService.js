const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO
                songs(id, title, year, performer, genre, duration, album_id)
                VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let query = 'SELECT id, title, performer FROM songs';

    if (title || performer) {
      query += ' WHERE';
      if (title) {
        query += ` title iLIKE '%${title}%' `;
      }
      if (performer) {
        if (title) {
          query += 'AND ';
        }
        query += ` performer iLIKE '%${performer}%' `;
      }
    }

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, genre, performer, duration, album_id as albumId FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows[0];
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: `SELECT id, title, performer 
                   FROM songs WHERE album_id = $1`,
      values: [albumId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre =$3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
