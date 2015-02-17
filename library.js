
var fs = require('fs'),
path = require('path'),
async = require('async'),
meta = module.parent.require('./meta');
var settings = {};
Adsense = {
	init: function() {
		var	_self = this,
		fields = [
		'client_id', 'header_id', 'footer_id', 'first_post_id', 'after_first_post_id', 'first_post_position', 'header_active', 'footer_active', 'first_post_active', 'after_first_post_active'
		],
		defaults = {
			'client_id': '',
			'header_id': '',
			'footer_id': '',
			'first_post_id': '',
			'after_first_post_id': '',
			'first_post_position': 'bottom',
			'header_active': false,
			'footer_active': false,
			'first_post_active': false,
			'after_first_post_active': false

		};
		meta.settings.get('google-adsense', function(err, options) {
			for(var field in options) {
				if (options.hasOwnProperty(field)) {
					settings[field] = options[field];
				}
			}
			fs.writeFile("public/google-adsense.config.json", JSON.stringify(settings), function (err){
			})
		});
	},

	admin:{
		menu: function(custom_header, callback) {
			custom_header.plugins.push({
				"route": '/plugins/google-adsense',
				"icon": 'fa-usd',
				"name": 'Google Adsense'
			});

			callback(null, custom_header);
		},
		onLoad: function(params, callback) {
			function render(req, res, next) {
				res.render('admin/plugins/google-adsense', {});
			}
            
			params.router.get('/admin/plugins/google-adsense', params.middleware.admin.buildHeader, render);
			params.router.get('/api/admin/plugins/google-adsense', render);
            
            callback();
		},
		activate: function(id) {
			if (id === 'nodebb-plugin-google-adsense') {
				var defaults = [
				{ field: 'client_id', value: '' },
				{ field: 'header_id', value: '' },
				{ field: 'footer_id', value: '' },
				{field: 'after_first_post_id', value: ''},
				{ field: 'first_post_position', value: 'bottom' },
				{ field: 'first_post_id', value: '' },
				{ field: 'header_active', value: 'Off' },
				{ field: 'footer_active', value: 'Off' },
				{ field: 'first_post_active', value: 'Off' },
				{field: 'after_first_post_active', value: 'Off'}
				];

				async.each(defaults, function(optObj, next) {
					meta.settings.setOnEmpty('google-adsense', optObj.field, optObj.value, next);
				});
			}
		},
		deactivate: function(id) {
			if (id === 'nodebb-plugin-google-adsense') {
				fs.unlink("public/google-adsense.config.json", function (){

				})
			}
		}
	}
};

function getInsCode(clientId, dataId){
	var ad = '<ins class="adsbygoogle" style="display:block; margin:0 auto; margin-bottom:15px; " data-ad-client="' + clientId + '" data-ad-slot="' + dataId + '" data-ad-format="auto"></ins>';
	return ad;
}
Adsense.init();
module.exports = Adsense;
