const UserModel = require("../models/adminuser.model");
const PostModel = require("../models/adminpost.model");
const categoryModel = require("../models/admincategory.model");

class AdminpostController {

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


    async posts(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            console.log('My print:', adminData);

           

            let allData = await PostModel.aggregate([



                {
                    $lookup: {
                        from: 'categories',
                        let: {
                            cattId: '$category'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {


                                                $eq: ['$_id', '$$cattId']
                                            }
                                        ]
                                    }
                                }
                            },

                            {
                                $project: {
                                    createdAt: 0


                                }
                            },
                        ],
                        as: 'category'
                    }
                },

                {
                    $unwind: {
                        path: '$category'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$user'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
                                            }
                                        ]
                                    }
                                }
                            },
                            // {
                            //     $project: {
                            //         createdAt: 0


                            //     }
                            // },
                        ],
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user'
                    }
                },
                // {
                //     $project: {
                //         createdAt: 0,


                //     }
                // },

            ]);
            console.log('AllData :', allData);
            console.log('My Data :');
         
            res.render('admin/posts', {
                page_title: "Admin || Posts",
                data: req.admin,
                adminData,
                displayData: allData
            })
        } catch (err) {
            throw err;
        }
    }

    async showadminpostForm(req, res) {
        try {
            let adminData = await UserModel.find({ _id: req.admin.id, isAdmin: false })
            console.log('My print:', adminData);
            let allCart = await categoryModel.find({});
            let allUsers = await UserModel.find({});
            res.render('admin/postform', {
                page_title: "Admin || Postform",
                message_success: req.flash('message_success'),
                message_failed: req.flash('message_failed'),
                message_warning: req.flash('message_warning'),
                data: req.admin,
                adminData,
                allCart,
                allUsers
            });
        } catch (err) {
            throw err;
        }
    }

    async adminpost(req, res) {
        try {
            console.log("Body Main Part :", req.body);
            console.log("image :", req.files);
            if (req.file && req.file.filename) {
                req.body.image = req.file.filename;
            }
            req.body.category = req.body.category.trim();
            req.body.title = req.body.title.trim();
            req.body.subTitle = req.body.subTitle.trim();
            req.body.postText = req.body.postText.trim();
            req.body.slug = req.body.title.trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_").toLowerCase();









            if (req.body.category && req.body.title && req.body.subTitle && req.body.postText && req.body.image) {





                let saveData = await PostModel.create(req.body);
                if (saveData && saveData._id) {
                    req.flash('message_success', 'User Posted Successfully!');
                    res.redirect('/admin/showadminpostForm')
                } else {
                    req.flash('message_failed', 'Something Went Wrong! Please try again later');
                    res.redirect('/admin/showadminpostForm')
                }





            } else {
                req.flash('message_warning', 'Field is Empty');
                res.redirect('/admin/showadminpostForm')
            }

        } catch (err) {
            throw err;
        }

    }

    async activePost(req, res) {
        try {
            let data = await PostModel.find({ _id: req.params.id })
            let postactive = await PostModel.findByIdAndUpdate(data[0]._id, { status: true });
            if (postactive) {
                req.flash('message_success', 'Data Activeted Successfully');
                res.redirect('/admin/posts');
            } else {
                console.log('Not Activeted');
                res.redirect('/admin/posts');
            }

        } catch (err) {
            throw err;
        }
    }

    async deActivePost(req, res) {
        try {
            let data = await PostModel.find({ _id: req.params.id })
            let postdactive = await PostModel.findByIdAndUpdate(data[0]._id, { status: false });
            if (postdactive) {
                req.flash('message_success', 'Data Deactiveted Successfully');
                res.redirect('/admin/posts');
            } else {
                console.log('Not Deactiveted');
                res.redirect('/admin/posts');
            }

        } catch (err) {
            throw err;
        }
    }


}

module.exports = new AdminpostController();