var tabActva=1;
$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";
    
    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 

    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px',todayString: '', clearString: '' });

    $(".hwdbo-numero").jqxNumberInput({ symbol: '$', textAlign:'left', min: 0 })

    //$("#nummeses").jqxNumberInput({ textAlign:'left', min: 0, inputMode: 'simple', decimalDigits: 0 }).on('change',function(event){console.log(event);});

    $("#dias").on('keyup',function(event){
        if($('#vigini').val()!="")
        {
            var value = $('#vigini').jqxDateTimeInput('getDate');
            let nDias = Number($(this).val());
            const newDate = value.setDate(value.getDate() + nDias - 1);
            $("#vigfin").val(formatFecha(new Date(newDate)));
        }
    });

    $("#vigini").on('change',function(event){
        if($("#dias").val()!="")
        {
            var value = $(this).jqxDateTimeInput('getDate');
            let nDias = Number($("#dias").val());
            const newDate = value.setDate(value.getDate() + nDias - 1);
            $("#vigfin").val(formatFecha(new Date(newDate)));
        }
    });

    $("#diasInc").on('keyup',function(event){
        if($('#fechainiincapacidad').val()!="")
        {
            var value = $('#fechainiincapacidad').jqxDateTimeInput('getDate');
            let nDias = Number($(this).val());
            const newDate = value.setDate(value.getDate() + nDias - 1);
            $("#vigfinInc").val(formatFecha(new Date(newDate)));
        }
    });

    $("#fechainiincapacidad").on('change',function(event){
        if($("#diasInc").val()!="")
        {
            var value = $(this).jqxDateTimeInput('getDate');
            let nDias = Number($("#diasInc").val());
            const newDate = value.setDate(value.getDate() + nDias - 1);
            $("#vigfinInc").val(formatFecha(new Date(newDate)));
        }
    });

    /*
    $("#diasvacaciones").on('keyup',function(event){
        if($('#fechainiciovacaciones').val()!="")
        {
            mostrarCargador();
            var value = $('#fechainiciovacaciones').jqxDateTimeInput('getDate');
            let nDias = Number($(this).val());
            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
            var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);

            var jsonConsulta="'[{\"VigenciaInicial\":\"" + formatFecha(new Date(value)) + "\",\"Id_Ocupacion\":" + data0.ID.toString() + ",\"Dias\":" + nDias + "}]'";

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
    */

    $("#diasvacaciones").on('keyup',function(event){
        if($('#fechainiciovacaciones').val()!="")
        {
            var value = $('#fechainiciovacaciones').jqxDateTimeInput('getDate');
            let nDias = Number($(this).val());
            const newDate = value.setDate(value.getDate() + nDias - 1);
            $("#fechafinalvacaciones").val(formatFecha(new Date(newDate)));
        }
    });

    /*
    $("#fechainiciovacaciones").on('change',function(event){
        if($("#diasvacaciones").val()!="")
        {
            mostrarCargador();
            var value = $(this).jqxDateTimeInput('getDate');
            let nDias = Number($("#diasvacaciones").val());
            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
            var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);

            var jsonConsulta="'[{\"VigenciaInicial\":\"" + formatFecha(new Date(value)) + "\",\"Id_Ocupacion\":" + data0.ID.toString() + ",\"Dias\":" + nDias + "}]'";

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
    */

    $("#fechainiciovacaciones").on('change',function(event){
        if($("#diasvacaciones").val()!="")
        {
            var value = $(this).jqxDateTimeInput('getDate');
            let nDias = Number($("#diasInc").val());
            const newDate = value.setDate(value.getDate() + nDias - 1);
            $("#fechafinalvacaciones").val(formatFecha(new Date(newDate)));
        }
    });

    $("#btnporcentual").on('change',function(event){
        $("#lblRadioMinutos").text('Ejemplo: 0.50=30 min; 0.25=15 min');
    });

    $("#btnminutos").on('change',function(event){
        $("#lblRadioMinutos").text('Ejemplo: 0.50=50 min; 0.25=25 min');
    });

    $("#btnnuevoaviso").on('change',function(event){
        $("#rowfechasuspension").hide();
        $("#fechafinsuspension").val('');
    });

    $("#btnhastafecha").on('change',function(event){
        $("#rowfechasuspension").show();        
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

    $("#numpagos").on('keyup',function(event){
        $("#offcanvasAmortizacion").offcanvas('hide');
        let importe=Number($("#importetotal").val());
        let montoper=importe/Number($(this).val());
        $("#montoperiodo").val(montoper.toFixed(2));
        $("#montoperiodocredito").jqxNumberInput({ disabled: true });
    });

    $("#numpagoscredito").on('keyup',function(event){
        $("#offcanvasAmortizacionCredito").offcanvas('hide');
        if($("#importetotalcredito").val()!="")
        {
            let importe=Number($("#importetotalcredito").val());
            let montoper=importe/Number($(this).val());
            $("#montoperiodocredito").val(montoper.toFixed(2));
            $("#montoperiodocredito").jqxNumberInput({ disabled:true })
        }
    });

    $("#importetotal").on('keyup',function(event){
        let importe=Number($(this).val());
        $("#offcanvasAmortizacion").offcanvas('hide');
        if($("#numpagos").val()!="")
        {
            let montoper=importe/Number($("#numpagos").val());
            $("#montoperiodo").val(montoper.toFixed(2));
        }
    });

    $("#importetotalcredito").on('keyup',function(event){
        let importe=Number($(this).val());
        $("#offcanvasAmortizacionCredito").offcanvas('hide');
        if($("#numpagoscredito").val()!="")
        {
            let montoper=importe/Number($("#numpagoscredito").val());
            $("#montoperiodocredito").val(montoper.toFixed(2));
            $("#montoperiodocredito").jqxNumberInput({ disabled: true });
        }
    });

    $("#frecuencia").on('keyup',function(event){
        $("#offcanvasAmortizacion").offcanvas('hide');
    });

    GetGrid();

});

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

