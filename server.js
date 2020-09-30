let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json()); // json added to let the body parser know that JSON is expected to be coming in
app.use(bodyParser.urlencoded({ extended: false }))     // whatever comes from the browser is URL encoded and will show undefined if this line is not added


let msgs = [
    {
        name: 'Rosie',
        text: 'right back at ya!'
    },
    {
        name: 'Aneesh',
        text: 'Hello World!'
    }
]
app.get('/messages', (req, res)=>{
    res.send(msgs);
})

app.post('/message', (req, res)=>{
    msgs.push(req.body);
    io.emit('msg', req.body)
    res.sendStatus(200);
})

io.on('connection', (socket)=>{
    console.log('USER connected!')
})

let server = http.listen(3000, ()=>{
    console.log('Messaging App listening on port ', server.address().port);
})
