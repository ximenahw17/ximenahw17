$(document).ready(function () {

    // GuardaHash();
    // let user = localStorage.getItem('HWDbo');
    // let domino = "demo.wcloudservices.mx"; //location.href.split('/')[2]


    console.log('jala');

    $("#imgtest").click(function(){

//alert('hola');
      // $.ajax({
        // type: "POST",
        // "url": "https://hwdbonotifications.azurewebsites.net/api/Notification?code=apqZ7NwPVKOLADLR4ov3NAAUrQqs0fEyGB/bNhC2czTqjzCS8NZ73A==",
        // contentType: "application/json; charset=utf-8",
        // headers: {
            // "Content-Type": "application/json",
        // },
        // dataType: "json",
        // "data": JSON.stringify({"PNS":"fcm","Key":"192582ea-a552-41c8-9a4f-65a91a84d7ac","Message":"Prueba"}),
        // success: function (response) {
                    // console.log(response);
                    // alert('Mensaje Enviado');
                // },
                // error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // console.log(XMLHttpRequest, textStatus, errorThrown);
                // }
            // });
			
			var settings = {
  "url": "https://hwdbonotifications.azurewebsites.net/api/Notification?code=apqZ7NwPVKOLADLR4ov3NAAUrQqs0fEyGB/bNhC2czTqjzCS8NZ73A==",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({"PNS":"fcm","Key":"192582ea-a552-41c8-9a4f-65a91a84d7ac","Message":$('#txtMensaje').val()}),
};

$.ajax(settings).done(function (response) {
  alert('Mensaje Enviado');
});

   
        // var settings = {
        //     "url": "https://apiharwebdbocore.wcloudservices.mx/api/app/SoFIANotifications/GetNotificacionesEmpAll?Mensaje=Holapendejo",
        //     "method": "GET",
        //     "crossDomain": true,
        //     "contentType": "application/json; charset=utf-8",
        //     "dataType": "json",
        //     "timeout": 0,
        //     "headers": {
        //       "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyYW5jaXNjby5jaWJyZWlyb0BoYXJ3ZWJkYm8ubXgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJmcmFuY2lzY28uY2licmVpcm9AaGFyd2ViZGJvLm14IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlcnMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy93ZWJwYWdlIjoicGFueGVhLndjbG91ZHNlcnZpY2VzLm14IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvaGFzaCI6IjMyMDkyNEY2RUVEMjc4Q0I1OTY1NTk4NkVCNDJGMjlBOTAzMUQ2MzI2NkFGNUMyRkI4OTZDMjhBQUYzNjZBN0MiLCJuYmYiOjE2MTQ5MjQzMTksImV4cCI6MTYxNTAxMDcxOSwiaXNzIjoiaGFyd2ViZGJvLm14IiwiYXVkIjoiaGFyd2ViZGJvLm14In0.nJ-fv0lzEEqu1m_LlCvpZB_N41ei4lRzaaF16wvrL5A"
        //     },
        //   };
          
        //   $.ajax(settings).done(function (response) {
        //     alert('Mensaje Enviado');
        //   });


          // $.ajax({
          //       type: "GET",
          //       "url": "https://apiharwebdbocore.wcloudservices.mx/api/app/SoFIANotifications/GetNotificacionesEmpAll?Mensaje=Hola-pendejo",
          //       contentType: "application/json; charset=utf-8",
          //       headers: {
          //           Authorization: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyYW5jaXNjby5jaWJyZWlyb0BoYXJ3ZWJkYm8ubXgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJmcmFuY2lzY28uY2licmVpcm9AaGFyd2ViZGJvLm14IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlcnMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy93ZWJwYWdlIjoicGFueGVhLndjbG91ZHNlcnZpY2VzLm14IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvaGFzaCI6IjMyMDkyNEY2RUVEMjc4Q0I1OTY1NTk4NkVCNDJGMjlBOTAzMUQ2MzI2NkFGNUMyRkI4OTZDMjhBQUYzNjZBN0MiLCJuYmYiOjE2MTQ5MjQzMTksImV4cCI6MTYxNTAxMDcxOSwiaXNzIjoiaGFyd2ViZGJvLm14IiwiYXVkIjoiaGFyd2ViZGJvLm14In0.nJ-fv0lzEEqu1m_LlCvpZB_N41ei4lRzaaF16wvrL5A",
          //           "Content-Type": "application/json",
          //       },                
          //       dataType: "json",
          //       success: function (response) {
          //           console.log(response);
          //           alert('Mensaje Enviado');
          //           //localStorage.setItem('lachula', response.access_token);
          //       },
          //       error: function (XMLHttpRequest, textStatus, errorThrown) {
          //           console.log(XMLHttpRequest, textStatus, errorThrown);
          //       }
          //   });
          


     });

    


    // $.ajax({
    //     type: "POST",
    //     url: "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
    //     contentType: "application/json; charset=utf-8",
    //     headers: {
    //         Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
    //         "Content-Type": "application/json",
    //     },
    //     dataType: "json",
    //     data: JSON.stringify(
    //         {
    //             "API": "8AB5EF6347BBA9D2BED6252EEA0DD8995BBF09A3F0F36E3CA3BE7ED1B60B6A28",
    //             "Parameters": "",
    //             "JsonString": JSON.stringify({
    //                 Email: "edgar.vargas@harwebdbo.mx",
    //                 Hash: localStorage.getItem('hash')
    //             }),
    //             "Hash": localStorage.getItem('hash'),
    //             "Bearer": ""
    //         }
    //     ),
    //     success: function (response) {
    //         console.log(response);
    //         localStorage.setItem('lachula', response.access_token);
    //     },
    //     error: function (XMLHttpRequest, textStatus, errorThrown) {
    //         console.log(XMLHttpRequest, textStatus, errorThrown);
    //     }
    // });

});



