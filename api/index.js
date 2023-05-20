const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('../google-creds.json');

const SPREADSHEET_ID = '1mVxQJ9yYF7vlfF6wDDZJRNoke1WvIqzqooxV0Rc-2ag';
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

async function getNames(tab) {
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[decodeURI(tab)];
    const rows = await sheet.getRows();

    return rows.map(row => row._rawData[0]);
}

async function getTabs() {
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    return doc.sheetsByIndex.map(sheet => sheet.title);
}

const app = express();
app.use((req, res, next) => {
    app.use(express.json());
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/names', async (req, res) => {
    const tab = req.query.tab;
    const names = await getNames(tab);
    res.json(names);
});

app.get('/tabs', async (req, res) => {
    const tabs = await getTabs();
    res.json(tabs);
});
app.post('/signOut', async (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', async () => {
        const name = data;
        const timestamp = new Date().toISOString();

        await doc.useServiceAccountAuth(credentials);
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle['Log Sheet'];
        await sheet.addRow({ Name: name, 'Sign Out': timestamp });

        res.json({ success: true });
    });
});


app.post('/signoIn', async (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', async () => {
        const name = data;
        const timestamp = new Date().toISOString();

        await doc.useServiceAccountAuth(credentials);
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle['Log Sheet'];
        const rows = await sheet.getRows();
        const row = rows.find(row => row.Name === name && !row['Sign In']);
        if (row) {
            row['Sign In'] = timestamp;
            await row.save();
        }

        res.json({ success: true });
    });
});


app.listen(3002,() => {
    console.log('API listening on port 192.168.123.312:3002');
});
