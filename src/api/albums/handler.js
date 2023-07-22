const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, songService, validator) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    return h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    }).code(201);
  }

  async getAlbumsByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);
    const songs = await this._songService.getSongsByAlbumId(id);
    return h.response({
      status: 'success',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    });
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });
  }

  async deleteAlbumsByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });
  }
}

module.exports = AlbumsHandler;
