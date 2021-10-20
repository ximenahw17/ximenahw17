var DatosInfo = {};

$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";

    $("#jqxtabs").jqxTabs({ width: '100%', height: '100%', position: 'top', disabled:true }).on('tabclick', function (event) {
        var clickedItem = event.args.item;
        switch (clickedItem) {
            case 0:
                $(this).jqxTabs('setTitleAt',1,'');
                $(this).jqxTabs({ disabled:true});
                $(this).jqxTabs('enableAt', 0);
                break;
        }
    }); 
    
    $("#jqxtabs").jqxTabs('enableAt', 0);

    $(".hwdbo-texto").jqxInput({ width: '98%', height: '30px' });
    
    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '99%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 
    
    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' });

    $(".hwdbo-texto, .hwdbo-combo, .hwdbo-checkBox").on("change", function (event) {
        let idelem = this.id;
        let htmlObj = $("#" + idelem + "");
        let val = '';
        if(event.args.type=="mouse" || event.args.type=="keyboard")
        {
            if (htmlObj.hasClass("hwdbo-texto")) 
            {
                val = htmlObj.val().toString();
            }
            else if (htmlObj.hasClass("hwdbo-combo")) 
            {
                var item = htmlObj.jqxDropDownList('getSelectedItem');
                val = item.value.toString();
            }
            else if (htmlObj.hasClass("hwdbo-checkBox")) 
            {            
                val = htmlObj.jqxCheckBox('val') ? "1" : "0";
            }

            DatosInfo[idelem] = val.toString();
        }
    });

    Combos();
    
    GetGrid();

    let url = new URL(location.href);
    let _IdRef = url.searchParams.get("id");
    if(_IdRef!=null)
    {
        Nuevo();
    }

    InitDatos();

    //console.log(DatosInfo);
});

function GetGrid() 
{
    $.when(ajaxCatalogo(61,"")).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            if(response=="")
            {
                showMsg("Mensaje","Sin información");
                let botones="<div class=\"row\" style=\"margin-top:1.5%;margin-left:1%\">";
                botones+="<div class=\"col-md-1\"><button id=\"BtnNuevo\"><i class=\"fa fa-plus-circle\"></i> Nuevo</button></div>";
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
                        $("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
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

function Combos()
{
    fillCombo(26, 'idpais', '');
}

function Nuevo()
{
    $("#jqxtabs").jqxTabs('enableAt', 1); 
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo'); 
    limpiaCampos();
    $("#idmoneda").val("0");
    DatosInfo["idmoneda"]="0";
    $("#jqxtabs").jqxTabs('select',1);
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
    botones+="<div class=\"col-md-1\"><button id=\"BtnNuevo\"><i class=\"fa fa-plus-circle\"></i> Nuevo</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
    botones+="</div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'singlerow',
        showstatusbar: false,
        width: '101.47%',
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
            /*$("#gdPlantilla").jqxGrid('autoresizecolumns');*/
        },
        renderstatusbar: function(statusbar){ 
            statusbar.append(botones); 
            $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel(); }); 
            $("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
        },

    }).on('rowdoubleclick',function(event){
        var obj = event.args.row.bounddata;
        mostrarCargador();
        MapeaDatos(obj);
    });

    /*$('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});*/

    ocultarCargador();
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'Moneda');
		}
		ocultarCargador();
	}, 1000);
}

function validaCampos(elem) {
    mostrarUpCargador();
    let divId = elem.dataset.contenido;
    let resultValidacion = [];
    let arrObjetosValdiar = $("#" + divId + "").find('.aweb0');

    $.each(arrObjetosValdiar, function (index, data) {
        let idObjhtml = data.id;
        if ($("#" + idObjhtml + "").val() == "") {
            let ObjLabel = document.getElementById(divId).querySelector("label[for =" + idObjhtml + "]");
            resultValidacion.push("Falta asignar valor al campo " + ObjLabel.textContent + ". ");
        }
    });

    if (resultValidacion.length == 0) 
    {
        var apino =DatosInfo.idmoneda=="0" ? "C2473DE9BEE803514817C44F4CF13AA65276BB0BCBC8497CDE2C31BE66419ED1":"16BAA08D7DF902CA889B576DE5A9CB973E4E5C260C040D3CB2C84A658C75D909";
        
        var obj = new Object();
        obj.API=apino;
        obj.Parameters="";
        obj.JsonString=JSON.stringify(DatosInfo);
        obj.Hash= getHSH();
        obj.Bearer= getToken();
       
        setTimeout(function() {
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
            });    
        },1500);
    }
    else
    {
        armaListaErrores(resultValidacion);
        ocultarUpCargador();
    }
}

function MapeaDatos(obj)
{
    //console.log(obj);
    DatosInfo.idmoneda=obj.Id.toString();
    DatosInfo.clavemoneda=obj.ClaveMoneda;
    DatosInfo.descripcion=obj.Moneda;
    DatosInfo.idpais=obj.ClavePais.toString();

    let objKeys = Object.keys(DatosInfo);
    $.each(objKeys, function (index, data) {
        let htmlObj = $("#" + data + "");
        let valor = DatosInfo[data];
        
        if (htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero")) {
            $("#" + data + "").val(valor).toString();
        }        
    });
    //llenar combos        
    $("#idpais").val(obj.ClavePais);

    $("#jqxtabs").jqxTabs('enableAt', 1);
    $("#jqxtabs").jqxTabs('setTitleAt', 1,'Modificar');
    $("#jqxtabs").jqxTabs('select', 1);
    
    setTimeout(ocultarCargador,1000);

    //console.log(DatosInfo);
}