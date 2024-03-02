/*
 *  jquery-ph-locations - v1.0.3
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
                location_type : "cities", // what data this control supposed to display? regions, provinces, cities or barangays?,
				api_base_url: 'http://localhost:3333/v1/',
				order: "name asc",
				filter: {},
                default_values : {
                    "regions": "Select Region",
                    "provinces": "Select Province",
                    "cities": "Select City",
                    "barangays" : "Select Barangay"
                },
                use_psgc_as_value : false,
                api_key: "knffxw2q0x13ty4KImwlDaX6yNOv4aXftqdbe8vi",
				selected_value: ''
            };

		// plugin constructor
		function Plugin ( element, options ) {
            this.psgc_code = '';
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
                $(this.element).on('change', this.onChange.bind(this));
				return this
            },

			fetch_list: function (options) {

				if(options.filter != undefined)
					this.settings.filter = options.filter;
				if(options.location_type != undefined)
					this.settings.location_type = options.location_type;
				if(options.selected_value != undefined)
					this.settings.selected_value = options.selected_value;

				$.ajax({
                    type: "GET",
                    url: this.settings.api_base_url +  this.settings.location_type,
                    crossDomain: true,
                    dataType: 'json',
                    headers: {"x-api-key": this.settings.api_key},
					success: this.onDataArrived.bind(this),
					data: $.param(this.map_parameters())
                });

            }, // fetch list
            onDataArrived(data){
				$(this.element).html(this.build_options(data));
			},

			map_parameters(){

				var mapped_parameter = {"filter": {
					"where": {},
					"order" : this.settings.order
					}
				};

				 for(var property in this.settings.filter)
				    mapped_parameter.filter.where[property] = this.settings.filter[property];

				 return mapped_parameter;
			},

			build_options(params){
				var shtml = "";

                // add default value
                shtml += '<option value="" disabled="disabled" selected>';
                shtml +=  this.settings.default_values[this.settings.location_type];
                shtml += '</option>';

				for(var i=0; i<params.data.length;i++){

                    if(this.settings.use_psgc_as_value){
    					shtml += '<option value="' + params.data[i].id + '" data-psgc-code=' +  params.data[i].id; 
						if(this.settings.selected_value ==  params.data[i].id)
							shtml += ' selected="selected" ';
						shtml += '>';
					}
                    else { 
    					shtml += '<option value="' + params.data[i].name + '" data-psgc-code=' +  params.data[i].id; 
						if(this.settings.selected_value ==  params.data[i].name)
							shtml += ' selected="selected" ';
						shtml += '>';
					}
					shtml +=  params.data[i].name ;
					shtml += '</option>';
				}

				return shtml;
			},
            onChange(e){
                var val = $( "option:selected" , this.element).data('psgc-code');
                $(this.element).data('selected-psgc-code', val);
			},
			select2: function(options){

				this.settings.location_type = options.location_type;

				var api_url = this.settings.api_base_url +  this.settings.location_type
				var api_key = this.settings.api_key;
				var region_code = '';
				var province_code = '';
				var city_code = '';
				var selected_value = options.selected_value != undefined ? options.selected_value : '';

				if(options.region_code != undefined)
					region_code = options.region_code;
				
				if(options.province_code != undefined)
					province_code = options.province_code;
				
				if(options.city_code != undefined)
					city_code = options.city_code;


				// add default value
				var shtml = "";
				shtml += '<option value="" disabled="disabled">';
				shtml +=  this.settings.default_values[this.settings.location_type];
				shtml += '</option>';
				$(this.element).html(shtml);

				// set default selected
				$(this.element).append(new Option(selected_value, selected_value, true, false)).trigger('change');

				$(this.element).select2({
                    ajax: {
                        url:  api_url + '/select2',
                        dataType: 'json',
						headers: {"x-api-key": api_key},
                        data: function (params) {
							params.region_code = region_code;
                            params.province_code = province_code;
                            params.city_code = city_code;
                            return params;
                        }
                    },
                    dropdownAutoWidth : true
                });
			}
		} );


		$.fn[ pluginName ] = function( options, args ) {
			return this.each( function() {
				var $plugin = $.data( this, "plugin_" + pluginName );
				if (!$plugin) {
					var pluginOptions = (typeof options === 'object') ? options : {};
					$plugin = $.data( this, "plugin_" + pluginName, new Plugin( this, pluginOptions ) );
				}

				if (typeof options === 'string') {
					if (typeof $plugin[options] === 'function') {
						if (typeof args !== 'object') args = [args];
						$plugin[options].apply($plugin, args);
					}
				}
			} );
		};

} )( jQuery, window, document );