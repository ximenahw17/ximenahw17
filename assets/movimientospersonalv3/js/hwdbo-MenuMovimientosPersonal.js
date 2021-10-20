$(document).ready(function () {
    localStorage.clear();
    
    GuardaHash();

    let usuario =sessionStorage.getItem('user');
    usuario = usuario!=null&&usuario!=""?usuario:"ximena.cerna@harwebdbo.mx";

    $.ajax({
        type: "POST",
        url: "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
        },
        dataType: "json",
        data: JSON.stringify(
            {
                "API": "8AB5EF6347BBA9D2BED6252EEA0DD8995BBF09A3F0F36E3CA3BE7ED1B60B6A28",
                "Parameters": "",
                "JsonString": JSON.stringify({
                    Email: usuario,
                    Hash: getHSH()
                }),
                "Hash": getHSH(),
                "Bearer": ""
            }
        ),
        success: function (response) {
            localStorage.setItem('S0hEQk8=', response.access_token);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    });

});

function accionEmpleado(ruta) {
    window.location.href = ruta;
}

function GuardaHash() {
    let url = new URL(location.href);
    let _IdRef = url.searchParams.get("siteCode");
    localStorage.setItem('aGFzaA==', _IdRef);
}

