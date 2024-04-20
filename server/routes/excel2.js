const express = require('express');
const route = express.Router();
const XLSX = require('xlsx');

route.get('/', async (req, res) => {
    const workbook = await XLSX.readFile('test_data.xlsx');
    const sheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheet];
    const colname = 'B';
    const colname1 = 'L';
    const colname2 = 'E';
    
    const teacherMap = new Map();
var rowNum=2;
    // Start from row 9, assuming data starts from row 9
    for(let i=2; ;i++){
    while (true) {
        const cellAddress = `${colname}${rowNum}`;
        const cellAddress2 = `${colname1}${rowNum}`;
        const cellAddress3 = `${colname2}${i}`;
        
        const cell = worksheet[cellAddress];
        const cell2 = worksheet[cellAddress2];
        const cell3 = worksheet[cellAddress3];
        
        if (!cell || !cell.v || !cell2 || !cell2.v)
            break;

        const teacherName = cell3&&cell3.v;
        const avg = cell2&&cell2.v;

        // Check if teacher already exists in the map
        if (!teacherMap.has(teacherName)) {
            // If teacher doesn't exist, create a new array for feedbacks
            teacherMap.set(teacherName, []);
        }

        // Add feedback to the teacher's feedback array
        const feedback = cell&&cell.v;
        teacherMap.get(teacherName).push({ feedback, avg });

        rowNum=rowNum+1;
    }
}
    console.log(teacherMap);
    res.send({ teacherMap });
});

module.exports = route;
