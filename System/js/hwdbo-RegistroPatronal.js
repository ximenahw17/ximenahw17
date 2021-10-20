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

    $(".hwdbo-numero").jqxNumberInput({ inputMode: 'simple', height: '22px', width: '94%', min: 0, max: 9999999, spinMode: 'simple', textAlign: 'left', decimalDigits: 5, digits:7 });
    
    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '99%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 
    
    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '100%', height: '30px' });
    
    $(".hwdbo-switch").jqxSwitchButton({ theme:'fresh', onLabel: 'Si', offLabel: 'No', height: 30, width:'60%' }).on('change', function (event) { RadioChange(event); });

    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' });

    $(".hwdbo-texto, .hwdbo-combo, .hwdbo-numero").on("change", function (event) {
        let idelem = this.id;
        let htmlObj = $("#" + idelem + "");
        let val = '';
        if(event.args.type=="mouse" || event.args.type=="keyboard")
        {
            if (htmlObj.hasClass("hwdbo-texto")) 
            {
                val = htmlObj.val().toString().toUpperCase();
            }
            else if(htmlObj.hasClass("hwdbo-numero"))
            {
                val = htmlObj.val().toString()
            }
            else if (htmlObj.hasClass("hwdbo-combo")) 
            {
                var item = htmlObj.jqxDropDownList('getSelectedItem');
                val = item.value.toString();
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

    $("#numeroexterior").jqxInput({ width: '98%', height: '30px' });
    
    $("#numerointerior").jqxInput({ width: '98%', height: '30px' });

    $("#idrazonsocial").on('change',function(event){
        let IdPais=event.args.item.originalItem.Id_Pais;
        let descripcion =event.args.item.originalItem.Descripcion;
        DatosInfo.descripcionregistropatronal = descripcion.substring(descripcion.split(' ')[0].length,descripcion.length).trim();
        DatosInfo.rfc=descripcion.split(' ')[0].trim();
        $("#idpais").val(IdPais);
    });

    $("#idpais").on('change',function(event){
        $("#identidad").jqxDropDownList('clear');
        $("#idmunicipio").jqxDropDownList('clear');
        $("#colonia").jqxDropDownList('clear');
        fillCombo(36, 'identidad', '&_Parameters=' + $(this).val());
        DatosInfo.idpais=$(this).val();
        var valor = GetValLada($(this).val());
        $("#ladatelefono1").val(valor);
        DatosInfo.ladatelefono1=valor.toString();
    });

    $("#identidad").on('change',function(event){
        $("#idmunicipio").jqxDropDownList('clear');
        $("#colonia").jqxDropDownList('clear');
        fillCombo(37, 'idmunicipio', "&_Parameters='" + $("#idpais").val() + "','" + $(this).val() + "'");
    });

    $("#idmunicipio").on('change',function(event){
        $("#colonia").jqxDropDownList('clear');
        fillCombo(38, 'colonia', "&_Parameters='" + $("#idpais").val() + "','" + $("#identidad").val() + "','" + $(this).val() + "'");
    });

    $("#idclaseprt").on('change',function(event){
        $("#idfraccionprt").jqxDropDownList('clear');
        fillCombo(77, 'idfraccionprt', '&_Parameters=' + $(this).val());
    });

    $("#idclavedelegacionimss").on('change',function(event){
        $("#idclavesubdelegacionimss").jqxDropDownList('clear');
        fillCombo(79, 'idclavesubdelegacionimss', '&_Parameters=' + $(this).val());
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
    $.when(ajaxCatalogo(51,"")).done(function (response) {
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
    fillCombo(40, 'idrazonsocial', '');
    fillCombo(72, 'idzonaeconomica', '');
    fillCombo(76, 'idclaseprt', '');
    fillCombo(78, 'idclavedelegacionimss', '');
    fillCombo(75, 'idinmueble', '');
    fillCombo(44, 'ladatelefono1', '')
}

function Nuevo()
{
    $("#jqxtabs").jqxTabs('enableAt', 1); 
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo'); 
    limpiaCampos();
    $("#idregistropatronal").val("0");
    DatosInfo["idregistropatronal"]="0";
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

    let botones="<div class=\"row\" style=\"margin-top:1.5%;margin-left:1%\">";
    botones+="<div class=\"col-md-1\"><button id=\"BtnNuevo\"><i class=\"fa fa-plus-circle\"></i> Nuevo</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
    botones+="</div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    var oculta="IDEntidad,IDMunicipio,IDZonaEconomica,IDColonia,Id_ClaveDelegacionIMSS,Id_ClaveSubDelgacionIMSS,Id_ClasePRT,Id_FraccionPRT";
    var hide ="";
    $.each(oculta.split(','),function(i,elem){
        hide+="$('#gdPlantilla').jqxGrid('hidecolumn','" + elem + "');";
    });

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
            eval(hide);
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
    eval(hide);
    ocultarCargador();
}

function validaCampos(elem) {
    mostrarUpCargador();
    let divId = elem.dataset.contenido;
    let resultValidacion = [];
    let arrObjetosValdiar = $("#" + divId + "").find('.aweb0');

    $.each(arrObjetosValdiar, function (index, data) {
        let idObjhtml = data.id;
        let htmlObj = $("#" + idObjhtml + "");
        if ($("#" + idObjhtml + "").val() == "" && !htmlObj.hasClass("hwdbo-switch")) {
            let ObjLabel = document.getElementById(divId).querySelector("label[for =" + idObjhtml + "]");
            resultValidacion.push("Falta asignar valor al campo " + ObjLabel.textContent + ". ");
        }
    });

    if (resultValidacion.length == 0) 
    {
        var apino = DatosInfo.idregistropatronal=="0" ? "D74441E8311EAC7DF6512511FE8E35675756FF3EBC4A237441E1F0BC2637248D":"9CBC2ED818BBC95D3570684F33A8FE11CA3BAA453C226A150F8093E51EA9E704";
        
        var obj = new Object();
        obj.API=apino;
        obj.Parameters="";
        obj.JsonString=JSON.stringify(DatosInfo);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        //console.log(DatosInfo);
        
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
        },1000);        
    }
    else
    {
        armaListaErrores(resultValidacion);
        ocultarUpCargador();
    }
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'RegistroPatronal');
		}
		ocultarCargador();
	}, 1000);
}

function RadioChange(event)
{
    let idelem=event.currentTarget.id;
    if (event.args.checked) {
        DatosInfo[idelem]="1";
    }
    else {
        DatosInfo[idelem]="0";
    }
}

function GetValLada(idpais)
{
    var items = $("#ladatelefono1").jqxDropDownList('getItems');
    var id=0;
    $.each(items,function(i,row){
        if(row.originalItem.Id_Pais==idpais)
        {
            id=row.originalItem.Valor;
            return false;
        }
    });
    return id;
}

function MapeaDatos(obj)
{
    console.log(obj);
    DatosInfo.idregistropatronal=obj.IDRegistroPatronal.toString();
    DatosInfo.numeroregistropatronal=obj.NumeroRegistroPatronal.toUpperCase();
    DatosInfo.actividadeconomica=obj.ActividadEconomica.toUpperCase();
    DatosInfo.calle=obj.Calle;
    DatosInfo.numeroexterior=obj.NumeroExterior;
    DatosInfo.numerointerior=obj.NumeroInterior;
    DatosInfo.codigopostal=obj.CodigoPostal.toString();
    DatosInfo.telefono1=obj.Telefono;
    DatosInfo.nombrerepresentantelegal=obj.NombreRepresentanteLegal.toUpperCase();
    DatosInfo.apellido1representantelegal=obj.ApellidoMaternoRepresentanteLegal.toUpperCase();
    DatosInfo.apellido2representantelegal=obj.ApellidoPaternoRepresentanteLegal.toUpperCase();
    DatosInfo.curprepresentantelegal=obj.CURPRepresentanteLegal.toUpperCase();
    DatosInfo.porcentajeprimariesgo=obj.PorcentajePrimaRiesgo.toString();
    DatosInfo.idzonaeconomica = obj.IDZonaEconomica.toString();
    DatosInfo.idclaseprt=obj.Id_ClasePRT.toString();
    DatosInfo.idfraccionprt=obj.Id_FraccionPRT.toString();
    DatosInfo.idclavedelegacionimss=obj.Id_ClaveDelegacionIMSS.toString();
    DatosInfo.idclavesubdelegacionimss=obj.Id_ClaveSubDelgacionIMSS.toString();
    DatosInfo.identidad=obj.IDEntidad.toString();
    DatosInfo.idmunicipio=obj.IDMunicipio.toString();
    DatosInfo.colonia=obj.IDColonia.toString();
    DatosInfo.idpais="157";
    DatosInfo.idrazonsocial=obj.IDRazonSocial.toString();
    DatosInfo.styps=obj.STyPS=="NO"?"0":"1";

    if(obj.VigenciaInicial!="")
    {
        DatosInfo.vigenciainicial=formatDate(obj.VigenciaInicial);
    }
    if(obj.VigenciaFinal!="")
    {
        DatosInfo.vigenciaFinal=formatDate(obj.VigenciaFinal);
    }
    

    let objKeys = Object.keys(DatosInfo);
    $.each(objKeys, function (index, data) {
        let htmlObj = $("#" + data + "");
        let valor = DatosInfo[data];
        
        if (htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero")) {
            $("#" + data + "").val(valor);
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
        else if(htmlObj.hasClass("hwdbo-switch"))
        {
            if(valor=="0")
            {
                $("#" + data + "").jqxSwitchButton({ checked:false });
            }
            else
            {
                $("#" + data + "").jqxSwitchButton({ checked:true });
            }
        }
        
        DatosInfo[data]=valor.toString();
    });
    //llenar combos        
    $("#idrazonsocial").val(obj.IDRazonSocial);
    $("#idzonaeconomica").val(obj.IDZonaEconomica);
    $("#idinmueble").val(obj.Id_Inmueble);
    $("#idclavedelegacionimss").val(obj.Id_ClaveDelegacionIMSS);
    $("#idclaseprt").val(obj.Id_ClasePRT);
    setTimeout(function(){ $("#identidad").val(obj.IDEntidad);},1000);
    setTimeout(function() { $("#idmunicipio").val(obj.IDMunicipio);},2000);
    if(obj.IDColonia!="0" || obj.IDColonia!="")
    {
        setTimeout(function() { $("#colonia").val(obj.IDColonia);},2800);
    }
    setTimeout(function(){ $("#idclavesubdelegacionimss").val(obj.Id_ClaveSubDelgacionIMSS);},3000);    
    setTimeout(function(){ $("#idfraccionprt").val(obj.Id_FraccionPRT);},3500);

    $("#jqxtabs").jqxTabs('enableAt', 1);
    $("#jqxtabs").jqxTabs('setTitleAt', 1,'Modificar');
    $("#jqxtabs").jqxTabs('select', 1);
    
    setTimeout(ocultarCargador,3500);

    console.log(DatosInfo);
}
