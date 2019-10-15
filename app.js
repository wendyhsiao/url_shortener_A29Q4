const express = require('express')
const app = express()
port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

// 設定express-handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定mongoDB連線
mongoose.connect('mongodb://localhost/url', { useNewUrlParser: true, useCreateIndex: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})
// 載入model
const Url = require('./models/url.js')

// 設定路由
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  console.log('App is running')
})