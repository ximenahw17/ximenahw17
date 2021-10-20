var IdControlNomina=0;
//agrego Paco
var _NumeroNomina = 0;
var _objperfil;
var ExisteCierre=false;
var MensajeCierre="";

$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";
    
    $("#jqxtabs").jqxTabs({ width: '100%', height: '100%', position: 'top' });

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 

    _cerrar(1);

});

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
    botones+="<div class=\"col-1.5\"><button onclick=\"Validar();\" class=\"btn btn-outline-dark btn-sm\" ><span class=\"fa fa-check\"></span> Validar</button></div>";
    botones+="<div class=\"col-1.5\"><button onclick=\"Cerrar();\" class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-lock\"></span> Cerrar</button></div>";
    botones+="<div class=\"col-1.5\"><button onclick=\"Aperturar();\" class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-unlock\"></span> Aperturar</button></div>";
    botones+="<div class=\"col-1.5\"><button class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-file-excel-o\"></span> Exportar</button></div>";
    botones+="</div></div>";


    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        showstatusbar: false,
        width: '100%',
        autoheight:true,
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
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_ControlNomina');
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

function armaGrid2(_data,NomGrid)
{
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
            let ancho = index==2 || index==4?"21%":"10.5%";
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: ancho,
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
    if(NomGrid=="GridWarning")
    {
        botones+="<div class=\"col-1.5\"><button onclick=\"DescargaExcel('"+NomGrid+"','Warnings');\" class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-file-excel-o\"></span> Exportar</button></div>";
    }
    else
    {
        botones+="<div class=\"col-1.5\"><button onclick=\"DescargaExcel('"+NomGrid+"','Stoppers');\" class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-file-excel-o\"></span> Exportar</button></div>";
    }
    botones+="</div></div>";

    $("#" + NomGrid).jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        showstatusbar: false,
        width: '100%',
        autoheight:true,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 10,
        sortable: true, 
        showstatusbar:true, 
        statusbarheight: 64,
        ready:function(){
            $("#" + NomGrid).jqxGrid('updatebounddata');
            $("#" + NomGrid).jqxGrid('hidecolumn','Id_Conf_ValidacionCierreNomina');
            $("#" + NomGrid).jqxGrid('hidecolumn','Id_TipoValidacionNomina');
            $("#" + NomGrid).jqxGrid('hidecolumn','Validacion');
            $("#" + NomGrid).jqxGrid('autoresizecolumns');
        },
        renderstatusbar: function(statusbar){ 
            statusbar.append(botones); 
        }

    });

    $("#" + NomGrid).on('bindingcomplete',function(){ $("#" + NomGrid).jqxGrid('autoresizecolumns','all');});
    $("#" + NomGrid).on('filter',function(){ $("#" + NomGrid).jqxGrid('autoresizecolumns','all');});
    $("#" + NomGrid).on('sort',function(){ $("#" + NomGrid).jqxGrid('autoresizecolumns','all');});
    $("#" + NomGrid).on('pagechanged',function(){ $("#" + NomGrid).jqxGrid('autoresizecolumns','all');});
}

function Combos()
{
    var json = new Object();
    json.idgrupoempresarial="";
    json.idtipoperiodo="";
    json.combo="ge";

    var obj = new Object();
    obj.API="D224731C77DD6C795164F99E05E2548D1A83ED2607E29D6B92643D15FA72CEAB";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res.length>0)
        {
            var dataAdapter = new $.jqx.dataAdapter(res);
    
            $("#idgrupoempresarial").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });

            Clasificacion();
        }
        else
        {
            $("#idgrupoempresarial").jqxDropDownList('clear');
        }
    }).fail(function(){ 
        $("#idgrupoempresarial").jqxDropDownList('clear');
    });

    setTimeout(ocultarCargador,1500);
}

function Clasificacion()
{
    var json = new Object();
    json.idgrupoempresarial="";
    json.idclasificacionnomina="";
    json.idtiponomina="";
    json.idperfilcalendario="";
    json.idgrupocalculo="";
    json.idperiodonomina="";

    CombosApertura("clasificacion",json);

}

