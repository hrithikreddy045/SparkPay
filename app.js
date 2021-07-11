const express=require('express');
const app=express();

const PORT=process.env.PORT || 7000;

const mongoose=require('mongoose');
const mongodb="mongodb+srv://root:hrithiK@45@cluster0.g2yhf.mongodb.net/bank-database?retryWrites=true&w=majority";
mongoose.connect(mongodb, {useNewUrlParser : true, useUnifiedTopology : true, useFindAndModify: false}, console.log("Connected to Database!"));
const Customer = require('./models/customers');
const Transaction = require('./models/transactions');

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

app.get('/customer/:id', (req, res) => {
    const id=req.params.id;
    Customer.findById(id).then(result => {
        res.render('customer-details', { customer: result });
    });
});

app.get('/transfer/:id', (req, res) => {
    const id=req.params.id;
    Customer.findById(id).then(result => {
        res.render('transfer', { customer: result });
    });
});

app.post('/transfer/:id', (req, res) => {
    const senderID=req.params.id;
    Customer.findById(senderID).then(result => {
        const senderName=result.name;
        const senderBalance=result.balance;
        const receiverEmail=(req.body.receiver);
        const amount=(req.body.amount);
        var alert=require('alert');
        if(amount<=0)
        {
            console.log("Enter a Valid Amount!");
            res.redirect('/transfer/'+senderID);
            alert("Enter a Valid Amount!");
        }
        else if(parseInt(amount)>parseInt(senderBalance))
        {
            console.log("Insufficient Funds!\nTry Again with a lesser amount!");
            res.redirect('/transfer/'+senderID);
            alert("Insufficient Funds!\nTry Again with a lesser amount!");
        }
        else
        {
            const transaction=new Transaction({
                sender: senderName,
                receiver: receiverEmail,
                amount: parseInt(amount)
            });
            const updatedSenderBalance=senderBalance-parseInt(amount);
            
            Customer.findOne({ email: receiverEmail }, (err, data) => {
                if(data===null) {
                    console.log("Receiver does not exist!");
                    res.redirect('/transfer/'+senderID);
                } else {
                    const updatedReceiverBalance = data.balance + parseInt(amount);
                    Customer.findOneAndUpdate({ email: receiverEmail }, { balance: updatedReceiverBalance }, (err, data) => {
                        if(err) throw err;
                    });
                    Customer.findByIdAndUpdate(senderID, { balance: updatedSenderBalance }).then(() => {
                        transaction.save().then(() => {
                            res.redirect('/customers');
                        });
                    });
                }
            });
        }
    });
});

app.get('/transactions', (req, res) => {
    Transaction.find().then(result => {
        res.render('transactions', { transactions: result });
    });
});

app.listen(7000, console.log("Server running on PORT "+PORT));