async function ComboConceptos(tipoperiodo,divCombo,id)
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id="+id+"&_Domain={d}&_Parameters="+tipoperiodo;
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        var dataAdapter = new $.jqx.dataAdapter(response);

        $("#" + divCombo).jqxDropDownList({
            source: dataAdapter,
            displayMember: "Descripcion",
            valueMember: "Valor",
            placeHolder:"--Seleccione--"                
        });
    }).fail(function(){
        showMsg('Advertencia','No se encontraron registros.');
    });
}

async function ComboPeriodo(divCombo,id)
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id="+id+"&_Domain={d}";
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        var dataAdapter = new $.jqx.dataAdapter(response);

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

async function ComboPeriodoVacacional(tipoperiodo,divCombo,id)
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id="+id+"&_Domain={d}&_Parameters="+tipoperiodo;
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        var dataAdapter = new $.jqx.dataAdapter(response);

        $("#" + divCombo).jqxDropDownList({
            source: dataAdapter,
            displayMember: "Periodo",
            valueMember: "PeriodoVacacional",
            placeHolder:"--Seleccione--"                
        });
    }).fail(function(){
        showMsg('Advertencia','No se encontraron registros.');
    });
}

function GetGrid() 
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id=109&_Domain={d}";
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

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
        showMsg('Advertencia','No se encontraron registros.');
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

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        showstatusbar: false,
        width: '100%',
        height:$("#divContenedorInterno").height()-150,
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
        ready:function(){
            $("#gdPlantilla").jqxGrid('updatebounddata');
            $("#gdPlantilla").jqxGrid('hidecolumn','UID');
            $("#gdPlantilla").jqxGrid('hidecolumn','NoAnt');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RegistroPatronal');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RazonSocial');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_TipoPeriodo');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_ControlNomina');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_PeriodoNomina');
            $("#gdPlantilla").jqxGrid('hidecolumn','NumPlaza');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_PerfilCalendario');
            $("#gdPlantilla").jqxGrid('autoresizecolumns');
        }

    });

    $('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});

    ocultarCargador();
}

async function Incidencias(){
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let tp =data0.Id_TipoPeriodo;
        let ini = data0.FechaInicioPeriodo;
        let continua=true;
        $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            if(tp!=data.Id_TipoPeriodo)
                continua=false;
        });
        if(continua==true)
        {
            let fini = formatDate(ini);
            let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);
            const c = await ComboConceptos(tp,"conceptoincidencia","110");
            const k = await ComboPeriodo("idperiodo_inc","111");
            $("#vigini").val(dfini);
            //$("#vigini").jqxDateTimeInput({ max: dfini });
            $("#vigfin").val('');
            $("#dias").val('');
            $("#vigfin").jqxDateTimeInput({disabled:true});
            $("#offcanvasIncidencias").offcanvas('show');
        }
        else
        {
            showMsgSinTimer("Mensaje","Los movimientos masivos para incidencias se aplican a empleados de un mismo periodo de pago");
        }
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
                    var _json = new Array();
                    let concepto = $("#conceptoincidencia").val().toString();
                    let vigini = formatDate($("#vigini").val());
                    let dias = $("#dias").val().toString();
                    let vigfin = formatDate($("#vigfin").val());
                    let periodo = $("#idperiodo_inc").val().toString();

                    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                    $.each(rows,function(i,row){
                        var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                        var reg = new Object();
                        reg.idtipoperiodo=data.Id_TipoPeriodo.toString();
                        reg.idperiodo=data.Id_PeriodoNomina.toString();
                        reg.numeroempleado=data.NoEmpleado.toString();
                        reg.idocupacion=data.ID.toString();
                        reg.idtipoincidencia=concepto;
                        reg.vigenciainicial=vigini;
                        reg.vigenciafinal=vigfin;
                        reg.dias=dias;
                        reg.usuario="usuario@harwebdbo.mx/Captura";
                        reg.idperiodocalculoincidencias=periodo;
                        reg.tipomovimientoincidencias="1";
                        reg.idcontrolnomina=data.Id_ControlNomina.toString();

                        _json.push(reg);
                    });

                    var obj = new Object();
                    obj.API="CBB201B6D9E4BC5F882FE1587772225D08E5D6ECFA070C8A6B592BFF3533281E";
                    obj.Parameters="";
                    obj.JsonString=JSON.stringify(_json);
                    obj.Hash= getHSH();
                    obj.Bearer= getToken();

                    $.when(ajaxTokenFijo(obj)).done(function (response) {
                        console.log(response);
                        if(response.error=="0")
                        {
                            $.confirm({
                                title: "Carga incidencias",
                                content: "Registro(s) insertado(s) correctamente",
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
                        showMsg('Advertencia','Ocurrió un error al ingresar la(s) incapacidad(es)');
                        ocultarUpCargador();
                    });
                }
            }
        }
    }
}

