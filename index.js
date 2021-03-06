const pg        = require('pg');
const express   = require('express');
var bodyParser = require('body-parser');
const app       = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const config = {
    user: 'mvurcmhguiswwo',
    database: 'dea0q0vpb3s6rg',
    host:'ec2-54-227-243-210.compute-1.amazonaws.com',
    password: '15e0fc883769a385a54e06cc51d7bd84754f7971d1929a7b87f63d365b456f62',
    port: 5432,
    ssl:true,
    sslfactory:'org.postgresql.ssl.NonValidatingFactory'
};

// pool takes the object above -config- as parameter
const pool = new pg.Pool(config);

app.post('/login', (req, res, next) => {
    console.log('Start');
   
    var id = JSON.stringify(req.body);
    if (req.body.queryResult.action == "login-user")
    {
        var username = req.body.queryResult.parameters.user_name;
        var sqlquery = "SELECT user_name FROM master_login where user_name ='"+username+"';";
        
        console.log(sqlquery);
           pool.connect(function (err, client, done) {
           if (err) {
               console.log("Can not connect to the DB" + err);
           }
           client.query(sqlquery, function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
               else {
                    console.log(result);
                   if(result.rowCount>0)
                   {
                    res.json({
                        fulfillmentText : 'Please enter your 6  Digit PIN to authenticate',
                        fulfillmentMessages :[
                            {
                                "text":{
                                    "text":[
                                        "Please enter your 6  Digit PIN to authenticate"
                                    ]
                                }
                            }
                        ],
                        source :'chatbottest'
                    });
                   }
                   else{
                    res.json({
                        fulfillmentText : 'Kindly check your username entered',
                        fulfillmentMessages :[
                            {
                                "text":{
                                    "text":[
                                        "Kindly check your username entered"
                                    ]
                                }
                            }
                        ],
                        source :'chatbottest'
                    });
                   }
                  
              }
           });
           });
 }
     else if (req.body.queryResult.action == "login-user-authenticate")
    {
         var param = req.body.queryResult.outputContexts[0];
        console.log(param);
        var username  = param.user_name;
        console.log(username);
        var password= req.body.queryResult.parameters.pass_word;
        if(password.length=6)
        {
            var sqlquery = "SELECT user_name FROM master_login where user_name ='"+username+"' and password = '"+password+"';";
            console.log(sqlquery);
            pool.connect(function (err, client, done) {
            if (err) {
                console.log("Can not connect to the DB" + err);
            }
            client.query(sqlquery, function (err, result) {
                 done();
                 if (err) {
                     console.log(err);
                     res.status(400).send(err);
                 }
                else {
                 res.json({
                     fulfillmentText : 'Your Connected To Mignon Successfully, How Can I help you?',
                     fulfillmentMessages :[{"text":{"text":["Your Connected To Mignon Successfully, How Can I help you?"]}}],
                     source :'chatbottest'
                 });  
               }
            });
            });
        }
        else{
            res.json({
                fulfillmentText : 'Incorrect Pin , Kindly check and Re-Enter your 6 Digit PIN',
                fulfillmentMessages :[{"text":{"text":["Incorrect Pin , Kindly check and Re-Enter your 6 Digit PIN"]}}],
                source :'chatbottest'
            });  

        }
        
 }
    else
        {
            res.json({
                    fulfillmentText : 'fallback Reponse',
                    fulfillmentMessages :[{"text":{"text":[req.body.queryResult.fulfillmentText]}}],
                    source :'chatbottest'
                });
        }
    
});
app.set( 'port', (process.env.PORT || 5000 ));
app.listen(app.get('port'));
