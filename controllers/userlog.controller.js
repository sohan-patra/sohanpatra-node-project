const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/adminuser.model");
const PostModel = require("../models/adminpost.model");
const categoryModel = require("../models/admincategory.model");
const CommentModel = require("../models/admincomment.model");
const BannerModel = require("../models/adminbanner.model");

class UserController {
    async userAuth(req, res, next) {
        try {
            if (req.user) {
                next();
            } else {
                res.redirect('/showlogin')
            }
        } catch (err) {
            throw err;
        }
    }
   

    async index(req, res) {
        try {
            const pager = req.query.page ? req.query.page : 1
        const options = {
            populate: "user",
            page: pager,
            limit: 3,
            sort: '-createdAt',
            collation: {
                locale: 'en',
            },
        };
        let data = await PostModel.paginate({}, options)
        if (data){
            console.log(data.docs);
            let result = await PostModel.find({}).populate("user").sort('-createdAt').limit(5)
            console.log("AM", result);
            if (result){
                let category = await categoryModel.find({})
                if (category){
                    let comment = await CommentModel.find({}).sort('-createdAt').limit(5)
                    let banners = await BannerModel.find({});
                    res.render('index', {
                        page_title: "Sohan's Blog | Home",
                        data: req.user,
                        displayData: data,
                        pager: pager,
                        result: result,
                        comment: comment,
                        category: category,
                        banner: banners
                    })

                } else {
                    console.log("error while fetching category for index page");
                }
            } else {
                console.log("Something went wrong...");
            }
        } else {
            console.log("Something went wrong...");
        }
            
            
        } catch (err) {
            throw err;
        }
    }


    /*
 
 @Method: show Registration 
  @Description: To show the dashboard
 
*/

    async showregister(req, res) {
        try {
            res.render('register', {
                page_title: 'User Registration',
                message_success: req.flash('message_success'),
                message_failed: req.flash('message_failed'),
                message_warning: req.flash('message_warning'),
                message_dark: req.flash('message_dark'),
                message_phone: req.flash('message_phone'),
                data: req.user
            })
        } catch (err) {
            throw err;
        }
    }

    /*
    
    @Method: show login
    @Description: To show the dashboard
    
    */

    async showlogin(req, res) {
        try {
            let dislogin = await UserModel.find({})
            dislogin.email = (req.cookies.email) ? req.cookies.email : undefined
            dislogin.password = (req.cookies.password) ? req.cookies.password : undefined
            res.render('login', {
                page_title: 'User Login',
                message_failed: req.flash('message_failed'),
                message_success: req.flash('message_success'),
                message_warning: req.flash('message_warning'),
                displayData: dislogin,
                data: req.user
            })
        } catch (err) {
            throw err;
        }
    }

    /*
    
    @Method: post Register
    @Description: To show the dashboard
    
    */

    async register(req, res) {
        try {
            console.log("Body Main Part :", req.body);
            console.log("image :", req.files);
            if (req.file && req.file.filename) {
                req.body.image = req.file.filename;
            }
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            req.body.userName = req.body.userName.trim();
            req.body.contact = req.body.contact.trim();
            req.body.email = req.body.email.trim();









            if (req.body.firstName && req.body.lastName && req.body.userName && req.body.contact && req.body.email && req.body.image && req.body.password && req.body.confirmpassword) {
                //check email uniqueness
                let isEmailExists = await UserModel.find({ email: req.body.email, isAdmin: false });
                if (!isEmailExists.length) {
                    let phoneExists = await UserModel.find({ contact: req.body.contact, isAdmin: false })
                    if (!phoneExists.length) {
                        if (req.body.password === req.body.confirmpassword) {
                            req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
                            let saveData = await UserModel.create(req.body);
                            if (saveData && saveData._id) {
                                req.flash('message_success', 'User Registered Successfully!');
                                res.redirect('/showregister')
                            } else {
                                req.flash('message_failed', 'Something Went Wrong! Please try again later');
                                res.redirect('/showregister')
                            }
                        } else {
                            req.flash('message_warning', 'Password & Confirm Password Is Not Same');
                            res.redirect('/showregister')
                        }
                    } else {
                        req.flash('message_phone', 'PhoneNumber is already exists');
                        res.redirect('/showregister')
                    }





                } else {
                    req.flash('message_dark', 'Email is already exists');
                    res.redirect('/admin/registration')
                }

            } else {
                req.flash('message_warning', 'Field is Empty');
                res.redirect('/admin/registration')
            }

        } catch (err) {
            throw err;
        }

    }

    /*
    
    @Method: post login
    @Description: To show the dashboard
    
    */

    async postLogin(req, res) {
        try {
            console.log("Body Part2 :", req.body);
            let data = await UserModel.findOne({
                email: req.body.email
            })
            console.log(data);
            if (req.body.email && req.body.password) {
                if (data) {
                    let hashPassword = data.password;
                    if (bcrypt.compareSync(req.body.password, hashPassword)) {
                        // req.flash('message_success', 'User Logged in successfully');
                        // res.redirect('/login')
                        const token = jwt.sign({
                            id: data._id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            userName: data.userName

                        }, 'Sohan1414', {
                            expiresIn: '7d'
                        });
                        res.cookie('userToken', token)
                        if (req.body.rememberme) {
                            res.cookie('email', req.body.email)
                            res.cookie('password', req.body.password)
                        }
                        // res.cookie('email', req.body.email);
                        res.redirect('/showpost')
                    } else {
                        req.flash('message_failed', 'Password does Not Matched');
                        res.redirect('/showlogin')
                    }
                } else {
                    req.flash('message_failed', 'User does not Exists');
                    res.redirect('/showlogin')
                }
            } else {
                req.flash('message_warning', 'Field is Empty');
                res.redirect('/showlogin')
            }

        } catch (err) {
            throw err;
        }
    }






    /* METHOD: logoutUser
     Description: delete token to delete

  */
    async logoutUser(req, res) {
        try {
            res.clearCookie("userToken");
            res.redirect('/showlogin')
        } catch (err) {
            console.log('Unable to logout', err);
            throw err
        }
    }


    

   

}

module.exports = new UserController();