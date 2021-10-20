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

    $(".hwdbo-texto").jqxInput({ width: '99%', height: '30px' });
    
    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 
    
    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px' });
    
    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' });
    
    $("#entidadfederativa").on('change',function(event){
        fillCombo(37, 'municipio', "&_Parameters='157','" + $(this).val() + "'");
    });

    $(".hwdbo-texto, .hwdbo-combo, .hwdbo-checkBox").on("change", function (event) {
        let idelem = this.id;
        let htmlObj = $("#" + idelem + "");
        let val = '';
        if(event.args.type=="mouse" || event.args.type=="keyboard")
        {
            if (htmlObj.hasClass("hwdbo-texto")) 
            {
                val = htmlObj.val().toString().toUpperCase();
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

    $(".hwdbo-calendario").on('change',function(event){
        if(event.args.type=="mouse" || event.args.type=="keyboard")
        {
            let idelem = this.id;
            let htmlObj = $("#" + idelem + "");
            let val = '';
            val = stringtoDate(htmlObj.val());
            DatosInfo[idelem] = val;
        }
    });

    $("#numext").jqxInput({ width: '85%', height: '30px' });
    
    $("#numint").jqxInput({ width: '85%', height: '30px' });

    $("#cp").jqxInput({ width: '95%', height: '30px' });

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
    $.when(ajaxCatalogo(50,"")).done(function (response) {
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
    //fillCombo(26, 'pais', '');
    fillCombo(36, 'entidadfederativa', '&_Parameters=' + "157");
    fillCombo(40, 'idrazonsocial', '');
    fillCombo(72, 'zonaeconomica', '');
}

function Nuevo()
{
    $("#jqxtabs").jqxTabs('enableAt', 1); 
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo'); 
    limpiaCampos();
    $("#idlocalidad").val("0");
    DatosInfo["idlocalidad"]="0";
    $("#jqxtabs").jqxTabs('select',1);
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
        var apino =DatosInfo.idlocalidad=="0" ? "857DAE6985FA1628C4C412E800D2506BE29AB6353506C9A801487FB4F93B17F7":"76F2C6CBFAD5D5D9BC99BB5F1D545496120879932B8397B8954BEDA73CB889D6";
        
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
    DatosInfo.idlocalidad=obj.IDLocalidad;
    DatosInfo.calle=obj.Calle.toUpperCase();
    DatosInfo.cp=obj.CodigoPostal.toString();
    DatosInfo.entidadfederativa=obj.IDEntidad.toString();
    DatosInfo.idlocalidad=obj.IDLocalidad.toString();
    DatosInfo.latitud=obj.Latitud;
    DatosInfo.longitud=obj.Longitud;
    DatosInfo.municipio=obj.IDMunicipio.toString();
    DatosInfo.nombrecorto=obj.NombreCorto.toUpperCase();
    DatosInfo.nombrelargo=obj.NombreLargo.toUpperCase();
    DatosInfo.numext=obj.NumExterior.toUpperCase();
    DatosInfo.numint=obj.NumInterior.toUpperCase();
    DatosInfo.idrazonsocial=obj.IDRazonSocial.toString();
    DatosInfo.telefono1=obj.Telefono1;
    DatosInfo.telefono2=obj.Telefono2;
    if(obj.VigenciaInicial!="")
    {
        DatosInfo.vigenciainicial=formatDate(obj.VigenciaInicial);
    }
    if(obj.VigenciaFinal!="")
    {
        DatosInfo.vigenciafinal=formatDate(obj.VigenciaFinal);
    }
    DatosInfo.zonaeconomica=obj.IDZonaEconomica;

    let objKeys = Object.keys(DatosInfo);
    $.each(objKeys, function (index, data) {
        let htmlObj = $("#" + data + "");
        let valor = DatosInfo[data];
        
        if (htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero")) {
            $("#" + data + "").val(valor).toString();
        }
        else if (htmlObj.hasClass("hwdbo-calendario")) 
        {
            if(valor=="1900-01-01")
            {
                $("#" + data + "").val('');
            }
            else
            {
                $("#" + data + "").jqxDateTimeInput('setDate', valor);
            }
        }        
    });
    //llenar combos        
    $("#idrazonsocial").val(obj.IDRazonSocial);
    $("#zonaeconomica").val(obj.IDZonaEconomica);
    setTimeout(function(){ $("#entidadfederativa").val(obj.IDEntidad);},1000);
    setTimeout(function() { $("#municipio").val(obj.IDMunicipio);},2000);

    $("#jqxtabs").jqxTabs('enableAt', 1);
    $("#jqxtabs").jqxTabs('setTitleAt', 1,'Modificar');
    $("#jqxtabs").jqxTabs('select', 1);
    
    setTimeout(ocultarCargador,3000);

    //console.log(DatosInfo);
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

    let botones="<div class=\"row\" style=\"margin-top:1.5%;margin-left:1%\">";
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
            $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel(); }); 
            $("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
        },

    }).on('rowdoubleclick',function(event){
        var obj = event.args.row.bounddata;
        mostrarCargador();
        MapeaDatos(obj);
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
			WriteExcel(rows, 'LocalidadSucursal');
		}
		ocultarCargador();
	}, 1000);
}