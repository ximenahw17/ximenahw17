var IdResultadoBusqueda = "";
var CURP = "";
var Estatus = 0;

$(document).ready(function () {
    
    $.jqx.theme = "light";

    $("#jqxtabs").jqxTabs({
        width: '100%',
        height: '100%',
        position: 'top'
    });
    
    $(".hwdbo-texto").jqxInput({ width: '100%', height: '30px', disabled: true });
    
    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '100%', height: '30px', disabled: true });

    $(".hwdbo-checkBox").jqxCheckBox({ width: '85%', height: 25, disabled: true });

    $("#estatura").prop("disabled", true);
    
    $("#peso").prop("disabled", true);
    
    $("#observacionesbaja").prop("disabled", true);

    armaGridSubcontratantes();
    
    obtieneDatosEmpleado();

    $("#divContenido").show();

});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $.confirm({
            title: 'Advertencia',
            content: 'Este navegador no soporta la geolocalización.',
            autoClose: 'aceptar|3000',
            buttons: {
                aceptar: function () {
                }
            }
        });
    }
}

function MostrarMenu()
{
    $("#MenuOpciones").toggle();
}

function showPosition(position) {

    /*var mymap = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGFyd2ViZGJvIiwiYSI6ImNrb2NjY2txNzA3bXQycnRlZ3Q4NXFuYnkifQ.F0-4Vs8Ri55pEKy0nxEgiA', {
        maxZoom: 18,
        //attribution: 'Make with love; <a href="https://www.harweb.mx/?gclid=CjwKCAjwhMmEBhBwEiwAXwFoEY16_CqCBEoi-dqh6YYwm1MSCZtiGnP_1L_1udmlwHVznBszv3_7SRoC9u8QAvD_BwE">Harweb DBO</a>',
        attribution: 'Joto el que lo lea',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);
    L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);*/

    //var mymap = L.map('map').setView([position.coords.latitude, position.coords.longitude], 10);
    //var marker = L.marker([position.coords.latitude, position.coords.longitude], { draggable: 'true' }).addTo(mymap);
    //L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //    //attribution: 'Make with love; <a href="https://www.harweb.mx/?gclid=CjwKCAjwhMmEBhBwEiwAXwFoEY16_CqCBEoi-dqh6YYwm1MSCZtiGnP_1L_1udmlwHVznBszv3_7SRoC9u8QAvD_BwE">Harweb DBO</a>',
    //    attribution: '<b>Joto el que lo lea</b>',
    //    id: 'mapbox/streets-v11',
    //    tileSize: 512,
    //    zoomOffset: -1,
    //    accessToken: 'pk.eyJ1IjoiaGFyd2ViZGJvIiwiYSI6ImNrb2NjY2txNzA3bXQycnRlZ3Q4NXFuYnkifQ.F0-4Vs8Ri55pEKy0nxEgiA',
    //    center: [position.coords.latitude, position.coords.longitude],
    //    zooms: [9, 10, 11, 12, 13, 14, 15],
    //    minZoom: 9,
    //    maxZoom: 15
    //}).addTo(mymap);

    //L.tileLayer('tiles/{z}/{x}/{y}.png', {
    //    nativeZooms: [10, 14]
    //}).addTo(mymap);
}

function armaGridSubcontratantes()
{
    $("#DivGridSubcontratante").html('<div id="GridSubcontratante"></div>');
    $("#GridSubcontratante").jqxGrid(
        {
            width: '99.5%',
            autoheight:true,
            pagesize: 30,
            pageable: true,
            pagesizeoptions: ['10', '20', '50'],
            columnsresize: true,
            sortable: true,
            editable:false,
            selectionmode: 'none',
            localization: getLocalization(),
            rendergridrows: function (args) {
                return args.data;
            },
            columns: [
                { text: 'Valor', datafield: 'Valor', width: '10%', align: 'center', cellsalign: 'center', editable: false,  },
                { text: 'Razón social subcontratante', datafield: 'Descripcion', width: '20%', align: 'center', cellsalign: 'left', editable: false },
                {text: 'Porcentaje', datafield: 'Porcentaje', width: '20%', align: 'center', cellsalign: 'center', editable: false, columntype: 'numberinput', cellsformat:'d2' },      
            ],
            ready: function () {
                setTimeout(function () {
                    $('#GridSubcontratante').jqxGrid('hidecolumn','Valor');
                    $('#GridSubcontratante').jqxGrid('autoresizecolumns');
                }, 500);
            }
    });
}

