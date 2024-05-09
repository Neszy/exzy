const { connectMongoDB, closeMongoDB } = require("../../configs/database/mongodb");
const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');
const excel = require('exceljs');
const { Parser } = require('json2csv');


const createdTable = async (req, res) => {
    try {
        const { name_collection,name_database } = req.body;
        if (!name_collection) {
            return res.status(400).json({ error: 'Missing name_collection in request body' });
        }
        const client = await connectMongoDB(); 
        await client.db(name_collection);
        await client.db(name_collection).createCollection(name_database);

        return res.status(201).json({
            "request_id": '',
            "code": 200,
            "message": "OK: The request was successful.",
            "data": ''
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error creating' });
    }
};
const addDataFormXlsx = async (req, res) => {
    try {
        const { name_database} = req.body;
        const workSheetsFromFile = xlsx.parse(__dirname + '/excel-file/groupuser.xlsx'); // parses a file
        const jsonData = workSheetsFromFile[0].data; 

        const formattedData = jsonData.slice(1).map(row => ({
            sequence: row[0],
            groupCode: row[1],
            groupName: row[2]
        }));
        
        const mongo = await connectMongoDB()
        const db = mongo.db(name_database);

        const collection = db.collection(name_database); 
        const result = await collection.insertMany(formattedData);


        return res.status(201).json({
            "request_id": '',
            "code": 200,
            "message": "OK: The request was successful.",
            "data": result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error creating' });
    }
};
const getDataMongoAggregation = async (req, res) => {
    const { name_database} = req.body;
    const mongo = await connectMongoDB()
    const db = mongo.db(name_database);
    const collection = db.collection(name_database);
    try {

        const pipeline = [{ $match: {} }];
        const result = await collection.aggregate(pipeline).toArray();

        return res.status(201).json({
            "request_id": '',
            "code": 200,
            "message": "OK: The request was successful.",
            "data": result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error creating' });
    }
};

const getDataMongoAggregationAndExport = async (req, res) => {
    const { name_database, typeExport,file_name } = req.body;
    const mongo = await connectMongoDB();
    const db = mongo.db(name_database);
    const collection = db.collection(name_database);
    try {
        const pipeline = [{ $match: {} }];
        const result = await collection.aggregate(pipeline).toArray();

        if (typeExport.toUpperCase() == 'CSV') {
            const fields = Object.keys(result[0]);
            const json2csvParser = new Parser({ fields });
            const csvData = json2csvParser.parse(result);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${file_name}.csv"`);

            res.status(200).send(csvData);

            const filePath = path.join(__dirname, 'output', `${file_name}.csv`);
            fs.writeFileSync(filePath, csvData);
            console.log('CSV file saved at:', filePath);
        } else if (typeExport.toUpperCase() == 'XLSX') {
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.columns = Object.keys(result[0]).map(key => ({ header: key, key }));

            result.forEach(row => {
                worksheet.addRow(row);
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${file_name}.csv"`);

            res.status(200).send(await workbook.xlsx.writeBuffer());

            const xlsxFilePath = path.join(__dirname, 'output', `${file_name}.xlsx`);
            await workbook.xlsx.writeFile(xlsxFilePath);
            console.log('XLSX file saved at:', xlsxFilePath);
        } else {
            return res.status(400).json({ error: 'Invalid typeExport value. Use "csv" or "xlsx".' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error exporting data' });
    }
};









module.exports = {createdTable,addDataFormXlsx,getDataMongoAggregation,getDataMongoAggregationAndExport};