const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const port = 5040;

app.get('/', (req, res) => {
    res.send('server run successfully');
})

app.listen(port, () => {
    console.log('server running on port ' + port);
});