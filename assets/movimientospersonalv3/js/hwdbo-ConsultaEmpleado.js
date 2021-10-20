var fecha = new Date();
var dd = fecha.getDate();
var mm = fecha.getMonth() + 1;
var yy = fecha.getFullYear();
const tk = getToken(), dominio = "demo.wcloudservices.mx"; //location.href.split('/')[2]
var IdResultadoBusqueda = "";
var arrTabsNuevo = {
    "divDatosGenerales": 0, "divDatosContacto": 1, "divDatosDomicilio": 2, "divDatosAcademicos": 3, "divDatosSalud": 4
},
    arrTabsLaboral = { "divDatosGeneralesLaborales": 0, "divOtrosDatos": 1 };
var DatosEmpleado = {};
var Estatus = 0;

$(document).ready(function () {
    $("#divContenedorInterno").jqxSplitter({
        splitBarSize: 8,
        width: '100%',
        height: '100%',
        orientation: 'horizontal',
        panels: [{ size: 100, min: 100 }, {}]
    }).jqxSplitter('collapse');

    $("#jqxtabs").jqxTabs({
        width: '99.5%',
        height: '100%',
        position: 'top'
    });

    //Tab nuevo
    $("#divTabsNuevo").jqxTabs({
        width: '98.5%',
        height: '99%',
        position: 'top'
    });
    $("#divTabsLaborales").jqxTabs({
        width: '99.5%',
        height: '100%',
        position: 'top'
    });

    $(".hwdbo-boton").jqxButton({ width: '150', height: '30', disabled: true });

    $(".hwdbo-texto").jqxInput({ width: '99%', height: '30px', disabled: true });

    $(".hwdbo-combo").jqxDropDownList({
        width: '100%', height: '30px', placeHolder: "-- Selecione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: true, checkboxes: false, openDelay: 0, animationType: 'none',
    });

    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px', disabled: true });
    $(".hwdbo-calendario").jqxDateTimeInput('setDate', new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));

    $(".hwdbo-checkBox").jqxCheckBox({ width: '90%', height: 25, disabled: true });

    $("#estatura").prop("disabled", true);
    $("#peso").prop("disabled", true);
    $("#observacionesbaja").prop("disabled", true);

    //initMap();

    obtieneDatosEmpleado();

});

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
        console.log(numero);
        if (numero >= 7) {
            reject('El numero es muy alto');
        }


        setTimeout(function () {
            resolve(numero + 1);
        }, 800);
    });


    return promesa;
}

function getToken() {
    return localStorage.getItem('KHWDBO');
}

function getCombos(response) {
    //razonsocial = patron
    //registroaptronal = registropatronal
    //puesto = categoria

    let _data = JSON.parse(response);

    var colonia = new Promise((resolve, reject) => { resolve(fillCombo(38, 'colonia', "&_Parameters='" + _data.pais + "','" + _data.entidadfederativa + "','" + _data.municipio + "'"));});
    var sexo = new Promise((resolve, reject) => { resolve(fillCombo(23, 'sexo', '')); });
    var lugarNacimiento = new Promise((resolve, reject) => { resolve(fillCombo(1, 'lugarnacimiento', '')); });
    var estadoCivil = new Promise((resolve, reject) => { resolve(fillCombo(2, 'estadocivil', '')); });
    var tipoRegimen = new Promise((resolve, reject) => { resolve(fillCombo(3, 'tiporegimen', '')); });
    var formaPago = new Promise((resolve, reject) => { resolve(fillCombo(4, 'formapago', '')); });
    var bancos = new Promise((resolve, reject) => { resolve(fillCombo(5, 'banco', '')); });
    var tipotelefono = new Promise((resolve, reject) => { resolve(fillCombo(24, 'tipotelefono1', '')); });
    var tipotelefono2 = new Promise((resolve, reject) => { resolve(fillCombo(24, 'tipotelefono2', '')); });
    var parentesco1 = new Promise((resolve, reject) => { resolve(fillCombo(25, 'parentesco1', ''));  });
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
        "Hash": localStorage.getItem('hash'),
        "Bearer": ""
    }

    var settings = {
        "url": "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        "method": "POST",
        "crossDomain": true,
        "contentType": "application/json; charset=utf-8",
        "dataType": "json",
        "timeout": 0,
        "async":false,
        "headers": {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(_data),
    };

    $.ajax(settings).done(function (response) {
        console.log(divCombo);
        console.log(response);
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
    IdResultadoBusqueda = url.searchParams.get("IdRef");
    if (IdResultadoBusqueda != null) {
        return true;
    } else {
        return false;
    }
}

function obtieneDatosEmpleado() {
    if (obtieneParametroURL()) {
        var settings = {
            "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "API": "6D4A73C29CB1009BA3E7A617376605FA9E6A6DE3D1FF30F840F5E9025BF58514",
                "Parameters": "",
                "JsonString": JSON.stringify({ "UID": IdResultadoBusqueda }),
                "Hash": localStorage.getItem('hash'),
                "Bearer": tk
            }),
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            if (response != "" && response != null) {
                getCombos(response);
            } else {
                $.confirm({
                    title: 'Advertencia',
                    content: 'No se encontró información del empleado.',
                    autoClose: 'aceptar|3000',
                    buttons: {
                        aceptar: function () {
                        }
                    }
                });
                $("#cargaPagina").hide();
            }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            console.error('ERROR EN LA FUNCION -> obtieneDatosEmpleado');
            console.error(XMLHttpRequest);
            console.error(textStatus);
            console.error(errorThrown);
        });

    } else {
        $.confirm({
            title: 'Advertencia',
            content: 'No se encontró información del empleado.',
            autoClose: 'aceptar|3000',
            buttons: {
                aceptar: function () {
                }
            }
        });
        $("#cargaPagina").hide();
    }
}

function asignaValores(_data) {
    console.log('Asignando datos');
    let objKeys = Object.keys(_data);

    $.each(objKeys, function (index, data) {
        console.log(data);
        let htmlObj = $("#" + data + "");
        let valor = _data[data];
		
		if(data == 'observacionesbaja')
		{
			$('#observacionesbaja').val(valor);
		}

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
                console.error('No se le asigno valor al combo -->' + data);
            }
        }
    });

    $("#cargaPagina").hide();
}

function armaListaErrores(items) {
    //lstValidaciones
    $("#lstValidaciones").empty();
    let ul = document.createElement('ul');
    document.getElementById('lstValidaciones').appendChild(ul);

    items.forEach(function (item) {
        let li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML += item;
    });

    $("#divValidacionCampos").jqxWindow("open");
}

function onlyIntNumber(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function decimalNumber(evt, txt) {
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    let ix = txt.indexOf(".");
    if (iKeyCode == 46 && ix > -1)
        return false;
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

    return true;
}
