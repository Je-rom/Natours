const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModels')

dotenv.config({path: './.env'});

const DB = process.env.CONNECTION_STRING;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connection successful!'))
.catch((err) => console.error('DB connection error:', err));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async ()=>{
    try {
        await Tour.create(tours);
        console.log('imported successfully')
    } catch (error) {
        console.log(error)
    }
}

const deleteData = async ()=>{
    try {
        await Tour.deleteMany();
        console.log('deleted successfully')
    } catch (error) {
        console.log(error)
    }
}

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData()
}

