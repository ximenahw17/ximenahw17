$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";
    
    $("#jqxtabs").jqxTabs({ width: '100%', height: '100%', position: 'top' });

    GetGrid();
});

function GetGrid() 
{
    $.when(ajaxCatalogo(62,"")).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            if(response=="")
            {
                showMsg("Mensaje","Sin información");
                let botones="<div class=\"row\" style=\"margin-top:1.5%;margin-left:1%\">";
                botones+="</div>";

                $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');

                $("#gdPlantilla").jqxGrid({
                    autoshowfiltericon: true,
                    columns: [],
                    source: [],
                    selectionmode: 'singlerow',
                    showstatusbar: false,
                    width: '101.45%',
                    height:$("#jqxtabs").height() - 35,
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
                    renderstatusbar: function(statusbar){ 
                        statusbar.append(botones); 
                    },
            
                });
            }
            else
            {
                armaGrid(response);
            }
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
            var ancho =index==1?"59.6%":"40%";
            var alinea=index==0?"center":"left";
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: ancho,
                cellsalign:alinea,
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
    botones+="<div class=\"col-md-12\"><center><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></center></div>";
    botones+="</div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'singlerow',
        showstatusbar: false,
        width: '101.45%',
        height:$("#jqxtabs").height() - 35,
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
            //$("#gdPlantilla").jqxGrid('autoresizecolumns');
        },
        renderstatusbar: function(statusbar){ 
            statusbar.append(botones); 
            $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel(); }); 
        },

    });

    /*$('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});*/

    //autoWidth(Object.keys(_data[0]));
    /*let ancho=0;
    $.each(Object.keys(_data[0]), function (index, element) {
        let t=textotodatafield(element);
        var value = $('#gdPlantilla').jqxGrid('getcolumnproperty', textotodatafield(element), 'width');
        ancho = ancho + value;
    });
console.log(ancho);
$('#gdPlantilla').jqxGrid({ width: ancho + 25});*/
    ocultarCargador();
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'Pais');
		}
		ocultarCargador();
	}, 1000);
}