async function ConceptosEspeciales()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);

        let continua=true;

        $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });
        if(continua==true)
        {
            mostrarCargador();
            const c = await ComboConceptos(tp,"concepto","113");
            const c2 = await ComboConceptos(tp,"conceptorango","113");
            const c3 = await ComboConceptos(tp,"conceptopermanente","113");
            const k = await ComboPeriodo("periodoafectaunico","114");
            const k2 = await ComboPeriodo("periodoafectainicial","114");
            const k3 = await ComboPeriodo("periodoafectainicialpermanente","114");

            $("#importeperiodounico").val('');
            $("#importerango").val('');
            $("#numeroperiodos").val('');
            $("#importepermanente").val('');
            ocultarCargador();
            $("#offcanvasConceptosEspeciales").offcanvas('show');

        }
        else
        {
            showMsgSinTimer("Mensaje","Los movimientos masivos para carga de conceptos especiales se aplican a empleados de un mismo periodo y fecha de inicio de pago");
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
        var _json = new Array();
        var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
        $.each(rows,function(i,row){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
            var reg = new Object();
            reg.idperiodocalculoincidencias=Idperiodocalculoincidencias;
            reg.idtipoconceptoespecial=Idtipoconceptoespecial;
            reg.idtipomovimientoincidencias="4";
            reg.numeroempleado=data.NoEmpleado.toString();
            reg.idocupacion=data.ID.toString();
            reg.numplaza=data.NumPlaza.toString();
            reg.idperiodo=data.Id_PeriodoNomina.toString();
            reg.idtipoperiodo=data.Id_TipoPeriodo.toString();
            reg.idcontrolnomina=data.Id_ControlNomina.toString();;
            reg.idconcepto=Idconcepto;
            reg.importe=Importe;
            reg.usuariocaptura="usuario@harwebdbo.mx/Captura";
            reg.usuarioautorizacion="";
            reg.usuariosolicitudbaja="";
            reg.numeroperiodosafectacion=Numeroperiodosafectacion;

            _json.push(reg);
        });

        var obj = new Object();
        obj.API="48A6A0AE2417B6A9E62CFCB4EB5505946BBAC46EF6EEB60B219578C4DD46649A";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(_json);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (response) {
            console.log(response);
            if(response.error=="0")
            {
                $.confirm({
                    title: "Carga conceptos especiales",
                    content: "Registro(s) insertado(s) correctamente",
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
            showMsg('Advertencia','Ocurrió un error al ingresar los conceptos especiales');
            ocultarUpCargador();
        });
    }
}

async function HorasExtra()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);        
        let continua=true;

       $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });

        if(continua==true)
        {
            mostrarCargador();
            const c = await ComboConceptos(tp,"horasextra","115");
            const k = await ComboPeriodo("idperiodo_he","116");
            $("#viginihorasextra").val('');
            $("#horashorasextra").val('');
            $("#btnporcentual").attr('checked','checked');
            ocultarCargador();
            $("#offcanvasHorasExtra").offcanvas('show');
        }
        else
        {
            $("#offcanvasHorasExtra").offcanvas('hide');
            showMsgSinTimer("Mensaje","Los movimientos masivos para horas extra se aplican a empleados de un mismo periodo y fecha de inicio de pago");
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
                        var _json = new Array();
                        var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                        $.each(rows,function(i,row){
                            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                            var reg = new Object();
                            reg.idperiodo=data.Id_PeriodoNomina.toString();
                            reg.numempleado=data.NoEmpleado.toString();
                            reg.idocupacion=data.ID.toString();
                            reg.numplaza=data.NumPlaza.toString();
                            reg.idconcepto=$("#horasextra").val().toString();
                            reg.vigenciainicial=formatFecha($("#viginihorasextra").jqxDateTimeInput('getDate'));
                            reg.dias=$("#horashorasextra").val().toString();
                            reg.usuariocaptura="usuario@harwebdbo.mx/Captura";
                            reg.idperiodocalculoincidencias=$("#idperiodo_he").val().toString();
                            reg.idtipomovimientoincidencias="3";
                            reg.idtipoperiodo=data.Id_TipoPeriodo.toString();
                            reg.idcontrolnomina=data.Id_ControlNomina.toString();;                        
                            reg.tratamientodecimales=$("#btnporcentual").prop('checked')==true?"1":"2";                       
                
                            _json.push(reg);
                        });

                        var obj = new Object();
                        obj.API="09F181FEECB0218E98F88FEAFC9EFB9D96BF6485BF5703E2AC03FCC47BC6C73B";
                        obj.Parameters="";
                        obj.JsonString=JSON.stringify(_json);
                        obj.Hash= getHSH();
                        obj.Bearer= getToken();

                        $.when(ajaxTokenFijo(obj)).done(function (response) {
                            console.log(response);
                            if(response.error=="0")
                            {
                                $.confirm({
                                    title: "Carga horas extras",
                                    content: "Registro(s) insertado(s) correctamente",
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
                            showMsg('Advertencia','Ocurrió un error al ingresar las horas extra');
                            ocultarUpCargador();
                        });
                    }
                }
            }
        }
    }
}

async function Vacaciones()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else if(rows.length>1)
    {
        showMsg("Mensaje","únicamente puede seleccionar un registro para este movimiento");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        console.log(data0);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);        
        let continua=true;

       $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });

        if(continua==true)
        {
            mostrarCargador();
            const c= await ComboConceptos(tp,"vacacion","122");
            const p= await ComboConceptos(1,"periodovacacional","124");
            const t = await ComboPeriodo("idperiodovacaciones","123");

            $("#fechaingreso").val(data0.FechadeIngreso);
            $("#fechaingreso").jqxDateTimeInput({disabled:true});
            $("#fechainiciovacaciones").val('');
            $("#diasvacaciones").val('');
            $("#fechafinalvacaciones").val('');
            $("#fechafinalvacaciones").jqxDateTimeInput({disabled:true});

            ocultarCargador();
            $("#offcanvasVacaciones").offcanvas('show');
        }
        else
        {
            $("#offcanvasVacaciones").offcanvas('hide');
            showMsgSinTimer("Mensaje","Los movimientos masivos para vacaciones se aplican a empleados de un mismo periodo y fecha de inicio de pago");
        }
    }
}

/*
async function Vacaciones()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else if(rows.length>1)
    {
        showMsg("Mensaje","únicamente puede seleccionar un registro para este movimiento");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        console.log(data0);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        let idocupacion=data0.ID;
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);        
        let continua=true;

       $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });

        if(continua==true)
        {
            mostrarCargador();
            const c= await ComboConceptos(tp,"vacacion","122");
            const p= await ComboPeriodoVacacional("'[{\"Id_Ocupacion\":" + idocupacion + "}]'","periodovacacional","153");
            const t = await ComboPeriodo("idperiodovacaciones","123");

            $("#fechaingreso").val(data0.FechadeIngreso);
            $("#fechaingreso").jqxDateTimeInput({disabled:true});
            $("#fechainiciovacaciones").val('');
            $("#diasvacaciones").val('');
            $("#fechafinalvacaciones").val('');
            $("#fechafinalvacaciones").jqxDateTimeInput({disabled:true});

            ocultarCargador();
            $("#offcanvasVacaciones").offcanvas('show');
        }
        else
        {
            $("#offcanvasVacaciones").offcanvas('hide');
            showMsgSinTimer("Mensaje","Los movimientos masivos para vacaciones se aplican a empleados de un mismo periodo y fecha de inicio de pago");
        }
    }
}
*/

