const fs = require('fs').promises;
const {nanoid} = require('nanoid');
const fileName = './db.json';
let data = [];

module.exports = {
    async init() {
        try {
            const fileContents = await fs.readFile(fileName);
            data = JSON.parse(fileContents.toString());
        } catch (e) {
            data = [];
        }
    },
    getMessages() {
        return data.slice(-30);
    },
    getMessage(datetime) {
        const message = data.find(message => message.datetime === datetime);
        if (!message) {
            return [];
        } else {
            return data.slice(data.indexOf(message) + 1);
        }
    },
    addMessage(message) {
        message.id = nanoid();
        message.datetime = new Date().toISOString();
        data.push(message);
        return this.save();
    },
    save() {
        return fs.writeFile(fileName, JSON.stringify(data, null, 2));
    }
}