//function initMap() {
//    var options = {
//        enableHighAccuracy: true,
//        timeout: 5000,
//        maximumAge: 0
//    };

//    function success(pos) {
//        var crd = pos.coords;

//        console.log('Your current position is:');
//        console.log('Latitude : ' + crd.latitude);
//        console.log('Longitude: ' + crd.longitude);
//        console.log('More or less ' + crd.accuracy + ' meters.');

//        let map = new google.maps.Map(document.getElementById("map"), {
//            center: { lat: crd.latitude, lng: crd.longitude },
//            zoom: 15,
//        });
//    };

//    function error(err) {
//        console.warn('ERROR(' + err.code + '): ' + err.message);
//    };

//    navigator.geolocation.getCurrentPosition(success, error, options);

//}

function ObtieneCombos(response) {
    var promesa = new Promise(function (resolve, reject) {

        if (numero >= 7) {
            reject('El numero es muy alto');
        }

        setTimeout(function () {
            resolve(numero + 1);
        }, 800);
    });


    return promesa;
}

function getCombos(response) {
    //razonsocial = patron
    //registroaptronal = registropatronal
    //puesto = categoria

    let _data = JSON.parse(response);

    var colonia = new Promise((resolve, reject) => { resolve(fillCombo(38, 'colonia', "&_Parameters='" + _data.pais + "','" + _data.entidadfederativa + "','" + _data.municipio + "'")); });
    var sexo = new Promise((resolve, reject) => { resolve(fillCombo(23, 'sexo', '')); });
    var lugarNacimiento = new Promise((resolve, reject) => { resolve(fillCombo(1, 'lugarnacimiento', '')); });
    var estadoCivil = new Promise((resolve, reject) => { resolve(fillCombo(2, 'estadocivil', '')); });
    var tipoRegimen = new Promise((resolve, reject) => { resolve(fillCombo(3, 'tiporegimen', '')); });
    var formaPago = new Promise((resolve, reject) => { resolve(fillCombo(4, 'formapago', '')); });
    var bancos = new Promise((resolve, reject) => { resolve(fillCombo(5, 'banco', '')); });
    var tipotelefono = new Promise((resolve, reject) => { resolve(fillCombo(24, 'tipotelefono1', '')); });
    var tipotelefono2 = new Promise((resolve, reject) => { resolve(fillCombo(24, 'tipotelefono2', '')); });
    var parentesco1 = new Promise((resolve, reject) => { resolve(fillCombo(25, 'parentesco1', '')); });
    var parentesco2 = new Promise((resolve, reject) => { resolve(fillCombo(25, 'parentesco2', '')); });
    var tipotelefeono3 = new Promise((resolve, reject) => { resolve(fillCombo(24, 'tipotelefono3', '')); });
    var tipotelefeono4 = new Promise((resolve, reject) => { resolve(fillCombo(24, 'tipotelefono4', '')); });
    var pais = new Promise((resolve, reject) => { resolve(fillCombo(26, 'pais', '')); });
    var gradoestudios = new Promise((resolve, reject) => { resolve(fillCombo(27, 'gradoestudios', '')); });
    var especialidad = new Promise((resolve, reject) => { resolve(fillCombo(28, 'especialidad', '')); });
    var tiposangre = new Promise((resolve, reject) => { resolve(fillCombo(29, 'tiposangre', '')); });
    var division = new Promise((resolve, reject) => { resolve(fillCombo(8, 'division', '')); });
    var departamento = new Promise((resolve, reject) => { resolve(fillCombo(7, 'departamento', '')); });
    var puesto = new Promise((resolve, reject) => { resolve(fillCombo(6, 'puesto', '')); });
    var patron = new Promise((resolve, reject) => { resolve(fillCombo(9, 'patron', '')); });
    var registropatronal = new Promise((resolve, reject) => { resolve(fillCombo(22, 'registropatronal', '&_Parameters=' + _data.patron, '')); });
    var localidad = new Promise((resolve, reject) => { resolve(fillCombo(20, 'localidad', '&_Parameters=' + _data.patron)); });
    var sindicatos = new Promise((resolve, reject) => { resolve(fillCombo(19, 'sindicato', '&_Parameters=' + _data.patron)); });
    var periodopago = new Promise((resolve, reject) => { resolve(fillCombo(13, 'periodopago', '')); });
    var moneda = new Promise((resolve, reject) => { resolve(fillCombo(34, 'moneda', '')); });
    var esquemapago = new Promise((resolve, reject) => { resolve(fillCombo(32, 'esquemapago', '&_Parameters=' + _data.patron)); });
    var nombramiento = new Promise((resolve, reject) => { resolve(fillCombo(33, 'nombramiento', '')); });
    var tipocontrato = new Promise((resolve, reject) => { resolve(fillCombo(10, 'tipocontrato', '')); });
    var tipojornada = new Promise((resolve, reject) => { resolve(fillCombo(12, 'tipojornada', '')); });
    var paislabora = new Promise((resolve, reject) => { resolve(fillCombo(26, 'paislabora', '')); });
    var salariomensual = new Promise((resolve, reject) => { resolve(fillCombo(21, 'salariomensual', "&_Parameters='" + _data.patron + "','" + _data.puesto + "','" + _data.periodopago + "'")); });
    var tiposalario = new Promise((resolve, reject) => { resolve(fillCombo(11, 'tiposalario', '')); });
    var tipojornadaimss = new Promise((resolve, reject) => { resolve(fillCombo(17, 'tipojornadaimss', '')); });
    var tipotrabajador = new Promise((resolve, reject) => { resolve(fillCombo(18, 'tipotrabajador', '')); });
    var tipobaja = new Promise((resolve, reject) => { resolve(fillCombo(14, 'tipobaja', '')); });
    var entidadfederativa = new Promise((resolve, reject) => { resolve(fillCombo(36, 'entidadfederativa', '&_Parameters=' + _data.pais)); });
    var municipio = new Promise((resolve, reject) => { resolve(fillCombo(37, 'municipio', "&_Parameters='" + _data.pais + "','" + _data.entidadfederativa + "'")); });

    const resp = Promise.all([colonia, sexo, lugarNacimiento, estadoCivil, tipoRegimen, formaPago, bancos, tipotelefono, tipotelefono2, parentesco1,
        parentesco2, tipotelefeono3, tipotelefeono4, pais, gradoestudios, especialidad, tiposangre, division, departamento,
        puesto, patron, registropatronal, localidad, sindicatos, periodopago, moneda, esquemapago, nombramiento, tipocontrato,
        tipojornada, paislabora, salariomensual, tiposalario, tipojornadaimss, tipotrabajador, tipobaja, entidadfederativa, municipio
    ])
    .then(result => {
        asignaValores(_data);
    })
    .catch(resp => {
        console.error(resp);
        $.confirm({
            title: 'Upsss....',
            content: 'Algo salió mal al intentar leer la información. No te preocupes, no todo salió mal.',
            autoClose: 'aceptar|3000',
            buttons: {
                aceptar: function () {
                }
            }
        });
        $("#cargaPagina").hide();
    });

}

