const UserModel = require("../models/adminuser.model");
const PostModel = require("../models/adminpost.model");
const CategoryModel = require("../models/admincategory.model");

class Admincategory {

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
   

    async viewCategory(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            // console.log('My print:', adminData);
            let categoryadmin = await CategoryModel.find({})
            res.render('admin/viewcategory', {
                page_title: "Admin || ViewCategory",
                data: req.admin,
                adminData,
                categoryadmin
            })
        } catch (err) {
            throw err;
        }
    }

    async showAddCategory(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            // console.log('My print:', adminData);
            
            
            res.render('admin/categoryform', {
                page_title: "Admin || categoryform",
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

    async admincategory(req, res) {
        try {
            // console.log("Body Main Part :", req.body);
            
            req.body.categoryName = req.body.categoryName.trim();
     
          








            if (req.body.categoryName) {





                let saveData = await CategoryModel.create(req.body);
                if (saveData && saveData._id) {
                    req.flash('message_success', 'Category Registered Successfully!');
                    res.redirect('/admin/addcategoryform')
                } else {
                    req.flash('message_failed', 'Something Went Wrong! Please try again later');
                    res.redirect('/admin/addcategoryform')
                }





            } else {
                req.flash('message_warning', 'Field is Empty');
                res.redirect('/admin/addcategoryform')
            }

        } catch (err) {
            throw err;
        }

    }
}

module.exports = new Admincategory();