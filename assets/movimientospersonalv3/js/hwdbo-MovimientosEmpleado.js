var _HashAPI = '';

$(document).ready(function () {
    mostrarCargador();
    $.jqx.theme = "light";
    let url = new URL(location.href);
    let _estatus = url.searchParams.get("estatus");

    switch (_estatus) {
        case "1":
            $("#spanTitulo").text('Movimientos pendientes');
            _HashAPI = 'C563C317507D83C9F4784E1D5EACA49FD630516598D19582993F00F290FE62DC';
            break;
        case "2":
            break;
        case "3":
            $("#spanTitulo").text('Modificaciones pendientes');
            _HashAPI = '';
            break;
        case "4":
            break;
        case "5":
            $("#spanTitulo").text('Bajas pendientes');
            _HashAPI = 'D91808E8B0266915D8F8A96AFEEA5B15909B8299E79BE086872A224BCC9D7319';
            break;
    }

    CargaDatosPendientes(0);
});

function CargaDatosPendientes(_estatus) {
    var settings = {
        "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "API": "BD9919B79DA2DD2F99744F27A4C07BA74F45E10625866683F35B786CE0A833AF",
            "Parameters": "?Id_TipoMovimiento=" + _estatus,
            "JsonString": "",
            "Hash": getHSH(),
            "Bearer": getToken()
        }),
    };


    $.ajax(settings).done(function (response) {
        if (response != null && response != '') {
            armaGrid(JSON.parse(response));
        }
        else {
            showMsg('Advertencia','No se encontraron registros para este movimiento.');

            ocultarCargador();
        }
    });

}

function armaGrid(_data) {

    let _columns = [];
    let _jsonData = [];

    if(_data=="No hay movimientos para autorizar. ")
    {
        showMsg('Error',_data);
    }
    else
    {
        let titulosGrid = Object.keys(_data[0]);    
        $.each(titulosGrid, function (index, element) {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: 150,
                cellsalign:'center',
                align:'center'
            });
        });
    
        $.each(_data, function (index, data) {
            let oldKeys = Object.keys(data);
            let newjson = new Object();
            $.each(oldKeys, function (i, d) {
                let newProperty = textotodatafield(d);
                newjson[newProperty] = data[d];
            });
    
            _jsonData.push(newjson);
        });
    }


    $("#gdEmpleados").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        selectionmode: 'checkbox',
        showstatusbar: true,
        statusbarheight: 55,
        renderstatusbar: function (statusbar) {
            {
                statusbar.append($("<div id = 'divControlesPendientes' style='margin-top:1%;margin-bottom:1%'>"
                    + "<button type='button' class='hwdbo-boton' onclick='autorizaMovimientos();' style='cursor: pointer; margin-top: 3px; margin-left: 5px; height:28px; max-height:28px;'><span style='position: relative;'><i class='fa fa-check fa-lg' style='padding-right:5px;'></i>Autorizar</span></button>"
                    + "<button type='button' class='hwdbo-boton' onclick='rechazaMovimientos();' style='cursor: pointer; margin-top: 3px; margin-left: 5px; height:28px; max-height:28px;'><span style='position: relative;'><i class='fa fa-close fa-lg' style='padding-right:5px;'></i>Rechazar</span></button>"
                    + "</div>"));
                    $(".hwdbo-boton").jqxButton({ width: '150', height: '30' });
            };
        },
        width: '100%',
        height: $(window).height()- 100,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: true,
        autoshowfiltericon: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 50,
        sortable: true,
        showaggregates: false,
        ready:function(){
            $("#gdEmpleados").jqxGrid('updatebounddata');
            $("#gdEmpleados").jqxGrid('hidecolumn','Id_TipoMovimientoIP');
        },
    }).on('rowdoubleclick',function(event){
        var obj = new Object();
        obj.Id_Movimiento = event.args.row.bounddata.Id_Movimiento;
        obj.Id_TipoMovimiento = event.args.row.bounddata.Id_TipoMovimientoIP;

        /*console.log(obj);
        $("#lblIdMov").text(event.args.row.bounddata.Id_Movimiento);
        $('#myModal2').modal('show');*/
    });

    let source = {
        datatype: 'json',
        localdata: _jsonData
    };

    let dataAdapter = new $.jqx.dataAdapter(source);

    $("#gdEmpleados").jqxGrid({
        source: dataAdapter
    });
    $("#gdEmpleados").jqxGrid('updatebounddata');
    $("#gdEmpleados").jqxGrid('autoresizecolumns');
    

    ocultarCargador();

}


