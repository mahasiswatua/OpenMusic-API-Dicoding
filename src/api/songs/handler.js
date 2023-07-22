const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    }).code(201);
  }

  async getSongsHandler(request, h) {
    const { title } = request.query;
    const { performer } = request.query;
    const songs = await this._service.getSongs(title, performer);
    return h.response({
      status: 'success',
      data: {
        songs,
      },
    });
  }

  async getSongsByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return h.response({
      status: 'success',
      data: {
        song,
      },
    });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    });
  }

  async deleteSongsByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
  }
}

module.exports = SongsHandler;
