
const { Router } = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const rowsToObject = (rows) => {
    const data = rows.map(row => {
        const obj = {};
        row._sheet.headerValues.forEach(header => {
            obj[header] = row[header];
        });
        return obj;
    });
    return data;
}

const createRoute = async (sheet) => {
    const doc = new GoogleSpreadsheet(sheet.sheet_id);
    await doc.useServiceAccountAuth({
        client_email: sheet.credentials.client_email,
        private_key: sheet.credentials.private_key,
    });
    await doc.loadInfo();
    const router = Router();
    router.get(sheet.endpoint, async (req, res) => {
        const rows =  await doc.sheetsByIndex[sheet.sheet_page].getRows();
        const data = rowsToObject(rows);
        res.json(data);
    });
    return router;
}

module.exports = createRoute;
