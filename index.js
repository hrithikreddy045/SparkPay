const express=require('express');
const app=express();

const PORT=process.env.PORT || 7000;

const mongoose=require('mongoose');
const mongodb="mongodb+srv://root:hrithiK@45@cluster0.g2yhf.mongodb.net/bank-database?retryWrites=true&w=majority";
mongoose.connect(mongodb, {useNewUrlParser : true, useUnifiedTopology : true, useFindAndModify: false}, console.log("Connected to Database!"));
const Customer = require('./models/customers');
const Transaction = require('./models/transactions');

const flash = require('connect-flash');
app.use(flash());

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
    Customer.find().then(result => {
        res.render('transfer', { customers: result, id: id });
    });
    // Customer.findById(id).then(result => {
    //     res.render('transfer', { customer: result });
    // });
});

// app.post('/transfer/:id', (req, res) => {
//     let errors=[];
//     const senderID=req.params.id;
//     Customer.findById(senderID).then(result => {
//         const senderName=result.name;
//         const senderBalance=result.balance;
//         const receiverName=(req.body.receiver);
//         const amount=(req.body.amount);
//         if(amount<=0)
//         {
//             errors.push({ msg: "Enter a Valid Amount!" });
//             console.log("Enter a Valid Amount!");
//             Customer.find().then(result => {
//                 res.render('transfer', { customers: result, id: senderID, errors: errors });
//             });
//         }
//         else if(parseInt(amount)>parseInt(senderBalance))
//         {
//             errors.push({ msg: "Insufficient Funds!\nTry Again with a lesser amount!" });
//             console.log("Insufficient Funds!\nTry Again with a lesser amount!");
//             Customer.find().then(result => {
//                 res.render('transfer', { customers: result, id: senderID, errors: errors });
//             });
//         }
//         else
//         {
//             const transaction=new Transaction({
//                 sender: senderName,
//                 receiver: receiverName,
//                 amount: parseInt(amount)
//             });
//             const updatedSenderBalance=senderBalance-parseInt(amount);
            
//             Customer.findOne({ name: receiverName }, (err, data) => {
// 	            if(data===null) {
//                     errors.push({ msg: "Receiver does not exist!" });
//                     console.log("Receiver does not exist!");
//                     Customer.find().then(result => {
//                         res.render('transfer', { customers: result, id: senderID, errors: errors });
//                     });
//                 } else {
//                     const updatedReceiverBalance = data.balance + parseInt(amount);
//                     Customer.findOneAndUpdate({ name: receiverName }, { balance: updatedReceiverBalance }, (err, data) => {
//                         if(err) throw err;
//                     });
//                     Customer.findByIdAndUpdate(senderID, { balance: updatedSenderBalance }).then(() => {
//                         transaction.save().then(() => {
//                             console.log("Transaction Successful!");
//                             res.redirect('/customers');
//                         });
//                     });
// 	            }
//             });
//         }
//     });
// });

app.post('/transfer/:id', (req, res) => {
    const senderID=req.params.id;
    const receiverName=req.body.receiver;
    const amount=req.body.amount;
    let errors=[];
    if(receiverName==null)
    {
        errors.push({ msg: "Receiver does not exist!" });
        console.log("Receiver does not exist!");
        Customer.find().then(result => {
            res.render('transfer', { customers: result, id: senderID, errors });
        });
    }
    else if(amount<=0)
    {
        errors.push({ msg: "Enter a Valid Amount!" });
        console.log("Enter a Valid Amount!");
        Customer.find().then(result => {
            res.render('transfer', { customers: result, id: senderID, errors });
        });
    }
    else
    {
        Customer.findById(senderID).then(sender => {
            if(amount>sender.balance)
            {
                errors.push({ msg: "Insufficient Funds!\nTry Again with a lesser amount!" });
                console.log("Insufficient Funds!\nTry Again with a lesser amount!");
                Customer.find().then(result => {
                    res.render('transfer', { customers: result, id: senderID, errors });
                });
            }
            else
            {
                Customer.find((err, data) => {
                    for(var i=0;i<data.length;i++)
                    {
                        if(data[i]._id==senderID)
                        {
                            Customer.findOneAndUpdate({ _id: senderID }, { balance: data[i].balance-parseInt(amount) }, (err, data) => {
                                if(err) console.log(err);
                            });
                        }
                        if(data[i].name==receiverName)
                        {
                            Customer.findOneAndUpdate({ name: receiverName }, { balance: data[i].balance+parseInt(amount) }, (err, data) => {
                                if(err) console.log(err);
                            });
                        }
                    }
                });
                Customer.findById(senderID).then(sender => {
                    const senderName=sender.name;
                    const transaction=new Transaction({
                        sender: senderName,
                        receiver: receiverName,
                        amount: amount
                    });
                    transaction.save();
                });
                res.redirect('/customers');
            }
        });
    }
});

app.get('/transactions', (req, res) => {
    Transaction.find().then(result => {
        res.render('transactions', { transactions: result });
    });
});

app.listen(PORT, console.log("Server running on PORT "+PORT));