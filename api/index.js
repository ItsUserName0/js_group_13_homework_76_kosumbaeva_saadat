const express = require('express');
const messages = require('./app/messages');
const cors = require('cors');
const db = require('./fileDb');
const app = express();
const port = 8000;

app.use(cors({origin: 'http://localhost:4200'}));
app.use(express.json());
app.use('/messages', messages);

const run = async () => {
    await db.init();
    app.listen(port, () => {
        console.log(`Server started on ${port} port`);
    });
}

run().catch(e => {
    console.error(e);
});