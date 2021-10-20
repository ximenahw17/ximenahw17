$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";

    GetGridHistoria();

});

function GetGridHistoria()
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id=94&_Domain={d}&_Parameters='1'";
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        if (response != null && response != '') {
            armaGrid(response);
        }
        else 
        {
            showMsg('Advertencia','No se encontraron registros.');
            ocultarCargador();
        }
        ocultarCargador();
    });
}

function armaGrid(_data) {
    
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
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '20%',
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

    let source = { datatype: 'json', localdata: _jsonData };

    let dataAdapter = new $.jqx.dataAdapter(source);

    let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
    botones+="<div class=\"d-grid gap-2 d-md-flex\">";
    botones+="<div class=\"col-sm-2\"><button class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-file-excel-o\"></span> Exportar</button></div>";
    botones+="</div></div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        showstatusbar: false,
        width: '100%',
        height:$("#divContenedorInterno").height() + 20,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 50,
        sortable: true,
        showstatusbar:true, 
        statusbarheight: 64, 
        ready:function(){
            $("#gdPlantilla").jqxGrid('updatebounddata');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RelOcupacionContratoTemporal');
            $("#gdPlantilla").jqxGrid('hidecolumn','UID');
            $("#gdPlantilla").jqxGrid('hidecolumn','NumPlaza');
            $("#gdPlantilla").jqxGrid('hidecolumn','ApellidoPaterno');
            $("#gdPlantilla").jqxGrid('hidecolumn','ApellidoMaterno');
            $("#gdPlantilla").jqxGrid('hidecolumn','Nombre');
            //$("#gdPlantilla").jqxGrid('hidecolumn','NoAnt');
            $("#gdPlantilla").jqxGrid('autoresizecolumns');
        },
        renderstatusbar: function(statusbar){ 
            statusbar.append(botones); 
        },

    });

    $('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});

    ocultarCargador();
}

$('.class-link').click((event) => {
    let sitio=$(event.currentTarget).data('modulo');
    window.location.href = sitio + '.html'
});