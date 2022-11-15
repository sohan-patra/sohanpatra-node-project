const router = require('express').Router();

const admincategoryController = require('../controllers/admincategory.controller')



router.get('/addcategoryform', admincategoryController.showAddCategory);
router.get('/viewcategory', admincategoryController.adminAuth, admincategoryController.viewCategory);
router.post('/admincategory', admincategoryController.admincategory);


// router.get('/activeUser/:id', adminpostController.activeUser);
// router.get('/deActiveUser/:id', adminpostController.deActiveUser);


module.exports = router;