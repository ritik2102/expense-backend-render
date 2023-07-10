const express=require("express");
const app=express();
const fs=require('fs');
const path=require("path");
require('dotenv').config();

const bodyParser=require("body-parser");
app.use(bodyParser.json({extended: false}));

const cors=require('cors');
app.use(cors());
const sequelize=require('./util/database');
// using helmetfor secure response headers

// flags:'a' to make sure that logs are appended and not overwritten
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

const userRoutes=require('./routes/users');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumRoutes=require('./routes/premium');
const passwordRoutes=require('./routes/password');



app.use('/users',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,`views/${req.url}`));
})

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/order');
const ForgotPasswordRequests=require('./model/forgot-password-requests');
const Downloads=require('./model/downloads');

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Downloads);
Downloads.belongsTo(User);

// {force:true}
sequelize.sync()
    .then(result=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    })
