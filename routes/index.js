var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

/* GET Userlist page. */
router.get('/newuser', function (req, res) {
    res.render('newuser', {
        title: 'Create account'
    });
});


router.post('/adduser', function (req, res) {
    var pw = req.body.userpassword;
    var conf = req.body.userconfirmpassword;
    if (conf.localeCompare(password) == 0) {
        var ref = new Firebase('https://memokee.firebaseio.com/');
        //need encryption

    } else {
        //passwords did not match
    }
}
})

module.exports = router;