/*
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
                    let dias=itempv.originalItem.Total;
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
                            let concepto = $("#vacacion").val().toString();
                            let vigini = formatDate($("#fechainiciovacaciones").val());
                            let dyas = $("#diasvacaciones").val().toString();
                            let vigfin = formatDate($("#fechafinalvacaciones").val());
                            let itempv = $("#periodovacacional").jqxDropDownList('getSelectedItem');
        
                            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
                            var reg = new Object();
                            reg.idperiodo=data.Id_PeriodoNomina.toString();                        
                            reg.numempleado=data.NoEmpleado.toString();
                            reg.idocupacion=data.ID.toString();
                            reg.numplaza = data.NumPlaza.toString();
                            reg.idconcepto=concepto;
                            reg.vigenciainicial = vigini;
                            reg.vigenciafinal = vigfin;
                            reg.dias = dyas;
                            reg.usuariocaptura="usuario@harwebdbo.mx";
                            reg.idperiodocalculoincidencias=$("#idperiodovacaciones").val().toString();
                            reg.idtipomovimientoincidencias="2";
                            reg.idtipoperiodo=data.Id_TipoPeriodo.toString();
                            reg.idcontrolnomina=data.Id_ControlNomina.toString();                      
                            reg.periodovacacional = itempv.value;
        
                            var obj = new Object();
                            obj.API="CFA171DC93347943E6D9D0C3CCB6C49D12F61B22DA095A1D1F0AAAD31C40AB83";
                            obj.Parameters="";
                            obj.JsonString=JSON.stringify(reg);
                            obj.Hash= getHSH();
                            obj.Bearer= getToken();
        
                            $.when(ajaxTokenFijo(obj)).done(function (response) {
                                console.log(response);
                                if(response.error=="0")
                                {
                                    $.confirm({
                                        title: "Carga vacaciones",
                                        content: "Registro insertado correctamente",
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
*/

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
                if($("#idperiodovacaciones").val()=="")
                {
                    showMsg("Mensaje","Por favor seleccione periodo de cálculo");
                }
                else
                {
                    mostrarUpCargador();
                    //var _json = new Array();
                    let concepto = $("#vacacion").val().toString();
                    let vigini = formatDate($("#fechainiciovacaciones").val());
                    let dyas = $("#diasvacaciones").val().toString();
                    let vigfin = formatDate($("#fechafinalvacaciones").val());
                    let itempv = $("#periodovacacional").jqxDropDownList('getSelectedItem');

                    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                    var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
                    var reg = new Object();
                    reg.idperiodo=data.Id_PeriodoNomina.toString();                        
                    reg.numempleado=data.NoEmpleado.toString();
                    reg.idocupacion=data.ID.toString();
                    reg.numplaza = data.NumPlaza.toString();
                    reg.idconcepto=concepto;
                    reg.vigenciainicial = vigini;
                    reg.vigenciafinal = vigfin;
                    reg.dias = dyas;
                    reg.usuariocaptura="usuario@harwebdbo.mx";
                    reg.idperiodocalculoincidencias=$("#idperiodovacaciones").val().toString();
                    reg.idtipomovimientoincidencias="2";
                    reg.idtipoperiodo=data.Id_TipoPeriodo.toString();
                    reg.idcontrolnomina=data.Id_ControlNomina.toString();                      
                    reg.periodovacacional = itempv.label;

                    //console.log(_json);

                    var obj = new Object();
                    obj.API="CFA171DC93347943E6D9D0C3CCB6C49D12F61B22DA095A1D1F0AAAD31C40AB83";
                    obj.Parameters="";
                    obj.JsonString=JSON.stringify(reg);
                    obj.Hash= getHSH();
                    obj.Bearer= getToken();

                    $.when(ajaxTokenFijo(obj)).done(function (response) {
                        console.log(response);
                        if(response.error=="0")
                        {
                            $.confirm({
                                title: "Carga vacaciones",
                                content: "Registro insertado correctamente",
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


async function Incapacidades()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else if(rows.length>1)
    {
        showMsg("Mensaje","únicamente puede seleccionar un registro para este movimiento");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);        
        let continua=true;

       $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });

        if(continua==true)
        {
            mostrarCargador();
            const c= await ComboConceptos(tp,"incapacidad","117");
            const k = await ComboPeriodo("tipoincapacidad","118");
            const t = await ComboPeriodo("tiporiesgo","119");
            const s = await ComboPeriodo("secuela","120");
            const ct = await ComboPeriodo("control","121");
            $("#fechainiincapacidad").val('');
            $("#folioInc").val('');
            $("#diasInc").val('');
            $("#vigfinInc").val('');
            $("#fechacalculoInc").val('');
            $("#observacionesInc").text('');
            $("#vigfinInc").jqxDateTimeInput({disabled:true});

            $("#offcanvasIncapacidades").offcanvas('show');
        }
        else
        {
            $("#offcanvasIncapacidades").offcanvas('hide');
            showMsgSinTimer("Mensaje","Los movimientos masivos para vacaciones se aplican a empleados de un mismo periodo y fecha de inicio de pago");
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
                                        var _json = new Array();
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
                   
                                        var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                                        $.each(rows,function(i,row){
                                            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                                            var reg = new Object();
                                            reg.numempleado=data.NoEmpleado.toString();
                                            reg.numplaza = data.NumPlaza.toString();
                                            reg.idocupacion=data.ID.toString();
                                            reg.idconcepto=concepto;
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
                                            reg.idtipomovimientoincidencias="6";                                            
                                            reg.idtipoperiodo=data.Id_TipoPeriodo.toString();
                                            reg.idperiodo=data.Id_PeriodoNomina.toString();
                                            reg.idcontrolnomina=data.Id_ControlNomina.toString();
                                            reg.captura="usuario@harwebdbo.mx/Captura";
                                            reg.autorizar="";
                                            reg.solicitudbaja="";
                                                           
                                            _json.push(reg);
                                        });

                                        //console.log(_json);

                                        var obj = new Object();
                                        obj.API="C3FC3FB0F5663C8E94C34A598D98DBEEB421721CF463E5BDD8F42183FB8FDFDA";
                                        obj.Parameters="";
                                        obj.JsonString=JSON.stringify(_json);
                                        obj.Hash= getHSH();
                                        obj.Bearer= getToken();
                
                                        $.when(ajaxTokenFijo(obj)).done(function (response) {
                                            console.log(response);
                                            if(response.error=="0")
                                            {
                                                $.confirm({
                                                    title: "Carga incapacidades",
                                                    content: "Registro(s) insertado(s) correctamente",
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
                                            showMsg('Advertencia','Ocurrió un error al ingresar las incapacidades');
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

async function Programacion()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);        
        let continua=true;

       $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });

        if(continua==true)
        {
            mostrarCargador();
            const c= await ComboConceptos(tp,"concepto_p","125");
            const ct = await ComboPeriodo("idperiodo_p","126");
            $("#importetotal").val('');
            $("#numpagos").val('');
            $("#montoperiodo").val('');
            $("#frecuencia").val('');

            ocultarCargador();
            $("#offcanvasProgramacion").offcanvas('show');
        }
        else
        {
            $("#offcanvasProgramacion").offcanvas('hide');
            showMsgSinTimer("Mensaje","Los movimientos masivos para programacion de conceptos se aplican a empleados de un mismo periodo y fecha de inicio de pago");
        }
    }
}

async function Creditos()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        $("#txtCtrlNominaCredito").val(data0.Id_ControlNomina);
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);        
        let continua=true;

       $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });

        if(continua==true)
        {
            mostrarCargador();
            const c= await ComboConceptos(tp,"conceptocredito","167");
            const ct = await ComboPeriodo("idperiodocredito","126");
            $("#importetotalcredito").val('');
            $("#nummeses").val('');
            $("#numpagoscredito").val('');
            $("#montoperiodocredito").val('');
            $("#frecuenciacredito").val('');
            $("#idperiodocredito").jqxDropDownList('clearSelection');

            ocultarCargador();
            /*clippy.load('Clippy', function(agent){
                // do anything with the loaded agent
                agent.moveTo(900,300); 
                console.log(agent.animations());
                agent.show();
                agent.play('Greeting');
    
                setTimeout(function (){
                    agent.speak('Hola Emmanuel!, ¿ Ya terminaste de cargar las nóminas de historia de MPG?');
                }, 5000);
    
                setTimeout(function (){
                    agent.play('CheckingSomething');
                }, 10000);
    
                setTimeout(function (){
                    agent.speak('Por lo que veo, aun no para variar.');
                }, 15000);
    
                setTimeout(function (){
                    agent.play('IdleHeadScratch');
                }, 25000);
    
                setTimeout(function (){
                    agent.speak(' Creo que tendre que hablar con el Sr. Rivera.');
                }, 29000);
    
                setTimeout(function (){
                    agent.play('Searching');
                }, 35000);
    
                setTimeout(function (){
                    agent.speak(' Creo que nos acompaña y ya se enteró como te haces .....');
                }, 42000);
    
                setTimeout(function (){
                    agent.speak('Mejor me escondo antes de que me regañen.');
                }, 50000);
    
                setTimeout(function (){
                    agent.play('Save');
                }, 57000);
    
                setTimeout(function (){
                    agent.speak('Mejor ya ponte a chingarle porque es para mañana.');
                    agent.gestureAt(200,200);
                }, 62000);
    
                setTimeout(function (){
                    agent.speak('Mientras sigues haciendo tus chingaderas...');
                    agent.play('IdleEyeBrowRaise');
                }, 67000);
    
                setTimeout(function (){
                    agent.speak('Mejor recibe el módulo de creditos y descansen los que si trabajan.');
                }, 72000);
    
                setTimeout(function (){
                    agent.play('GestureRight');
                }, 77000);
    
                
    
            });*/
            
            $("#offcanvasCreditos").offcanvas('show');

            /*$("#offcanvasCreditos").offcanvas('show').on('hidden.bs.offcanvas',function(ev){
                var clip =$(".clippy");
                clip.remove();
            });*/
        }
        else
        {
            $("#offcanvasCreditos").offcanvas('hide');
            showMsgSinTimer("Mensaje","Los movimientos masivos para créditos se aplican a empleados de un mismo periodo y fecha de inicio de pago");
        }
    }
}

