var tabActva=1;
$(document).ready(function () {
        
    $.jqx.theme = "light";

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' });

    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px',todayString: '', clearString: '' });
    
    $(".hwdbo-numero").jqxNumberInput({ symbol: '$', textAlign:'left', min: 0, disabled:true })

    Inicio();

    fillCombo(130, 'tipoconcepto', '');

    fillCombo(132, 'periodo', '');
    
});

function CargaDatosPendientes(_estatus) {
    var settings = {
        "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        "data": JSON.stringify({
            "API": "0F06021DAC62376993A8FE1E5DB757BD8FF83C86EEAF67C2DB663F8891B29F55",
            "Parameters": "?Id_TipoMovimiento=" + _estatus,
            "JsonString": "",
            "Hash": getHSH(),
            "Bearer": getToken()
        }),
    };

    $.ajax(settings).done(function (response) 
    {
        $("#DivGrid").html('<div id=\"gdEmpleados\" style=\"margin-top:1%\"></div>');
        if (response != null && response != '') {           
            armaGrid(JSON.parse(response));
        }
        else 
        {
            $("#gdEmpleados").jqxGrid({
                columns: [{text:'', type:'string'}],
                source:[],
                width: '100%',
                height: $("#divContenedorInterno").height() - 150,
                scrollmode: 'logical',
                localization: getLocalization(),
                pageable:true,
                pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
                pagesize: 50,
                ready:function(){

                },
            });

            ocultarCargador();
        }
    });

}

function armaGrid(_data) {

    let _columns = [];
    let _jsonData = [];

    let titulosGrid = Object.keys(_data[0]);    
    $.each(titulosGrid, function (index, element) {
        _columns.push({
            text: element,
            datafield: textotodatafield(element),
            type: 'string',
            width: 150,
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

    let source = {
        datatype: 'json',
        localdata: _jsonData
    };

    let dataAdapter = new $.jqx.dataAdapter(source);

    $("#gdEmpleados").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        width: '100%',
        height: $("#divContenedorInterno").height() - 150,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: true,
        autoshowfiltericon: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 50,
        sortable: true,
        showaggregates: false,
        ready:function(){},
    }).on('rowdoubleclick',function(event){
        var obj = new Object();
        obj.Id_Movimiento = event.args.row.bounddata.Id_Movimiento;
        obj.Id_TipoMovimiento = event.args.row.bounddata.Id_TipoMovimientoIP;
    });

    $("#gdEmpleados").on("filter", function (event) 
    {
        setTimeout(function() { 
            $("#gdEmpleados").jqxGrid('hidecolumn','Id_Movimiento');
            $("#gdEmpleados").jqxGrid('hidecolumn','IdMovimiento');
            $("#gdEmpleados").jqxGrid('hidecolumn','Id_TipoMovimientoIncidencias');
            $("#gdEmpleados").jqxGrid('hidecolumn','EstatusNomina');
            $("#gdEmpleados").jqxGrid('hidecolumn','Id_PerfilCalendario');
            $('#gdEmpleados').jqxGrid('autoresizecolumns');
    
            ocultarCargador();
        },1000);
    });

    setTimeout(function() { 
        $("#gdEmpleados").jqxGrid('hidecolumn','Id_Movimiento');
        $("#gdEmpleados").jqxGrid('hidecolumn','IdMovimiento');
        $("#gdEmpleados").jqxGrid('hidecolumn','Id_TipoMovimientoIncidencias');
        $("#gdEmpleados").jqxGrid('hidecolumn','EstatusNomina');
        $("#gdEmpleados").jqxGrid('hidecolumn','Id_PerfilCalendario');
        $('#gdEmpleados').jqxGrid('autoresizecolumns');

        ocultarCargador();
    },1000);
}

function rechazaMovimientos() {
    let rowindex = $("#gdEmpleados").jqxGrid('getselectedrowindexes');
    if (rowindex!=undefined && rowindex.length > 0) {
        let mensaje = rowindex.length===1 ?"¿Desea rechazar el movimiento seleccionado?":"¿Desea rechazar los movimientos seleccionados?";
        $.confirm({
            title: '¿Rechazar?',
            type:'blue',
            icon: 'fa fa-info-circle',
            typeAnimated:true,
            columnClass: 'medium',
            content: mensaje,
            buttons: {
                aceptar: function () {
                    mostrarUpCargador();
                    let _data = getIds('gdEmpleados');

                    var settings = {
                        "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin":"*"
                        },
                        "data": JSON.stringify({
                            "API": "A351048E867B9A0067F242C92C35BBAE388883D6E6D60E4D8BA020A1165B9305",
                            "Parameters": "",
                            "JsonString": JSON.stringify(_data),
                            "Hash": getHSH(),
                            "Bearer": getToken()
                        }),
                    };

                    $.ajax(settings)
                        .done(function (response) {                            
                            if (response) 
                            {
                                try
                                {
                                    let respuesta = JSON.parse(response)
                                    let resp = respuesta.filter(x => x.MsgError != '');
                                    if (resp.length > 0) 
                                    {                                        
                                        let tabla="<table class=\"table table-sm table-bordered table-striped\"><thead><th>Movimiento</th><th>Mensaje</th></thead><tbody>";
                                        let IdsMov="";
                                        $.each(resp,function(i,row){
                                            IdsMov+="<tr><td style=\"width:44%\">" + row.Id_Movimiento + "</td><td>" + row.MsgError + "</td></tr>";
                                        });
                                        tabla+=IdsMov;
                                        tabla+="</tbody></table>";
                                   
                                        $.confirm({
                                            title: "Mensaje",
                                            content: tabla,
                                            icon: 'fa fa-info-circle',
                                            type:'blue',
                                            width: '100%',
                                            typeAnimated:true,
                                            columnClass: 'medium',
                                            useBootstrap: false,
                                            buttons: {
                                                aceptar: function () {
                                                }
                                            }
                                        });
                                    } 
                                    else 
                                    {
                                        showMsgReload('Éxito','Todos los registros se rechazaron con éxito.');
                                    }
                                }
                                catch{
                                    showMsgSinTimer("Error","<pre>" + response + "</pre>");
                                }
                            } 
                            else 
                            {
                                showMsg('Algo salio mal...','Al parecer algo no salió bien al procesar la información, vuelve a intentarlo.');
                            }
                            ocultarUpCargador();
                        })
                        .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                            console.error('ERROR EN LA FUNCION -> rechazaMovimientos');
                            console.error(XMLHttpRequest);
                            console.error(textStatus);
                            console.error(errorThrown);
                            ocultarUpCargador();
                    });
                },
                cancelar: function () {
                }
            }
        });
    } else {
        showMsg('Advertencia','Favor de seleccionar uno o mas registros.');
    }
}

