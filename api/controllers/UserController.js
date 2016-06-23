/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var passport = require('passport');

 module.exports = {

 	home: function(req, res){
 		if(req.session.user==null)
	 		res.redirect('user/login');
	 	else
	 		res.redirect('/user/dashboard');
 	},

   login: function (req, res) {
     res.view();
   },

   dashboard: function (req, res) {
   	if(req.session.user==null)
   		res.redirect('user/login');
   	else	
     res.view();
   },

   logout: function (req, res){
     req.session.user = null;
     req.session.flash = 'You have logged out';
     res.redirect('user/login');
   },

   'facebook': function (req, res, next) {
      passport.authenticate('facebook', { scope: ['email']},
         function (err, user) {
             req.logIn(user, function (err) {
             if(err) {
                 req.session.flash = 'There was an error';
                 res.redirect('user/login');
             } else {
                 req.session.user = user;
                 res.redirect('/user/dashboard');
             }
         });
     })(req, res, next);
   },

   'facebook/callback': function (req, res, next) {
      passport.authenticate('facebook',
         function (req, res) {
             res.redirect('/user/dashboard');
         })(req, res, next);
   }

 };

