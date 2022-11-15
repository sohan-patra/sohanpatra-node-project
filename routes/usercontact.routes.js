const router = require('express').Router();

const usercontactController = require('../controllers/usercontact.controller')





router.get("/contact", usercontactController.userAuth, usercontactController.getContact);
router.post("/contact", usercontactController.contact);
router.get("/forgot", usercontactController.forgot);
router.post("/getlink", usercontactController.getLink);
router.get("/resetpassword/(:email)/(:forgottoken)", usercontactController.resetPassword);
router.post("/resetpassword/(:email)/(:forgottoken)", usercontactController.reset);


module.exports = router;