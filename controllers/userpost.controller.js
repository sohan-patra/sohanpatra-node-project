
const UserModel = require("../models/adminuser.model");
const PostModel = require("../models/adminpost.model");
const categoryModel = require("../models/admincategory.model");
const CommentModel = require("../models/admincomment.model");
const BannerModel = require("../models/adminbanner.model");
const fs = require('fs')

class UserpostController {
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

    /*
        
        @Method: post Register
        @Description: To show the dashboard
        
        */
    async showpost(req, res) {
        try {
            let result = await categoryModel.find({})
            res.render("post", {
                page_title: "Sohan's Blog | Post",
                message: req.flash("message"),
                alert: req.flash("alert"),
                data: req.user,
                displayData: result
            })


        } catch (err) {
            throw err;
        }
    }

    async userpost(req, res) {
        try {
            let data = await PostModel.findOne({ slug: req.body.title.trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_').toLowerCase() })
            if (data) {
                req.flash("message", "Post Title Already Exists");
                req.flash("alert", "error-msg");
                console.log("Post Title Already Exists", err);
                res.redirect('/showpost');
            } else {
                let saveData = await PostModel.create({
                    category: req.body.category,
                    title: req.body.title,
                    subTitle: req.body.subtitle,
                    postText: req.body.post,
                    image: req.file.filename,
                    slug: req.body.title.trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_").toLowerCase(),
                    user: req.user.id
                });
                if (saveData && saveData.slug) {
                    req.flash('message', 'User Posted Successfully!');
                    res.redirect('/showpost')
                } else {
                    req.flash('message', 'Something Went Wrong! Please try again later');
                    res.redirect('/showpost')
                }
            }


        } catch (err) {
            throw err;
        }
    }

    async viewpost(req, res) {
        try {
            let result = await PostModel.find({ slug: req.params.slug }).populate("category").populate("user")
            console.log("ViewPost Result :", result);
            let data = await CommentModel.find({}).populate("post")
            
            if (data) {
                console.log(data);
                let banner = await BannerModel.find({})
                res.render("viewpost", {
                    page_title: "Sohan's Blog | View Post",
                    displayData: result,
                    data: req.user,
                    message: req.flash("message"),
                    alert: req.flash("alert"),
                    cmnt: data,
                    banner: banner
                })
            } else {
                console.log("Something went wrong...");
            }


        } catch (err) {
            throw err;
        }
    }

    async addComment(req, res) {
        try {
            let result = await CommentModel.create({

                post: req.body.post,
                name: req.body.name,
                email: req.body.email,
                comment: req.body.comment,
            })
                
            
            if (result && result._id) {
                console.log("Comment Added...");
                req.flash("message", "Comment Added Successfully, Wait For Approval");
                req.flash("alert", "success-msg");
                res.redirect(`viewpost/${req.body.slug}`);
            } else {
                req.flash("message", "Something Went Wrong!!!");
                req.flash("alert", "error-msg");
                console.log("Comment Not Added...");
                res.redirect(`viewpost/${req.body.slug}`);
            }


        } catch (err) {
            throw err;
        }
    }

    async managePost(req, res) {
        try {
            let posts = await PostModel.find({ isDeleted: false}).populate("user")
            if (posts) {
                console.log(req.cookies.email);
                console.log(posts);
                res.render("managepost", {
                    page_title: "Manage Post",
                    data: req.user,
                    posts: posts,
                    flag: req.user.email
                })
            } else {
                console.log(err);
            }



        } catch (err) {
            throw err;
        }
    }

    async showUpdatePost(req, res) {
        try {
            let result = await PostModel.findById({ _id: req.params.id }).populate("category")
            let category = await categoryModel.find({})
            res.render("updatepost", {
                page_title: "Update Post",
                data: req.user,
                message: req.flash("message"),
                alert: req.flash("alert"),
                category: category,
                result: result
            })



        } catch (err) {
            throw err;
        }
    }

    async updatePost(req, res) {
        try {

            console.log("Edit Part :", req.body);

            let oldData = await PostModel.find({_id: req.body.id});
            if(req.file && req.file.filename) {
                req.body.image = req.file.filename;
                fs.unlinkSync(`./public/uploads/${oldData[0].image}`);
            }

            req.body.title = req.body.title.trim();
            req.body.subTitle = req.body.subTitle.trim();
            req.body.postText = req.body.postText.trim();
            let result = await PostModel.findByIdAndUpdate(req.body.id, {
                category: req.body.category,
                title: req.body.title,
                subTitle: req.body.subTitle,
                postText: req.body.postText,
                image: req.file.filename,
                slug: req.body.title.trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_").toLowerCase()
            })
            if (result && result._id) {
                console.log("Post Updated...");
                req.flash("message", "Post Updated Successfully");
                req.flash("alert", "success-msg")
                res.redirect(`/updatepost/${req.body.id}`);
            } else {
                req.flash('message', 'Something Went Wrong! Please try again later');
                res.redirect(`/updatepost/${req.body.id}`);
            }




        } catch (err) {
            throw err;
        }
    }

    async blogdelete(req, res) {
        try {

            let data = await PostModel.find({ _id: req.params.id })
            let del = await PostModel.findByIdAndUpdate(data[0]._id, { isDeleted: true });
            if (del) {
                req.flash('message_success', 'Data Deleted Successfully');
                // alert("Data Deleted Successfully")
                console.log("Data Deleted Successfully");
                res.redirect('/managepost');
            } else {
                console.log('Not deleted');
                res.redirect('/managepost')
            }
        } catch (err) {
            console.log('Error in delete', err);
            throw err;
        }
    }

    async fetchProducts(req, res) {
        try {
            let result = await PostModel.find({ category: req.body.catId}).populate("user");
            res.send(result)

            
        } catch (err) {
            
            throw err;
        }
    }




    



   























}

module.exports = new UserpostController();










