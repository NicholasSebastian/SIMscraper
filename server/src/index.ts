import express from 'express';
import access from './data';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.write("<h1>Please wait...</h1>");
    access('', '', (log: string) => res.write(log + '<br/>'))
    .then(data => {
        res.write(data);
        res.end();
    });
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});