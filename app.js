const express = require("express");
const path = require("path");
const port = 3000;
const app = express();



const Session = require("express-session")
const SessionStore = require("connect-mongodb-session")(Session)
const flash = require('connect-flash')

const homeRouter = require('./routes/Home.route')
const productRouter = require('./routes/product.route')
const cartRouter = require('./routes/cart.router')
const authRouter = require('./routes/auth.router')
const orderRouter = require('./routes/orders.router')
const verifyOrder = require('./routes/verifyOrder.router')
const adminRouter = require('./routes/admin.router')

app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.set("view engine", "ejs");
app.set("views", "views");

const STORE = new SessionStore({
  uri: 'mongodb://localhost:27017/online-shop',
  collection: 'sessions',

})

app.use(Session({
  secret: 'this is my secret session ',
  saveUninitialized: false,
  store: STORE,
  resave: true,
  saveUninitialized: true
}))

app.use(flash())
app.use('/', homeRouter);
app.use('/', authRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter)
app.use('/verifyOrder', verifyOrder)
app.use('/admin', adminRouter)

app.get('/not-admin', (req, res, next) => {
  res.status(403)
  res.render('not-admin', {

    isUser: req.session.isAdmin,
    validationErrors: req.flash('validationErrors')[0],
    isAdmin: false,
    pageTitle: 'Not-Admin'
  })
})

app.get('/error', (req, res, next) => {
  res.status(500)
  res.render('error.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin,
    pageTitle: 'error'


  })
})

app.use((error, req, res, next) => {
  res.redirect('/error')
})


app.use((req, res, next) => {
  res.status(404)
  res.render('not-found', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin,
    pageTitle: 'page not found'

  })
})

app.listen(port, () => {
  console.log("server now listen to port 3000");
});