function rechazaMovimientos() {
    let rowindex = $("#gdEmpleados").jqxGrid('getselectedrowindexes');
    if (rowindex.length > 0) {
        let mensaje = rowindex.length===1 ?"¿Desea rechazar el movimiento seleccionado?":"¿Desea rechazar los movimientos seleccionados?";
        $.confirm({
            title: '¿Rechazar?',
            type:'blue',
            icon: 'fa fa-info-circle',
            typeAnimated:true,
            columnClass: 'medium',
            content: mensaje,
            buttons: {
                aceptar: function () {
                    mostrarUpCargador();
                    let _data = getIds('gdEmpleados');

                    var settings = {
                        "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "API": "9E1A33359A757B443916213BDA1988D4C6F3C0C89D564261C0FD8B4D5749BB4D",
                            "Parameters": "",
                            "JsonString": JSON.stringify(_data),
                            "Hash": getHSH(),
                            "Bearer": getToken()
                        }),
                    };

                    $.ajax(settings)
                        .done(function (response) {                            
                            if (response) 
                            {
                                try
                                {
                                    let respuesta = JSON.parse(response)
                                    let resp = respuesta.filter(x => x.MsgError != '');
                                    if (resp.length > 0) 
                                    {
                                        let IdsMov="";
                                        $.each(resp,function(i,row){
                                            IdsMov+="<p>" + row.MsgError + "->" + row.Id_Movimiento + "</p>";
                                        });
                                        showMsgSinTimer('Ojo...','Al parecer algunos registros no se procesaron, favor de validar la información de estos.' + IdsMov);
                                    } 
                                    else 
                                    {
                                        showMsgReload('Éxito','Todos los registros se rechazaron con éxito.');
                                    }
                                }
                                catch{
                                    showMsgSinTimer("Error","<pre>" + response + "</pre>");
                                }
                            } 
                            else 
                            {
                                showMsg('Algo salio mal...','Al parecer algo no salió bien al procesar la información, vuelve a intentarlo.');
                            }
                            ocultarUpCargador();
                        })
                        .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                            console.error('ERROR EN LA FUNCION -> rechazaMovimientos');
                            console.error(XMLHttpRequest);
                            console.error(textStatus);
                            console.error(errorThrown);
                            ocultarUpCargador();
                    });
                },
                cancelar: function () {
                }
            }
        });
    } else {
        showMsg('Advertencia','Favor de seleccionar uno o mas registros.');
    }
}

function autorizaMovimientos() {
    let rowindex = $("#gdEmpleados").jqxGrid('getselectedrowindexes');
    if (rowindex.length > 0) {
        let mensaje = rowindex.length===1 ?"¿Desea aprobar el movimiento seleccionado?":"¿Desea aprobar los movimientos seleccionados?";
        $.confirm({
            title: '¿Aprobar?',
            type:'blue',
            icon: 'fa fa-info-circle',
            typeAnimated:true,
            columnClass: 'medium',
            content: mensaje,
            buttons: {
                aceptar: function () {
                    mostrarUpCargador();
                    let _data = getIds('gdEmpleados');
                    var settings = {
                        "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "API": "DB45D49675B5C002E1C6F42B445C681A0B540CA9E2E0065B1C8368A07A2A7CD7",
                            "Parameters": "",
                            "JsonString": JSON.stringify(_data),
                            "Hash": getHSH(),
                            "Bearer": getToken()
                        }),
                    };

                    $.ajax(settings)
                        .done(function (response) {
                            //console.log(response);
                            if (response) 
                            {
                                try
                                {
                                    let respuesta = JSON.parse(response)
                                    let resp = respuesta.filter(x => x.MsgError != '');
                                    if (resp.length > 0) 
                                    {
                                        let IdsMov="";
                                        $.each(resp,function(i,row){
                                            IdsMov+="<p>" + row.MsgError + "->" + row.Id_Movimiento + "</p>";
                                        });
                                        showMsgSinTimer('Ojo...','Al parecer algunos registros no se procesaron, favor de validar la información de estos.' + IdsMov);
                                    } 
                                    else 
                                    {
                                        showMsgReload('Éxito','Todos los registros se aprobaron con éxito.');
                                    }
                                }
                                catch{
                                    showMsgSinTimer("Error","<pre>" + response + "</pre>");
                                }
                            } 
                            else 
                            {
                                showMsg('Algo salio mal...','Al parecer algo no salió bien al procesar la información, vuelve a intentarlo.');
                            }
                            ocultarUpCargador();
                        })
                        .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                            console.error('ERROR EN LA FUNCION -> autorizaMovimientos');
                            console.error(XMLHttpRequest);
                            console.error(textStatus);
                            console.error(errorThrown);
                            ocultarUpCargador();
                        });
                },
                cancelar: function () {
                }
            }
        });
    } else {
        showMsg('Advertencia','Favor de seleccionar uno o mas registros.');
    }
}

function getIds(IdGrid, col = '') {
    var rowIndex = $("#" + IdGrid + "").jqxGrid('getselectedrowindexes');
    var Ids = [];

    $.each(rowIndex, function (index, data) {
        let datarow = $("#" + IdGrid + "").jqxGrid('getrowdata', data);
        let newarray=new Object();
        newarray.Id_Movimiento = datarow.Id_Movimiento;
        newarray.Id_TipoMovimiento=datarow.Id_TipoMovimientoIP
        Ids.push(newarray);
    });

    return Ids;
}
