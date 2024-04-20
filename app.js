const express=require('express');
const app=express();
app.use(express.static('./public'));
// const expresslayouts=require('express-ejs-layouts');
// app.use(expresslayouts);
const ejs=require('ejs');
app.set('view engine','ejs');
app.use('/',require('./server/routes/main'));
app.use('/sheet',require('./server/routes/excel'));
app.use('/sheet2',require('./server/routes/excel2'));
app.use('/sheet3',require('./server/routes/sheet'));
app.listen(5000,()=>{console.log(`listening to https://localhost:${5000}`)});
 