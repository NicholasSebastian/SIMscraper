import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import access from './data';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors())

app.post('/api/data', (req, res) => {
    const { username, password } = req.body;
    try {
        access(username, password)
        .then(data => res.json(data));
    }
    catch(ex) {
        res.status(401).json({ message: ex });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});