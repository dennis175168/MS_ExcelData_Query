
var request = require('request');
const util = require('util');

var key = "AIzaSyDKoe3HgubCTmPENDXEVQF0Lby92kH3iCo";
var fields = "name,rating,formatted_phone_number";

var flow_api_get_data = 'https://prod-29.southeastasia.logic.azure.com:443/workflows/f36bf8349756429e97b854698ccce097/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bEA5DSjealajQJk_5FrIlPA_IQSPEMlt33Ee1MxnXj8';
var flow_api_update_data = 'https://prod-03.southeastasia.logic.azure.com:443/workflows/8a0d029c52074e0dabdea73da26bd044/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_ghALYQcUGX8QdnTnqnLTPr8a5AOqKJ53C03kQ1vZeA';

const r1 = util.promisify(request);

request(flow_api_get_data , function(error, response, body){ //get company_name in excel
    var company_array = JSON.parse(body).value;
    console.log(company_array);
    zzz(company_array);

    for( var i = 0 ;i <= company_array.length-1 ;i++){
        var company = company_array[i].Company;
        
        var option = {
            uri: 'https://maps.googleapis.com/maps/api/geocode/json',
            qs: {
              address: company,
              key: key
            }
          };
        var api1 = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(escape(company))+'&key='+key;

        r1(option, function(error, response, body) { // get place_id
            console.log(i);
            var res = JSON.parse(body);
            // console.log(res);
            var address = res.results[0].formatted_address;
            var placeid = res.results[0].place_id;
            
            var api2 = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+placeid+'&fields='+fields+'&key='+key;
            // console.log(company);

            r1(api2 ,function(error, response, body){ //get company address and phone_number
                // console.log(body);
                var phone = JSON.parse(body).result.formatted_phone_number;
                console.log(" company_name :"+company);
                console.log(" place_id : "+placeid);
                console.log(" address : "+address);
                console.log(" phone : "+phone);
                var update_data ={
                    "Company" : company,
                    "Address" : address,
                    "Phone" : phone
                }
                // request.post({//update to company excel with phone_number & address
                //     headers: {'content-type': 'application/json'},
                //     url : flow_api_update_data,
                //     body : update_data,
                //     json: true
                // },function(err , res , body){ 
                //     console.log(body)
                // })

        
            })
        
          });
    }
});



function zzz(company_array){
    async.each(company_array, function(apiRequest, cb) {
        apicall(apiRequest, cb);
    }, function(err) {
       // do something after all api requests have been made
    });

    function apicall(){}
    for( var i = 0 ;i <= company_array.length-1 ;i++){
        var company = company_array[i].Company;
        var option = {
            uri: 'https://maps.googleapis.com/maps/api/geocode/json',
            qs: {
              address: company,
              key: key
            }
          };
        request(option,(error, response, body)=>{
            console.log(i);
        })
    }
}

// request.post({
//     headers: {'content-type' : 'application/x-www-form-urlencoded'},
//     url:     'flow_api_get_data',
//     body:    ""
//   }, function(error, response, body){
//     console.log(body);
//   });







