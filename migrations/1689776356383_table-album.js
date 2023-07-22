/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('albums', {
        id: {
            type: 'varchar(50)',
            primaryKey: true
        },
        name: {
            type: 'varchar(255)',
            notNull: true
        },
        year: {
            type: 'integer',
            notNull: true
        },
    });

    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'varchar(50)',
            notNull: true
        },
        year: {
            type: 'int',
            notNull: true
        },
        performer: {
            type: 'varchar(50)',
            notNull: true
        },
        genre: {
            type: 'varchar(50)',
            notNull: true
        },
        duration: {
            type: 'int',
            notNull: false,
            default: null
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: false,
            references: '"albums"',
            onDelete: 'cascade',
            default: null
        },
    })

    pgm.createIndex('songs', 'album_id')
};

exports.down = pgm => {
    pgm.dropTable('albums');
    pgm.dropTable('songs');
};