function fillCombo(id, divCombo, params) {
    let _data = {
        "API": "0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1",
        "Parameters": "?_Id=" + id + "&_Domain={d}" + params,
        "JsonString": "",
        "Hash": "380410C457DC3725C89C96DFBF3DC42FECC8604F80D5F0FBCFEA83CF94685837",
        "Bearer": ""
    }

    var settings = {
        "url": "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        "method": "POST",
        "crossDomain": true,
        "contentType": "application/json; charset=utf-8",
        "dataType": "json",
        "timeout": 0,
        "async": false,
        "headers": {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(_data),
    };

    $.ajax(settings).done(function (response) 
    {
        if (response != "" && response != null) {
            var dataAdapter = new $.jqx.dataAdapter(response);

            $("#" + divCombo + "").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor"
            });
            return true;
        }
        else {
            return true;
        }
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
        console.error('ERROR al asignar valor -> ' + divCombo);
        console.error(XMLHttpRequest);
        console.error(textStatus);
        console.error(errorThrown);
    });
}

function obtieneParametroURL() {
    let url = new URL(location.href);
    IdResultadoBusqueda = url.searchParams.get("IdRef").split('@')[0];
    CURP = url.searchParams.get("IdRef").split('@')[1];
    if (IdResultadoBusqueda != null) {
        return true;
    } else {
        return false;
    }
}

