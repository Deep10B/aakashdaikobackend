
import mongoose from 'mongoose';
import Note from '../Models/Note.js';
const DbName = 'mongodb://localhost:27017/testMyNoteapp';

beforeAll(async () => {
    await mongoose.connect(DbName, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
})

describe('Note Test', () => {
    test('should be able to add new note', async () => {
        let note = await Note.create({
            'title': "Note1", 'body': "This is test note 1 body.",
            
        });
        expect(note.title).toMatch("Note1");
    })

    test('should be able to update Note', async () => {
        let note = await Note.findOne({
            'title': 'Note1'
        });
        note.title = 'Update note 1';

        let newNote = await note.save();
        expect(newNote.title).toBe('Update note 1');
    })
    test("should delete the note", async () => {
        let note = await Note.findOneAndDelete({
            'title': 'Update note 1'
        });
        expect(note.title).toMatch('Update note 1');
    })

})