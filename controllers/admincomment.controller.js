const UserModel = require("../models/adminuser.model");
const PostModel = require("../models/adminpost.model");
const CommentModel = require("../models/admincomment.model");

class AdmincommentController {

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
   

    async viewcomment(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            console.log('My print:', adminData);
            let commentadmin = await CommentModel.find({}).populate("post")
            console.log('commentadmin :', commentadmin);
            res.render('admin/viewcomment', {
                page_title: "Admin || Viewcomment",
                data: req.admin,
                adminData,
                displayData: commentadmin
            })
        } catch (err) {
            throw err;
        }
    }

    async showadmincommentForm(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            console.log('My print:', adminData);
            let allcom = await PostModel.find({});
            console.log(allcom);
            res.render('admin/commentform', {
                page_title: "Admin || Commentform",
                message_success: req.flash('message_success'),
                message_failed: req.flash('message_failed'),
                message_warning: req.flash('message_warning'),
                data: req.admin,
                adminData,
                allcom
                
            });
        } catch (err) {
            throw err;
        }
    }

    async admincomment(req, res) {
        try {
            console.log("Body Main Part :", req.body);
            
            req.body.post = req.body.post.trim();
            req.body.name = req.body.name.trim();
            req.body.email = req.body.email.trim();
            req.body.comment = req.body.comment.trim();
            
          








            if (req.body.post && req.body.name && req.body.email && req.body.comment) {





                let saveData = await CommentModel.create(req.body);
                if (saveData && saveData._id) {
                    req.flash('message_success', 'Comment Added Successfully!');
                    res.redirect('/admin/showadmincommentForm')
                } else {
                    req.flash('message_failed', 'Something Went Wrong! Please try again later');
                    res.redirect('/admin/showadmincommentForm')
                }





            } else {
                req.flash('message_warning', 'Field is Empty');
                res.redirect('/admin/showadmincommentForm')
            }

        } catch (err) {
            throw err;
        }

    }

    async activeComment(req, res) {
        try {
            let data = await CommentModel.find({ _id: req.params.id })
            let commentactive = await CommentModel.findByIdAndUpdate(data[0]._id, { status: true });
            if (commentactive) {
                req.flash('message_success', 'Data Activeted Successfully');
                res.redirect('/admin/viewcomment');
            } else {
                console.log('Not Activeted');
                res.redirect('/admin/viewcomment');
            }
            
        }catch (err){
            throw err;
        }
    }

    async deActiveComment(req, res) {
        try {
            let data = await CommentModel.find({ _id: req.params.id })
            let commentdactive = await CommentModel.findByIdAndUpdate(data[0]._id, { status: false });
            if (commentdactive) {
                req.flash('message_success', 'Data Deactiveted Successfully');
                res.redirect('/admin/viewcomment');
            } else {
                console.log('Not Deactiveted');
                res.redirect('/admin/viewcomment');
            }
            
        }catch (err){
            throw err;
        }
    }

 
}

module.exports = new AdmincommentController();