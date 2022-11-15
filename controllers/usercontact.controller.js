const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ContactModel = require("../models/contact.model");
const UserModel = require("../models/adminuser.model");

class UsercontactController {

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

    async getContact(req, res) {
        try {
            res.render("contact", {
                page_title: "Contact Us",
                message: req.flash("message"),
                alert: req.flash("alert"),
                data: req.user
            })


        } catch (err) {
            throw err;
        }
    }

    async contact(req, res) {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "sohanpatra85@gmail.com",
                    pass: "skyilzxpqkasnnil"
                }
            });
            let mailOptions = {
                from: 'sohanpatra993@gmail.com',
                to: 'sohanpatra85@gmail.com',
                subject: "Query From Sohan's Blogging",
                text: `Greetings From ${req.body.name}
                Query - ${req.body.message}
                Email - ${req.body.email}
                Contact - ${req.body.contact}`
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log("Techniclal Issue...");
                } else {
                    req.flash("message", "Message Sent Successfully...");
                    req.flash("alert", "success-msg");
                    res.redirect("/contact");
                }
            });

        } catch (err) {
            throw err;
        }
    }

    async forgot(req, res) {
        try {
            res.render("forgot", {
                page_title: "Forgot Password",
                data: req.user,
                message: req.flash("message"),
                alert: req.flash("alert"),
            })


        } catch (err) {
            throw err;
        }
    }

    async getLink(req, res) {
        try {
            let email = await UserModel.findOne({ email: req.body.email })
            if (email) {
                console.log(email, "Email found...");
                let forgotToken = crypto.randomBytes(16).toString('hex');
                let result = await UserModel.findOneAndUpdate({ email: req.body.email }, { forgotToken: forgotToken });
                if (result) {
                    console.log("forgotToken set...");
                    var transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "sohanpatra85@gmail.com",
                            pass: "skyilzxpqkasnnil"
                        }
                    });
                    var mailOptions = {
                        from: 'sohanpatra993@gmail.com',
                        to: email.email,
                        subject: 'Reset Password',
                        text: 'Hello ' + email.userName + ',\n\n' + 'Please forgot your password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/resetpassword\/' + email.email + '\/' + forgotToken + '\n\nThank You!\n'
                    };
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.log("Techniclal Issue...");
                        } else {
                            req.flash("message", "A Forgot Email Sent To Your Mail ID.... Please Change Your Password By Click The Link....");
                            req.flash("alert", "success-msg");
                            res.redirect("/forgot");

                        }
                    });
                } else {
                    console.log("email not Sent");
                    req.flash("message", "Email not Sent");
                    res.redirect("/forgot");
                }
            } else {
                console.log("email not found while execute getLink()");
                req.flash("message", "Email Not Found");
                req.flash("alert", "error-msg");
                res.redirect("/forgot");
            }


        } catch (err) {
            throw err;
        }
    }

    async resetPassword(req, res) {
        try {
            let data = await UserModel.findOne({ forgotToken: req.params.forgottoken })
            console.log("Reset Password :---", data);
            if (data) {
                res.render("resetpassword", {
                    page_title: "Reset Password",
                    data: data,
                    message: req.flash("message"),
                    alert: req.flash("alert")
                })

            } else {
                req.flash("message", "Reset Password Link May Be Expired");
                req.flash("alert", "error-msg");
                res.redirect("/forgot");
            }


        } catch (err) {
            throw err;
        }
    }

    async reset(req, res) {
        try {
            if (req.body.password === req.body.confirmpassword) {
                let result = await UserModel.findByIdAndUpdate(req.body.id, { password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) });
                if (result) {
                    console.log("Password Updated...");
                    req.flash("message", "Password Updated Successfully");
                    req.flash("alert", "success-msg");
                    res.redirect("/showlogin");
                } else {
                    req.flash("message", "Something Went Wrong!!!");
                    req.flash("alert", "error-msg");
                    console.log("Password Not Changed...");
                    res.redirect("/showlogin");
                }
            } else {
                console.log("Password & Confirm Password Not Same");
                req.flash("message", "Password & Confirm Password Not Same");
                req.flash("alert", "error-msg");
                res.redirect("/login");
            }


        } catch (err) {
            throw err;
        }
    }
}

module.exports = new UsercontactController();