function CombosApertura(NomCombo,json)
{
    var obj = new Object();
    obj.API="B14EF64C45438814A296555977E158C86BC7E54A5D7AD491139CE1BD5F74D5F8";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res.length>0)
        {
            var dataAdapter = new $.jqx.dataAdapter(res);

            //agrego Paco
            if(NomCombo == 'periodo')
            {
                _objperfil = JSON.parse(JSON.stringify(res));

                $("#" + NomCombo).jqxDropDownList({
                    source: dataAdapter,
                    displayMember: "Descripcion",
                    valueMember: "Valor",
                    placeHolder:"--Seleccione--"                
                });
            }
    
            if(NomCombo=="clasificacion")
            {
                $("#" + NomCombo).jqxDropDownList({
                    source: dataAdapter,
                    displayMember: "Descripcion",
                    valueMember: "Valor",
                    placeHolder:"--Seleccione--"                
                });
            }
            else
            {
                $("#" + NomCombo).jqxDropDownList({
                    source: dataAdapter,
                    displayMember: "Descripcion",
                    valueMember: "Valor",
                    placeHolder:"--Seleccione--",
                    selectedIndex:0                
                });
            }
            
        }
        else
        {
            $("#" + NomCombo).jqxDropDownList('clear');
        }
    }).fail(function(){ 
        $("#" + NomCombo).jqxDropDownList('clear');
    });
}

function Cerrar()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione un registro");
    }
    else if(rows.length>1)
    {
        showMsg("Mensaje","Únicamente puede seleccionar un registro");
    }
    else
    {
        mostrarCargador();
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        var _json=new Object();
        _json.idcontrolnomina=data0.Id_ControlNomina.toString();
        IdControlNomina=data0.Id_ControlNomina.toString();
    
        var obj = new Object();
        obj.API="1CDDE1648B2243312F2313C62342F550EBAB6923DFFA3C55CA96EE4D869C1F1A";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(_json);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        setTimeout(function()
        {
            $.when(ajaxTokenFijo(obj)).done(function (response) {

                if(response.error==1)
                {
                    showMsg("Error",response.msg);
                }
                else if(response.Table[0].AplicaCierre==1)
                {
                    $.confirm({
                        title: "Mensaje",
                        content: "Se cerrará la nómina",
                        icon: 'fa fa-check nuevoingresoico',
                        type:'green',
                        typeAnimated:true,
                        columnClass: 'medium',
                        buttons: {
                            aceptar: function () {
                                _cerrar(2);
                            },
                            cancelar:function(){}
                        }
                    });
                }
                else
                {
                    let Tablas=Object.keys(response);
                    let numWrn=0;
                    let numStp=0;
                    $.each(Tablas,function(i,tabla){
                        if(response[tabla][0].Id_TipoValidacionNomina==1){
                            numWrn=numWrn+1;
                        }
                        else if(response[tabla][0].Id_TipoValidacionNomina==2)
                        {
                            numStp=numStp+1;
                        }
                    });

                    if(numStp>0)
                    {
                        $.confirm({
                            title: "Mensaje",
                            content: "No es posible cerrar la nómina ya que existen "+numStp+" stoppers, ¿Revisar stoppers?",
                            icon: 'fa fa-close bajasico',
                            type:'red',
                            typeAnimated:true,
                            columnClass: 'medium',
                            buttons: {
                                aceptar: function () {
                                    Validar(1);
                                },
                                cancelar:function(){}
                            }
                        });
                    }
                    else if(numWrn>0)
                    {
                        $.confirm({
                            title: "Mensaje",
                            content: "Existen "+numWrn+" warnings, ¿Desea cerrar la nómina?",
                            icon: 'fa fa-close bajasico',
                            type:'red',
                            typeAnimated:true,
                            columnClass: 'medium',
                            buttons: {
                                aceptar: function () {
                                    BitacoraWarnings(response);
                                    _cerrar(2);
                                },
                                cancelar:function(){}
                            }
                        });
                    }
                }

                ocultarCargador();

            }).fail(function(e){
                showMsg("Mensaje","Ocurrió un error al validar");
                ocultarCargador();
            });
        },1000);
    }
}

function Aperturar()
{
    $("#clasificacion").jqxDropDownList('clearSelection');
    $("#periodicidad").jqxDropDownList('clear');
    $("#periodo").jqxDropDownList('clear');
    $("#perfil").jqxDropDownList('clear');
    $("#DivNombreExtra").hide();

    $("#offcanvasApertura").offcanvas('show');
}

