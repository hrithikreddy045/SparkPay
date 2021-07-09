const express=require('express');
const app=express();

const PORT=process.env.PORT || 7000;

const mongoose=require('mongoose');
const mongodb="mongodb+srv://root:hrithiK@45@cluster0.g2yhf.mongodb.net/bank-database?retryWrites=true&w=majority";
mongoose.connect(mongodb, {useNewUrlParser : true, useUnifiedTopology : true}, console.log("Connected to Database!"));
const Customer = require('./models/customers');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get(['/', '/home', '/index'], (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/customers', (req, res) => {
    // console.log(req.query);
    Customer.find().then(result => {
        res.render('customers', { customers: result });
    });
});

app.get('/transfer', (req, res) => {
    const id=req.query.id;
    Customer.findById(id).then(result => {
        res.render('transfer', { customer: result });
    });
});

app.post('/transfer', (req, res) => {

});

app.listen(7000, console.log("Server running on PORT "+PORT));