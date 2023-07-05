require('dotenv').config();
const config = require('./config/config');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();



//DataBase Connection...
const dataConection =require('./config/db.config');
dataConection();

app.use(bodyparser.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));
app.use('assets', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
const router = require('./routes/user.routes');
app.use('/api/v1',router);

let server;
if (config.protocol == 'https') {
    const https = require('https')
    server = https.createServer({
        key: fs.readFileSync(config.certificate.privkey, 'utf8'),
        cert: fs.readFileSync(config.certificate.fullchain, 'utf8')
    }, app);
}
else {
    const http = require('http')
    server = http.createServer(app);
}

server.listen(config.port, () => {
    console.log(`Server Running On PORT ${config.port}`);
});