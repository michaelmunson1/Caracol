/**
 * Module dependencies.
 */
  var Clipping = require('../database/dbschemas.js'),
    _ = require('underscore');


/**
 * Find clipping by id
 */
exports.clipping = function(req, res, next, id) {
    Clipping.load(id, function(err, clipping) {
        if (err) { return next(err); }
        if (!clipping) { return next(new Error('Failed to load clipping ' + id)); }
        req.clipping = clipping;
        next();
    });
};

/**
 * Create a clipping
 */
exports.create = function(req, res) {
    var clipping = new Clipping(req.body);
    clipping.user = req.user;

    clipping.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                clipping: clipping
            });
        } else {
            res.jsonp(clipping);
        }
    });
};

/**
 * Update a clipping
 */
exports.update = function(req, res) {
    var clipping = req.clipping;

    clipping = _.extend(clipping, req.body);

    clipping.save(function() {
        res.jsonp(clipping);
    });
};

/**
 * Delete an clipping
 */
exports.destroy = function(req, res) {
    var clipping = req.clipping;

    clipping.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(clipping);
        }
    });
};

/**
 * Show an clipping
 */
exports.show = function(req, res) {
    res.jsonp(req.clipping);
};

/**
 * List of Clipping
 */
exports.all = function(req, res) {
    Clipping.find().sort('-created').populate('user', 'name username').exec(function(err, clipping) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(clipping);
        }
    });
};
