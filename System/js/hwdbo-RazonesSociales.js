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

    $("#pia").jqxSwitchButton({ onLabel: 'Si', offLabel: 'No', height: 30,theme:'light' }).on('change', function (event) { RadioChange(event); });

    $("#pais").on('change',function(event){
        fillCombo(36, 'entidadfederativa', '&_Parameters=' + $(this).val());
    });

    $("#entidadfederativa").on('change',function(event){
        fillCombo(37, 'municipio', "&_Parameters='" + $("#pais").val() + "','" + $(this).val() + "'");
    });

    $("#municipio").on('change',function(event){
        fillCombo(38, 'colonia', "&_Parameters='" + $("#pais").val() + "','" + $("#entidadfederativa").val() + "','" + $(this).val() + "'");
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

    $("#regimen").on('change',function(event){
        var valor  = $(this).val();
        switch(valor)
        {
            case "601":
            case "603":
            case "607":
            case "609":
            case "620":
            case "623":
            case "624":
            case "628":
                $("#rfcrazonsocial").attr("maxlength","12");
                $("#curp").val('');
                $("#curp").jqxInput({ disabled: true });
                $("#curp").removeClass("aweb0");
                $(".curpobli").hide();
                break;
            case "605":
            case "606":
            case "608":
            case "611":
            case "612":
            case "614":
            case "615":
            case "616":
            case "621":
            case "629":
            case "630":
                $("#rfcrazonsocial").attr("maxlength","13");
                $("#curp").jqxInput({ disabled: false });
                $("#curp").addClass("aweb0");
                $(".curpobli").show();
                break;
            case "610":
            case "622":
                $("#rfcrazonsocial").attr("minlength","12");
                $("#rfcrazonsocial").attr("maxlength","13");
                $("#curp").jqxInput({ disabled: false });
                $("#curp").removeClass("aweb0");
                $(".curpobli").hide();
                break; 
            default:
                $("#curp").val('');
                $("#curp").jqxInput({ disabled: true });
                $("#curp").removeClass("aweb0");
                $(".curpobli").hide();
                break;
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
    $.when(ajaxCatalogo(49,"")).done(function (response) {
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
    fillCombo(26, 'pais', '');
    fillCombo(71, 'regimen', '');
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
            $('#gdPlantilla').jqxGrid('setcolumnproperty', textotodatafield('RFC Patronal'), 'width', 150);
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

    $('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all'); $('#gdPlantilla').jqxGrid('setcolumnproperty', textotodatafield('RFC Patronal'), 'width', 150);});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all'); $('#gdPlantilla').jqxGrid('setcolumnproperty', textotodatafield('RFC Patronal'), 'width', 150);});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all'); $('#gdPlantilla').jqxGrid('setcolumnproperty', textotodatafield('RFC Patronal'), 'width', 150);});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all'); $('#gdPlantilla').jqxGrid('setcolumnproperty', textotodatafield('RFC Patronal'), 'width', 150);});

    ocultarCargador();
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'RazonesSociales');
		}
		ocultarCargador();
	}, 1000);
}

function Nuevo()
{
    $("#jqxtabs").jqxTabs('enableAt', 1); 
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo'); 
    limpiaCampos();
    $("#idrazonsocial").val("0");
    DatosInfo["idrazonsocial"]="0";
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
    //validar longitud de curp
    var longmin=$("#rfcrazonsocial").attr('minlength');
    var longmax=$("#rfcrazonsocial").attr('maxlength');
    var disabled = $('#rfcrazonsocial').jqxInput('disabled');
    
    if(disabled===false)
    {
        var len = $("#rfcrazonsocial").val().length;
        //console.log(longmin,longmax,disabled,len);
        let idObjhtml ="rfcrazonsocial";
        let ObjLabel = document.getElementById(divId).querySelector("label[for =" + idObjhtml + "]");

        if(longmin!=undefined)
        {
            if(Number(len)<Number(longmin) && Number(len)<=Number(longmax))
            {
                resultValidacion.push("El campo " + ObjLabel.textContent + " debe tener longitud entre " + longmin + " y " + longmax);
            }
        }
        else
        {
            if(Number(len)<Number(longmax))
            {

                resultValidacion.push("El campo " + ObjLabel.textContent + " debe tener longitud " + longmax);
            }
        }

    }

    if (resultValidacion.length == 0) {
        var apino = DatosInfo.idrazonsocial=="0" ? "C35FEF3EA8800EAF7A85031A6FE5C1940894482C7688D354F6D791D1BF5B7930" : "F1323A6B58AB2A806AA794D726074DD3DDA5FBFA4F66575C418BFC065453D880";

        var obj = new Object();
        obj.API=apino;
        obj.Parameters="";
        obj.JsonString=JSON.stringify(DatosInfo);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        //console.log(DatosInfo);
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
        armaListaErrores(resultValidacion);
        ocultarUpCargador();
    }
}

