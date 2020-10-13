import express from 'express';
import access from './data';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.write("<h1>Please wait...</h1>");
    try {
        access('nshendra001', 'c7jcbEdROB', (log: string) => res.write(log + '<br/>'))
        .then(data => {
            res.write(`<pre>${JSON.stringify(data, null, "\t")}</pre>`);
            res.end();
        });
    }
    catch(e) {
        res.write("<h2>An Error Occured...</h2>");
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});