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

    $("#identidad").on('change',function(event){
        fillCombo(37, 'idmunicipio', "&_Parameters='157','" + $(this).val() + "'");
    });

    $("#idmunicipio").on('change',function(event){
        fillCombo(38, 'idcolonia', "&_Parameters='" + $("#idpais").val() + "','" + $("#identidad").val() + "','" + $(this).val() + "'");
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
    $.when(ajaxCatalogo(53,"")).done(function (response) {
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

function Combos(){
    fillCombo(26, 'idpais', '');
    fillCombo(36, 'identidad', '&_Parameters=' + "157");
    fillCombo(92, 'idtiposindicato', '');
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
    botones+="<div class=\"col-md-1\"><button id=\"BtnNuevo\"><i class=\"fa fa-plus-square\"></i> Nuevo</button></div>";
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
            $("#gdPlantilla").jqxGrid('hidecolumn','ClavePais');
            $("#gdPlantilla").jqxGrid('hidecolumn','ClaveEntidad');
            $("#gdPlantilla").jqxGrid('hidecolumn','ClaveMunicipio');
            $("#gdPlantilla").jqxGrid('hidecolumn','IDColonia');
            $("#gdPlantilla").jqxGrid('hidecolumn','IDTipoSindicato');
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
			WriteExcel(rows, 'EsquemaPago');
		}
		ocultarCargador();
	}, 1000);
}

function Nuevo()
{
    $("#jqxtabs").jqxTabs('enableAt', 1); 
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo'); 
    limpiaCampos();
    $("#idsindicato").val("0");
    DatosInfo["idsindicato"]="0";
    $("#jqxtabs").jqxTabs('select',1);
}

function validaCampos(elem) {
    mostrarUpCargador();
    let divId = elem.dataset.contenido;
    let resultValidacion = [];
    let arrObjetosValdiar = $("#" + divId + "").find('.aweb0');

    console.log(DatosInfo);

    $.each(arrObjetosValdiar, function (index, data) {
        let idObjhtml = data.id;
        if ($("#" + idObjhtml + "").val() == "") {
            let ObjLabel = document.getElementById(divId).querySelector("label[for =" + idObjhtml + "]");
            resultValidacion.push("Falta asignar valor al campo " + ObjLabel.textContent + ". ");
        }
    });

    if (resultValidacion.length == 0) 
    {
        var apino =DatosInfo.idsindicato=="0" ? "A90B02072C927C0F7A69C6F00B6A5CBA3C2A2C6480217768ABF24F33369FE402":"AD37A90816E573CF25E8BCE577895C84A452D45BC8B984E4DF9BC7E51E126CB9";
        
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
    DatosInfo.idsindicato=obj.IDSindicato.toString();
    DatosInfo.nombrecorto=obj.NombreCorto;
    DatosInfo.nombrelargo=obj.NombreLargo;
    DatosInfo.calle=obj.Calle;
    DatosInfo.numext=obj.NumExterior;
    DatosInfo.numint=obj.NumInterior;
    DatosInfo.idpais=obj.ClavePais.toString();
    DatosInfo.cp=obj.CodigoPostal.toString();
    DatosInfo.identidad=obj.ClaveEntidad.toString();
    DatosInfo.idmunicipio=obj.ClaveMunicipio.toString();
    DatosInfo.idcolonia=obj.IDColonia.toString();
    DatosInfo.telefono1=obj.Telefono1;
    DatosInfo.telefono2=obj.Telefono2;
    DatosInfo.nombrerepresentante=obj.NombredelRepresentante;
    DatosInfo.apellido1representante=obj.ApellidoPaternodelRepresentante;
    DatosInfo.apellido2representante=obj.ApellidoMaternodelRepresentante;
    DatosInfo.idtiposindicato=obj.IDTipoSindicato.toString();

    if(obj.VigenciaInicial!="")
    {
        DatosInfo.vigenciainicial=formatDate(obj.VigenciaInicial);
    }
    if(obj.VigenciaFinal!="")
    {
        DatosInfo.vigenciafinal=formatDate(obj.VigenciaFinal);
    }

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
    $("#idpais").val(obj.ClavePais);
    $("#idtiposindicato").val(obj.IDTipoSindicato);
    setTimeout(function(){ $("#identidad").val(obj.ClaveEntidad);},1800);
    setTimeout(function() { $("#idmunicipio").val(obj.ClaveMunicipio);},2800);
    setTimeout(function() { $("#idcolonia").val(obj.IDColonia);},3800);

    $("#jqxtabs").jqxTabs('enableAt', 1);
    $("#jqxtabs").jqxTabs('setTitleAt', 1,'Modificar');
    $("#jqxtabs").jqxTabs('select', 1);
    
    setTimeout(ocultarCargador,4000);

    //console.log(DatosInfo);
}