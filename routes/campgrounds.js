const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrouds = require('../controller/campground')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrouds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrouds.createCampground));
//.post(upload.single("image"), (req, res) => { res.send(req.body, req.file) })

router.get('/new', isLoggedIn, catchAsync(campgrouds.renderNewForm));

router.route('/:id')
    .get(catchAsync(campgrouds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrouds.updateCampground))
    .delete(catchAsync(campgrouds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrouds.renderEditForm));

module.exports = router;