function autorizaMovimientos() {
    let rowindex = $("#gdEmpleados").jqxGrid('getselectedrowindexes');
    if (rowindex!=undefined && rowindex.length > 0) {
        let mensaje = rowindex.length===1 ?"¿Desea aprobar el movimiento seleccionado?":"¿Desea aprobar los movimientos seleccionados?";
        $.confirm({
            title: '¿Aprobar?',
            type:'blue',
            icon: 'fa fa-info-circle',
            typeAnimated:true,
            columnClass: 'medium',
            content: mensaje,
            buttons: {
                aceptar: function () {
                    mostrarUpCargador();
                    let _data = getIds('gdEmpleados');
                    var settings = {
                        "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin":"*"
                        },
                        "data": JSON.stringify({
                            "API": "DF57B3C5F69CDFE098D956DDD4D78C7159A3C0A4C4C0E55482FD9E012A2213D4",
                            "Parameters": "",
                            "JsonString": JSON.stringify(_data),
                            "Hash": getHSH(),
                            "Bearer": getToken()
                        }),
                    };

                    $.ajax(settings)
                        .done(function (response) {
                            //console.log(response);
                            if (response) 
                            {
                                try
                                {
                                    let respuesta = JSON.parse(response)
                                    let resp = respuesta.filter(x => x.MsgError != '');
                                    if (resp.length > 0) 
                                    {
                                        let tabla="<table class=\"table table-sm table-bordered table-striped\"><thead><th>Movimiento</th><th>Mensaje</th></thead><tbody>";
                                        let IdsMov="";
                                        $.each(resp,function(i,row){
                                            IdsMov+="<tr><td style=\"width:44%\">" + row.Id_Movimiento + "</td><td>" + row.MsgError + "</td></tr>";
                                        });
                                        tabla+=IdsMov;
                                        tabla+="</tbody></table>";
                                   
                                        $.confirm({
                                            title: "Mensaje",
                                            content: tabla,
                                            icon: 'fa fa-info-circle',
                                            type:'blue',
                                            width: '100%',
                                            typeAnimated:true,
                                            columnClass: 'medium',
                                            useBootstrap: false,
                                            buttons: {
                                                aceptar: function () {
                                                }
                                            }
                                        });
                                    } 
                                    else 
                                    {
                                        showMsgReload('Éxito','Todos los registros se aprobaron con éxito.');
                                    }
                                }
                                catch{
                                    showMsgSinTimer("Error","<pre>" + response + "</pre>");
                                }
                            } 
                            else 
                            {
                                showMsg('Algo salio mal...','Al parecer algo no salió bien al procesar la información, vuelve a intentarlo.');
                            }
                            ocultarUpCargador();
                        })
                        .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                            console.error('ERROR EN LA FUNCION -> autorizaMovimientos');
                            console.error(XMLHttpRequest);
                            console.error(textStatus);
                            console.error(errorThrown);
                            ocultarUpCargador();
                        });
                },
                cancelar: function () {
                }
            }
        });
    } else {
        showMsg('Advertencia','Favor de seleccionar uno o mas registros.');
    }
}

function Inicio()
{
    mostrarCargador();
    $("#BtnInicio").addClass('selected');
    $("#BtnHistorico").removeClass('selected');

    $("#BtnBuscar").attr('disabled','disabled');   
    $("#BtnCancelar").attr('disabled','disabled');
    $("#BtnModificar").attr('disabled','disabled');

    $("#BtnAutorizar").removeAttr('disabled');
    $("#BtnRechazar").removeAttr('disabled');
    CargaDatosPendientes(0);
}

function getIds(IdGrid, col = '') {
    var rowIndex = $("#" + IdGrid + "").jqxGrid('getselectedrowindexes');
    var Ids = [];

    //Dejar al último cambio de puesto
    $.each(rowIndex, function (index, data) {
        let datarow = $("#" + IdGrid + "").jqxGrid('getrowdata', data);
        if(datarow.Id_TipoMovimientoIP!=7)
        {
            let newarray=new Object();
            newarray.Id_Movimiento = datarow.Id_Movimiento;
            newarray.Id_TipoMovimientoIncidencias=datarow.Id_TipoMovimientoIncidencias
            Ids.push(newarray);
        }
    });

    $.each(rowIndex, function (index, data) {
        let datarow = $("#" + IdGrid + "").jqxGrid('getrowdata', data);
        if(datarow.Id_TipoMovimientoIP==7)
        {
            let newarray=new Object();
            newarray.Id_Movimiento = datarow.Id_Movimiento;
            newarray.Id_TipoMovimientoIncidencias=datarow.Id_TipoMovimientoIncidencias
            Ids.push(newarray);
        }
    });

    return Ids;
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdEmpleados").jqxGrid('getRows');
		if (rows!=undefined && rows.length > 0) {
			WriteExcel(rows, 'NominaPendientesAutorizar');
		}
		ocultarCargador();
	}, 1000);
}

function Historico()
{
    mostrarCargador();
    $("#BtnInicio").removeClass('selected');
    $("#BtnHistorico").addClass('selected');


    //$("#BtnBuscar").removeAttr('disabled');
    $("#BtnCancelar").removeAttr('disabled');
    $("#BtnModificar").removeAttr('disabled');

    $("#BtnAutorizar").attr('disabled','disabled');
    $("#BtnRechazar").attr('disabled','disabled');

    var obj = new Object();
    obj.API="57A21A0FBB5B875F7592D62063F878E2309435638A46F931642E67F8D3672794";
    obj.Parameters="?Id_TipoMovimiento=0";
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        if (response != null && response != '') {
            armaGrid(response);
        }
        else 
        {
            showMsg('Advertencia','No se encontraron registros para este movimiento.');
        }

        setTimeout(ocultarCargador,1000);
    }).fail(function(){
        ocultarCargador();
        showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
    });
}

function Cancelar()
{
    var rows = $('#gdEmpleados').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {       
        fillCombo(130, 'motivo', '');
        var data0 = $('#gdEmpleados').jqxGrid('getrowdata', rows[0]);
        let tipoMov=data0.TipodeMovimiento;
        let per = data0.Periodicidad;
        let estatus = data0.EstatusNomina;
        let continua=true;
        let puedecancelar=true;

        $.each(rows,function(i,fila){
            var data = $('#gdEmpleados').jqxGrid('getrowdata', fila);
            if(data.TipodeMovimiento!=tipoMov || data.Periodicidad!=per)
            {
                continua=false;
            }
                
            if(data.EstatusNomina==0)
            {
                puedecancelar=false;
            }
        });

        if(puedecancelar==false)
        {
            showMsgSinTimer("Mensaje","Únicamente puede cancelar movimientos de la nómina abierta");
        }
        else
        {
            $("#spanMov").text("Movimiento");
            $("#offcanvasCancelar").offcanvas('show');
            /*if(continua==true)
            {
                $("#spanMov").text(data0.TipodeMovimiento);
                $("#offcanvasCancelar").offcanvas('show');
            }
            else
            {
                showMsgSinTimer("Mensaje","Los movimientos masivos de cancelación se aplican al mismo tipo de movimiento y periodicidad");
            }*/
        }

    }   
}