function obtieneDatosEmpleado() {
    if (obtieneParametroURL()) 
    {
        var obj1=new Object();
        obj1.CURP = CURP;

        var obj = new Object();
        obj.API="A9BF89AA4713E434BD2872368786FF4B2191909791694F8FE23398473D0000D5";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(obj1);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (response) {
            console.log(response);
            if(response.length>1)
            {

            }
            else if(response.length==1)
            {
                var ObjDatos=new Object();
                ObjDatos.API="E7AF374F02C1483652C6CF5EC0DAAFBD39CDA99E4BDB21ACB66A990059051293";
                ObjDatos.Parameters="";
                ObjDatos.JsonString=JSON.stringify({ "UID": IdResultadoBusqueda });
                ObjDatos.Hash=getHSH();
                ObjDatos.Bearer=getToken();

                $.when(ajaxTokenFijo(ObjDatos)).done(function (response) {
                    console.log(response);
                });
            }
        });

        var ObjDatos=new Object();
        ObjDatos.API="E7AF374F02C1483652C6CF5EC0DAAFBD39CDA99E4BDB21ACB66A990059051293";
        ObjDatos.Parameters="";
        ObjDatos.JsonString=JSON.stringify({ "UID": IdResultadoBusqueda });
        ObjDatos.Hash=getHSH();
        ObjDatos.Bearer=getToken();

        /*$.when(ajaxTokenFijo(ObjDatos)).done(function (response) {
            if (response != "" && response != null && response != '"No se encontró el UID. "') {
                $("#jqxtabs").show();
                asignaValores(response);
            } 
            else 
            {
                $("#jqxtabs").hide();
                showMsg('Advertencia','No se encontró información del empleado.');
                ocultarCargador();
            }
            ocultarCargador();
        });*/
    } 
    else 
    {
        $("#jqxtabs").hide();
        showMsg('Advertencia','No se encontró información del empleado.');
        ocultarCargador();
    }
}

function asignaValores(_data) {
    //console.log(_data);
    //_data = JSON.parse(_data);

    let subcontr = _data.subcontratante;
    if(_data.subcontratante!==undefined && _data.subcontratante.length>0)
    {
        let source = {
            datatype: 'json',
            localdata: eval(subcontr)
        };
        let dataAdapter = new $.jqx.dataAdapter(source);
        $('#GridSubcontratante').jqxGrid({ source: dataAdapter });
    }

    let objKeys = Object.keys(_data);
    let IdPais=_data["paislabora"];
    let estatus = _data["estatus"];
    Estatus=estatus;

    $.each(objKeys, function (index, data) {
        //console.log(data);
        let htmlObj = $("#" + data + "");
        let valor = _data[data];

        if (htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero")) {
            $("#" + data + "").val(valor);
        }
        else if (htmlObj.hasClass("hwdbo-checkBox")) {
            if (valor == 1 || valor || valor == "1") {
                $("#" + data + "").jqxCheckBox('check');
            }
        }
        else if (htmlObj.hasClass("hwdbo-calendario")) {
            $("#" + data + "").jqxDateTimeInput('setDate', valor);
        }
        else if (htmlObj.hasClass("hwdbo-combo")) {
            let items = $("#" + data + "").jqxDropDownList('getItems');
            if (items != undefined) {
                let i = 0;
                if (items.find(x => x.value == valor)) {
                    i = items.find(x => x.value == valor).index;
                } else {
                    i = -1;
                }

                $("#" + data + "").jqxDropDownList({ selectedIndex: i });
            } else {
                //console.error('No se le asigno valor al combo -->' + data);
            }
        }
    });

    switch(estatus)
    {
        case 1: //Activo
            $('.editar').show();
            $('.reingreso').hide();
            $('.bajar').css('margin-top','-10%');
            break;
        case 2://Inactivo
            $('.editar').hide();
            $('.reingreso').show();
            $('.bajar').css('margin-top','-6%');
            break;
    }

    if (estatus != 2) {
        $('._datosBaja').hide();
    }
    else
    { 
        $('._datosBaja').show();
    }

    if(IdPais!='157')
    {
        $('.mex').hide();
        $("#rfc").removeClass('aweb0');
    }
    else
    {
        $('.mex').show();
        $("#rfc").addClass('aweb0');
    }

    if(_data.fechafinal=="1900-01-01")
    {
        $("#fechafinal").val('');
    }

    getEtiquetas(IdPais);

    //MAPA
    let Latitud=$("#latitud").val();
    let Longitud=$("#longitud").val();
    if(Latitud!="" && Longitud!="")
    {
    L.mapbox.accessToken = 'pk.eyJ1IjoieGltZW5hLWNlcm5hIiwiYSI6ImNrb3ZucGh2ejA4cHMyeHB1ZXZybjdzcjkifQ.i_TI3L6iDOr2mcEplkrQxw';       
    var map = L.mapbox.map('mapid', null, { zoomControl: false })
        .setView([Latitud, Longitud], 14)
        .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));   
    new L.Control.Zoom({ position: 'topright' }).addTo(map);   
    L.marker([Latitud, Longitud]).addTo(map);
    }

    $("#txtIdOcupacion").val(_data["id_ocupacion"]);

    ocultarCargador();
}