function Validar(selTab=0)
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione un registro");
    }
    else if(rows.length>1)
    {
        showMsg("Mensaje","Únicamente puede seleccionar un registro");
    }
    else
    {
        mostrarCargador();
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        var _json=new Object();
        _json.idcontrolnomina=data0.Id_ControlNomina.toString();
    
        var obj = new Object();
        obj.API="1CDDE1648B2243312F2313C62342F550EBAB6923DFFA3C55CA96EE4D869C1F1A";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(_json);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        setTimeout(function()
        {
            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.Table[0].AplicaCierre==1)
                {
                    ocultarCargador();
                    $.confirm({
                        title: "Validación",
                        content: "No se encontraron errores en la nómina " + data0.Descripciondelanomina,
                        icon: 'fa fa-check nuevoingresoico',
                        type:'green',
                        typeAnimated:true,
                        columnClass: 'medium',
                        buttons: {
                            aceptar: function () {
                            }
                        }
                    });
                }
                else
                {
                    let Tablas=Object.keys(response);
                    let Warnings = "<div class=\"accordion\" id=\"accordionWarning\">";
                    let Stoppers = "<div class=\"accordion\" id=\"accordionStopper\">";
                    let numWrn=0;
                    let numStp=0;
                    $("#DivWarning").html('<div id="GridWarning"></div>');
                    $("#DivStopper").html('<div id="GridStopper"></div>');

                    $.each(Tablas,function(i,tabla){
                        if(response[tabla][0].Id_TipoValidacionNomina==1)
                        {
                            Warnings+="<div class=\"accordion-item\">";
                            Warnings+="<h2 class=\"accordion-header\" id=\"heading"+i+"\">";
                            Warnings+="<button class=\"accordion-button\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"collapse"+i+"\">";
                            Warnings+=response[tabla][0].Validacion+"</button></h2>";
                            Warnings+="<div id=\"collapse"+i+"\" class=\"accordion-collapse collapse\" aria-labelledby=\"heading"+i+"\" data-bs-parent=\"#accordionWarning\">";
                            Warnings+="<div class=\"accordion-body\"><div id=\"GridWrn"+i+"\"></div></div>";
                            Warnings+="</div></div>";
                            numWrn=numWrn+1;
                        }
                        else
                        {
                            Stoppers+="<div class=\"accordion-item\">";
                            Stoppers+="<h2 class=\"accordion-header\" id=\"heading"+i+"\">";
                            Stoppers+="<button class=\"accordion-button\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse"+i+"\" aria-expanded=\"true\" aria-controls=\"collapse"+i+"\">";
                            Stoppers+=response[tabla][0].Validacion+"</button></h2>";
                            Stoppers+="<div id=\"collapse"+i+"\" class=\"accordion-collapse collapse\" aria-labelledby=\"heading"+i+"\" data-bs-parent=\"#accordionStopper\">";
                            Stoppers+="<div class=\"accordion-body\"><div id=\"GridStp"+i+"\"></div></div>";
                            Stoppers+="</div></div>";
                            numStp=numStp+1;
                        }
                    });

                    Warnings+="</div>";
                    Stoppers+="</div>";

                    $("#GridWarning").html(Warnings);
                    $("#GridStopper").html(Stoppers);

                    $.each(Tablas,function(i,tabla){
                        if(response[tabla][0].Id_TipoValidacionNomina==1){
                            armaGrid2(response[tabla],"GridWrn"+i);
                        }
                        else if(response[tabla][0].Id_TipoValidacionNomina==2)
                        {
                            armaGrid2(response[tabla],"GridStp"+i);
                        }
                    });

                    ocultarCargador();
                    
                    if(selTab==1)
                    {
                        $("#tabStopper").trigger('click');
                    }
                    else
                    {
                        $("#tabWarning").trigger('click'); 
                    }

                    $("#offcanvasValidacion").offcanvas('show');
                }
            }).fail(function(e){
                showMsg("Mensaje","Ocurrió un error al validar");
                ocultarCargador();
            });
        },1000);
    }
}

function DescargaExcel(NomGrid,nombre) {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#" + NomGrid).jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, nombre);
		}
		ocultarCargador();
	}, 1000);
}

function BitacoraWarnings(registros)
{
    let JsonRegistros=new Array();
    let Tablas=Object.keys(registros);
    $.each(Tablas,function(i,tabla){
        $.each(registros[tabla],function(i,row){
            var _json=new Object();
            _json.idcontrolnomina=IdControlNomina;
            _json.idgrupoempresarial=$("#idgrupoempresarial").val().toString();
            _json.usuarioafectacion="usuario@harwebdbo.mx";
            _json.idconfvalidacioncierrenomina=row.Id_Conf_ValidacionCierreNomina.toString();
            _json.idtipovalidacionnomina=row.Id_TipoValidacionNomina.toString();
    
            JsonRegistros.push(_json);
        });
    });

    var obj = new Object();
    obj.API="122007A49A224A4E921D251EF376D796904554B3E5B1691D22E7E99BDFCE79B0";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(JsonRegistros);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
            console.log(response);
            if(response.error=="0")
            {
                return false;
            }
    }).fail(function(e){
        showMsg("Mensaje","Ocurrió un error al guardar en bitácora");
        ocultarCargador();
    });

}