function DoCancelar()
{
    if($("#motivo").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione un motivo");
    }
    else
    {
        mostrarCargador();
        let Motivo = $("#motivo").val();
        let Obs = $("#observaciones").val();
        var rows = $('#gdEmpleados').jqxGrid('getselectedrowindexes');
        var _json=new Array();
        $.each(rows,function(i,row){            
            var data = $('#gdEmpleados').jqxGrid('getrowdata', rows[i]);
            var obj = new Object();
            obj.idmovimiento = data.Id_Movimiento;
            obj.tipomovimientoincidencias=data.Id_TipoMovimientoIncidencias.toString();
            obj.idmotivocancelacion=Motivo.toString();
            obj.observacioncancelacion=Obs;
            _json.push(obj);
        });

        var ObjDatos = new Object();
        ObjDatos.API="B2A54C9F9BC079F42FC9A32A891B1E353A06488FC65AA59C3CB7B2CEFA147173";
        ObjDatos.Parameters="";
        ObjDatos.JsonString=JSON.stringify(_json);
        ObjDatos.Hash= getHSH();
        ObjDatos.Bearer= getToken();

        $.when(ajaxTokenFijo(ObjDatos)).done(function (response) 
        {
            let resp = response.filter(x => x.MsgError != '');
            if (resp.length > 0) 
            {                                        
                let tabla="<table class=\"table table-sm table-bordered table-striped\"><thead><th>Movimiento</th><th>Mensaje</th></thead><tbody>";
                let IdsMov="";
                $.each(resp,function(i,row){
                    IdsMov+="<tr><td style=\"width:44%\">" + row.idmovimiento + "</td><td>" + row.MsgError + "</td></tr>";
                });
                tabla+=IdsMov;
                tabla+="</tbody></table>";
                           
                $.confirm({
                    title: "Mensaje",
                    content: tabla,
                    icon: 'fa fa-info-circle',
                    type:'blue',
                    width: '100%',
                    typeAnimated:true,
                    columnClass: 'medium',
                    useBootstrap: false,
                    buttons: {
                        aceptar: function () {
                        }
                    }
                });
            } 
            else 
            {
                $.confirm({
                    title: "Éxito",
                    content: "Todos los registros se cancelaron con éxito.",
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
  
            setTimeout(ocultarCargador,1000);

        }).fail(function(){
            ocultarCargador();
            showMsg('Mensaje','Ocurrio un error al obtener la respuesta de cancelación');
        });
    }
}

function Modificar()
{
    var rows = $('#gdEmpleados').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
        return false;
    }
    if(rows.length>1)
    {
        showMsg("Mensaje","Únicamente puede seleccionar un registro para modificar");
        return false;
    }
    else
    {
        mostrarCargador();
        var data0 = $('#gdEmpleados').jqxGrid('getrowdata', rows[0]);
        var obj = new Object();
        obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
        obj.JsonString="";
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        if(data0.EstatusNomina==0)
        {
            showMsgSinTimer("Mensaje","Únicamente puede modificar movimientos de la nómina abierta");
            setTimeout(ocultarCargador,500);
        }        
        else if(data0.Id_TipoMovimientoIncidencias==1 || data0.TipodeMovimiento=="Incidencias")
        {
            ComboPeriodo("idperiodo_inc","111");

            obj.Parameters="?_Id=146&_Domain={d}&_Parameters='"+ data0.Id_Movimiento+"'";
        
            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.length>0)
                {
                    console.log(response[0]);
                    ComboConceptos(response[0].idtipoperiodo,"conceptoincidencia","110");

                    $("#vigini").val(response[0].vigenciainicial);

                    $("#vigfin").val(response[0].vigenciafinal);
                    $("#vigfin").jqxDateTimeInput({ disabled: true });

                    $("#dias").val(response[0].dias);

                    setTimeout(function(){
                        $("#conceptoincidencia").val(response[0].idtipoincidencia);
                        $("#idperiodo_inc").val(response[0].idperiodocalculoincidencias);
                    },1000);

                    $("#dias").on('keyup',function(event){
                        if($('#vigini').val()!="")
                        {
                            var value = $('#vigini').jqxDateTimeInput('getDate');
                            let nDias = Number($(this).val());
                            const newDate = value.setDate(value.getDate() + nDias - 1);
                            $("#vigfin").val(formatFecha(new Date(newDate)));
                        }
                    });

                    $("#idperiodo_inc").val(response[0].idperiodocalculoincidencias);

                    sessionStorage.setItem('incidencia',JSON.stringify(response[0]));

                    $("#offcanvasIncidencias").offcanvas('show');
                }       
                setTimeout(ocultarCargador,1000);
            }).fail(function(){
                ocultarCargador();
                showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
            });            
        }
        else if(data0.Id_TipoMovimientoIncidencias==6 || data0.TipodeMovimiento=="Incapacidades")
        {
            ComboPeriodo("tipoincapacidad","118");
            ComboPeriodo("tiporiesgo","119");
            ComboPeriodo("secuela","120");
            ComboPeriodo("control","121");

            obj.Parameters="?_Id=148&_Domain={d}&_Parameters='"+ data0.Id_Movimiento+"'";

            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.length>0)
                {
                    console.log(response[0]);

                    ComboConceptos(response[0].idtipoperiodo,"incapacidad","117");

                    $("#fechainiincapacidad").val(response[0].fechainicial);
                    $("#folioInc").val(response[0].folio);
                    $("#diasInc").val(response[0].dias);
                    $("#vigfinInc").val(response[0].fechafinal);
                    $("#fechacalculoInc").val(response[0].fechacalculo);
                    $("#observacionesInc").text(response[0].observaciones);
                    $("#vigfinInc").jqxDateTimeInput({disabled:true});
                            
                    setTimeout(function(){
                        $("#incapacidad").val(response[0].idconcepto);
                        $("#tipoincapacidad").val(response[0].idtipoincapacidad);
                        $("#tiporiesgo").val(response[0].idtiporiesgo);
                        $("#secuela").val(response[0].idsecuela);
                        $("#control").val(response[0].idcontrolincidencia);
                    },1000);

                    $("#diasInc").on('keyup',function(event){
                        if($('#fechainiincapacidad').val()!="")
                        {
                            var value = $('#fechainiincapacidad').jqxDateTimeInput('getDate');
                            let nDias = Number($(this).val());
                            const newDate = value.setDate(value.getDate() + nDias - 1);
                            $("#vigfinInc").val(formatFecha(new Date(newDate)));
                        }
                    });

                    $("#tipoincapacidad").on('change',function(event){
                        switch ($(this).val()) {
                            case "0":
                            case "2":
                                    $("#tiporiesgo").jqxDropDownList('clearSelection');
                                    $("#tiporiesgo").jqxDropDownList({ disabled: true });
                                    $("#secuela").jqxDropDownList('clearSelection');
                                    $("#secuela").jqxDropDownList({ disabled: true });
                                    $("#control").jqxDropDownList({ disabled: false });
                                    $("#control").jqxDropDownList('clearSelection');
                                    //obj.ids = "1,2,3,4";
                                    disableAll("control");
                                    $("#control").jqxDropDownList('enableAt', 1 );
                                    $("#control").jqxDropDownList('enableAt', 2 );
                                    $("#control").jqxDropDownList('enableAt', 3 );
                                    $("#control").jqxDropDownList('enableAt', 4 );
                                break;
                            case "1":
                                $("#tiporiesgo").jqxDropDownList({ disabled: false });
                                $("#secuela").jqxDropDownList({ disabled: false }); 
                                enableAll("control");
                                $("#control").jqxDropDownList('clearSelection');
                                $("#control").jqxDropDownList({ disabled: true });
                                break; 
                            case "3":
                                $("#tiporiesgo").jqxDropDownList('clearSelection');
                                $("#tiporiesgo").jqxDropDownList({ disabled: true });
                                $("#secuela").jqxDropDownList('clearSelection');
                                $("#secuela").jqxDropDownList({ disabled: true });
                                $("#control").jqxDropDownList('clearSelection');
                                //obj.ids = "7,8,9";        
                                disableAll("control");
                                $("#control").jqxDropDownList('enableAt', 7 );
                                $("#control").jqxDropDownList('enableAt', 8 );
                                $("#control").jqxDropDownList('enableAt', 9 );
                                    
                                break;       
                        }
                    });
                
                    $("#secuela").on('change',function(event){
                        switch ($(this).val()) {
                            case "0":
                                $("#control").jqxDropDownList({ disabled: false });
                                disableAll("control");
                                $("#control").jqxDropDownList('enableAt', 0 );
                                $("#control").jqxDropDownList('selectIndex', 0 ); 
                                break;
                            case "1":
                            case "5":
                            case "8":
                                $("#control").jqxDropDownList({ disabled: false });
                                disableAll("control");
                                $("#control").jqxDropDownList('enableAt', 1 );
                                $("#control").jqxDropDownList('enableAt', 2 );
                                $("#control").jqxDropDownList('enableAt', 3 );
                                $("#control").jqxDropDownList('enableAt', 4 );
                                break;
                            case "4":
                                $("#control").jqxDropDownList({ disabled: false });
                                disableAll("control");
                                $("#control").jqxDropDownList('enableAt', 6 );
                                $("#control").jqxDropDownList('selectIndex', 6 ); 
                                break;
                            default:
                                $("#control").jqxDropDownList({ disabled: false });
                                disableAll("control");
                                $("#control").jqxDropDownList('enableAt', 5 );
                                $("#control").jqxDropDownList('selectIndex', 5 );
                                break;
                        }
                    });

                    sessionStorage.setItem('incapacidad',JSON.stringify(response[0]));

                    $("#offcanvasIncapacidades").offcanvas('show');
                }        
                setTimeout(ocultarCargador,1000);
            }).fail(function(){
                ocultarCargador();
                showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
            });
        }
        else if(data0.Id_TipoMovimientoIncidencias==4 || data0.TipodeMovimiento=="Conceptos Especiales")
        {
            ComboPeriodo("periodoafectaunico","114");
            ComboPeriodo("periodoafectainicial","114");
            ComboPeriodo("periodoafectainicialpermanente","114");

            obj.Parameters="?_Id=149&_Domain={d}&_Parameters='"+ data0.Id_Movimiento+"'";

            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.length>0)
                {
                    console.log(response[0]);

                    ComboConceptos(response[0].idtipoperiodo,"concepto","113");
                    ComboConceptos(response[0].idtipoperiodo,"conceptorango","113");
                    ComboConceptos(response[0].idtipoperiodo,"conceptopermanente","113");

                    tabActva = response[0].Id_TipoConceptosEspeciales;

                    switch(response[0].Id_TipoConceptosEspeciales)
                    {
                        case 1: //unico periodo
                        $("#importeperiodounico").val(response[0].importe);

                        setTimeout(function(){
                        $("#concepto").val(response[0].idconcepto);                       
                        $("#periodoafectaunico").val(response[0].idperiodocalculoincidencias);
                        },1000);

                        $("#Tab1").addClass("active");
                        $("#Tab1Cont").addClass("show active");
                        $("#Tab2").removeClass("active");
                        $("#Tab2Cont").removeClass("show active");
                        $("#Tab3").removeClass("active");
                        $("#Tab3Cont").removeClass("show active");
                            break;
                        case 2: //rango periodos                        
                        $("#importerango").val(response[0].importe);
                        $("#numeroperiodos").val(response[0].numeroperiodosafectacion);

                        setTimeout(function(){
                            $("#conceptorango").val(response[0].idconcepto);
                            $("#periodoafectainicial").val(response[0].idperiodocalculoincidencias);
                        },1000);
                        
                        $("#Tab2").addClass("active");
                        $("#Tab2Cont").addClass("show active");
                        $("#Tab3").removeClass("active");
                        $("#Tab3Cont").removeClass("show active");
                        $("#Tab1").removeClass("active");
                        $("#Tab1Cont").removeClass("show active");
                            break;
                        case 3: //permanente
                        $("#importepermanente").val(response[0].importe);

                        setTimeout(function(){
                            $("#conceptopermanente").val(response[0].idconcepto);                       
                            $("#periodoafectainicialpermanente").val(response[0].idperiodocalculoincidencias);
                        },1000);

                        $("#Tab3").addClass("active");
                        $("#Tab3Cont").addClass("show active");
                        $("#Tab2").removeClass("active");
                        $("#Tab2Cont").removeClass("show active");
                        $("#Tab1").removeClass("active");
                        $("#Tab1Cont").removeClass("show active");
                            break;
                        default:
                            break;
                    }

                    sessionStorage.setItem('conceptos',JSON.stringify(response[0]));

                    $("#offcanvasConceptosEspeciales").offcanvas('show');
                }       
                setTimeout(ocultarCargador,1000);
            }).fail(function(){
                ocultarCargador();
                showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
            });
        }
        else if(data0.Id_TipoMovimientoIncidencias==2 || data0.TipodeMovimiento=="Vacaciones")
        {
            ComboPeriodo("idperiodovacaciones","123");

            obj.Parameters="?_Id=150&_Domain={d}&_Parameters='"+ data0.Id_Movimiento+"'";

            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.length>0)
                {
                    console.log(response[0]);

                    ComboConceptos(response[0].idtipoperiodo,"vacacion","122");
                    ComboPeriodoVacacional("'[{\"Id_Ocupacion\":" + response[0].idocupacion + "}]'","periodovacacional","153");

                    $("#fechaingreso").val(response[0].fechaingreso);
                    $("#fechaingreso").jqxDateTimeInput({ disabled: true });

                    setTimeout(function(){
                        $("#vacacion").val(response[0].idconcepto);
                        $("#periodovacacional").jqxDropDownList('selectItem', response[0].periodovacacional );
                        $("#periodovacacional").val(response[0].periodovacacional);
                        $("#idperiodovacaciones").val(response[0].idperiodocalculoincidencias);
                    },1000);

                    $("#fechainiciovacaciones").val(response[0].vigenciainicial);
                    $("#diasvacaciones").val(response[0].dias);
                    $("#fechafinalvacaciones").val(response[0].vigenciafinal);
                    $("#fechafinalvacaciones").jqxDateTimeInput({ disabled: true });

                    $("#diasvacaciones").on('keyup',function(event){
                        if($('#fechainiciovacaciones').val()!="")
                        {
                            mostrarCargador();
                            var value = $('#fechainiciovacaciones').jqxDateTimeInput('getDate');
                            let nDias = Number($(this).val());
                
                            var jsonConsulta="'[{\"VigenciaInicial\":\"" + formatFecha(new Date(value)) + "\",\"Id_Ocupacion\":" + response[0].idocupacion + ",\"Dias\":" + nDias + "}]'";
                
                            var obj = new Object();
                            obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
                            obj.Parameters="?_Id=152&_Domain={d}&_Parameters="+jsonConsulta;
                            obj.JsonString="";
                            obj.Hash= getHSH();
                            obj.Bearer= getToken();
                
                            $.when(ajaxTokenFijo(obj)).done(function (response) {
                                if (response.length>0) 
                                {
                                    const newDate = response[0].Fecha;
                                    setTimeout(function(){
                                    $("#fechafinalvacaciones").val(newDate);},1000);
                                }
                                else
                                {
                                    $("#fechafinalvacaciones").val('');
                                }
                                setTimeout(ocultarCargador,1500);
                            }).fail(function(){
                                showMsg('Advertencia','Ocurrió un error al obtener la fecha final');
                                $("#fechafinalvacaciones").val('');
                                ocultarCargador();
                            });
                        }
                    });
                
                    $("#fechainiciovacaciones").on('change',function(event){
                        if($("#diasvacaciones").val()!="")
                        {
                            mostrarCargador();
                            var value = $(this).jqxDateTimeInput('getDate');
                            let nDias = Number($("#diasvacaciones").val());
                
                            var jsonConsulta="'[{\"VigenciaInicial\":\"" + formatFecha(new Date(value)) + "\",\"Id_Ocupacion\":" + response[0].idocupacion + ",\"Dias\":" + nDias + "}]'";
                
                            var obj = new Object();
                            obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
                            obj.Parameters="?_Id=152&_Domain={d}&_Parameters="+jsonConsulta;
                            obj.JsonString="";
                            obj.Hash= getHSH();
                            obj.Bearer= getToken();
                
                            $.when(ajaxTokenFijo(obj)).done(function (response) {
                                if (response.length>0) 
                                {
                                    const newDate = response[0].Fecha;
                                    setTimeout(function(){
                                        $("#fechafinalvacaciones").val(newDate);},1000);
                                }
                                else
                                {
                                    $("#fechafinalvacaciones").val('');
                                }
                                setTimeout(ocultarCargador,1500);
                            }).fail(function(){
                                showMsg('Advertencia','Ocurrió un error al obtener la fecha final');
                                $("#fechafinalvacaciones").val('');
                                ocultarCargador();
                            });
                
                            //const newDate = value.setDate(value.getDate() + nDias - 1);
                            //$("#fechafinalvacaciones").val(formatFecha(new Date(newDate)));
                        }
                    });
                    
                    sessionStorage.setItem('vacaciones',JSON.stringify(response[0]));

                    $("#offcanvasVacaciones").offcanvas('show');
                }       
                setTimeout(ocultarCargador,1000);
            }).fail(function(){
                ocultarCargador();
                showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
            });
        }
        else if(data0.Id_TipoMovimientoIncidencias==3 || data0.TipodeMovimiento=="Horas Extras")
        {
            ComboPeriodo("idperiodo_he","116");

            obj.Parameters="?_Id=151&_Domain={d}&_Parameters='"+ data0.Id_Movimiento+"'";

            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.length>0)
                {
                    console.log(response[0]);

                    ComboConceptos(response[0].idtipoperiodo,"horasextra","115");

                    $("#viginihorasextra").val(response[0].vigenciainicial);
                    $("#horashorasextra").val(response[0].dias);
                    $("#btnporcentual").attr('checked','checked');

                    setTimeout(function(){
                        $("#horasextra").val(response[0].idconcepto);
                        $("#idperiodo_he").val(response[0].idperiodocalculoincidencias);
                    },1000);

                    $("#btnporcentual").on('change',function(event){
                        $("#lblRadioMinutos").text('Ejemplo: 0.50=30 min; 0.25=15 min');
                    });
                
                    $("#btnminutos").on('change',function(event){
                        $("#lblRadioMinutos").text('Ejemplo: 0.50=50 min; 0.25=25 min');
                    });
                    
                    sessionStorage.setItem('horas',JSON.stringify(response[0]));

                    $("#offcanvasHorasExtra").offcanvas('show');
                }       
                setTimeout(ocultarCargador,1000);
            }).fail(function(){
                ocultarCargador();
                showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
            });
        }
        else if(data0.Id_TipoMovimientoIncidencias==8 || data0.TipodeMovimiento=="Creditos")
        {
            ComboPeriodo("idperiodocredito","126");

            obj.Parameters="?_Id=170&_Domain={d}&_Parameters='"+ data0.Id_Movimiento+"'";

            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.length>0)
                {
                    console.log(response[0]);

                    $.when(ComboConceptos(response[0].idtipoperiodo,"conceptocredito","167")).done(function(){
                        setTimeout(function(){
                            $("#conceptocredito").val(response[0].idconcepto);
                            $("#conceptocredito").jqxDropDownList({ disabled: true });
                        },2000);
                    });


                    $("#numerocredito").val(response[0].numcredito);
                    $("#importetotalcredito").val(Number(response[0].importe).toFixed(2));
                    $("#nummeses").val(response[0].nummeses);
                    $("#numpagoscredito").val(response[0].numpagos);
                    $("#montoperiodocredito").val(response[0].monto);
                    $("#frecuenciacredito").val(response[0].frecuenciapago);
                    $("#txtCtrlNominaCredito").val(response[0].idcontrolnomina);

                    setTimeout(function(){
                        $("#conceptocredito").val(response[0].idconcepto);
                        $("#conceptocredito").jqxDropDownList({ disabled: true });
                        $("#idperiodocredito").val(response[0].idperiodocalculoincidencias);
                        $("#idperiodocredito").jqxDropDownList({ disabled: true });
                        $("#numpagoscredito").trigger('keyup');
                        $("#importetotalcredito").trigger('keyup')
                    },4000);

                    $("#numpagoscredito").on('keyup',function(event){
                        if($("#importetotalcredito").val()!="")
                        {
                            let importe=Number($("#importetotalcredito").val());
                            let montoper=importe/Number($(this).val());
                            $("#montoperiodocredito").val(montoper.toFixed(2));
                        }
                    });

                    $("#importetotalcredito").on('keyup',function(event){
                        let importe=Number($(this).val());
                        if($("#numpagoscredito").val()!="")
                        {
                            let montoper=importe/Number($("#numpagoscredito").val());
                            $("#montoperiodocredito").val(montoper.toFixed(2));
                        }
                    });

                    sessionStorage.setItem('credito',JSON.stringify(response[0]));
                   
                    //TABLA DE AMORTIZACION
                    $("#DivAmortizaCredito").html('<div id="GridAmortizaCredito"></div>');
                    
                    var _columns=[];
                    var _jsonData=[];
                    let titulosGrid = Object.keys(response[0].grid[0]);
                    $.each(titulosGrid, function (index, element) {

                        if(element=="Ano")
                        {
                            element="Año";
                        }

                        if(index==5)
                        {
                            _columns.push({
                                text: element,
                                datafield: textotodatafield(element),
                                type: 'number',
                                width: '34%',
                                cellsalign:'right',
                                align:'center',
                                cellsformat: 'c2', 
                                editable:true, 
                                aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { var total = currentValue; return aggregatedValue + total; } }]
                            });
                        }
                        else
                        {
                            _columns.push({
                                text: element,
                                datafield: textotodatafield(element),
                                type: 'string',
                                width: '33%',
                                cellsalign:'center',
                                align:'center',
                                editable:false
                            });
                        }
                    });
                
                    $.each(response[0].grid, function (index, data) {
                        let oldKeys = Object.keys(data);
                        let newjson = new Object();
                        $.each(oldKeys, function (i, d) {
                            let newProperty = textotodatafield(d);
                            newjson[newProperty] = data[d];
                        });
                
                        _jsonData.push(newjson);
                    });

                    let source = { datatype: 'json', localdata: _jsonData };

                    let dataAdapter = new $.jqx.dataAdapter(source);

                    $("#GridAmortizaCredito").jqxGrid({
                        autoshowfiltericon: true,
                        columns: _columns,
                        source: dataAdapter,
                        width: '100%',
                        height:$("#offcanvasAmortizacionCredito").height() -220,
                        columnsresize: true,
                        columnsautoresize: true,
                        scrollmode: 'logical',
                        localization: getLocalization(),
                        showfilterrow: true,
                        showstatusbar:true,
                        showaggregates:true,
                        filterable: true,
                        sortable: true, 
                        editable:true,
                        ready:function(){
                            $("#GridAmortizaCredito").jqxGrid('updatebounddata');
                            $("#GridAmortizaCredito").jqxGrid('hidecolumn','ID');
                            $("#GridAmortizaCredito").jqxGrid('hidecolumn','Id_PeriodoNomina');
                            $("#GridAmortizaCredito").jqxGrid('hidecolumn','NumeroPeriodo');
                            $("#GridAmortizaCredito").jqxGrid('hidecolumn','Cerrado');
                            $("#GridAmortizaCredito").jqxGrid('hidecolumn','Ano');
                        }                            
                    }).on('cellbeginedit',function(ev){
                        var data = ev.args.row;
                        if(data.Cerrado!=0)
                        {
                            $("#GridAmortizaCredito").jqxGrid('endcelledit', ev.args.rowindex, ev.args.datafield, true);
                            showMsg('Mensaje','No es posible editar este monto, ya que pertenece a un periodo cerrado');
                        }
                    });

                    $("#offcanvasCreditos").offcanvas('show');
                    $("#offcanvasAmortizacionCredito").offcanvas('show');

                }

                setTimeout(ocultarCargador,1000);

            }).fail(function(){
                ocultarCargador();
                showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
            });
        }
        else
        {
            return false;
        }
    }
}

