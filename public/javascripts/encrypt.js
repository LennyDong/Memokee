var crypto = require("crypto"),
	key = 'from_Berkeley_to_UMD',
	plaintext= 'password',
	cipher = crypto.createCipher('aes-256-cbc', key),
	decipher = crypto.createDecipher('aes-256-cbc', key);

// Feeds the cipher with:
//		1) password to be encrypted
//		2) The encoding format of the password
//		3) The endocing format of the encryption
cipher.update(plaintext, 'utf8', 'base64');

// Spits out the encrypted password
var encryptedPassword = cipher.final('base64');

// Feeds the decipher with :
//		1) The encrypted password
//		2) The encoding format of the encryption
//		3) The encoding format of the password
decipher.update(encryptedPassword, 'base64', 'utf8');

// Spits out the original password
var decryptedPassword = decipher.final('utf8');

