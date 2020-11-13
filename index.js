const express = require('express');
const bodyParser  = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const hpp = require('hpp');
const csurf = require('csurf');
const limiter = require("express-rate-limit");
const cors = require('cors');
const sqlite3 = require('sqlite3');
const os = require('os');
const bcryptjs = require('bcryptjs');


const transactions = require('./src/transactions');
const signature = require('./src/signature');


const app = express();

const secret = 'thisismysecretskeysshhhhhhh';
//Serve the static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));

//Middelware (security)
/*
app.use(helmet());
app.use(hpp());
app.use(csurf());
app.use(limiter);
*/
//Allows react from port 3000 to send requests
var corsOptions = {
    origin: (os.hostname() == 'TwizzX') ? 'http://localhost:3000' : 'http://157.245.47.65:80',
    credentials:  true,
    "methods": "POST"
  }
app.use(cors(corsOptions));

//app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

/*
    Authenticates login processes
*/
app.post('/api/authenticate', (req, res) => {
    console.log(req.headers);
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(200).json({state: false, description: 'Please fill out both fields'});
    }

    var hostname = os.hostname()
    if(hostname == 'TwizzX'){
        var path = 'C:/Users/Jacob/Documents/bahamas/login.sqlite';
    } else {
        var path = '/home/bahamas/login.sqlite';
    }
        const id_db = new sqlite3.Database(path, (err) =>{
            if(err){
                console.log('Could not connect to database: ' + err);
            } else {
                //Query the user email
                id_db.get(`SELECT * FROM login WHERE email = ?`, [email.toLowerCase()], (err, row) => {
                    if(err){
                        res.status(400).json({state: false, description: 'Invalid input'});
                        return;
                    }
                    console.log(row)
                    
                    if(row){
                        console.log(bcryptjs.compareSync(password, row.password))
                        //test password at hashed password
                        //bcryptjs returns true on match
                        if(bcryptjs.compareSync(password, row.password)){


                            //issue token
                            const payload = {email, userid: row.id};
                            const token = jwt.sign(payload, secret, {
                                expiresIn: '24h'
                            });
                            //:Todo httpsonly should be true for production
                            id_db.close();
                            return res.cookie('token', token, {httpOnly: false})
                                .status(200).json({state: true, description: 'Login status - OK'});
                        }
                    } 
                    id_db.close();
                    return res.status(200).json({state: false, description: 'Invalid credentials'});
                });
            }
        })
});

/*
    Registers a user in id database
*/
app.post('/api/register', (req, res) => {
    const {email, password} = req.body;
    var hostname = os.hostname()
    if(hostname == 'TwizzX'){
        var path = 'C:/Users/Jacob/Documents/bahamas/login.sqlite';
    } else {
        var path = '/home/bahamas/mydatabase.db';
    }
        const id_db = new sqlite3.Database(path, (err) =>{
            if(err){
                console.log('Could not connect to database');
            } else {
                //insert new user
                id_db.run(`INSERT INTO login (email, password, salt) VALUES (?, ?, ?)`, [email.toLowerCase(), bcryptjs.hashSync(password, 11), ""], (err) => {
                    if(err){
                        res.status(400).json({state: false, description: 'Invalid input'});
                        id_db.close();
                        return;
                    } else {
                        id_db.close();
                        return res.status(200).json({state: true, description: 'User was created'});
                        
                    }
                });
            }
        })
});




 //An api endpoint that returns a short list of items
 app.post('/api/signature', (req,res) => {
    
    console.log(req.headers.authorization);

    const token = signature.verifySignature(req.headers.authorization);
    console.log(token);
    res.json(token);

});


app.post('/api/transaction_new', (req, res) => {
    //Call Transactions module
    transactions.create_new(req);
})


app.get('/api/transactions', (req,res) => {
    //middleware
    const token = signature.verifySignature(req.headers.authorization);
    if (token.state === false){
        res.json(token);
    }
    //get transactions
    var data = transactions.load_transactions().then(function (data){
        var result = {
            state: true,
            data: data
        }
        console.log(result);
        console.log('Transactions has been loaded');
        res.json(result);
    }) 
});

app.post('/api/transactions', (req,res) => {
    //middleware
    const token = signature.verifySignature(req.headers.authorization);
    if (token.state === false){
        res.json(token);
        res.end;
    
    }
    //add transaction
    transactions.add_transaction(req.body).then(function (data){
        
        console.log(data);
        res.json(data);
    }) 
});

app.post('/api/transaction_del', (req,res) => {
    //middleware
    const token = signature.verifySignature(req.headers.authorization);
    if (token.state === false){
        res.json(token);
        res.end;
    }
    //add transaction
    transactions.delete_transaction(req.body.id).then(function (data){
        
        console.log(data);
        res.json(data);
    }) 
});














 //An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

 //Handles any requests that don't match the ones above
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);