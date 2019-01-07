const   mongoose = require('mongoose'),
        express = require('express')

const   config = require("./config")


//initialize express and setup Nadmin by passing in app
const app = express();
//Nandmin Object needs an app as first option
//Second option is a settings object(defaults below)
//AT MINIMUM pass in valid email settings(look up nodemailer transport settings)
/* settings = {
    appRoot         : appRoot,  //this is generated by appRoot middleware
    modelDirectory  : "models",
    userModel       : "user",
    sessionSecret   : "$2b$12$wuJPlBlIRh2SXt18AwbBDOjuh5xPNniStXzTcrytS/Y1aF/zlVyuK",
    sessionExpire   : 4, //days
    emailOptions    : {
        from: 'yourname@gmail.com',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "username",
            pass: "password"
        }
    },
    enableHelmet    : true //if you plan to use sitewide helmet protection in your own application set this to false
} */
const nadmin = require("nadmin")(app) 

app.locals.pretty = true//Output well formatted html
//set view engine to pug
app.set('view engine','pug')
//set directory for static assets
app.use("/Assets",express.static("public"))

//Initialize and setup nadmin middleware before others
//Needs done early so it can control register/login/reset routes and etc
app.use(nadmin)

//setup mongoose
//mongoose connection created in main app, so subsequent calls by nandmin will be on the same connection as main the app
mongoose.Promise = global.Promise
//create uri
//mongodb://username:password@host:port/database
const db_uri = "mongodb://"+config.db.user+":"+config.db.password+"@"+config.db.host+":"+config.db.port+"/"+config.db.name
//connect to db
mongoose.connect(db_uri,{useNewUrlParser:true})
mongoose.connection.once('open', () => {
    console.log("Connected to database...")
}).on("error", error => {
    console.log("Connection error: ",error)
    console.log("Please make sure you edit config file with proper database credentials");
    process.exit(1)
})



//Nadmin attaches a 'isLoggedIn' function as well as 'userInfo' object to session 
app.get('/', (req, res) => {
    if(req.session.isLoggedIn()){
        res.send('Hello '+req.session.userInfo.displayName)  
    }
    else{        
        res.send('Hello Guest!')  
    }
})
app.listen(config.app.port, () => console.log(`App listening on port ${config.app.port}!`))

//At this point you can login, logout, sign up and reset the password
//ROUTES:
//login or signin for logging in
//logout or signout for logging out
//register or signup for registration
//forgotpassword for password reset

