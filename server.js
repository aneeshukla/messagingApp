let express = require('express');
require('dotenv').config();
let bodyParser = require('body-parser');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json()); // json added to let the body parser know that JSON is expected to be coming in
app.use(bodyParser.urlencoded({ extended: false }))     // whatever comes from the browser is URL encoded and will show undefined if this line is not added

mongoose.Promise = Promise;

let dbURL = process.env['DB_URL'];

let Message = mongoose.model('Message', {
    name: String,
    text: String
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, msgs) => {
        res.send(msgs);
    })
})

app.post('/message', async (req, res) => {

    try {
        let msg = new Message(req.body);

        await msg.save();

        let censored = await Message.findOne({ text: "badword" });

        if (censored) {
            console.log(censored)
            await Message.deleteOne({ _id: censored.id });
        }
        else {
            io.emit('msg', req.body);
            console.log("saved!");
        }

        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(500)
        return console.error(err)
    }

});

io.on('connection', (socket) => {
    console.log('USER connected!')
})

mongoose.connect(dbURL, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) console.log(err)
    else console.log('MongoDB connection established successfully!');
})

let server = http.listen(3000, () => {
    console.log('Messaging App listening on port ', server.address().port);
})
