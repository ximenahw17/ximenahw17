var DatosInfo = new Array();
var Editando=0;
var dataFieldEdita="";

$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";

    $("#jqxtabs").jqxTabs({ width: '100%', height: '100%', position: 'top' }); 
    
    GetGrid();

});

function GetGrid() 
{
    $.when(ajaxCatalogo(68,"")).done(function (response) {
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
            switch(index)
            {
                case 4:
                case 5:
                case 6:
                    _columns.push({
                        text: element,
                        datafield: textotodatafield(element),
                        type: 'string',
                        width: '11%',
                        cellsalign:'center',
                        align:'center',
                        editable:true,
                        classname:'negritas',
                        columntype:'numberinput',
                        createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {;
                            editor.jqxNumberInput({ inputMode: 'simple', height: '22px', width: '94%', min: 0, max: 9999999, spinMode: 'simple', textAlign: 'left', decimalDigits: 2, digits:7 });
                        },
                        validation: function (cell, value) {
                            if (value < 0 ) {
                                return { result: false, message: "Por favor ingrese una cantidad mayor o igual a cero. Para salir presione ESC" };
                            }
                            return true;
                        }
                    });
                    break;
                    case 7:
                        _columns.push({
                            text: element,
                            datafield: textotodatafield(element),
                            type: 'string',
                            width: '11%',
                            cellsalign:'center',
                            align:'center',
                            editable:true,
                            classname:'negritas',
                            columntype:'numberinput',
                            createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {;
                                editor.jqxNumberInput({ inputMode: 'simple', height: '22px', width: '94%', min: 0, max: 1, spinMode: 'simple', textAlign: 'left', decimalDigits: 4, digits:5 });
                            },
                            validation: function (cell, value) {
                                if (value < 0 ) {
                                    return { result: false, message: "Por favor ingrese una cantidad mayor o igual a cero. Para salir presione ESC" };
                                }
                                if(value > 1)
                                {
                                    return { result: false, message: "Por favor ingrese una cantidad menor a uno. Para salir presione ESC" };
                                }
                                return true;
                            }
                        });
                        break;
                default:
                    _columns.push({
                        text: element,
                        datafield: textotodatafield(element),
                        type: 'string',
                        width: '11%',
                        cellsalign:'center',
                        align:'center',
                        editable:false
                    });
                    break;
            }

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
    //botones+="<div class=\"col-md-1\"><button id=\"BtnNuevo\"><i class=\"fa fa-plus-circle\"></i> Nuevo</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnGuardar\"><i class=\"fa fa-save\"></i> Guardar</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
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
        editable:true,
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
            $("#gdPlantilla").jqxGrid('hidecolumn','ClaveTipoTarifa');
        },
        renderstatusbar: function(statusbar){ 
            statusbar.append(botones);              
            //$("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
            $("#BtnGuardar").jqxButton({ width: 100, height: 30, disabled:true }).on('click',function(){ Guardar(); });
            $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel(); });
        },

    }).on('cellendedit',function(event){
        var obj = event.args.row;
        Inserta(obj);
        $("#BtnGuardar").jqxButton({ disabled:false });
    });

    $('#gdPlantilla').on('cellbeginedit',function(event){
        Editando=event.args.row.boundindex;
        dataFieldEdita=event.args.datafield;
    });

    ocultarCargador();
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'TarifaImpuestoGuatemala');
		}
		ocultarCargador();
	}, 1000);
}

function Nuevo()
{
    var data = $('#gdPlantilla').jqxGrid('getrowdatabyid', 0);
    var rows = $('#gdPlantilla').jqxGrid('getrows');
    var obj = new Object();
    obj.IDImpuesto=rows.length*1000+"*";
    obj.ClaveTipoTarifa=data.ClaveTipoTarifa;
    obj.Articulo=data.Articulo;
    obj.ClaveTipoTarifa=obj.ClaveTipoTarifa;
    obj.LimiteInferior=0;
    obj.LimiteSuperior=0;
    obj.CuotaFija=0;
    obj.PorcentajeExedente=0.000000;
    obj.TipoTarifa=data.TipoTarifa;
    obj.VigenciaInicial=data.VigenciaInicial;
    obj.VigenciaFinal=data.VigenciaFinal;
    $('#gdPlantilla').jqxGrid('addrow', 0, obj,"first");
}

function Guardar()
{
    mostrarUpCargador();

    $("#gdPlantilla").jqxGrid('endcelledit', Editando, dataFieldEdita, false);

    var DatosFinal=new Array();

    //Armar json final
    $.each(DatosInfo,function(i,row){
            var json=new Object();
            json.idtarifaimpuesto=row.IDImpuesto.toString();
            json.limiteinferior=row.LimiteInferior.toString();
            json.limitesuperior=row.LimiteSuperior.toString();
            json.cuotafija=row.CuotaFija.toString();
            json.porcentajeexcedente=row.PorcentajeExedente.toString();
            DatosFinal.push(json);
    });

    //console.log(DatosFinal);

    var obj = new Object();
    obj.API="A4D81C349B1C09754C821F0768D2BFE8ED13C22E522015B33E2125F24DDCE8AA";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(DatosFinal);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    if(DatosFinal.length>0)
    {
        setTimeout(function(){
            $.when(ajaxTokenFijo(obj)).done(function (res) {
            if(res)
            {
                if(res.error=="0")
                {
                    $.confirm({
                        title: 'Éxito',
                        type:'green',
                        icon: 'fa fa-check nuevoingresoico',
                        typeAnimated:true,
                        content: 'Registro guardado con éxito.',
                        buttons: {
                            Aceptar: function () {
                                let url = new URL(location.href).toString();
                                changeLocation(url.split('?')[0]);
                            },
                        }
                    });
                }
                else
                {
                    $.confirm({
                        title: 'Error',
                        type:'red',
                        icon: 'fa fa-check bajasico',
                        typeAnimated:true,
                        content: res.msg,
                        buttons: {
                            Aceptar: function () {
                            },
                        }
                    });
                }
            }
            else
            {
                showMsg("Error","Ocurrió un error al guardar: " + res.Msg);
            }

            ocultarUpCargador();
        });  },1500);
    }
    else
    {
        ocultarUpCargador();
        showMsg("Mensaje","No hay cambios para guardar");
    }
}

function Inserta(obj)
{
    if(DatosInfo.length==0)
    {
        DatosInfo.push(obj);
    }
    else
    {
        var replace=false;
        $.each(DatosInfo,function(i,row){
            if(row.IDImpuesto==obj.IDImpuesto)
            {
                DatosInfo[i]=obj;
                replace=true;
            }
        });
        if(replace==false)
            DatosInfo.push(obj);
    }
}

$('.class-inicio-impuesto').click((event) => {
    
    $("#gdPlantilla").jqxGrid('endcelledit', Editando, dataFieldEdita, false);

    if(DatosInfo.length==0)
    {
        let sitio=$(event.currentTarget).data('modulo');
        window.location.href = sitio + '.html?siteCode=' + getHSH();
    }
    else
    {
        $.confirm({
            title: 'Mensaje',
            type:'blue',
            icon: 'fa fa-info-circle',
            typeAnimated:true,
            content: "¿Seguro quieres salir sin guardar cambios?",
            buttons: {
                Aceptar: function () {
                    let sitio=$(event.currentTarget).data('modulo');
                    window.location.href = sitio + '.html?siteCode=' + getHSH();
                },
                Cancelar:function(){}
            }
        });
    }
});