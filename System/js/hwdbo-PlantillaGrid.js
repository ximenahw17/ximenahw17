var ObjDatos=new Object();
ObjDatos.API="748BCECCAC4FD4BDBEC0DF5B6970AC5BB52E65FCC435DCFE736170695398A836";
ObjDatos.Parameters="?_Id=3&_Domain=deprecated";
ObjDatos.JsonString="";
ObjDatos.Hash=getHSH();
ObjDatos.Bearer=getToken();

$(document).ready(function () {
    $.jqx.theme = "energyblue";
    GetGrid();
});

function GetGrid() 
{
    $.when(ajaxTokenFijo(ObjDatos)).done(function (response) {
        if(response!="No existe el Proceso. ")
        {
            armaGrid(response);
        }
        else
        {
            showMsg('Mensaje',response);
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
                width: '14%',
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

    let botones="<div class=\"row\" style=\"margin-top:1.5%;margin-left:1%\">";
    botones+="<div class=\"col-md-3\"><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
    botones+="</div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\" style=\"margin-top:1%\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'singlerow',
        showstatusbar: false,
        width: '100%',
        height:$(window).height()-150,
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
        statusbarheight: 65, 
        ready:function(){
            $("#gdPlantilla").jqxGrid('updatebounddata');
            $("#gdPlantilla").jqxGrid('autoresizecolumns');
        },
        renderstatusbar: function(statusbar){ statusbar.append(botones); $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel(); }) },

    });

    $('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});

    ocultarCargador();
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			/*let Info = rows.map((item) => {
				return {
					NumEmpleado: item['NumEmpleado'],
					Nombre: item['Nombre'],
					RegistroPatronal: item['RegistroPatronal'],
					TipoIncidencia: item['TipoIncidencia'],
					ValorImporte: item['ValorImporte'],
					PeriodoAfectacion: item['PeriodoAfectacion'],
					Captura: item['Captura'],
					Autoriza: item['Autoriza'],
					SolicitaBaja: item['SolicitaBaja'],
					AutorizaBaja: item['AutorizaBaja']
				}
			});*/

			WriteExcel(rows, 'Consulta');
		}
		ocultarCargador();
	}, 1000);
}