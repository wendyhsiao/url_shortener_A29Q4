const express = require('express')
const app = express()
port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dns = require('dns')
const flash = require('connect-flash')

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
// 設定connect-flash
app.use(flash())

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
  const regex = /^https?:\/\//
  const originalUrl = req.body.url
  const httpsUrl = (regex.test(originalUrl)) ? originalUrl : `https://${originalUrl}` //確認是否有加https或http
  const githubURL = new URL(httpsUrl) //為了解析網址而帶入URL建構式

  dns.lookup(githubURL.hostname, (err, address) => { //確認網址是否有效
    if (err) {
      return res.status(404).render('index', { url: originalUrl, alert: '操作失敗，請確認是否為有效網址' })
    } else {
      Url.findOne({ url: httpsUrl }, (err, url) => {
        if (url) {  // 如已轉過短網址就回傳原本的資料
          res.render('index', { url: req.body.url, url_shorten: url.url_shorten })
        } else {
          function confirmCode(item) {
            let urlCode = makeRandom(item)
            Url.findOne({ url_shorten: urlCode }, (err, code) => {
              if (!code) {
                const newUrl = new Url({
                  url: httpsUrl,
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
    }
  })
})

app.get('/:urlCode', (req, res) => {
  Url.findOne({ url_shorten: req.params.urlCode }, (err, url) => {
    res.redirect(url.url)
  })
})

app.listen(port, () => {
  console.log('App is running')
})