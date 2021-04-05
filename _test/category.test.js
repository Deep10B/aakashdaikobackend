import Category from '../Models/Category.js';
import mongoose from 'mongoose';
const DbName = 'mongodb://localhost:27017/testMyNoteapp';

beforeAll(async () => {
    await mongoose.connect(DbName, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
})

describe('Category Test', () => {
    test('should be able to add new category', async () => {
        let cate = await Category.create({ 'category': "School" });
        expect(cate.category).toMatch("School");
    })

    test('should be able to update Category', async () => {
        let cate = await Category.findOne({
            'category': 'School'
        });
        cate.category = 'Office';

        let newCate = await cate.save();
        expect(newCate.category).toBe('Office');
    })
    test("should delete the category", async () => {
        let cate = await Category.findOneAndDelete({
            'category': 'Office'
        });
        expect(cate.category).toMatch('Office');
    })

})