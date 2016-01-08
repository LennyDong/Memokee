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
        "userlist": docs
    });
});


router.post('/adduser', function (req, res) {
    if (req.body.userpassword === req.body.userconfirmpassword) {
        var ref = new Firebase('https://memokee.firebaseio.com/');
        //need encryption

    } else {
        //passwords did not match
    }
}
})

module.exports = router;