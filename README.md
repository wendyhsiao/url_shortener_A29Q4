# 短網址生產器
- 產生五位數(數字0-9、英文大小寫)的短網址

## 環境建置與需求

---

- Node.js v10.15.3
- MongoDB

#### npm 套件

- body-parser: ^1.19.0
- connect-flash: ^0.1.1
- dns: ^0.2.2
- express: ^4.17.1
- express-handlebars: ^3.1.0
- mongoose: ^5.7.5
- url-parse: ^1.4.7


## 安裝與執行步驟

---

#### 安裝方法 1

在終端機(Terminal)輸入

```
git clone https://github.com/wendyhsiao/url_shortener_A29Q4.git
```

如果在終端機訊息中看見「done」，就表示成功了！

#### 安裝方法 2

先點選 "Clone or download / Download ZIP" 把檔案下載下來，解壓縮。

#### 執行步驟

1.在終端機(Terminal)切換到 url_shortener_A29Q4 目錄下

```
cd url_shortener_A29Q4
```

2.安裝套件

```
npm install
```

3.使用 nodemon 啟動伺服器

```
npm run dev
```

5.在瀏覽器輸入網址 `localhost:3000`即可看到內容

## 專案畫面

---

![image](https://github.com/wendyhsiao/url_shortener_A29Q4/blob/master/public/img/index.PNG)