function _cerrar(opc)
{
    var json = new Object();

    switch(opc)
    {
        case 1: //revisar si hay cierre o calculo ejecutandose
            json.idcontrolnomina="";
            json.usuario="";
            break;
        case 2: // ejecutar cierre
            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
            var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
            json.idcontrolnomina=data0.Id_ControlNomina.toString();
            json.usuario="usuario@harwebdbo.mx";
            break;
        default:
            break;
    }

    var obj = new Object();
    obj.API="F6A714CEECE93A2F9554F4D0C45C3864981C41EB7F6ED5E986550D4FFC065E48";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    mostrarCargador();

    if(opc==1) 
    {
        setTimeout(function(){
            $.when(ajaxTokenFijo(obj)).done(function (res) {
                res=res[0];
                if(res.Proceso=="1")
                {
                    ExisteCierre=true;
                    showMsg("Mensaje",res.Mensaje);
                }
                else
                {
                    ExisteCierre=false;
                }

                if(ExisteCierre==true)
                {
                    showMsg("Mensaje",MensajeCierre);
                }
                else
                {
                    Combos();     
            
                    $("#idgrupoempresarial").on('change',function(){
                        var _json=new Object();
                        _json.idgrupoempresarial=$(this).val().toString();
                
                        var obj = new Object();
                        obj.API="EAD992E071A21E700A32A814C4442F8387354A66C48123714DA053A6029ADA86";
                        obj.Parameters="";
                        obj.JsonString=JSON.stringify(_json);
                        obj.Hash= getHSH();
                        obj.Bearer= getToken();
                
                        mostrarCargador();
                
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
                        }).fail(function(){ 
                            ocultarCargador();
                        });           
                    });
                
                    $("#clasificacion").on('change',function(){
                        var json = new Object();
                        json.idgrupoempresarial=$("#idgrupoempresarial").val().toString();
                        json.idclasificacionnomina="";
                        var item = $(this).jqxDropDownList('getSelectedItem'); 
                        json.idtiponomina=item.originalItem.Id_TipoNomina.toString();
                        json.idperfilcalendario="";
                        json.idgrupocalculo="";
                        json.idperiodonomina="";
                
                        if(item.originalItem.Id_TipoNomina==2)
                        {
                            $("#DivNombreExtra").show();
                        }
                        else
                        {
                            $("#DivNombreExtra").hide();
                        }
                
                        CombosApertura("periodicidad",json);
                        
                        
                    });
                
                    $("#periodicidad").on('change',function(){
                        var json = new Object();
                        json.idgrupoempresarial=$("#idgrupoempresarial").val().toString();
                        json.idclasificacionnomina="";
                        var item = $("#clasificacion").jqxDropDownList('getSelectedItem'); 
                        var itemgrupo=$(this).jqxDropDownList('getSelectedItem');
                        json.idtiponomina=item.originalItem.Id_TipoNomina.toString();
                        json.idperfilcalendario=$(this).val().toString();
                        json.idgrupocalculo=itemgrupo.originalItem.Id_GrupoCalculo.toString();
                        json.idperiodonomina="";
                
                        CombosApertura("periodo",json);
                    });
                
                    $("#periodo").on('change',function(){
                        var json = new Object();
                        json.idgrupoempresarial="";
                        json.idclasificacionnomina=""; 
                        var itemgrupo=$("#periodicidad").jqxDropDownList('getSelectedItem');
                        json.idtiponomina="";
                        json.idperfilcalendario="";
                        json.idgrupocalculo=itemgrupo.originalItem.Id_GrupoCalculo.toString();
                        json.idperiodonomina="";
                
                        CombosApertura("perfil",json);
                    });
                }
                ocultarCargador();
            }).fail(function(){ 
                ocultarCargador();
                showMsg("Mensaje","Ocurrió un error al validar cierre");
            });
        },1000);
    }
    else if(opc==2)
    {
        setTimeout(function(){
            $.when(ajaxTokenFijo(obj)).done(function (res) {
                console.log(res);
                ocultarUpCargador();
                if(res.error=="1")
                {

                    showMsg("Mensaje",res.msg);
                }
                else
                {
                    res=res[0];
                    if(res.Proceso=="1")
                    {
                        showMsg("Mensaje",res.Mensaje);
                    }
                    else
                    {
                        $.confirm({
                            title: "Cierre de nómina",
                            content: "El cierre se realizó correctamente",
                            icon: 'fa fa-check nuevoingresoico',
                            type:'green',
                            typeAnimated:true,
                            columnClass: 'medium',
                            buttons: {
                                aceptar: function () {
                                    window.location.reload(1);
                                }
                            }
                        });
                    }
                }
            }).fail(function(){
                ocultarUpCargador();
                showMsg("Mensaje","Ocurrió un error al ejecutar el cierre");
            });
        },1000);
    }
}

