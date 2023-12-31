const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // const geoData = await geocoder.forwardGeocode({
    //     query: 'Nanded Maharashtra',
    //     limit: 1
    // }).send();
    // console.log(geoData);

    //Creating schema for joi to validate the input data
    const campground = new Campground(req.body.campground);
    //campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Successfuly created new campground !");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }
    ).populate('author');
    if (!campground) {
        req.flash('error', 'This campground does not exist !');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'This campground does not exist !');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    //console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', "Successfuly updated campground !");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfuly deleted campground !");
    res.redirect(`/campgrounds/`);
}


