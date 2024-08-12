const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/calculatorDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Define a schema and model for calculation history
const calculationSchema = new mongoose.Schema({
  num1: Number,
  num2: Number,
  operation: String,
  result: String,
  timestamp: { type: Date, default: Date.now }
});

const Calculation = mongoose.model('Calculation', calculationSchema);


// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Helper function to create and save calculation
async function saveCalculation(num1, num2, operation, result) {
  const calculation = new Calculation({
    num1,
    num2,
    operation,
    result: result.toString()
  });
  try {
    await calculation.save();
	console.log('Data Saved to MongoDB');
  } catch (error) {
    console.error('Error saving calculation:', error);
  }
}

// Routes for calculator actions
app.get('/add', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  if (!isNaN(num1) && !isNaN(num2)) {
    const result= num1 + num2;
      const operation = 'add';
    saveCalculation(num1, num2, operation, result);
    res.send(`The sum of ${num1} and ${num2} is ${result}`);
  } 	
   else {
    res.send('Invalid numbers');
  }
});

app.get('/subtract', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  if (!isNaN(num1) && !isNaN(num2)) {
    const result = num1 - num2;
    const operation = 'subtract';
    saveCalculation(num1, num2, operation, result);
   res.send(`The result of ${num1} - ${num2} is ${result}`);
  } 	  
  else {
    res.send('Invalid numbers');
  }
});

app.get('/multiply', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  if (!isNaN(num1) && !isNaN(num2)) {
    const result = num1 * num2;
    const operation = 'multiply';
    saveCalculation(num1, num2, operation, result);
	res.send(`The result of ${num1} * ${num2} is ${result}`);	
 } else {
    res.send('Invalid numbers');
  }
});

app.get('/divide', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);
  if (!isNaN(num1) && !isNaN(num2) && num2 !== 0) {
    const result = num1 / num2;
    const operation = 'divide';
    saveCalculation(num1, num2, operation, result);
    res.send(`The result of ${num1} / ${num2} is ${result}`);
  } else {
    res.send('Invalid numbers or division by zero');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
