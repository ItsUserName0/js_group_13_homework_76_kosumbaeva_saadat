const express = require('express');
const db = require('../fileDb');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.query['datetime']) {
        const date = new Date(req.query['datetime']);
        if (isNaN(date.getDate())) {
            return res.status(400).send({"error": "The date is incorrect"});
        } else {
            const messages = db.getMessage(date.toISOString());
            return res.send(messages);
        }
    }

    const messages = db.getMessages();
    return res.send(messages);
});
router.post('/new', async (req, res, next) => {
    try {
        const author = req.body.author;
        const message = req.body.message;
        if (!author || !message) {
            return res.status(400).send({"error": "Author and message must be present in the request"});
        } else {
            const data = {
                author: author,
                message: message
            }
            await db.addMessage(data);
            return res.send({message: "Created new message"});
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;