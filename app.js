const path = require('path');
const fs = require('fs');

const express = require('express');

const mongoose = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.uirpv.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});
const csrfProtection = csrf();

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/png'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, 'access.log'),
	{ flags: 'a' }
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

const s3 = new aws.S3({
	region: 'us-east-2',
	accessKeyId: `${process.env.ACCESS_KEY_ID}`,
	secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
});

app.use(express.urlencoded({ extended: false }));
app.use(
	multer({
		storage: multerS3({
			s3: s3,
			bucket: 'banditsblogimgs',
			acl: 'public-read-write',
			metadata: function (req, file, cb) {
				cb(null, { fieldName: file.fieldname });
			},
			key: function (req, file, cb) {
				cb(null, 'bandit-img-' + file.originalname);
			},
		}),
		fileFilter: fileFilter,
	}).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	res.locals.isAdmin = req.session.isAdmin;
	next();
});

app.use('/admin', adminRoutes);
app.use(blogRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(MONGODB_URI)
	.then(result => {
		app.listen(process.env.PORT || 3000);
	})
	.catch(err => {
		console.log(err);
	});
