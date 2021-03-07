
const express = require('express');
const SheetRoute = require('./SheetRoute');
const sheets = require('./sheets.json');

const API_BASE = '/api';

const app = express();
const port = process.env.PORT || 5000;

if (process.env.AUTHORIZATION_HEADER) {
    app.use((req, res, next) => {
        if (req.headers.authorization === process.env.AUTHORIZATION_HEADER) {
            next();
        } else {
            next('Couldn\'t authenticate');
        }
    });
}

sheets.forEach(async sheet => app.use(API_BASE, await SheetRoute(sheet)));

app.listen(port, () => {
    console.log('---------');
    console.log(`SheetsAPI listening on ${port}`);
    console.log('---------');
    sheets.forEach(sheet => console.log(` - ${API_BASE}${sheet.endpoint}`));
});