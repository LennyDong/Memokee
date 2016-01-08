var Firebase = require('firebase');
var myFirebaseRef = new Firebase('amber-heat-4870.firebaseio.com/');
var testEntry = {
	'users': {
		'30932fdc676336e89786929a1643d6a9': {
			'salt': 'testsalt',
			'hash': 'FmZHT+2cOA0+EjQbS65gWA==',
		}

	}
}
myFirebaseRef.set(testEntry);