import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoute from './routes/authRoute'
import examRoute from './routes/examRoute'


const app = express();
app.use(express.json());
app.use(express.Router());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use('/api', authRoute);
app.use('/api', examRoute);

mongoose.Promise = Promise;
mongoose.connect(process.env.DATABASEURL as string).then(() => {
    console.log("database connection established");
}).catch((error) => {
    console.log(error);
});

app.listen(3000, ()=>{
    console.log("server running on port 3000")
})