async function Suspension()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);        
        let continua=true;

        $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });

        if(continua==true)
        {
            mostrarCargador();
            fillCombo(172,"motivosuspension","");
            const ct = await ComboPeriodo("periodocalculosuspension","126");

            $("#fechafinsuspension").val('');
            $("#motivosuspension").jqxDropDownList('clearSelection');
            $("#periodocalculosuspension").jqxDropDownList('clearSelection');
            $("#observacionessuspension").val('');
            $("#btnnuevoaviso").attr('checked','checked');
            $("#btnnuevoaviso").trigger('change');

            ocultarCargador();
        
            $("#offcanvasSuspension").offcanvas('show');

        }
        else
        {
            $("#offcanvasSuspension").offcanvas('hide');
            showMsgSinTimer("Mensaje","Los movimientos masivos para suspensión se aplican a empleados de un mismo periodo y fecha de inicio de pago");
        }
    }
}

function DoSuspension()
{
    if($("#motivosuspension").val()=="")
    {
        showMsg('Mensaje','Por favor seleccione un motivo de suspensión');
    }
    else
    {
        if($("#periodocalculosuspension").val()=="")
        {
            showMsg('Mensaje','Por favor seleccione periodo de cálculo');
        }
        else
        {
            if($("#btnnuevoaviso").prop('checked')==false && $("#fechafinsuspension").val()=="")
            {
                showMsg('Mensaje','Por favor ingrese fecha final de suspensión');
            }
            else
            {
                mostrarUpCargador();
                var _json = new Array();
                var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                $.each(rows,function(i,row){
                    var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                    var reg = new Object();
                    reg.idmotivo=$("#motivosuspension").val().toString();
                    reg.idperiodocalculoincidencias=$("#periodocalculosuspension").val().toString();
                    reg.observaciones=$("#observacionessuspension").val();
                    reg.vigenciainicial=formatDate(data.FechaInicioPeriodo);
                    reg.vigenciapago=$("#btnnuevoaviso").prop('checked')==false?formatFecha($("#fechafinsuspension").jqxDateTimeInput('getDate')):"";
                    reg.idocupacion=data.ID.toString();
                    reg.idcontrolnomina=data.Id_ControlNomina.toString(); 
                    reg.idperiodo=data.Id_PeriodoNomina.toString();
                    reg.idtipomovimientoincidencias="9";
                    reg.idperfilcalendario=data.Id_PerfilCalendario.toString();
                    reg.numempleado=data.NoEmpleado.toString();                   
                    reg.numplaza=data.NumPlaza.toString();
                    reg.usuariocaptura="usuario@harwebdbo.mx";                                       
                    reg.idtipoperiodo=data.Id_TipoPeriodo.toString();
                              
                    _json.push(reg);
                });

                var obj = new Object();
                obj.API="B7836A63C2C86B91169702D5E11F47A75F473E58870A5FEC6F3D29888F1B7D2E";
                obj.Parameters="";
                obj.JsonString=JSON.stringify(_json);
                obj.Hash= getHSH();
                obj.Bearer= getToken();

                $.when(ajaxTokenFijo(obj)).done(function (response) {
                    console.log(response);
                    if(response.error=="0")
                    {
                        $.confirm({
                            title: "Suspensión",
                            content: "Registro(s) insertado(s) correctamente",
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
                    showMsg('Advertencia','Ocurrió un error al ingresar la suspensión');
                    ocultarUpCargador();
                });
            }
        }
    }
}

async function Reanudacion()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let tp =data0.Id_TipoPeriodo;
        let finiper=data0.FechaInicioPeriodo;
        let fini = formatDate(finiper);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);        
        let continua=true;

        $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            let ffd=data.FechaInicioPeriodo;
            let ffi = formatDate(ffd);
            let dff=new Date(ffi.split('-')[0],Number(ffi.split('-')[1])-1,ffi.split('-')[2]);

            if(tp!=data.Id_TipoPeriodo)
            {
                continua=false;
            }
            else if(dfini.toDateString()!=dff.toDateString())
            {
                continua=false;
            }
        });

        if(continua==true)
        {
            mostrarCargador();
            fillCombo(173,"motivoreanuda","");
            const ct = await ComboPeriodo("periodocalculoreanuda","126");

            $("#motivoreanuda").jqxDropDownList('clearSelection');
            $("#periodocalculoreanuda").jqxDropDownList('clearSelection');
            $("#observacionesreanuda").val('');

            ocultarCargador();
        
            $("#offcanvasReanudacion").offcanvas('show');

        }
        else
        {
            $("#offcanvasReanudacion").offcanvas('hide');
            showMsgSinTimer("Mensaje","Los movimientos masivos para reanudación se aplican a empleados de un mismo periodo y fecha de inicio de pago");
        }
    }
}

