const express = require('express');
const XLSX = require('xlsx');

const routes = express.Router();

// Define the path to your Excel file
const excelFilePath = './test_data.xlsx';

// Define a function to extract data from a single row
function extractRowData(worksheet, rowNum) {
    const staffIdCell = worksheet[`C${rowNum}`];
    if (!staffIdCell || !staffIdCell.v) {
        return null; // Skip empty rows
    }

    const staffId = staffIdCell.v;
    const feedback = [];
    const marks = [];

    // Extract feedback and marks for each staff Id
    for (let i = 1; ; i++) {
        const feedbackCell = worksheet[`B${rowNum + i}`];
        const marksCell = worksheet[`L${rowNum + i}`];
        
        // Check if both feedback and marks cells exist
        if (feedbackCell && marksCell && feedbackCell.v !== undefined && marksCell.v !== undefined) {
            feedback.push(feedbackCell.v);
            marks.push(marksCell.v);
        } else {
            break;
        }
    }

    return {
        staffId,
        feedback,
        marks
    };
}

// Define a function to process all rows and store data
function processData(worksheet) {
    const data = [];
    let rowNum = 2; // Start from row 2 (assuming row 1 is header)
    while (true) {
        const rowData = extractRowData(worksheet, rowNum);
        if (!rowData) {
            break; // Break if no more data
        }
        data.push(rowData);
        rowNum += 8; // Move to the next staff Id
    }
    return data;
}

// Define a GET route to fetch the data from the Excel file
routes.get('/fetchData', async (req, res) => {
    try {
        // Load Excel file
        const workbook = await XLSX.readFile(excelFilePath);
        // Assuming that each sheet contains the staff Ids and feedback/marks
        // For simplicity, let's assume the sheet name is 'Sheet1'
        const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
        const worksheet = workbook.Sheets[sheetName];
        // Extract and store data
        const extractedData = processData(worksheet);
        // Send the extracted data as response
        res.json(extractedData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = routes;
