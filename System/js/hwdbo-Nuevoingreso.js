var fecha = new Date();
var dd = fecha.getDate();
var mm = fecha.getMonth() + 1;
var yy = fecha.getFullYear();
var tk = getToken();
var Id_MPv3 = '';

$(document).ready(function () {   
    $.jqx.theme = "light";

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
        sessionStorage.setItem('SWRQYWlz',btoa(IdPais));
        sessionStorage.setItem('SWRfUmF6b25Tb2NpYWw=',btoa($(this).val()));
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

function buscaCURP() 
{

    var obj1=new Object();
    obj1.CURP = $("#txtCUP").val();

    var obj = new Object();
    obj.API="12748271D4C2C1B077DFF974ECFE3F0BF515CD3E0E651F0C1FAB50A6AB567B10";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(obj1);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    setTimeout(function()
    {
        $.when(ajaxTokenFijo(obj)).done(function (response) 
        {   
            if (valdiateResponse(response)) {
                sessionStorage.setItem(response.Id_MPv3, btoa(JSON.stringify(response)));
                Id_MPv3 = response.Id_MPv3;
                $("#lblNombre").text(response.nombre);
                $("#lblPaterno").text(response.apellidopaterno);
                $("#lblMaterno").text(response.apellidomaterno);
                $("#lblFechaNac").text(response.fechanacimiento);
                $("#lblNSS").text(response.nss);
                $("#lblOcupacion").text(response.id_ocupacion);
                $("#DivInfo").show();
                $("#DivTarjetas").show();
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
                    sessionStorage.setItem('Q1VSUA==',btoa($("#txtCUP").val()))
                    $("#cardModificaEmpleado").hide();
                    $("#cardBajaEmpleado").hide();
                    $("#cardReingresoEmpleado").hide();
                    $("#cardAltaRazonSocial").hide();
                }
            } 
            else 
            {
                showMsg('Error',response);
                $("#DivInfo").hide();
                $("#DivTarjetas").hide();
            }                    
            ocultarCargador();
        }).fail(function(){
            showMsg('Error','Ocurrió un error al recibir la respuesta');
            ocultarCargador();
        });  
    },1500);
}

function accionEmpleado(_estatus) {
    changeLocation("AltaEmpleado.html?estatus=" + _estatus);
}
