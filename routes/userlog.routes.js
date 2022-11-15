const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const userlogController = require('../controllers/userlog.controller')

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

router.get('/', userlogController.index);
// router.get('/dashboard', adminController.adminAuth,  adminController.dashboard)

router.get('/showregister', userlogController.showregister);
router.post('/register', upload.single('image'), userlogController.register);
router.post('/postlogin', userlogController.postLogin)
router.get('/showlogin', userlogController.showlogin)
// router.get('/adminview', adminController.adminview);


router.get('/logout', userlogController.logoutUser);




module.exports = router;