function MapeaDatos(obj)
{
    DatosInfo.idrazonsocial=obj.IDRazonSocial;
    DatosInfo.apellido1representante=obj.ApellidoMaternodelRepresentanteLegal.toUpperCase();
    DatosInfo.apellido2representante=obj.ApellidoPaternodelRepresentanteLegal.toUpperCase();
    DatosInfo.calle=obj.Calle.toUpperCase();
    DatosInfo.colonia=obj.Colonia.toUpperCase();
    DatosInfo.cp=obj.CodigoPostal;
    DatosInfo.curp=obj["CURP(Personafisica)"].toUpperCase();
    DatosInfo.curprepresentante=obj.CURPRepresentanteLegal.toUpperCase();
    DatosInfo.entidadfederativa=obj.ClaveEntidad.toString();
    DatosInfo.idrazonsocial=obj.IDRazonSocial;
    DatosInfo.municipio=obj.ClaveMunicipio.toString();
    DatosInfo.nombrecortorazonsocial=obj.RazonSocialNombreCorto.toUpperCase();
    DatosInfo.nombrerazonsocial=obj.RazonSocialNombreCompleto.toUpperCase();
    DatosInfo.nombrerepresentante=obj.NombredelRepresentanteLegal.toUpperCase();
    DatosInfo.numext=obj.NumeroExterior;
    DatosInfo.numint=obj.NumeroInterior;
    DatosInfo.pais=obj.ClavePais;
    DatosInfo.pia = obj.ServicioPayInAdvace=="Sí"?"1":"0";
    DatosInfo.regimen=obj.Regimen;
    DatosInfo.rfcrazonsocial=obj.RFCPatronal.toUpperCase();
    DatosInfo.rfcrepresentante=obj.RFCRepresentanteLegal.toUpperCase();
    DatosInfo.telefono=obj.Telefono1;
    DatosInfo.vigenciainicial=formatDate(obj.VigenciaInicial);
    if(obj.VigenciaFinal!="")
    {
        DatosInfo.vigenciafinal=formatDate(obj.VigenciaFinal);
    }

    DatosInfo.idrazonsocial=DatosInfo.idrazonsocial.toString();
    DatosInfo.regimen = DatosInfo.regimen.toString();
    DatosInfo.pais = DatosInfo.pais.toString();
    DatosInfo.entidadfederativa=DatosInfo.entidadfederativa.toString();
    DatosInfo.municipio=DatosInfo.municipio.toString();

    $("#rfcrazonsocial").val(obj.RFCPatronal);
    $("#nombrerazonsocial").val(obj.RazonSocialNombreCompleto);
    $("#nombrecortorazonsocial").val(obj.RazonSocialNombreCorto);
    $("#curpepresentante").val(obj.CURPRepresentanteLegal);
    $("#regimen").val(obj.Regimen);
    $("#pais").val(obj.ClavePais);
    if(obj.ServicioPayInAdvace=="Sí")
    {
        $('#pia').jqxSwitchButton({ checked:true });
    }
    else
    {
        $('#pia').jqxSwitchButton({ checked:false });
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
            
    setTimeout(function(){ $("#entidadfederativa").val(obj.ClaveEntidad);},1500);
    setTimeout(function() { $("#municipio").val(obj.ClaveMunicipio);},2500);
    setTimeout(function() { $("#colonia").val(obj.Colonia);},3500);

    $("#jqxtabs").jqxTabs('enableAt', 1);
    $("#jqxtabs").jqxTabs('setTitleAt', 1,'Modificar');
    $("#jqxtabs").jqxTabs('select', 1);
    
    setTimeout(ocultarCargador,3000);
}

function RadioChange(event)
{
    if (event.args.checked) {
        DatosInfo.pia="1";
    }
    else {
        DatosInfo.pia="0";
    }
}