function DoReanudacion()
{
    if($("#motivoreanuda").val()=="")
    {
        showMsg('Mensaje','Por favor seleccione un motivo de reanudación');
    }
    else
    {
        if($("#periodocalculoreanuda").val()=="")
        {
            showMsg('Mensaje','Por favor seleccione periodo de cálculo');
        }
        else
        {
            mostrarUpCargador();
            var _json = new Array();
            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
            $.each(rows,function(i,row){
                var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                var reg = new Object();
                reg.idmotivo=$("#motivoreanuda").val().toString();
                reg.idperiodocalculoincidencias=$("#periodocalculoreanuda").val().toString();
                reg.observaciones=$("#observacionesreanuda").val();
                reg.vigenciainicial=formatDate(data.FechaInicioPeriodo);
                reg.vigenciapago="";
                reg.idocupacion=data.ID.toString();
                reg.idcontrolnomina=data.Id_ControlNomina.toString(); 
                reg.idperiodo=data.Id_PeriodoNomina.toString();
                reg.idtipomovimientoincidencias="10";
                reg.idperfilcalendario=data.Id_PerfilCalendario.toString();
                reg.numempleado=data.NoEmpleado.toString();                   
                reg.numplaza=data.NumPlaza.toString();
                reg.usuariocaptura="usuario@harwebdbo.mx";                                       
                reg.idtipoperiodo=data.Id_TipoPeriodo.toString();
                          
                _json.push(reg);
            });

            var obj = new Object();
            obj.API="466A9277F6B360F886007305485721B1C3758D44D35F9A2AECAB9D0764A5402B";
            obj.Parameters="";
            obj.JsonString=JSON.stringify(_json);
            obj.Hash= getHSH();
            obj.Bearer= getToken();

            $.when(ajaxTokenFijo(obj)).done(function (response) {
                console.log(response);
                if(response.error=="0")
                {
                    $.confirm({
                        title: "Reanudación",
                        content: "Registro(s) insertado(s) correctamente",
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
                showMsg('Advertencia','Ocurrió un error al ingresar la reanudación');
                ocultarUpCargador();
            });
        }
    }
}

function DoCalcular()
{
    if($("#concepto_p").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione un concepto");
    }
    else
    {
        if($("#importetotal").val()=="" || $("#importetotal").val()=="0" )
        {
            showMsg("Mensaje","Por favor ingrese número de pagos");
        }
        else
        {
            if($("#montoperiodo").val()=="" || $("#montoperiodo").val()=="0")
            {
                showMsg("Mensaje","Por favor ingrese un monto por periodo");
            }
            else
            {
                if($("#frecuencia").val()=="" || $("#frecuencia").val()=="0")
                {
                    showMsg("Mensaje","Por favor ingrese frecuencia");
                }
                else
                {
                    if($("#idperiodo_p").val()=="")
                    {
                        showMsg("Mensaje","Por favor seleccione un periodo de cálculo");
                    }
                    else
                    {
                        mostrarUpCargador();
                        var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                        var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);

                        var obj = new Object();
                        obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
                        obj.Parameters="?_Id=127&_Domain={d}&_Parameters="+data.Id_PeriodoNomina+","+data.Id_TipoPeriodo+","+$("#numpagos").val()+","+$("#importetotal").val()+","+$("#frecuencia").val()+","+$("#idperiodo_p").val();
                        obj.JsonString="";
                        obj.Hash= getHSH();
                        obj.Bearer= getToken();

                        $.when(ajaxTokenFijo(obj)).done(function (response) 
                        {
                            $("#DivAmortiza").html('<div id="GridAmortiza"></div>');
                    
                            if(response==null || response=="" ||response.length==0)
                            {
                                let cols=[];
                                cols.push({text: 'Pago',datafield: 'Pago',type: 'string',width: '50%',cellsalign:'center',align:'center', editable:false});
                                cols.push({text: 'Periodo',datafield: 'Periodo',type: 'string',width: '50%',cellsalign:'center',align:'center', editable:false});
                                cols.push({text: 'Importe',datafield: 'Importe',type: 'number',width: '50%',cellsalign:'right',align:'center', cellsformat: 'c2', editable:true, aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { var total = currentValue; return aggregatedValue + total; } }] });

                                $("#GridAmortiza").jqxGrid({
                                    autoshowfiltericon: true,
                                    columns: cols,
                                    source: [],
                                    width: '100%',
                                    height:$("#offcanvasAmortizacion").height() -220,
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
                                        $("#GridAmortiza").jqxGrid('updatebounddata');
                                    }                            
                                });
                            }
                            else
                            {
                                var _columns=[];
                                var _jsonData=[];
                                let titulosGrid = Object.keys(response[0]);
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
                            
                                $.each(response, function (index, data) {
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

                                $("#GridAmortiza").jqxGrid({
                                    autoshowfiltericon: true,
                                    columns: _columns,
                                    source: dataAdapter,
                                    width: '100%',
                                    height:$("#offcanvasAmortizacion").height() -220,
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
                                        $("#GridAmortiza").jqxGrid('updatebounddata');
                                        $("#GridAmortiza").jqxGrid('hidecolumn','ID');
                                        $("#GridAmortiza").jqxGrid('hidecolumn','Id_PeriodoNomina');
                                        $("#GridAmortiza").jqxGrid('hidecolumn','NumeroPeriodo');
                                        $("#GridAmortiza").jqxGrid('hidecolumn','Ano');
                                    }                            
                                });
                            }

                            ocultarUpCargador();

                        }).fail(function(){
                            showMsg('Advertencia','Ocurrió un error al obtener la tabla de amortización');
                            $("#DivAmortiza").html('<div id="GridAmortiza"></div>');
                            ocultarUpCargador();
                        });

                        $("#offcanvasAmortizacion").offcanvas('show');
                    }
                }
            }
        }
    }
}

