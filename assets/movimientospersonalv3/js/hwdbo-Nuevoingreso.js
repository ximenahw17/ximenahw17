var fecha = new Date();
var dd = fecha.getDate();
var mm = fecha.getMonth() + 1;
var yy = fecha.getFullYear();
var tk = getToken();
var Id_MPv3 = '';

$(document).ready(function () {   
    $.jqx.theme = "light";
    //$(".hwdbo-texto").jqxInput({ width: '99%', height: '30px', disabled: true });

    $('#jqxBtnBuscar').jqxButton({ width: '150', height: '30' }).on('click', function () {
        if($("#txtCUP").val()!="")
        {
            mostrarCargador();
            buscaCURP();
        }
        else{
            showMsg('Mensaje','Por favor ingrese el CURP');
        }
    });

    fillCombo(40, 'SelRazonSocial', '');

    $("#cardAltaEmpleado").hide();
    $("#cardModificaEmpleado").hide();
    $("#cardBajaEmpleado").hide();
    $("#cardReingresoEmpleado").hide();
    $("#cardAltaRazonSocial").hide();

    $(".card-option").css('cursor','pointer');
    $(".card-option").on('click', function () {
        let _estatus = this.dataset.estatus;
        mostrarCargador();
        setTimeout(function(){ changeLocation("AltaEmpleado.html?estatus=" + _estatus + "&IdRef=" + Id_MPv3); },2000);
    });

    $(".splitter-panel").css('height',170)

    $("#SelRazonSocial").on('change',function(event){
        event.preventDefault();
        let IdPais=event.args.item.originalItem.Id_Pais;
        localStorage.setItem('SWRQYWlz',btoa(IdPais));
        localStorage.setItem('SWRfUmF6b25Tb2NpYWw=',btoa($(this).val()));
        $.when(ajaxCatalogo(46,'&_Parameters=\'curp\',\''+IdPais+'\'')).done(function (response) {
            $("#txtCUP").attr('placeholder',"Ingrese "+ response[0].Etiqueta+"...");
            $("#DivBusqueda").show();
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status===200)
            {
                $("#txtCUP").attr('placeholder',"Ingrese CURP...");
                $("#DivBusqueda").show();
            }
            else{
                showMsg('Error',errorThrown);
                $("#DivBusqueda").hide();
            }
        });
         
    });
    $("#SelRazonSocial").jqxDropDownList({ theme:'fresh', width:"100%", height:"27px", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", openDelay: 0, animationType: 'none' });

    setTimeout(ocultarCargador,1000);
});

function validaCURP(elem) {
    let val = elem.value;
    if (val.length == 18) {
        $("#jqxBtnBuscar").jqxInput({ disabled: false });
    } else {
        $("#jqxBtnBuscar").jqxInput({ disabled: true });
    }
}

function buscaCURP() {
    let curp = { "CURP": $("#txtCUP").val() };
    $.ajax({
        type: "POST",
        url: "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
        },
        dataType: "json",
        data: JSON.stringify({
            "API": "8CA64ABA598F943C9B2CCBD6C4D36BB68A2B7E66837756B394E52C7C93E9BA61",
            "Parameters": "",
            "JsonString": JSON.stringify(curp),
            "Hash": getHSH(),
            "Bearer": getToken()
        }),
        success: function (response) {
            if (valdiateResponse(response)) {
                localStorage.setItem(response.Id_MPv3, btoa(JSON.stringify(response)));
                Id_MPv3 = response.Id_MPv3;
                $("#lblNombre").text(response.nombre);
                $("#lblPaterno").text(response.apellidopaterno);
                $("#lblMaterno").text(response.apellidomaterno);
                $("#lblFechaNac").text(response.fechanacimiento);
                $("#lblNSS").text(response.nss);
                $("#lblOcupacion").text(response.id_ocupacion);
                $("#DivInfo").show();
                $(".splitter-panel").show();

                //Activo
                if (response.estatus == "1") {
                    $("#cardAltaEmpleado").hide();
                    $("#cardModificaEmpleado").show();
                    $("#cardBajaEmpleado").show();
                    $("#cardReingresoEmpleado").hide();
                    $("#cardAltaRazonSocial").show();
                }
                //Inactivo
                else if (response.estatus == "2") {
                    $("#cardAltaEmpleado").hide();
                    $("#cardModificaEmpleado").hide();
                    $("#cardBajaEmpleado").hide();
                    $("#cardReingresoEmpleado").show();
                    $("#cardAltaRazonSocial").hide();
                }
                //No existe
                else if (response.estatus == "3") {
                    $("#cardAltaEmpleado").show();
                    localStorage.setItem('Q1VSUA==',btoa($("#txtCUP").val()))
                    $("#cardModificaEmpleado").hide();
                    $("#cardBajaEmpleado").hide();
                    $("#cardReingresoEmpleado").hide();
                    $("#cardAltaRazonSocial").hide();
                }
            } 
            else {
                showMsg('Error',response);
                $("#DivInfo").hide();
            }
            ocultarCargador();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log(XMLHttpRequest, textStatus, errorThrown);
            console.log(XMLHttpRequest);
            showMsg('Error','Ocurrió un error al recibir la respuesta');
            ocultarCargador();
        }
    });
}

function accionEmpleado(_estatus) {
    changeLocation("AltaEmpleado.html?estatus=" + _estatus);
}
