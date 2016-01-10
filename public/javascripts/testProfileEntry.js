var Firebase = require('firebase');
var myFirebaseRef = new Firebase('amber-heat-4870.firebaseio.com/');
var testEntry = {
	'users': {
		'30932fdc676336e89786929a1643d6a9': {
			'salt': 'testsalt',
			'hash': 'FmZHT+2cOA0+EjQbS65gWA==',
			'list': {
				'facebook': {
					'username': 'testuser',
					'password': 'password'
				},
				'twitter': {
					'username': 'testuser',
					'password': 'password'
				},
				'snapchat': {
					'username': 'testuser',
					'password': 'password'
				}
			}
		},
		'0c0dda9ae523b96788e0f1940c0309a3': {
			'salt': 'testsalt',
			'hash': 'FmZHT+2cOA0+EjQbS65gWA==',
			'list': {
				'facebook': {
					'username': 'testuser2',
					'password': 'password'
				},
				'twitter': {
					'username': 'testuser2',
					'password': 'password'
				},
				'snapchat': {
					'username': 'testuser2',
					'password': 'password'
				}
			}
		},
		'2b5d534afa366417ee628c7afb48607a': {
			'salt': 'testsalt',
			'hash': 'FmZHT+2cOA0+EjQbS65gWA==',
			'list': {
				'facebook': {
					'username': 'testuser3',
					'password': 'password'
				},
				'twitter': {
					'username': 'testuser3',
					'password': 'password'
				},
				'snapchat': {
					'username': 'testuser3',
					'password': 'password'
				}
			}
		}
	}
}
myFirebaseRef.set(testEntry);