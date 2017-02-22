const config_dev = {
	firebaseConfig: {
		apiKey: 'AIzaSyA1LW0612NA3SO8Wsg60kFCqOuB1-hVDLY',
		authDomain: 'redime-dev.firebaseapp.com',
		databaseURL: 'https://redime-dev.firebaseio.com',
		storageBucket: 'redime-dev.appspot.com',
		messagingSenderId: '422692571227'
	}

}

const config_prod = {
	firebaseConfig: {
		apiKey: '',
		authDomain: '',
		databaseURL: '',
		storageBucket: '',
		messagingSenderId: ''
	}

}

export const environment = config_dev;