function DoCalcularCredito()
{
    if($("#numerocredito").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese número de crédito");
    }
    else
    {
        if($("#conceptocredito").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione un concepto");
        }
        else 
        {
            if($("#importetotalcredito").val()=="" || $("#importetotalcredito").val()=="0" )
            {
                showMsg("Mensaje","Por favor ingrese importe total");
            }
            else
            {
                if($("#nummeses").val()=="")
                {
                    showMsg("Mensaje","Por favor ingrese número de meses");
                }
                else
                {
                    if($("#frecuenciacredito").val()=="" || $("#frecuenciacredito").val()=="0")
                    {
                        showMsg("Mensaje","Por favor ingrese frecuencia");
                    }
                    else
                    {
                        if($("#idperiodocredito").val()=="")
                        {
                            showMsg("Mensaje","Por favor seleccione un periodo de cálculo");
                        }
                        else
                        {
                            mostrarUpCargador();
                            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
    
                            var obj = new Object();
                            obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
                            obj.Parameters="?_Id=169&_Domain={d}&_Parameters="+data.Id_PeriodoNomina+","+data.Id_TipoPeriodo+","+$("#numpagoscredito").val()+","+$("#importetotalcredito").val()+","+$("#frecuenciacredito").val()+","+$("#idperiodocredito").val()+","+data.Id_PerfilCalendario;
                            obj.JsonString="";
                            obj.Hash= getHSH();
                            obj.Bearer= getToken();
    
                            $.when(ajaxTokenFijo(obj)).done(function (response) 
                            {
                                $("#DivAmortizaCredito").html('<div id="GridAmortizaCredito"></div>');
                        
                                if(response==null || response=="" ||response.length==0)
                                {
                                    let cols=[];
                                    cols.push({text: 'Pago',datafield: 'Pago',type: 'string',width: '50%',cellsalign:'center',align:'center', editable:false});
                                    cols.push({text: 'Periodo',datafield: 'Periodo',type: 'string',width: '50%',cellsalign:'center',align:'center', editable:false});
                                    cols.push({text: 'Importe',datafield: 'Importe',type: 'number',width: '50%',cellsalign:'right',align:'center', cellsformat: 'c2', editable:true, aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { var total = currentValue; return aggregatedValue + total; } }] });
    
                                    $("#GridAmortizaCredito").jqxGrid({
                                        autoshowfiltericon: true,
                                        columns: cols,
                                        source: [],
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
                                        }                            
                                    });
                                }
                                else
                                {
                                    var _columns=[];
                                    var _jsonData=[];
                                    let titulosGrid = Object.keys(response[0]);
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
                                
                                    $.each(response, function (index, data) {
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
                                            $("#GridAmortizaCredito").jqxGrid('hidecolumn','Ano');
                                        }                            
                                    });
                                }
    
                                ocultarUpCargador();
    
                            }).fail(function(){
                                showMsg('Advertencia','Ocurrió un error al obtener la tabla de amortización');
                                $("#DivAmortizaCredito").html('<div id="GridAmortizaCredito"></div>');
                                ocultarUpCargador();
                            });
    
                            $("#offcanvasAmortizacionCredito").offcanvas('show');
                        }
                    }
                }
            }
        }
    } 
}

