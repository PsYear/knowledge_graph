const path = require('path')
const express = require('express')
const session = require('express-session')
const routes = require('./routes')
var bodyParser = require('body-parser');
const pkg = require('./package')

const app = express()
app.set('views',path.join(__dirname,'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'));
routes(app)


app.listen(40006, function () {
    console.log(`${pkg.name}listening on port 40006`)
})