var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

/* GET newuser page. */
router.get('/newuser', function (req, res) {
    res.render('newuser', {
        title: 'Create account'
    });
});


router.post('/adduser', function (req, res) {
    var email = req.body.useremail;
    var pw = req.body.userpassword;
    var conf = req.body.userconfirmpassword;
    if (conf.localeCompare(password) == 0) {
        var ref = new Firebase('https://memokee.firebaseio.com/');

        ref.set({
            email: email,
            password: pw
        });
    } else {
        console.log('passwords do not match')
    }
})

module.exports = router;