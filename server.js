const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const path=require('path');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require('connect-flash')
app.set('view engine','ejs');
app.set('views','views')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}))

const dbDriver = "mongodb+srv://sohan:DnT1dbUMfZs8alkL@cluster0.v9sbg.mongodb.net/sohanbloggingproject";
// const dbDriver = "mongodb+srv://sohan:DnT1dbUMfZs8alkL@cluster0.v9sbg.mongodb.net/?retryWrites=true&w=majority/employeemanagement";
app.locals.moment = require('moment')
app.use(session({
    secret: 'Sohan1515',
    resave: false,
    saveUninitialized: false,
}))

app.use(cookieParser())

app.use(flash())

const adminAuth = require("./middlewares/adminAuth");
app.use(adminAuth.authJwt);

const userAuth = require("./middlewares/userAuth");
app.use(userAuth.authJwt);

const adminrouter = require('./routes/addminuser.routes');
app.use("/admin", adminrouter)

const adminpostrouter = require('./routes/adminpost.routes');
app.use("/admin", adminpostrouter)

const admincategoryrouter = require('./routes/admincategory.routes');
app.use("/admin", admincategoryrouter)

const admincommentrouter = require('./routes/admincomment.routes');
app.use("/admin", admincommentrouter)

const adminbannerrouter = require('./routes/adminbanner.routes');
app.use("/admin", adminbannerrouter)

const userlogrouter=require('./routes/userlog.routes');
app.use(userlogrouter)

const userpostrouter=require('./routes/userpost.routes');
app.use(userpostrouter)

const usercontactrouter=require('./routes/usercontact.routes');
app.use(usercontactrouter)



const port = process.env.PORT || 1999;


mongoose.connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    app.listen(port, () => {
        console.log('DB is connected');
        console.log(`Server is connected @ http://localhost:${port}`);
    })
}).catch(err => {
    console.log('Error dected');
    console.log(err);
})