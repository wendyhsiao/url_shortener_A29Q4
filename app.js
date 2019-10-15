const express = require('express')
const app = express()
port = 3000
const exphbs = require('express-handlebars')

// 設定express-handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

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