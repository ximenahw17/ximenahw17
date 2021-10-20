function mostrarCargador()
{
    $("#cargaPagina").fadeIn();
}

function ocultarCargador()
{
    $("#cargaPagina").fadeOut('slow');
}

function mostrarUpCargador()
{
    $("#cargaPagina2").fadeIn();
}

function ocultarUpCargador()
{
    $("#cargaPagina2").fadeOut('slow');
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

function getToken() {
    //let token = localStorage.getItem('S0hEQk8=');
    let token = sessionStorage.getItem('S0hEQk8=');
    let usuario =sessionStorage.getItem('user');

    if(token=="" || token===null)
    {
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
                        Email: usuario!=null&&usuario!=""?usuario:"usuario@harwebdbo.mx",
                        Hash: getHSH()
                    }),
                    "Hash": getHSH(),
                    "Bearer": ""
                }
            ),
            success: function (response) {
                //localStorage.setItem('S0hEQk8=', response.access_token);
                sessionStorage.setItem('S0hEQk8=', response.access_token);
                return response.access_token;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest, textStatus, errorThrown);
                showMsg("Error","No fue posible obtener un token de acceso");
            }
        });
    }

    //return localStorage.getItem('S0hEQk8=');
    return sessionStorage.getItem('S0hEQk8=');
}

function getHSH()
{
    //return localStorage.getItem('aGFzaA==');
    return sessionStorage.getItem('aGFzaA==');
}

function getIdPais()
{
    //return atob(localStorage.getItem('SWRQYWlz'));
    return atob(sessionStorage.getItem('SWRQYWlz'));
}

function getRazonSocial()
{
    //return atob(localStorage.getItem('SWRfUmF6b25Tb2NpYWw='));
    return atob(sessionStorage.getItem('SWRfUmF6b25Tb2NpYWw='));
}

function getCurpNuevo()
{
    //return atob(localStorage.getItem('Q1VSUA=='));
    return atob(sessionStorage.getItem('Q1VSUA=='));
}

function getRFCPatronalNuevo()
{
    //return atob(localStorage.getItem('UkZDUEFUUk9O'));
    return atob(sessionStorage.getItem('UkZDUEFUUk9O'));
}

