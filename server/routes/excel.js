const express = require('express');
const ExcelJS = require('exceljs');
const routes = express.Router();

routes.get('/', async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile('./file.xlsx');
        const worksheet = workbook.getWorksheet(1);
        
        var data=[];
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const rowData = [];
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        rowData.push(cell.value);
    });
    data.push(rowData);
});

        res.send(data);
    } catch (error) {
        console.error('Error reading the Excel file:', error);
        res.status(500).send('Error reading the Excel file');
    }
});

module.exports = routes;
