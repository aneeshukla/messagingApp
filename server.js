let express = require('express');
let app = express();

app.use(express.static(__dirname));

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

let server = app.listen(3000, ()=>{
    console.log('Messaging App listening on port ', server.address().port);
})
