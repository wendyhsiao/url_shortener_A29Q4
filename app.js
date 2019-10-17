const express = require('express')
const app = express()
port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dns = require('dns')
// 設定express-handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 設定body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// 設定mongoDB連線
mongoose.connect('mongodb://localhost/url', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

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

function makeRandom(number) {
  const possible = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let text = ''
  for (let i = 0; i < number; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

app.post('/', (req, res) => {
  console.log('req', req.body)
  let originalUrl = req.body.url
  dns.lookup(originalUrl, (err) => {
    if (err) return res.status(404).send({ error: '地址找不到' })
  })

  Url.findOne({ url: req.body.url }, (err, url) => {
    console.log('url', url)
    if (url) { // 如有轉過回傳短網址
      res.render('index', { url: req.body.url, url_shorten: url.url_shorten })
    } else {
      function confirmCode(item) {
        let urlCode = makeRandom(item)
        Url.findOne({ url_shorten: urlCode }, (err, code) => {
          if (!code) {
            const newUrl = new Url({
              url: req.body.url,
              url_shorten: urlCode
            })
            newUrl.save()
              .then(url => {
                res.render('index', { url: req.body.url, url_shorten: urlCode })
              })
          } else {
            return confirmCode(5)
          }
        })
      }
      confirmCode(5)

    }
  })
})

app.get('/:urlCode', (req, res) => {
  Url.findOne({ url_shorten: req.params.urlCode }, (err, url) => {
    console.log('url--get', url.url)
    res.redirect(url.url)
  })
})

app.listen(port, () => {
  console.log('App is running')
})