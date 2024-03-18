const express = require('express');
const XLSX = require('xlsx');
const routes = express.Router();
const {Teachers}=require('../database');
 const teacher=[];
 let data1=[];
 // fetches a whole data and stores it in a array as a json objects
 // then fetches a data in particular column 
routes.get('/', async (req, res) => {
   const workbook=await XLSX.readFile('file.xlsx');
    const sheet=workbook.SheetNames[0];
    const worksheet=workbook.Sheets[sheet];
    const data=XLSX.utils.sheet_to_json(worksheet);
    data1=[...data];
    console.log(data);
    
const colname='A';
for(let i=2; ;i++){
    const celladdress=`${colname}${i}`;
    const cell=worksheet[celladdress];
    //console.log(cell);
    if(!cell||!cell.v)break;
    teacher.push(cell.v);
}
console.log(teacher);
});
// it generally uploads the data into a database
routes.get('/upload',async (req,res)=>{
 for(const staff of data1){
    const teacher=await new Teachers({
        staffId:staff['STAFF ID'],
        staffname:staff['STAFF NAME']
    })
    const res=await teacher.save();
 }

});
module.exports = routes;