function DoModificar(tipo)
{
    var data0 = $('#gdEmpleados').jqxGrid('getrowdata', rows[0]);
    console.log(data0);

    var obj=new Object();
    let api = "";

    switch(tipo)
    {
        case "1":
            obj.idtipoperiodo= "";
            obj.idperiodo= "";
            obj.numeroempleado= "";
            obj.idocupacion= "";
            obj.idtipoincidencia= "";
            obj.vigenciainicial= "";
            obj.vigenciafinal= "";
            obj.dias= "";
            obj.usuario= "";
            obj.idperiodocalculoincidencias= "";
            obj.tipomovimientoincidencias= "";
            obj.idcontrolnomina= "";
            obj.idmovimiento= "";

            api="DF9A652BA5DF565B6A3F192D92010116FCEA4D5030BABA67D60C87F98D773246";
            break;
    }

    

}

function DoIncidencias(){
    if($("#conceptoincidencia").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione un concepto");
    }
    else
    {
        if($("#vigini").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione fecha inicial kárdex");
        }
        else
        {
            if($("#dias").val()=="")
            {
                showMsg("Mensaje","Ingrese número de días ");
            }
            else if($("#dias").val()=="0")
            {
                showMsg("Mensaje","Por favor ingrese un número mayor que 0");
            }
            else if(Number($("#dias").val())<0)
            {
                showMsg("Mensaje","Por favor ingrese un número mayor que 0");
            }
            else
            {
                if($("#idperiodo_inc").val()=="")
                {
                    showMsg("Mensaje","Por favor seleccione periodo de cálculo");
                }
                else
                {
                    mostrarUpCargador();
                    var data = JSON.parse(sessionStorage.getItem('incidencia'));
                    let concepto = $("#conceptoincidencia").val().toString();
                    let vigini = formatDate($("#vigini").val());
                    let dias = $("#dias").val().toString();
                    let vigfin = formatDate($("#vigfin").val());
                    let periodo = $("#idperiodo_inc").val().toString();

                    var reg = new Object();
                    reg.idtipoperiodo=data.idtipoperiodo.toString();
                    reg.idperiodo=data.idperiodo.toString();
                    reg.numeroempleado=data.numeroempleado.toString();
                    reg.idocupacion=data.idocupacion.toString();
                    reg.idtipoincidencia=concepto;
                    reg.vigenciainicial=vigini;
                    reg.vigenciafinal=vigfin;
                    reg.dias=dias;
                    reg.usuario=data.usuario;
                    reg.idperiodocalculoincidencias=periodo;
                    reg.tipomovimientoincidencias=data.tipomovimientoincidencias.toString();
                    reg.idcontrolnomina=data.idcontrolnomina.toString();
                    reg.idmovimiento=data.idmovimiento;

                    var obj = new Object();
                    obj.API="DF9A652BA5DF565B6A3F192D92010116FCEA4D5030BABA67D60C87F98D773246";
                    obj.Parameters="";
                    obj.JsonString=JSON.stringify(reg);
                    obj.Hash= getHSH();
                    obj.Bearer= getToken();

                    $.when(ajaxTokenFijo(obj)).done(function (response) {
                        console.log(response);
                        if(response.error=="0")
                        {
                            sessionStorage.removeItem('incidencia');
                            $.confirm({
                                title: "Carga incidencias",
                                content: "Registro modificado correctamente",
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
                        else
                        {
                            showMsg("Mensaje",response.msg);
                        }
                        ocultarUpCargador();
                    }).fail(function(){
                        showMsg('Advertencia','Ocurrió un error al modificar la incapacidad');
                        ocultarUpCargador();
                    });
                }
            }
        }
    }
}

function DoIncapacidades()
{
    if($("#folioInc").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese folio");
    }
    else
    {
        if($("#incapacidad").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione un concepto de incapacidad");
        }
        else
        {
            if($("#tipoincapacidad").val()=="")
            {
                showMsg("Mensaje","Por favor seleccione tipo incapacidad");
            }
            else
            {
                if($("#tiporiesgo").jqxDropDownList('disabled')==false && $("#tiporiesgo").val()=="")
                {
                    showMsg("Mensaje","Por favor seleccione tipo de riesgo");
                }
                else
                {
                    if($("#secuela").jqxDropDownList('disabled')==false && $("#secuela").val()=="")
                    {
                        showMsg("Mensaje","Por favor seleccione secuela");
                    }
                    else
                    {
                        if($("#control").jqxDropDownList('disabled')==false && $("#control").val()=="")
                        {
                            showMsg("Mensaje","Por favor seleccione control");
                        }
                        else
                        {
                            if($("#fechainiincapacidad").val()=="")
                            {
                                showMsg("Mensaje","Por favor seleccione fecha inicio incapacidad");
                            }
                            else
                            {
                                if($("#diasInc").val()=="" || $("#diasInc").val()=="0")
                                {
                                    showMsg("Mensaje","Por favor ingrese días");
                                }
                                else
                                {
                                    if($("#fechacalculoInc").val()=="")
                                    {
                                        showMsg("Mensaje","Por favor ingrese fecha de cálculo");
                                    }
                                    else
                                    {
                                        mostrarUpCargador();
                                        var data = JSON.parse(sessionStorage.getItem('incapacidad'));
                                        var reg = new Object();

                                        let concepto = $("#incapacidad").val().toString();
                                        let folio = $("#folioInc").val();
                                        let tipoinc = $("#tipoincapacidad").val().toString();
                                        let tiporiesgo = $("#tiporiesgo").val()=="" ? "99": $("#tiporiesgo").val().toString();
                                        let secuela = $("#secuela").val()=="" ? "99": $("#secuela").val().toString();
                                        let control = $("#control").val()=="" ? "99": $("#control").val().toString();
                                        let vigini = formatDate($("#fechainiincapacidad").val());
                                        let dyas = $("#diasInc").val().toString();
                                        let vigfin = formatDate($("#vigfinInc").val());
                                        let obs= $("#observacionesInc").val();
                                        let fcalc = formatDate($("#fechacalculoInc").val());
                   
                                        reg.numempleado=data.numempleado.toString();
                                        reg.numplaza = data.numplaza.toString();
                                        reg.idocupacion=data.idocupacion.toString();
                                        reg.idtipoincidencia=concepto;
                                        reg.folio=folio;
                                        reg.idtipoincapacidad = tipoinc;
                                        reg.idtiporiesgo= tiporiesgo;
                                        reg.idsecuela = secuela;
                                        reg.idcontrolincidencia = control;
                                        reg.fechainicial = vigini;
                                        reg.dias = dyas;
                                        reg.fechafinal = vigfin;
                                        reg.observaciones = obs;
                                        reg.fechacalculo = fcalc;
                                        reg.tipomovimientoincidencias="6"; 
                                        reg.idtipoperiodo=data.idtipoperiodo.toString();
                                        reg.idperiodo=data.idperiodo.toString();
                                        reg.idcontrolnomina=data.idcontrolnomina.toString();
                                        reg.captura=data.captura;
                                        reg.autorizar="";
                                        reg.solicitudbaja="";
                                        reg.idmovimiento=data.idmovimiento;
                                                                                                                
                                        var obj = new Object();
                                        obj.API="6BBD4D95566A06E8DD27CF7F8D9C869FFA38B515DA4D5D99C0ED90E8D1A5502E";
                                        obj.Parameters="";
                                        obj.JsonString=JSON.stringify(reg);
                                        obj.Hash= getHSH();
                                        obj.Bearer= getToken();
                
                                        $.when(ajaxTokenFijo(obj)).done(function (response) {
                                            console.log(response);
                                            if(response.error=="0")
                                            {
                                                sessionStorage.removeItem('incapacidad');
                                                $.confirm({
                                                    title: "Carga incapacidades",
                                                    content: "Registro modificado correctamente",
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
                                            else
                                            {
                                                showMsg("Mensaje",response.msg);
                                            }
                                            ocultarUpCargador();
                                        }).fail(function(){
                                            showMsg('Advertencia','Ocurrió un error al ingresar la incapacidad');
                                            ocultarUpCargador();
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function DoConceptosEspeciales()
{
    let Idperiodocalculoincidencias="";
    let Idtipoconceptoespecial="";
    let Idconcepto="";
    let Importe="";
    let Numeroperiodosafectacion="";
    let cont=false;

    switch(tabActva)
    {
        case 1: //Unico periodo
            if($("#concepto").val()=="")
            {
                cont=false;
                showMsg("Mensaje","Por favor seleccione concepto");
            }
            else
            {
                if($("#importeperiodounico").val()=="")
                {
                    cont=false;
                    showMsg("Mensaje","Por favor ingrese importe");
                }
                else
                {
                    if($("#periodoafectaunico").val()=="")
                    {
                        cont=false;
                        showMsg("Mensaje","Por favor seleccione periodo afectación");
                    }
                    else
                    {
                        cont=true;
                        Idconcepto=$("#concepto").val().toString();
                        Importe=$("#importeperiodounico").val().toString();
                        Idperiodocalculoincidencias=$("#periodoafectaunico").val().toString();
                        Numeroperiodosafectacion="0";
                        Idtipoconceptoespecial="1";
                    }
                }
            }
            break;
        case 2: //Rango periodos
            if($("#conceptorango").val()=="")
            {
                cont=false;
                showMsg("Mensaje","Por favor seleccione concepto");
            }
            else
            {
                if($("#importerango").val()=="")
                {
                    cont=false;
                    showMsg("Mensaje","Por favor ingrese importe");
                }
                else
                {
                    if($("#periodoafectainicial").val()=="")
                    {
                        cont=false;
                        showMsg("Mensaje","Por favor seleccione periodo afectación inicial");
                    }
                    else
                    {
                        if($("#numeroperiodos").val()=="")
                        {
                            cont=false;
                            showMsg("Mensaje","Por favor seleccione número de periodos");
                        }
                        else
                        {
                            cont=true;
                            Idconcepto=$("#conceptorango").val().toString();
                            Importe=$("#importerango").val().toString();
                            Idperiodocalculoincidencias=$("#periodoafectainicial").val().toString();
                            Numeroperiodosafectacion=$("#numeroperiodos").val().toString();
                            Idtipoconceptoespecial="2";
                        }
                    }
                }
            }
            break;
        case 3: //Permanente
            if($("#conceptopermanente").val()=="")
            {
                cont=false;
                showMsg("Mensaje","Por favor seleccione concepto");
            }
            else
            {
                if($("#importepermanente").val()=="")
                {
                    cont=false;
                    showMsg("Mensaje","Por favor ingrese importe");
                }
                else
                {
                    if($("#periodoafectainicialpermanente").val()=="")
                    {
                        cont=false;
                        showMsg("Mensaje","Por favor seleccione periodo");
                    }
                    else
                    {
                        cont=true;
                        Idconcepto=$("#conceptopermanente").val().toString();
                        Importe=$("#importepermanente").val().toString();
                        Idperiodocalculoincidencias=$("#periodoafectainicialpermanente").val().toString();
                        Numeroperiodosafectacion="0";
                        Idtipoconceptoespecial="3";
                    }
                }
            }
            break;
    }

    if(cont==true)
    {
        mostrarUpCargador();
        var data = JSON.parse(sessionStorage.getItem('conceptos'));
        var reg = new Object();
        reg.idperiodocalculoincidencias=Idperiodocalculoincidencias;
        reg.idtipoconceptoespecial=Idtipoconceptoespecial;
        reg.idtipomovimientoincidencias="4";
        reg.numeroempleado=data.numeroempleado.toString();
        reg.idocupacion=data.idocupacion.toString();
        reg.numplaza=data.numplaza.toString();
        reg.idperiodo=data.idperiodo.toString();
        reg.idtipoperiodo=data.idtipoperiodo.toString();
        reg.idcontrolnomina=data.idcontrolnomina.toString();;
        reg.idconcepto=Idconcepto;
        reg.importe=Importe;
        reg.usuariocaptura=data.usuariocaptura;
        reg.usuarioautorizacion=data.usuarioautorizacion;
        reg.usuariosolicitudbaja="";
        reg.numeroperiodosafectacion=Numeroperiodosafectacion;
        reg.idmovimiento=data.idmovimiento;

        var obj = new Object();
        obj.API="7E8F725E6CEE5DDAECD52905B7AAD46B449B6F012F47406D4317529010F65A4F";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(reg);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (response) {
            console.log(response);
            if(response.error=="0")
            {
                sessionStorage.removeItem('conceptos');
                $.confirm({
                    title: "Carga conceptos especiales",
                    content: "Registro modificado correctamente",
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
            else
            {
                showMsg("Mensaje",response.msg);
            }
            ocultarUpCargador();
        }).fail(function(){
            showMsg('Advertencia','Ocurrió un error al ingresar el concepto especial');
            ocultarUpCargador();
        });
    }
}

function DoVacaciones()
{
    if($("#vacacion").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione un concepto de vacaciones");
    }
    else
    {
        if($("#fechainiciovacaciones").val()=="")
        {
            showMsg("Mensaje","Por favor ingrese fecha de inicio")
        }
        else
        {
            if($("#diasvacaciones").val()=="")
            {
                showMsg("Mensaje","Por favor ingrese días");
            }
            else
            {
                let itempv = $("#periodovacacional").jqxDropDownList('getSelectedItem');
                if(itempv==null)
                {
                    showMsg("Mensaje","Por favor seleccione periodo vacacional");
                }
                else
                {
                    let dias=Number(itempv.originalItem.Periodo.split('/')[1]);
                    if($("#diasvacaciones").val()>dias)
                    {
                        showMsg("Mensaje","No debe exceder los días permitidos por periodo ("+dias+")");
                    }
                    else
                    {
                        if($("#idperiodovacaciones").val()=="")
                        {
                            showMsg("Mensaje","Por favor seleccione periodo de cálculo");
                        }
                        else
                        {
                            mostrarUpCargador();
                            var data = JSON.parse(sessionStorage.getItem('vacaciones'));
        
                            let concepto = $("#vacacion").val().toString();
                            let vigini = formatDate($("#fechainiciovacaciones").val());
                            let dyas = $("#diasvacaciones").val().toString();
                            let vigfin = formatDate($("#fechafinalvacaciones").val());
                            let itempv = $("#periodovacacional").jqxDropDownList('getSelectedItem');
        
                            var reg = new Object();
                            reg.idperiodo=data.idperiodo.toString();                        
                            reg.numempleado=data.numempleado.toString();
                            reg.idocupacion=data.idocupacion.toString();
                            reg.numplaza = data.numplaza.toString();
                            reg.idconcepto=concepto;
                            reg.vigenciainicial = vigini;
                            reg.vigenciafinal = vigfin;
                            reg.dias = dyas;
                            reg.usuariocaptura=data.usuariocaptura;
                            reg.idperiodocalculoincidencias=$("#idperiodovacaciones").val().toString();
                            reg.idtipomovimientoincidencias="2";
                            reg.idtipoperiodo=data.idtipoperiodo.toString();
                            reg.idcontrolnomina=data.idcontrolnomina.toString();                      
                            reg.periodovacacional = itempv.value;
                            reg.idmovimiento=data.idmovimiento;
        
                            var obj = new Object();
                            obj.API="0EF21515996A581B5E67ABAA0712673F8C0547509358DBF7C06D9859D364939B";
                            obj.Parameters="";
                            obj.JsonString=JSON.stringify(reg);
                            obj.Hash= getHSH();
                            obj.Bearer= getToken();
        
                            $.when(ajaxTokenFijo(obj)).done(function (response) {
                                console.log(response);
                                if(response.error=="0")
                                {
                                    sessionStorage.removeItem('vacaciones');
                                    $.confirm({
                                        title: "Carga vacaciones",
                                        content: "Registro modificado correctamente",
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
                                else
                                {
                                    showMsg("Mensaje",response.msg);
                                }
                                ocultarUpCargador();
                            }).fail(function(){
                                showMsg('Advertencia','Ocurrió un error al ingresar las vacaciones');
                                ocultarUpCargador();
                            });
                        }                        
                    }
                    
                }
            }
        }
    }
}

function DoHorasExtra()
{
    if($("#horasextra").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione horas extra");
    }
    else
    {
        if($("#viginihorasextra").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione fecha kárdex");
        }
        else
        {
            if($("#horashorasextra").val()=="")
            {
                showMsg("Mensaje","Por favor ingrese las horas ");
            }
            else
            {
                if($("#idperiodo_he").val()=="")
                {
                    showMsg("Mensaje","Por favor seleccione periodo de cálculo");
                }
                else
                {
                    let horas = $("#horashorasextra").val();
                    let decimales = horas.split('.')[1];
                    if($("#btnporcentual").prop('checked')==false && Number(decimales)>59)
                    {
                        showMsgSinTimer("Mensaje","Por favor revise el valor de horas, no debe sobrepasar .59");
                    }
                    else
                    {
                        mostrarUpCargador();
                        var data = JSON.parse(sessionStorage.getItem('horas'));
                        var reg = new Object();
                        reg.idperiodo=data.idperiodo.toString();
                        reg.numempleado=data.numempleado.toString();
                        reg.idocupacion=data.idocupacion.toString();
                        reg.numplaza=data.numplaza.toString();
                        reg.idconcepto=$("#horasextra").val().toString();
                        reg.vigenciainicial=formatFecha($("#viginihorasextra").jqxDateTimeInput('getDate'));
                        reg.dias=$("#horashorasextra").val().toString();
                        reg.usuariocaptura=data.usuariocaptura;
                        reg.idperiodocalculoincidencias=$("#idperiodo_he").val().toString();
                        reg.idtipomovimientoincidencias="3";
                        reg.idtipoperiodo=data.idtipoperiodo.toString();
                        reg.idcontrolnomina=data.idcontrolnomina.toString();;                        
                        reg.tratamientodecimales=$("#btnporcentual").prop('checked')==true?"1":"2";
                        reg.idmovimiento=data.idmovimiento;

                        var obj = new Object();
                        obj.API="114014F166C60500431C5F82377BFBC19A6D433EA33E3C1A1E902B7D846DA011";
                        obj.Parameters="";
                        obj.JsonString=JSON.stringify(reg);
                        obj.Hash= getHSH();
                        obj.Bearer= getToken();

                        $.when(ajaxTokenFijo(obj)).done(function (response) {
                            console.log(response);
                            if(response.error=="0")
                            {
                                sessionStorage.removeItem('horas')
                                $.confirm({
                                    title: "Carga horas extras",
                                    content: "Registro modificado correctamente",
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
                            else
                            {
                                showMsg("Mensaje",response.msg);
                            }
                            ocultarUpCargador();
                        }).fail(function(){
                            showMsg('Advertencia','Ocurrió un error al ingresar las horas extras');
                            ocultarUpCargador();
                        });
                    }
                }
            }
        }
    }
}

function DoAmortizacionCredito()
{
    let importe=Number($("#importetotalcredito").val());
    var rows = $('#GridAmortizaCredito').jqxGrid('getrows');
    let total=0.00;
    let jsonGrid=[];

    var data = JSON.parse(sessionStorage.getItem('credito'));

    $.each(rows,function(i,row){
        total = total+row.Importe;
        jsonGrid.push({
            "idmovimiento":data.idmovimiento, 
            "idperiodonomina":row.Id_PeriodoNomina.toString(),
            "importe":Number(row.Importe).toFixed(2).toString()
        });
    });

    if(importe.toFixed(2)==total.toFixed(2))
    {
        mostrarUpCargador();

        var obj = new Object();
        obj.API="A11E43240B32ED53E41834025E94C0FD04394F80B298DD4783A13286F2F81973";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(jsonGrid);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (response) {
            sessionStorage.removeItem('credito')
            if(response.error=="0")
            {
                $("#offcanvasCreditos").offcanvas('hide');
                $("#offcanvasAmortizacionCredito").offcanvas('hide');
                $.confirm({
                    title: "Créditos",
                    content: "Modificación registrada correctamente",
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
            else
            {
                showMsg("Mensaje",response.msg);
            }
            ocultarUpCargador();
        }).fail(function(){
            showMsg('Advertencia','Ocurrió un error al guardar la tabla de amortización de créditos');
            ocultarUpCargador();
        });

    }
    else
    {
        showMsgSinTimer("Mensaje" ,"Por favor revise los importes ingresados, la cantidad debe sumar $" + importe.toFixed(2))
    }
}

function Buscar()
{
    $("#offcanvasBusqueda").offcanvas('show');
}

function ComboConceptos(tipoperiodo,divCombo,id)
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id="+id+"&_Domain={d}&_Parameters="+tipoperiodo;
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        var dataAdapter = new $.jqx.dataAdapter(response);
        $("#" + divCombo).jqxDropDownList('clear');
        if(divCombo=='periodovacacional')
        {
            $("#" + divCombo).jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Descripcion",
                placeHolder:"--Seleccione--"                
            });
        }
        else
        {
            $("#" + divCombo).jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });
        }

    }).fail(function(){
        showMsg('Advertencia','No se encontraron registros.');
    });
}

function ComboPeriodo(divCombo,id)
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id="+id+"&_Domain={d}";
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        var dataAdapter = new $.jqx.dataAdapter(response);
        $("#" + divCombo).jqxDropDownList('clear');
        $("#" + divCombo).jqxDropDownList({
            source: dataAdapter,
            displayMember: "Descripcion",
            valueMember: "Valor",
            placeHolder:"--Seleccione--"                
        });
        ocultarCargador();
    }).fail(function(){
        showMsg('Advertencia','No se encontraron registros.');
        ocultarCargador();
    });
}

function ComboPeriodoVacacional(tipoperiodo,divCombo,id)
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id="+id+"&_Domain={d}&_Parameters="+tipoperiodo;
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        var dataAdapter = new $.jqx.dataAdapter(response);
        $("#" + divCombo).jqxDropDownList('clear');
        $("#" + divCombo).jqxDropDownList({
            source: dataAdapter,
            displayMember: "Periodo",
            valueMember: "PeriodoVacacional",
            placeHolder:"--Seleccione--"                
        });
    }).fail(function(){
        $("#" + divCombo).jqxDropDownList('clear');
        showMsg('Advertencia','No se encontraron registros (combo periodo vacacional).');
    });
}

function disableAll(combo)
{
    var items = $("#" + combo).jqxDropDownList('getItems'); 
    $.each(items,function(i,row){
        $("#" + combo).jqxDropDownList('disableAt', row.index );
    }); 
}

function enableAll(combo)
{
    var items = $("#" + combo).jqxDropDownList('getItems'); 
    $.each(items,function(i,row){
        $("#" + combo).jqxDropDownList('enableAt', row.index );
    }); 
}

function RegistraTab(numTab)
{
    tabActva=numTab;
    $("#Tab" + numTab).addClass("active");
    $("#Tab" + numTab + "Cont").addClass("show active");

    if(numTab == 1)
    {
        $("#Tab2").removeClass("active");
        $("#Tab2Cont").removeClass("show active");
        $("#Tab3").removeClass("active");
        $("#Tab3Cont").removeClass("show active");
    }
    if(numTab == 2)
    {
        $("#Tab1").removeClass("active");
        $("#Tab1Cont").removeClass("show active");
        $("#Tab3").removeClass("active");
        $("#Tab3Cont").removeClass("show active");
    }
    if(numTab == 3)
    {
        $("#Tab1").removeClass("active");
        $("#Tab1Cont").removeClass("show active");
        $("#Tab2").removeClass("active");
        $("#Tab2Cont").removeClass("show active");
    }
}

function ObtenerPagos(elem)
{
    mostrarUpCargador();
    let numero = Number($(elem).val());
    let ctrl = $("#txtCtrlNominaCredito").val();
    let params="&_Parameters=" + ctrl + "," + numero + "";
    
    setTimeout(function(){
        $.when(ajaxCatalogo(168,params)).done(function (response) {
            if(response != "No existe el catálogo. ")
            { 
                if(response.length >0)
                {
                    $("#numpagoscredito").val(response[0].Periodos);
                    $("#numpagoscredito").trigger('keyup');
                }           
            }
            else
            {
                showMsg('Mensaje',response);
            }

            ocultarUpCargador();
        });
    },1);
}

function Refresca()
{
    mostrarCargador();
    Inicio();
}