function DoAmortizacion()
{
    let importe=Number($("#importetotal").val());
    var rows = $('#GridAmortiza').jqxGrid('getrows');
    let total=0.00;
    let jsonGrid=[];
    $.each(rows,function(i,row){
        total = total+row.Importe;
        jsonGrid.push({
            "ID":row.ID.toString(), 
            "IdPeriodoNomina":row.Id_PeriodoNomina.toString(),
            "NumeroPeriodo":row.NumeroPeriodo.toString(),
            "Ano":row.Ano.toString(),
            "Importe":row.Importe.toString()
        });
    });
   
    if(importe.toFixed(2)==total.toFixed(2))
    {
        mostrarUpCargador();
        var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
        let registros=[];
        $.each(rows,function(i,row){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
            registros.push({
                "idperiodo":data.Id_PeriodoNomina.toString(),
                "numempleado" : data.NoEmpleado.toString(),
                "numplaza" : data.NumPlaza.toString(),
                "idocupacion" : data.ID.toString(),
                "idconcepto" : $("#concepto_p").val().toString(),
                "importe" : $("#importetotal").val().toString(),
                "numpagos" : $("#numpagos").val().toString(),
                "frecuenciapago" : $("#frecuencia").val().toString(),
                "usuariocaptura" : "usuario@harwebdbo.mx",
                "usuarioautoriza" : "",
                "idperiodocalculoincidencias" : $("#idperiodo_p").val().toString(),
                "idtipomovimientoincidencias" : "5",
                "idtipoperiodo" : data.Id_TipoPeriodo.toString(),
                "idcontrolnomina" : data.Id_ControlNomina.toString(),
                "jsongrid": jsonGrid
            });
        });

        var obj = new Object();
        obj.API="EE1CF83A2AA8791548B8C6A14AD5CBC65A0A2CA13D975B6B528204E9EB40D79D";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(registros);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (response) {
            console.log(response);
            if(response.error=="0")
            {
                $("#offcanvasProgramacion").offcanvas('hide');
                $("#offcanvasAmortizacion").offcanvas('hide');
                $.confirm({
                    title: "Carga programación conceptos",
                    content: "Registro(s) insertado(s) correctamente",
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
            showMsg('Advertencia','Ocurrió un error al ingresar las incapacidades');
            ocultarUpCargador();
        });

    }
    else
    {
        showMsgSinTimer("Mensaje" ,"Por favor revise los importes ingresados, la cantidad debe sumar $" + importe.toFixed(2))
    }
}

function RegistraTab(numTab)
{
    tabActva=numTab;
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'Movimientos nómina');
		}
		ocultarCargador();
	}, 1000);
}

async function ObtenerPagos(event)
{
   // mostrarUpCargador();
    var charCode = (event.which) ? event.which : event.keyCode
    let numero = Number($("#nummeses").val());
    let ctrl = $("#txtCtrlNominaCredito").val();
    let params="&_Parameters=" + ctrl + "," + numero + "";

    console.log(charCode);
    if(charCode==13)
    {
        mostrarUpCargador();
        console.log(params);
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
    }
    else
    {
        mostrarUpCargador();
        console.log(params);
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
    }
    


}

function DoAmortizacionCredito()
{
    let importe=Number($("#importetotalcredito").val());
    var rows = $('#GridAmortizaCredito').jqxGrid('getrows');
    let total=0.00;
    let jsonGrid=[];
    $.each(rows,function(i,row){
        total = total+row.Importe;
        jsonGrid.push({
            "ID":row.ID.toString(), 
            "IdPeriodoNomina":row.Id_PeriodoNomina.toString(),
            "NumeroPeriodo":row.NumeroPeriodo.toString(),
            "Ano":row.Ano.toString(),
            "Importe":row.Importe.toString()
        });
    });

    if(importe.toFixed(2)==total.toFixed(2))
    {
        mostrarUpCargador();
        var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
        let registros=[];
        $.each(rows,function(i,row){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
            registros.push({
                "idperiodo":data.Id_PeriodoNomina.toString(),
                "numempleado" : data.NoEmpleado.toString(),
                "numplaza" : data.NumPlaza.toString(),
                "idocupacion" : data.ID.toString(),
                "idconcepto" : $("#conceptocredito").val().toString(),
                "importe" : $("#importetotalcredito").val().toString(),
                "numpagos" : $("#numpagoscredito").val().toString(),
                "frecuenciapago" : $("#frecuenciacredito").val().toString(),
                "usuariocaptura" : "usuario@harwebdbo.mx",
                "usuarioautoriza" : "",
                "idperiodocalculoincidencias" : $("#idperiodocredito").val().toString(),
                "idtipomovimientoincidencias" : "8",
                "idtipoperiodo" : data.Id_TipoPeriodo.toString(),
                "idcontrolnomina" : data.Id_ControlNomina.toString(),
                "jsongrid": jsonGrid,
                "numcredito":$("#numerocredito").val().toString(),
                "nummeses":$("#nummeses").val().toString()
            });
        });

        var obj = new Object();
        obj.API="91501F6A8610A4BAF2A3875D852EED8B2900EB480FBAB16A7EC21890856B9375";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(registros);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (response) {
            console.log(response);
            if(response.error=="0")
            {
                $("#offcanvasCreditos").offcanvas('hide');
                $("#offcanvasAmortizacionCredito").offcanvas('hide');
                $.confirm({
                    title: "Créditos",
                    content: "Registro(s) insertado(s) correctamente",
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