const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/adminuser.model");

class AdminController {
    async adminAuth(req, res, next) {
        try {
            if (req.admin) {
                next();
            } else {
                res.redirect('/admin/')
            }
        } catch (err) {
            throw err;
        }
    }
   

    async dashboard(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            console.log('My print:', adminData);
            res.render('admin/dashboard', {
                page_title: "Admin || Dashboard",
                data: req.admin,
                adminData
            })
        } catch (err) {
            throw err;
        }
    }

    /*
 
 @Method: show Registration 
  @Description: To show the dashboard
 
*/

    async showRegistration(req, res) {
        try {
            res.render('admin/register', {
                page_title: 'EMS Registration',
                message_success: req.flash('message_success'),
                message_failed: req.flash('message_failed'),
                message_warning: req.flash('message_warning'),
                message_dark: req.flash('message_dark'),
                message_phone: req.flash('message_phone')
            })
        } catch (err) {
            throw err;
        }
    }

    /*
    
    @Method: show login
    @Description: To show the dashboard
    
    */

    async showLogin(req, res) {
        try {
            res.render('admin/login', {
                page_title: 'EMS Login',
                message_failed: req.flash('message_failed'),
                message_success: req.flash('message_success'),
                message_warning: req.flash('message_warning')
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
                                res.redirect('/admin/registration')
                            } else {
                                req.flash('message_failed', 'Something Went Wrong! Please try again later');
                                res.redirect('/admin/registration')
                            }
                        } else {
                            req.flash('message_warning', 'Password & Confirm Password Is Not Same');
                            res.redirect('/admin/registration')
                        }
                    } else {
                        req.flash('message_phone', 'PhoneNumber is already exists');
                        res.redirect('/admin/registration')
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
            let isUserExists = await UserModel.findOne({
                email: req.body.email
            })
            console.log(isUserExists);
            if (req.body.email && req.body.password) {
                if (isUserExists) {
                    let hashPassword = isUserExists.password;
                    if (bcrypt.compareSync(req.body.password, hashPassword)) {
                        // req.flash('message_success', 'User Logged in successfully');
                        // res.redirect('/login')
                        const token = jwt.sign({
                            id: isUserExists._id,
                            firstName: isUserExists.firstName,
                            lastName: isUserExists.lastName,
                            email: isUserExists.email,
                            userName: isUserExists.userName

                        }, 'Sohan1212', {
                            expiresIn: '7d'
                        });
                        res.cookie('adminToken', token)
                        // res.cookie('email', req.body.email);
                        res.redirect('/admin/dashboard')
                    } else {
                        req.flash('message_failed', 'Password does Not Matched');
                        res.redirect('/admin/')
                    }
                } else {
                    req.flash('message_failed', 'User does not Exists');
                    res.redirect('/admin/')
                }
            } else {
                req.flash('message_warning', 'Field is Empty');
                res.redirect('/admin/')
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
            res.clearCookie("adminToken")
            res.redirect('/admin/')
        } catch (err) {
            console.log('Unable to logout', err);
            throw err
        }
    }

    async adminview(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id})
            console.log('My print:', adminData);
            let result = await UserModel.find({isAdmin: false})
            console.log('Get Result :', result);
            res.render('admin/adminuser', {
                page_title: "Admin || AdminUser",
                data: req.admin,
                adminData,
                result
            })
        } catch (err) {
            throw err;
        }
    }

    async activeUser(req, res) {
        try {
            let data = await UserModel.find({ _id: req.params.id })
            let useractive = await UserModel.findByIdAndUpdate(data[0]._id, { status: true });
            if (useractive) {
                req.flash('message_success', 'Data Activeted Successfully');
                res.redirect('/admin/adminview');
            } else {
                console.log('Not Activeted');
                res.redirect('/admin/adminview');
            }
            
        }catch (err){
            throw err;
        }
    }

    async deActiveUser(req, res) {
        try {
            let data = await UserModel.find({ _id: req.params.id })
            let userdactive = await UserModel.findByIdAndUpdate(data[0]._id, { status: false });
            if (userdactive) {
                req.flash('message_success', 'Data Deactiveted Successfully');
                res.redirect('/admin/adminview');
            } else {
                console.log('Not Deactiveted');
                res.redirect('/admin/adminview');
            }
            
        }catch (err){
            throw err;
        }
    }

 

}

module.exports = new AdminController();