function textotodatafield(_d) {
    return _d.replace(/ /g, '').replace('/', '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function showMsg(titulo,mensaje)
{
    $.confirm({
        title: titulo,
        content: mensaje,
        autoClose: 'aceptar|3000',
        icon: 'fa fa-info-circle consultamovsletra',
        type:'blue',
        typeAnimated:true,
        columnClass: 'medium',
        buttons: {
            aceptar: function () {
            }
        }
    });
}

function showMsgSinTimer(titulo,mensaje)
{
    $.confirm({
        title: titulo,
        content: mensaje,
        icon: 'fa fa-info-circle consultamovsletra',
        type:'blue',
        typeAnimated:true,
        columnClass: 'medium',
        buttons: {
            aceptar: function () {
            }
        }
    });
}

function showMsgReload(titulo,mensaje)
{
    $.confirm({
        title: titulo,
        content: mensaje,
        icon: 'fa fa-info-circle consultamovsletra',
        type:'blue',
        typeAnimated:true,
        columnClass: 'medium',
        buttons: {
            aceptar: function () {
                window.location.reload(1);
            }
        }
    });
}

function valdiateResponse(text) {
    if (typeof text !== "string") {
        return true;
    } else {
        return false;
    }
}

function changeLocation(ruta) {
    window.location.href = ruta;
}

function formatFecha(fecha) {
    if(fecha!="" || fecha!=null)
    {
        var mm = fecha.getMonth() + 1; // getMonth() is zero-based
        var dd = fecha.getDate();
    
        return [fecha.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
            ].join('-');
    }
    else
    {
        return "";
    }
}

function formatDate(fecha)
{
    if(fecha.toString().indexOf('/')>0)
    {
        return fecha.split('/')[2]+"-"+fecha.split('/')[1]+"-"+fecha.split('/')[0];
    }
    else
    {
        return formatFecha(new Date(fecha))
    }
}

function formatDateGrid(fecha)
{
    return fecha.split('-')[2]+"/"+fecha.split('-')[1]+"/"+fecha.split('-')[0];
}

function stringtoDate(fecha) {
    let f = fecha.split('/')[2] + '-' + fecha.split('/')[1] + '-' + fecha.split('/')[0];
    return f;
}

function ajaxTokenFijo(ObjDatos) {
    let URL="https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==";
    return $.ajax({
        type: "POST",
        url: URL,
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        dataType: "json",
        data: JSON.stringify(ObjDatos)
    });
}

function ajaxCatalogo(id,params)
{
    let _data = {
        "API": "0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1",
        "Parameters": "?_Id=" + id + "&_Domain={d}" + params,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer": ""
    }
    
    return $.ajax({
        method: "POST",
        url: "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        crossDomain:true,
        contentType: "application/json; charset=utf-8",
        timeout:0,
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        dataType: "json",
        data: JSON.stringify(_data)
    });
}

function ajaxCatalogoSnId(_objeto){
    return $.ajax({
        method: "POST",
        url: "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        crossDomain:true,
        contentType: "application/json; charset=utf-8",
        timeout:0,
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        dataType: "json",
        data: JSON.stringify(_objeto)
    });
 
}

function ajaxResult(ObjDatos)
{
    var res=null;
    let URL="https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==";
    res= $.ajax({
        type: "POST",
        url: URL,
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        dataType: "json",
        data: JSON.stringify(ObjDatos)
    });
    return res;
}

function WriteExcel(datos, nombre) {
	mostrarCargador();
	setTimeout(() => {
		var wb = XLSX.utils.book_new();
		wb.Props = {
			Title: nombre,
			CreatedDate: new Date()
		};

		wb.SheetNames.push(nombre);
		var ws_data = datos;
		var ws = XLSX.utils.json_to_sheet(ws_data);
		wb.Sheets[nombre] = ws;
		var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

		saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream"' }), nombre + '.xlsx');

	}, 999)
	ocultarCargador();
}

function s2ab(s) {

	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

async function fillCombo(id, divCombo, params) {
    let _data = {
        "API": "0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1",
        "Parameters": "?_Id=" + id + "&_Domain={d}" + params,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer": ""
    }

    var settings = {
        "url": "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        "method": "POST",
        "crossDomain": true,
        "contentType": "application/json; charset=utf-8",
        "dataType": "json",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        "data": JSON.stringify(_data),
    };

    $.ajax(settings).done(function (response) {
        try {
            //console.log(divCombo,response);
            var dataAdapter = new $.jqx.dataAdapter(response);

            $("#" + divCombo + "").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });

        } catch (error) {

        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        //console.error('ERROR EN LA FUNCION -> ' + divCombo);
        //console.error(XMLHttpRequest);
        //console.error(textStatus);
        //console.error(errorThrown);
    });
}

function GuardaHash() {
    let url = new URL(location.href);
    let _IdRef = url.searchParams.get("siteCode");
    //localStorage.setItem('aGFzaA==', _IdRef);
    sessionStorage.setItem('aGFzaA==', _IdRef);
}

function InitDatos()
{
    $.each($('.hwdbo-texto'),function(i,row){
        var id=row.id;
        DatosInfo[id]="";
    });
    $.each($('.hwdbo-numero'),function(i,row){
        var id=row.id;
        DatosInfo[id]="";
    });
    $.each($('.hwdbo-combo'),function(i,row){
        var id=row.id;
        DatosInfo[id]="";
    });
    $.each($('.hwdbo-calendario'),function(i,row){
        var id=row.id;
        DatosInfo[id]="";
    });
    $.each($('.hwdbo-checkBox'),function(i,row){
        var id=row.id;
        DatosInfo[id]="0";
    });
    $.each($('.hwdbo-switch'),function(i,row){
        var id=row.id;
        DatosInfo[id]="0";
    });
}

function armaListaErrores(items) {
    let mensaje="";
    items.forEach(function (item) {
        mensaje+=item+"<br/>"
    });
    $.confirm({
        title: 'Validación',
        icon: 'fa fa-warning bajasico',
        content: mensaje,
        type:'red',
        typeAnimated:true,
        columnClass: 'medium',
        buttons: {
            Aceptar: function () {
            }
        }
    });
}

function autoWidth(titulosGrid)
{
    let ancho=0;
    $.each(titulosGrid, function (index, element) {
        let t=textotodatafield(element);
        var value = $('#gdPlantilla').jqxGrid('getcolumnproperty', textotodatafield(element), 'width');
        ancho = ancho + value;
    });
    $('#gdPlantilla').jqxGrid({ width: ancho + 1});
}

function limpiaCampos()
{
    $.each($(".hwdbo-texto"),function(i,row){
        $("#" + row.id).val('');
    });
    $.each($(".hwdbo-combo"),function(i,row){
        $("#" + row.id).jqxDropDownList('clearSelection',true);
        $("#" + row.id).jqxDropDownList('selectedIndex', -1);
        $("#" + row.id).jqxDropDownList({disabled:false});
    });
    $.each($(".hwdbo-calendario"),function(i,row){
        $("#" + row.id).val('');
        $("#" + row.id).jqxDateTimeInput({disabled:false});
    });
    $.each($(".hwdbo-switch"),function(i,row){
        $("#" + row.id).jqxSwitchButton({ checked:false });
    });
}

function setToken()
{
    let hash = getHSH();
    var ObjDatos=new Object();
    ObjDatos.API="8AB5EF6347BBA9D2BED6252EEA0DD8995BBF09A3F0F36E3CA3BE7ED1B60B6A28";
    ObjDatos.Parameters="";
    ObjDatos.JsonString=JSON.stringify
    (
        {
            Email: "usuario@harwebdbo.mx",
            Hash: hash
        }
    );
    ObjDatos.Hash=hash;
    ObjDatos.Bearer=getToken();

    $.when(ajaxTokenFijo(ObjDatos)).done(function (response) {
        if(response!="")
        {
            sessionStorage.setItem('S0hEQk8=', response.access_token);
        }
        ocultarCargador();
    });
}