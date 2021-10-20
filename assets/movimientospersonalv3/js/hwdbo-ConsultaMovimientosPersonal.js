$(document).ready(function () {
    mostrarCargador();
    $.jqx.theme = "light";
    CargaDatos();
});

function CargaDatos() {
    var settings = {
        "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "API": "4D733EF9C56FDFE991BF12F77BADE526F98A75473AD0185CE17493A241EA5D04",
            "Parameters": "",
            "JsonString": "",
            "Hash": getHSH(),
            "Bearer": getToken()
        }),
    };

    $.ajax(settings).done(function (response) {
        if (response != null && response != '') {
            armaGrid(JSON.parse(response));
        }
        else 
        {
            showMsg('Advertencia','No se encontraron registros para este movimiento.');
            ocultarCargador();
        }
    });

}

function armaGrid(_data) {
    
    $("#DivgdEmpleados").html('<center><div id="gdEmpleados"></div></center>');

    let _columns = [];
    let _jsonData = [];

    if(_data=="No se encontro información.")
    {
        showMsg('Error',_data);
    }
    else
    {
        let titulosGrid = Object.keys(_data[0]);

        $.each(titulosGrid, function (index, element) {
            let _hidden = false;
            if (element == 'NumPlaza') {
                _hidden = true;
            }
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: 150,
                hidden: _hidden,
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

    let source = {
        datatype: 'json',
        localdata: _jsonData
    };

    let dataAdapter = new $.jqx.dataAdapter(source);

    $("#gdEmpleados").jqxGrid({
        autoshowfiltericon: true,
        source: dataAdapter,
        columns: _columns,
        selectionmode: 'singlerow',
        showstatusbar: false,
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
            $("#gdEmpleados").jqxGrid('autoresizecolumns');
        }
    }).on('rowdoubleclick', function (event) {
        mostrarCargador();
        let args = event.args;
        let _uid = args.row.bounddata.UID;
        setTimeout(function(){ busquedaEmpleado(_uid); },2000);
    });
    $("#gdEmpleados").jqxGrid('autoresizecolumns');
    $('#gdEmpleados').on('bindingcomplete',function(){ $('#gdEmpleados').jqxGrid('autoresizecolumns','all');});
    $('#gdEmpleados').on('filter',function(){ $('#gdEmpleados').jqxGrid('autoresizecolumns','all');});
    $('#gdEmpleados').on('sort',function(){ $('#gdEmpleados').jqxGrid('autoresizecolumns','all');});
    $('#gdEmpleados').on('pagechanged',function(){ $('#gdEmpleados').jqxGrid('autoresizecolumns','all');});
    ocultarCargador();
}

function getIds(IdGrid, col = '') {
    var rowIndex = $("#" + IdGrid + "").jqxGrid('getselectedrowindexes');
    var Ids = [];

    $.each(rowIndex, function (index, data) {
        let datarow = $("#" + IdGrid + "").jqxGrid('getrowdata', data);
        Ids.push(datarow);
    });

    return Ids;
}

function busquedaEmpleado(_uid) {
    mostrarCargador();
    window.location.href = "ConsultaEmpleadoLigera.html?IdRef=" + _uid;
}
