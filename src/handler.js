const {nanoid} = require('nanoid');
//const { reset } = require('nodemon');
const notes = require('./notes');

//** POST NOTES - CREATE*/
const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};


//** GET ALL NOTES */
const getAllNotesHandler = () =>({
    status: 'success',
    data: {
        notes,
    },
});


//** GET NOTES BY ID */
const getNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined){
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
}


//** PUT NOTES BY ID - EDIT */
const editNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const {title, tags, body} = request.payload;

    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal update catatan, ID gaada',
    });
    response.code(404);
    return response;
}

//** DELETE NOTES BY ID */
const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1){
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus, id ganemu',
    });
    response.code(404);
    return response;
}

module.exports = {
    addNoteHandler,
    getAllNotesHandler, getNoteByIdHandler, 
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};