/*
 *  jquery-ph-locations - v1.0.0
 *  jQuery Plugin for displaying dropdown list of Philippines' Region, Province, City and Barangay in your webpage.
 *  https://github.com/buonzz/jquery-ph-locations
 *
 *  Made by Buonzz Systems
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

	"use strict";

		// defaults
		var pluginName = "ph_locations",
			defaults = {
                location_type : "city", // what data this control supposed to display? regions, provinces, cities or barangays?,
				api_base_url: 'https://ph-locations-api.buonzz.com/',
				filter: {}
            };

		// plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
				this.fetch_list();
            },
            
			fetch_list: function() {

                $.ajax({
                    type: "GET",
                    url: this.settings.api_base_url + 'v1/' +  this.settings.location_type,
					success: this.onDataArrived.bind(this),
					data: $.param(this.map_parameters())
                });
                this.settings

            }, // fetch list
            onDataArrived(data){
				$(this.element).html(this.build_options(data));
			},

			map_parameters(){

				var mapped_parameter = {"filter": {
					"where": {}
					} 
				};

				 for(var property in this.settings.filter)
				    mapped_parameter.filter.where[property] = this.settings.filter[property];

				 return mapped_parameter;
			},

			build_options(params){
				var shtml = "";

				for(var i=0; i<params.data.length;i++){
					shtml += '<option value="' + params.data[i].id + '">';
					shtml +=  params.data[i].name ;
					shtml += '</option>';
				}

				return shtml
			}
            
		} );


		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );