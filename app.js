const express = require('express')
const app = express()
port = 3000

app.get('/', (req, res) => {
  res.send('首頁')
})

app.post('/', (req, res) => {
  res.send('送出短網址')
})

app.listen(port, () => {
  console.log('App is running')
})