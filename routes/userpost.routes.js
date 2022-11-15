const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const userpostController = require('../controllers/userpost.controller')

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './public/uploads/')
    },
    filename: (req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const maxSize = 1*1000*1000;

const upload = multer({
    storage,
    fileFilter: (req,file,cb) =>{
        if(file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
            cb(null, true)
        }else{
            cb(null, false);
            return cb(new Error('oniy images are allowed (jpg,png,jpeg)'))
        }
    },
    limits: maxSize
})




router.get('/showpost', userpostController.userAuth, userpostController.showpost);
router.post('/userpost', upload.single('image'), userpostController.userpost);
router.get('/viewpost/:slug',  userpostController.viewpost);
router.post('/comment',  userpostController.addComment);
router.get('/managepost', userpostController.managePost);
router.get('/updatepost/(:id)',  userpostController.showUpdatePost);
router.post('/updatepost', upload.single('image'),  userpostController.updatePost);
router.get('/blogdelete/:id', userpostController.blogdelete);
router.post("/fetchproducts", userpostController.fetchProducts);
// router.post('/postlogin', userlogController.postLogin)
// router.get('/showlogin', userlogController.showlogin)
// router.get('/adminview', adminController.adminview);


// router.get('/logout', userlogController.logoutUser);




module.exports = router;