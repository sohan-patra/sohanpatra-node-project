const router = require('express').Router();

const adminbannerController = require('../controllers/adminbanner.controller')



router.get('/addbannerform',  adminbannerController.showAddbanner);
router.post('/addbanner',  adminbannerController.adminbanner);
router.get('/viewbanner', adminbannerController.adminAuth, adminbannerController.viewbanner);



module.exports = router;