
var async = require("async");
var request = require('request');

var key = "";
var fields = "name,rating,formatted_phone_number";

var flow_api_get_data = '';
var flow_api_update_data = '';


request(flow_api_get_data , function(error, response, body){ //get company_name in excel
    var company_array = JSON.parse(body).value;

    async.each(company_array, function(i, callback){
        var company = i.Company;

        var option = {
            uri: 'https://maps.googleapis.com/maps/api/geocode/json',
            qs: {
              address: company,
              key: key
            }
          };
        
        request(option, function(error, response, body){
        //   callback();
        GetAddress(body , company)
        });
      }, function(err){
          console.log("Hello");
          if(err){
            console.log("Error grabbing data");
          } else {
            console.log("Finished processing all data");
          }
     }
    );
})

function GetAddress(body ,company){
    var res = JSON.parse(body);
    var address = res.results[0].formatted_address;
    var placeid = res.results[0].place_id;
    var api2 = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+placeid+'&fields='+fields+'&key='+key;
    // console.log("company2: " + company);

    request( api2 , function(error, response, body){
        GetPhone(body , company, address )
    })
}


function GetPhone(body , company, address){
    var phone = JSON.parse(body).result.formatted_phone_number;
    console.log(" company_name :" + company);
    console.log(" address : " + address);
    console.log(" phone : " + phone);
    var update_data = {
        "Company": company,
        "Address": address,
        "Phone": phone
    }
    request.post({ //update to company excel with phone_number & address
        headers: {
            'content-type': 'application/json'
        },
        url: flow_api_update_data,
        body: update_data,
        json: true
    }, function (err, res, body) {
        console.log(body)
    })

}


// async.each(array, function(i, callback){
//     console.log("Grabbing Dataset from " + i.a);
//     request(flow_api_get_data, function(){
//       callback();
//     });
//   }, function(err){
//       console.log("Hello");
//       if(err){
//         console.log("Error grabbing data");
//       } else {
//         console.log("Finished processing all data");
//       }
//  }
// );