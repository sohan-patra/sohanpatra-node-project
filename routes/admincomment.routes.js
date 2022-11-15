const router = require('express').Router();

const admincommentController = require('../controllers/admincomment.controller')



router.get('/viewcomment', admincommentController.adminAuth, admincommentController.viewcomment);
router.get('/showadmincommentForm', admincommentController.showadmincommentForm);
router.post('/admincomment',  admincommentController.admincomment);
router.get('/activeComment/:id', admincommentController.activeComment);
router.get('/deActiveComment/:id', admincommentController.deActiveComment);


module.exports = router;