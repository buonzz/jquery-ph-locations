# jQuery PH Locations

jQuery Plugin for displaying dropdown list of Philippines' Region, Province, City and Barangay in your webpage.


install it by putting this in your HTML code (head or right before footer)

```
<script src="https://f001.backblazeb2.com/file/buonzz-assets/jquery.ph-locations.js"></script>
```

create the markup
```
<select name="city" id="my-city-dropdown"></select>
```

initialize the control
```
$('#my-city-dropdown').ph_locations({'location_type': 'cities'});
```

the **location_type** is the only required parameter to initialize the plugin. the possible values are:

* regions - this dropdown will gonna be filled with list of region
* provinces - this dropdown will gonna be filled with list of province
* cities - this dropdown will gonna be filled with list of cities
* barangays - this dropdown will gonna be filled with list of barangay

populate the dropdown with items

```
$('#my-city-dropdown').ph_locations( 'fetch_list', [{"province_code": "1339"}]);
```

in order to populate the dropdown with items, you need to call the **fetch_list** function by the plugin as shown above. the fetch_list function can accept **filters** that allows you to limit the number of items to show. For example, the dropdown above will list only show cities that is under Manila City, represented by province_code 1339. The 1339 value is the assigned code by  [Philippine Standard Geographic Codes (PSGC)](https://psa.gov.ph/classification/psgc/)



