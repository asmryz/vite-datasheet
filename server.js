import express from 'express';
import indexRouter from './routes/index.js';
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3500

app.use(cors());
app.use(express.json());
app.use('/api', indexRouter);

app.get('/', (req, res)=>{
    res.send(`REST-API`);
});

app.listen(PORT, ()=> console.log(`server is listening on http://localhost:${PORT}`));