function getEtiquetas(IdPais)
{
    $.when(ajaxCatalogo(46,'&_Parameters=\'curp\',\''+IdPais+'\'')).done(function (response) {
        $("#lblcurp").text(response[0].Etiqueta);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        $("#lblcurp").text("CURP");
    });
}

function Editar(_estatus)
{
    let verbo="";
    let titulo="";
    let tipo="";
    let icono="";
    switch(_estatus)
    {
        case 2:
            verbo="reingreso de empleado";
            titulo="Reingreso";
            tipo="green";
            icono="fa fa-user-plus nuevoingresoico"
            break;
        case 3:
            verbo="modificar los datos del empleado";
            titulo="Modificar";
            tipo="orange";
            icono="fa fa-edit altasico"
            break;
        case 5:
            verbo="baja de datos del empleado";
            titulo="Baja";
            tipo="red";
            icono="fa fa-close bajasico"
            break;
        case 6:
            verbo="alta de nuevo empleador"
            titulo="Nuevo empleador";
            tipo="green";
            icono="fa fa-user-plus nuevoingresoico"
            break;
    }

    $.confirm({
        title: titulo,
        content: "Será redireccionado para "+verbo+", ¿está seguro de continuar?",
        icon: icono,
        type:tipo,
        typeAnimated:true,
        columnClass: 'medium',
        buttons: 
        {
            Aceptar: function () {
                mostrarCargador();
                let curp = { "CURP": $("#curp").val() };
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
                        "API": "A9BF89AA4713E434BD2872368786FF4B2191909791694F8FE23398473D0000D5",
                        "Parameters": "",
                        "JsonString": JSON.stringify(curp),
                        "Hash": getHSH(),
                        "Bearer": getToken()
                    }),
                    success: function (response) {                        
                        if (valdiateResponse(response)) {
                            let idmonito="";

                            if(response.length>1)
                            {
                                let elegido = $("#txtIdOcupacion").val();
                                $.each(response,function(i,monito){
                                    console.log(monito);
                                    if(monito.id_ocupacion==elegido)
                                    {
                                        sessionStorage.setItem(monito.Id_MPv3, btoa(JSON.stringify(monito)));
                                        sessionStorage.setItem('SWRQYWlz',btoa(monito.paislabora));
                                        idmonito=monito.Id_MPv3;
                                    }
                                });
                            }
                            else
                            {
                                sessionStorage.setItem(response[0].Id_MPv3, btoa(JSON.stringify(response[0])));
                                sessionStorage.setItem('SWRQYWlz',btoa(response[0].paislabora));
                                idmonito=response[0].Id_MPv3;
                            }
  
                            if(idmonito!=undefined && idmonito!="")
                            {
                                setTimeout(function(){
                                    changeLocation("AltaEmpleado.html?IdRef=" + idmonito + "&estatus=" + _estatus);
                                },500);
                            }
                            else
                            {
                                ocultarCargador();
                                showMsg("Mensaje","No fue posible obtener los datos del empleado " + $("#curp").val());
                            }

                        } 
                        else 
                        {
                            showMsg('Error',response);
                        }
                    }
                });
            },
            Cancelar:function(){

            }
        }
    });  
}