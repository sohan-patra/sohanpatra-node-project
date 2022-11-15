const UserModel = require("../models/adminuser.model");
const BannerModel = require("../models/adminbanner.model");


class Adminbanner {

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
   

    async viewbanner(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            // console.log('My print:', adminData);
            let banneradmin = await BannerModel.find({})
            res.render('admin/viewbanner', {
                page_title: "Admin || Viewbanner",
                data: req.admin,
                adminData,
                banneradmin
            })
        } catch (err) {
            throw err;
        }
    }

    async showAddbanner(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            // console.log('My print:', adminData);
            
            
            res.render('admin/bannerform', {
                page_title: "Admin || bannerform",
                message_success: req.flash('message_success'),
                message_failed: req.flash('message_failed'),
                message_warning: req.flash('message_warning'),
                data: req.admin,
                adminData
                
            });
        } catch (err) {
            throw err;
        }
    }

    async adminbanner(req, res) {
        try {
            // console.log("Body Main Part :", req.body);
            
            req.body.heading = req.body.heading.trim();
            req.body.text = req.body.text.trim();
     
          








            if (req.body.heading && req.body.text) {





                let saveData = await BannerModel.create(req.body);
                if (saveData && saveData._id) {
                    req.flash('message_success', 'Category Registered Successfully!');
                    res.redirect('/admin/addbannerform')
                } else {
                    req.flash('message_failed', 'Something Went Wrong! Please try again later');
                    res.redirect('/admin/addbannerform')
                }





            } else {
                req.flash('message_warning', 'Field is Empty');
                res.redirect('/admin/addbannerform')
            }

        } catch (err) {
            throw err;
        }

    }
}

module.exports = new Adminbanner();