function Abrir()
{
    if($("#clasificacion").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione clasificación");
    }
    else
    {
        if($("#periodicidad").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione periodicidad");
        }
        else
        {
            if($("#periodo").val()=="")
            {
                showMsg("Mensaje","Por favor seleccione periodo");
            }
            else
            {
                if($("#perfil").val()=="")
                {
                    showMsg("Mensaje","Por favor seleccione perfil");
                }
                else
                {
                    var item = $("#clasificacion").jqxDropDownList('getSelectedItem'); 
                    if(item.originalItem.Id_TipoNomina==2 && $("#txtNombreNominaExtra").val()=="")
                    {
                        showMsg("Mensaje", "Por favor ingrese el nombre de la nómina extraordinaria");
                    }
                    else
                    {
                        mostrarUpCargador();
                        var _json=new Object();
                        
                        var itemgrupo=$("#periodicidad").jqxDropDownList('getSelectedItem');
                        var itemperiodo=$("#periodo").jqxDropDownList('getSelectedItem');
                        //var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                        //var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);

                        //agrego paco
                        /*for (var i=0 ; i < _objperfil.length ; i++)
                        {
                            if (_objperfil[i]["Valor"] == $("#periodo").val()) {
                                _NumeroNomina = _objperfil[i]["NumeroNomina"].toString();
                            }
                        }*/
                        //agrego Xime, buscar numero de nómina directo del dropdown
                        _NumeroNomina=itemperiodo.originalItem.NumeroNomina;


                        _json.idperiodonomina=$("#periodo").val().toString();
                        _json.idtiponomina=item.originalItem.Id_TipoNomina.toString();
                        _json.numeronomina= _NumeroNomina.toString(); //data0.Numerodenomina.toString();
                        _json.descripcionnomina=item.originalItem.Id_TipoNomina==2?$("#txtNombreNominaExtra").val():""; //data0.Descripciondelanomina.toString();
                        _json.idgrupocalculo=itemgrupo.originalItem.Id_GrupoCalculo.toString();
                        _json.idperfilprocesos=$("#perfil").val().toString();
                        _json.idclasificacionnomina=$("#clasificacion").val().toString();
                        _json.idgrupoempresarial=$("#idgrupoempresarial").val().toString();
                        _json.idperfilcalendario=$("#periodicidad").val().toString();
                        _json.usuario="usuario@harwebdbo.mx";

                        var obj = new Object();
                        obj.API="BC412F5289C107006FEE961D31C66D136D9BBAAF13F3ADC63E3A1C7406C53FF3";
                        obj.Parameters="";
                        obj.JsonString=JSON.stringify(_json);
                        obj.Hash= getHSH();
                        obj.Bearer= getToken();

                
                        $.when(ajaxTokenFijo(obj)).done(function (res) {
                            console.log(res);
                            if(res.error=="0")
                            {
                                $("#offcanvasApertura").offcanvas('hide');
                                showMsg("Mensaje","Nómina aperturada correctamente");

                                    // Agrego Paco
                                    //-------------------------------------------------------------------------------------------------
                                    var _json=new Object();
                                    _json.idgrupoempresarial=$("#idgrupoempresarial").val().toString();

                                    var obj = new Object();
                                    obj.API="EAD992E071A21E700A32A814C4442F8387354A66C48123714DA053A6029ADA86";
                                    obj.Parameters="";
                                    obj.JsonString=JSON.stringify(_json);
                                    obj.Hash= getHSH();
                                    obj.Bearer= getToken();

                                    mostrarCargador();

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
                                    }).fail(function(){ 
                                        ocultarCargador();
                                    });
                                    //-------------------------------------------------------------------------------------------------
                            }
                            else
                            {
                                showMsg("Mensaje",res.msg);
                            }
                            ocultarUpCargador();
                        }).fail(function(){ 
                            ocultarUpCargador();
                            showMsg("Mensaje","Ocurrió un error al aperturar la nómina");
                        });
                    }
                }
            }
        }
    }
}