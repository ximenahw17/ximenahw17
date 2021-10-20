var cambioSueldo=false;
var cambioEsquema=false;
var cambioPuesto=false;
var origen="";
var tabActva=1;
var monitos=new Array();
var monitosError=new Array();

$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 

    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px',todayString: '', clearString: '' });

    $("#swesquema").on('change',function(event){
        if($(this).prop('checked'))
        {
            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
            var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
            let rp =data0.RegistroPatronal;
            let continua=true;
            $.each(rows,function(i,fila){
                var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
                if(rp!=data.RegistroPatronal)
                    continua=false;
            });
            if(continua==false)
            {
                showMsgSinTimer("Mensaje","Los movimientos masivos de cambio de esquema se aplican a empleados de una misma razon social");
                $(this).prop('checked',false);
            }
        }
    });

    $("#offcanvasCambioPuesto").on('hide.bs.offcanvas',function(event){
        origen="";
    });

    $("#offcanvasCambioEsquema").on('hide.bs.offcanvas',function(event){
        origen="";
    });

    $("#offcanvasCambioSueldo").on('hide.bs.offcanvas',function(event){
        origen="";
    });

    $("#swcambiopuestocambiosueldo").show();

    $("#switchpuestoesquema").show();

    Combos();

    $("#iddivision").on('change',function(event){
        $("#iddepto").jqxDropDownList('clear');
        fillCombo(47, 'iddepto', "&_Parameters='" + $(this).val() + "'");
        $("#idpuesto").jqxDropDownList('clear');
    });

    $('#iddepto').on('change', function (event){
        $("#idpuesto").jqxDropDownList('clear');
        fillCombo(48, 'idpuesto', "&_Parameters='" + $(this).val() + "'");
    });

    $("#swcambiopuestonuevosueldo").on('change',function(event){
        if($(this).prop('checked'))
        {
            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
            var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
            let cal = data0.CalendarioNomina;
            let per = data0.PeriodicidaddePago; 
            let continua=true;
            $.each(rows,function(i,fila){
                var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
                if(cal!=data.CalendarioNomina || per!=data.PeriodicidaddePago)
                    continua=false;
            });
            if(continua==false)
            {
                showMsgSinTimer("Mensaje","Los movimientos masivos de cambio de puesto se aplican a empleados de misma periodicidad y mismo perfil calendario nómina pago");
                $(this).prop('checked',false);
            }
        }
    });

    $("#swcambiopuestoesquema").on('change',function(event){
        if($(this).prop('checked'))
        {
            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
            var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
            let cal = data0.CalendarioNomina;
            let per = data0.PeriodicidaddePago; 
            let continua=true;
            $.each(rows,function(i,fila){
                var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
                if(cal!=data.CalendarioNomina || per!=data.PeriodicidaddePago)
                    continua=false;
            });
            if(continua==false)
            {
                showMsgSinTimer("Mensaje","Los movimientos masivos de cambio de puesto se aplican a empleados de misma periodicidad y mismo perfil calendario nómina pago");
                $(this).prop('checked',false);
            }
        }
    });

    $("#swesquemanuevosueldo").on('change',function(event){
        if($(this).prop('checked'))
        {
            var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
            var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
            let rp =data0.RegistroPatronal;
            let continua=true;
            $.each(rows,function(i,fila){
                var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
                if(rp!=data.RegistroPatronal)
                    continua=false;
            });
            if(continua==false)
            {
                showMsgSinTimer("Mensaje","Los movimientos masivos de cambio de esquema se aplican a empleados de una misma razon social");
                $(this).prop('checked',false);
            }
        }
    });

    GetGrid();

});

function GetGrid() 
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id=96&_Domain={d}";
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

function GetGridHistoria()
{
    changeLocation("GestionPersonalTemporalHistoria.html");
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
        height: $("#divContenedorInterno").height() - 150,
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
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RelOcupacionContratoTemporal');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RegistroPatronal');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RazonSocial');
            $("#gdPlantilla").jqxGrid('hidecolumn','UID');
            $("#gdPlantilla").jqxGrid('hidecolumn','NumPlaza');
            $("#gdPlantilla").jqxGrid('hidecolumn','ApellidoPaterno');
            $("#gdPlantilla").jqxGrid('hidecolumn','ApellidoMaterno');
            $("#gdPlantilla").jqxGrid('hidecolumn','Nombre');
            //$("#gdPlantilla").jqxGrid('hidecolumn','NoAnt');
            $("#gdPlantilla").jqxGrid('hidecolumn','FechaInicioPeriodo');
            $("#gdPlantilla").jqxGrid('autoresizecolumns');
        }
    });

    $('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});

    ocultarCargador();
}

function Combos()
{
    fillCombo(8, 'iddivision', '');
    fillCombo(33, 'nombramiento', '');
}

function CambioPuesto()
{
    RevisaBanderas();
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let cal = data0.CalendarioNomina;
        let per = data0.PeriodicidaddePago;
        let ini = data0.FechaInicioPeriodo; 
        let continua=true;
        $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            if(cal!=data.CalendarioNomina || per!=data.PeriodicidaddePago)
                continua=false;
        });
        if(continua==true)
        {
            $("#iddivision").jqxDropDownList('clearSelection');
            $("#iddepto").jqxDropDownList('clear');
            $("#idpuesto").jqxDropDownList('clear');
            let fini = formatDate(ini);
            let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);
            $("#vigini").jqxDateTimeInput({ max: dfini });
            $("#vigini").val(fini);
            if(cambioSueldo==false)
            {
                $("#swsueldo").prop('checked',false);
            }
            if(cambioEsquema==false)
            {
                $("#swesquema").prop('checked',false);
            }
            origen=origen==""?"offcanvasCambioPuesto":origen;
            $("#offcanvasCambioPuesto").offcanvas('show');
        }
        else
        {
            showMsgSinTimer("Mensaje","Los movimientos masivos de cambio de puesto se aplican a empleados de misma periodicidad y mismo perfil calendario nómina pago");
        }
    }
}

function CambioEsquema()
{
    RevisaBanderas();
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        let rp =data0.RegistroPatronal;
        let idrp=data0.Id_RegistroPatronal;
        let idrs=data0.Id_RazonSocial;
        let rs = data0.RazonSocial;
        let esquema = data0.EsquemadePago;
        let ini = data0.FechaInicioPeriodo;
        let continua=true;
        $.each(rows,function(i,fila){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', fila);
            if(rs!=data.RazonSocial)
                continua=false;
        });

        if(continua==true)
        {
            $("#nombramiento").jqxDropDownList('clearSelection');
            const sindicato = fillCombo(19, 'idsindicato', '&_Parameters=' + idrs);
            setTimeout(function() {
                let combo=$("#idsindicato").jqxDropDownList('getItems');
                let indice=-1;
                $.each(combo,function(i,row){
                    if(row.label==esquema)
                    {
                        indice=i;
                        return false;
                    }
                });

                if(indice!=-1)
                {
                    $("#idsindicato").jqxDropDownList('selectIndex', indice );
                }
            },1000);

            if(cambioPuesto==false)
            {
                $("#swsueldopuesto").prop('checked',false);
            }
            if(cambioEsquema==false)
            {
                $("#swesquemanuevosueldo").prop('checked',false);
            }
            let fini = formatDate(ini);
            let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);
            $("#viginisindicato").jqxDateTimeInput({ max: dfini });
            $("#viginisindicato").val(fini);
            origen=origen==""?"offcanvasCambioEsquema":origen;
            $("#offcanvasCambioEsquema").offcanvas('show');
        }
        else
        {
            showMsgSinTimer("Mensaje","Los movimientos masivos de cambio de esquema se aplican a empleados de una misma razon social");
        }
    }
}

function CambioSueldo()
{
    RevisaBanderas();
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        $("#sueldomensual").val('');
        $("#salariodiario").val('');
        $("#swsbc").prop('checked',false);
        $("#porcentaje").val('');
        $("#importefijomensual").val('');
        $("#importefijodiario").val('');

        let ini = data0.FechaInicioPeriodo; 
        let fini = formatDate(ini);
        let dfini=new Date(fini.split('-')[0],Number(fini.split('-')[1])-1,fini.split('-')[2]);
        $("#vigininuevosueldo").jqxDateTimeInput({ max: dfini });
        $("#vigininuevosueldo").val(fini);
        if(CambioPuesto==false)
        {
            $("#swcambiopuestonuevosueldo").prop('checked',false);
        }        
        if(CambioEsquema==false)
        {
            $("#swesquemanuevosueldo").prop('checked',false);
        }
        
        origen=origen==""?"offcanvasCambioSueldo":origen;
        $("#offcanvasCambioSueldo").offcanvas('show');
    }

}

function DoCambioPuesto()
{
    if($("#iddivision").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione división");
    }
    else
    {
        if($("#iddepto").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione departamento");
        }
        else
        {
            if($("#idpuesto").val()=="")
            {
                showMsg("Mensaje","Por favor seleccione puesto");
            }
            else
            {
                if($("#vigini").val()=="")
                {
                    showMsg("Mensaje","Por favor ingrese una vigencia inicial");
                }
                else
                {
                    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                    mostrarUpCargador();
                    monitos=[];
                    monitosError=[];
                    $.each(rows,function(i,row){
                        var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                        ObtenerEmpleado(data.CURP,data.ID);
                    });

                    setTimeout(function(){                        
                        if(monitosError.length != 0)
                        {
                            let emps="";
                            $.each(monitosError,function(i,monito){
                                emps+=monitosError[i]+"<br />";
                            });
                            ocultarUpCargador();
                            $.confirm({
                                title: "Mensaje",
                                content: "No se encontraron los datos de los siguientes "+monitosError.length+" empleados: <br />"+emps+" <br /> ¿Desea continuar? solo se procesarán " + monitos.length + " de " + rows.length + " empleados seleccionados",
                                icon: 'fa fa-info-circle consultamovsico',
                                type:'blue',
                                typeAnimated:true,
                                columnClass: 'medium',
                                buttons: {
                                    aceptar: function () {
                                        emps=""
                                        monitos=new Array();
                                        monitosError=new Array();
                                    },
                                    cancelar:function(){
                                        emps=""
                                        monitos=new Array();
                                        monitosError=new Array();
                                    }
                                }
                            });
                        }
                        else
                        {
                            const div=$("#iddivision").val();
                            const depto = $("#iddepto").val();
                            const pue = $("#idpuesto").val();
                            const fechaini =formatDate($("#vigini").val());
                            var value = $('#vigini').jqxDateTimeInput('getDate');
                            const newDate = value.setDate(value.getDate() - 1);

                            $.each(monitos,function(i,row){
                                monitos[i].division=div;
                                monitos[i].departamento=depto;
                                monitos[i].puesto=pue;
                                monitos[i].fechaingreso=fechaini;
                                monitos[i].fechabaja=formatFecha(new Date(newDate));
                                monitos[i].tipomovimiento=7;
                            });

                            var settings = {
                                "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                                "method": "POST",
                                "timeout": 0,
                                "headers": {
                                    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                                    "Content-Type": "application/json",
                                },
                                "data": JSON.stringify({
                                    "API": "F2B11ED85FF1CB773B6D9D07EC759D7D8D6445C1D64CE4834FDBB41F6CAD6DB1",
                                    "Parameters": "",
                                    "JsonString": JSON.stringify(monitos),
                                    "Hash": getHSH(),
                                    "Bearer": getToken()
                                }),
                            };

                            //let response=[{"Id_MPv3":"FE58B43E-D244-4A4B-B3E6-CE731B74650C","Mensaje":"Successfull"},{"Id_MPv3":"F05EA56A-3081-4564-A8AD-B814A80A8B20","Mensaje":"Successfull"},{"Id_MPv3":"E16FEFD1-3D4E-414A-B694-EEC34747CE00","Mensaje":"Successfull"},{"Id_MPv3":"1DB9AB20-E4C6-43BA-96E7-7ED49E1D821B","Mensaje":"Successfull"},{"Id_MPv3":"26092EE8-E77D-496F-91C6-60B33E816E4C","Mensaje":"Successfull"}]

                            $.ajax(settings).done(function (response) {
                                if(typeof(response)=="string" && response!='"[]"')
                                {
                                    response = JSON.parse(response);
                                    $("#offcanvasCambioPuesto").offcanvas('hide');
                                    let ok="<table class=\"table table-sm\">";
                                    ok+="<thead><tr><th scope=\"col\">UID</th></tr></thead>";
                                    ok+="<tbody>";
                                    let cont=0;
                                    $.each(response,function(i,reg){
                                        if(reg.Mensaje=="Successfull")
                                        {                                        
                                            cont=cont+1;
                                        }
                                        else
                                        {
                                            ok+="<tr><td>"+ reg.Id_MPv3+"</td></tr>";
                                        }
                                    });                               
                                    ok+="</tbody></table>";
                                    let pre = "<p>" + cont + " de " + response.length + " registros ingresados correctamente</p>";
                                    if(cont<response.length)
                                    {
                                        pre+="<p>Los siguientes registros no se insertaron correctamente:</p>";
                                        showMsgSinTimer("Cambio de puesto",pre + ok);
                                    }
                                    else if(cont==response.length)
                                    {
                                        ocultarUpCargador();
                                        $.confirm({
                                            title: "Cambio de puesto",
                                            content: pre,
                                            icon: 'fa fa-check nuevoingresoico',
                                            type:'green',
                                            typeAnimated:true,
                                            columnClass: 'medium',
                                            buttons: {
                                                aceptar: function () { 
                                                    this.close(); 
                                                    cambioPuesto=true;                                             
                                                    var sueldo=$("#swsueldo").prop('checked');
                                                    var esquema = $("#swesquema").prop('checked');
                                                    RevisaBanderas();
                                                    if(origen=="")
                                                    {
                                                        if(sueldo==true && esquema==false)
                                                        {
                                                            cambioSueldo=true;
                                                            cambioEsquema=false;
                                                            //1) en offcanvas de cambio de sueldo:
                                                            //ocultar cambio de puesto
                                                            $("#swcambiopuestocambiosueldo").hide();
                                                            //check false cambio de puesto
                                                            $("#swcambiopuestonuevosueldo").prop('checked',false);
                                                            //2) en offcanvas esquema
                                                            //ocultar cambio sueldo
                                                            $("#swcambioesquemacambiosueldo").hide();
                                                            //check off cambio sueldo
                                                            $("#swesquemanuevosueldo").prop('checked',false);

                                                            CambioSueldo();
                                                        }
                                                        else if(sueldo==false && esquema==true)
                                                        {
                                                            cambioEsquema=true;
                                                            cambioSueldo=false;
                                                            //2) en offcanvas esquema
                                                            //ocultar cambio puesto
                                                            $("#switchpuestoesquema").hide();
                                                            //ocultar cambio sueldo
                                                            $("#swcambiosueldoesquemarow").hide();
                                                            //check off cambio puesto
                                                            $("#swcambiopuestoesquema").prop('checked',false);
                                                            //check off cambio sueldo
                                                            $("#swcambiosueldoesquema").prop('checked',false);

                                                            CambioEsquema();
    
                                                        }
                                                        else if(sueldo==true && esquema==true)
                                                        {
                                                            cambioSueldo=true;
                                                            cambioEsquema=true;
                                                            //1) en offcanvas de cambio de sueldo:
                                                            //ocultar cambio de puesto
                                                            $("#swcambiopuestocambiosueldo").hide();
                                                            //check false cambio de puesto
                                                            $("#swcambiopuestonuevosueldo").prop('checked',false);
                                                            //check on cambio esquema
                                                            $("#swesquemanuevosueldo").prop('checked',true);
                                                            //mostrar cambio esquema
                                                            $("#swcambioesquemacambiosueldo").hide();

                                                            //2) en offcanvas esquema
                                                            //ocultar cambio puesto
                                                            $("#swcambiosueldoesquemarow").hide();
                                                            //check off cambio puesto
                                                            $("#swcambiosueldoesquema").prop('checked',false);

                                                            CambioSueldo();
                                                        }
                                                        else
                                                        {
                                                            window.location.reload(1);
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                                else
                                {
                                    ocultarUpCargador();
                                    console.log(response);
                                    showMsg("Mensaje","Ocurrió un error al realizar el cambio de puesto");
                                }
                            }).fail(function(){
                                ocultarUpCargador();
                                showMsg("Mensaje","Ocurrió un error al realizar el cambio de puesto");
                            });                          
                        }
                    },3000);
                }
            }

        }
    }
}

function DoCambioEsquema()
{
    if($("#nombramiento").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione nombramiento");
    }
    else
    {
        if($("#idsindicato").val()=="")
        {
            showMsg("Mensaje","Por favor seeccione esquema de pago");
        }
        else
        {
            if($("#viginisindicato").val()=="")
            {
                showMsg("Mensaje","Por favor seleccione vigencia inicial");
            }
            else
            {
                var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                mostrarUpCargador();
                monitos=[];
                monitosError=[];
                $.each(rows,function(i,row){
                    var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                    ObtenerEmpleado(data.CURP,data.ID);
                });
                setTimeout(function(){                        
                    if(monitosError.length != 0)
                    {
                        let emps="";
                        $.each(monitosError,function(i,monito){
                            emps+=monitosError[i]+"<br />";
                        });
                        ocultarUpCargador();
                        $.confirm({
                            title: "Mensaje",
                            content: "No se encontraron los datos de los siguientes "+monitosError.length+" empleados: <br />"+emps+" <br /> ¿Desea continuar? solo se procesarán " + monitos.length + " de " + rows.length + " empleados seleccionados",
                            icon: 'fa fa-info-circle consultamovsico',
                            type:'blue',
                            typeAnimated:true,
                            columnClass: 'medium',
                            buttons: {
                                aceptar: function () {
                                    emps="";
                                    monitos=new Array();
                                    monitosError=new Array();
                                },
                                cancelar:function(){
                                    emps="";
                                    monitos=new Array();
                                    monitosError=new Array();
                                }
                            }
                        });
                    }
                    else
                    {
                        
                        const nom=$("#nombramiento").val();
                        const sind = Number($("#idsindicato").val());
                        const fechaini =formatDate($("#viginisindicato").val());
                        $.each(monitos,function(i,row){
                            monitos[i].nombramiento=nom;
                            monitos[i].esquemapago=sind;
                            monitos[i].sindicato=sind;
                            monitos[i].fechaingreso=fechaini;
                            monitos[i].tipomovimiento=9;
                        });

                        var settings = {
                            "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                            "method": "POST",
                            "timeout": 0,
                            "headers": {
                                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                                "Content-Type": "application/json",
                            },
                            "data": JSON.stringify({
                                "API": "F2B11ED85FF1CB773B6D9D07EC759D7D8D6445C1D64CE4834FDBB41F6CAD6DB1",
                                "Parameters": "",
                                "JsonString": JSON.stringify(monitos),
                                "Hash": getHSH(),
                                "Bearer": getToken()
                            }),
                        };

                        //let response=[{"Id_MPv3":"FE58B43E-D244-4A4B-B3E6-CE731B74650C","Mensaje":"Successfull"},{"Id_MPv3":"F05EA56A-3081-4564-A8AD-B814A80A8B20","Mensaje":"Successfull"},{"Id_MPv3":"E16FEFD1-3D4E-414A-B694-EEC34747CE00","Mensaje":"Successfull"},{"Id_MPv3":"1DB9AB20-E4C6-43BA-96E7-7ED49E1D821B","Mensaje":"Successfull"},{"Id_MPv3":"26092EE8-E77D-496F-91C6-60B33E816E4C","Mensaje":"Successfull"}]
                        $.ajax(settings).done(function (response) {
                            console.log(response);
                            if(typeof(response)=="string" && response!='"[]"')
                            {
                                response = JSON.parse(response);
                                $("#offcanvasCambioEsquema").offcanvas('hide');
                                let ok="<table class=\"table table-sm\">";
                                ok+="<thead><tr><th scope=\"col\">UID</th></tr></thead>";
                                ok+="<tbody>";
                                let cont=0;
                                $.each(response,function(i,reg){
                                    if(reg.Mensaje=="Successfull")
                                    {                                        
                                        cont=cont+1;
                                    }
                                    else
                                    {
                                        ok+="<tr><td>"+ reg.Id_MPv3+"</td></tr>";
                                    }
                                });                               
                                ok+="</tbody></table>";
                                let pre = "<p>" + cont + " de " + response.length + " registros ingresados correctamente</p>";
                                if(cont<response.length)
                                {
                                    pre+="<p>Los siguientes registros no se insertaron correctamente:</p>";
                                    showMsgSinTimer("Cambio de esquema",pre + ok);
                                }
                                else if(cont==response.length)
                                {
                                    ocultarUpCargador();
                                    $.confirm({
                                        title: "Cambio de esquema de pago",
                                        content: pre,
                                        icon: 'fa fa-check nuevoingresoico',
                                        type:'green',
                                        typeAnimated:true,
                                        columnClass: 'medium',
                                        buttons: {
                                            aceptar: function () { 
                                                this.close(); 
                                                cambioEsquema=true;                                             
                                                var sueldo=$("#swcambiosueldoesquema").prop('checked');
                                                var puesto = $("#swcambiopuestoesquema").prop('checked');
                                                RevisaBanderas();
                                                if(origen=="")
                                                {
                                                    if(puesto==true && sueldo==false)
                                                    {
                                                        cambioPuesto=true;
                                                        cambioSueldo=false;
                                                        //1)offcanvas cambio de puesto
                                                        //ocultar cambio esquema
                                                        $("#switchesquemapuesto").hide();
                                                        //check false cambio esquema
                                                        $("#swesquema").prop('checked',false);
                                                        //check false cambio sueldo
                                                        $("#swsueldo").prop('checked',false);
                                                        //mostrar cambio sueldo
                                                        $("#switchsueldopuesto").hide();
                                                        
                                                        CambioPuesto();
                                                    }
                                                    else if(puesto==false && sueldo==true)
                                                    {
                                                        cambioPuesto=false;
                                                        cambioSueldo=true;

                                                        //1)offcanvas cambio sueldo
                                                        //ocultar esquema pago
                                                        $("#swcambioesquemacambiosueldo").hide();
                                                        //check false esquema pago
                                                        $("#swesquemanuevosueldo").prop('checked',false);
                                                        //mostrar cambio puesto
                                                        $("#swcambiopuestocambiosueldo").hide();
                                                        //check false cambio puesto
                                                        $("#swcambiopuestonuevosueldo").prop('checked',false);

                                                        CambioSueldo();
    
                                                    }
                                                    else if(puesto==true && sueldo==true)
                                                    {
                                                        cambioSueldo=true;
                                                        cambioPuesto=true;

                                                        //1)offcanvas cambio de puesto
                                                        //ocultar cambio esquema
                                                        $("#switchesquemapuesto").hide();
                                                        //check false cambio esquema
                                                        $("#swesquema").prop('checked',false);
                                                        //check true cambio sueldo
                                                        $("#swsueldo").prop('checked',true);
                                                        //mostrar cambio sueldo
                                                        $("#switchsueldopuesto").hide();

                                                        //2)offcanvas cambio sueldo
                                                        //ocultar cambio esquema 
                                                        $("#swcambioesquemacambiosueldo").hide();
                                                        //check false cambio esquema 
                                                        $("#swesquemanuevosueldo").prop('checked',false);
                                                        //ocultar cambio puesto
                                                        $("#swcambiopuestocambiosueldo").hide();
                                                        //check false cambio puesto
                                                        $("#swcambiopuestonuevosueldo").prop('checked',false);

                                                        CambioPuesto();
                                                    }
                                                    else
                                                    {
                                                        window.location.reload(1);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                            else
                            {
                                ocultarUpCargador();
                                showMsg("Mensaje","Ocurrió un error al realizar el cambio de esquema de pago");
                            }                            
                        }).fail(function(){
                            ocultarUpCargador();
                            showMsg("Mensaje","Ocurrió un error al realizar el cambio de esquema de pago");
                        });                   
                    }
                },3000);
            }
        }
    }
}

function DoCambioSueldo()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');    
    monitos=[];
    monitosError=[];
    switch(tabActva)
    {
        case 1: //Nuevo Sueldo
        if($("#sueldomensual").val()=="")
        {
            showMsg("Mensaje","Por favor ingrese nuevo sueldo mensual");
        }
        else
        {
            if($("#vigininuevosueldo").val()=="")
            {
                showMsg("Mensaje","Por favor ingrese la vigencia inicial");
            }
            else
            {
                if(isNaN($("#sueldomensual").val()))
                {
                    showMsg("Mensaje","Por favor ingrese un monto válido");
                }
                else
                {
                    mostrarUpCargador();
                    $.each(rows,function(i,row){
                        var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                        ObtenerEmpleado(data.CURP,data.ID);
                    });

                    setTimeout(function(){
                        if(monitosError.length != 0)
                        {
                            let emps="";
                            $.each(monitosError,function(i,monito){
                                emps+=monitosError[i]+"<br />";
                            });
                            ocultarUpCargador();
                            $.confirm({
                                title: "Mensaje",
                                content: "No se encontraron los datos de los siguientes "+monitosError.length+" empleados: <br />"+emps+" <br /> ¿Desea continuar? solo se procesarán " + monitos.length + " de " + rows.length + " empleados seleccionados",
                                icon: 'fa fa-info-circle consultamovsico',
                                type:'blue',
                                typeAnimated:true,
                                columnClass: 'medium',
                                buttons: {
                                    aceptar: function () {
                                        emps="";
                                        monitos=new Array();
                                        monitosError=new Array();
                                    },
                                    cancelar:function(){
                                        emps="";
                                        monitos=new Array();
                                        monitosError=new Array();
                                    }
                                }
                            });
                        }
                        else
                        {
                            const ns=$("#sueldomensual").val();
                            const sd = $("#salariodiario").val();
                            const fechaini =formatDate($("#vigininuevosueldo").val());
                            $.each(monitos,function(i,row){
                                monitos[i].salariomensual=ns;
                                monitos[i].salariodiario=sd;
                                monitos[i].fechaingreso=fechaini;
                                monitos[i].tipomovimiento=8;
                            });

                            var settings = {
                                "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                                "method": "POST",
                                "timeout": 0,
                                "headers": {
                                    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                                    "Content-Type": "application/json",
                                },
                                "data": JSON.stringify({
                                    "API": "F2B11ED85FF1CB773B6D9D07EC759D7D8D6445C1D64CE4834FDBB41F6CAD6DB1",
                                    "Parameters": "",
                                    "JsonString": JSON.stringify(monitos),
                                    "Hash": getHSH(),
                                    "Bearer": getToken()
                                }),
                            };
                            //let response=[{"Id_MPv3":"FE58B43E-D244-4A4B-B3E6-CE731B74650C","Mensaje":"Successfull"},{"Id_MPv3":"F05EA56A-3081-4564-A8AD-B814A80A8B20","Mensaje":"Successfull"},{"Id_MPv3":"E16FEFD1-3D4E-414A-B694-EEC34747CE00","Mensaje":"Successfull"},{"Id_MPv3":"1DB9AB20-E4C6-43BA-96E7-7ED49E1D821B","Mensaje":"Successfull"},{"Id_MPv3":"26092EE8-E77D-496F-91C6-60B33E816E4C","Mensaje":"Successfull"}]
                            $.ajax(settings).done(function (response) {
                                if(typeof(response)=="string" && response!='"[]"')
                                {
                                    response=JSON.parse(response);
                                    $("#offcanvasCambioSueldo").offcanvas('hide');
                                    let ok="<table class=\"table table-sm\">";
                                    ok+="<thead><tr><th scope=\"col\">UID</th></tr></thead>";
                                    ok+="<tbody>";
                                    let cont=0;
                                    $.each(response,function(i,reg){
                                        if(reg.Mensaje=="Successfull")
                                        {                                        
                                            cont=cont+1;
                                        }
                                        else
                                        {
                                            ok+="<tr><td>"+ reg.Id_MPv3+"</td></tr>";
                                        }
                                    });                               
                                    ok+="</tbody></table>";
                                    let pre = "<p>" + cont + " de " + response.length + " registros ingresados correctamente</p>";
                                    if(cont<response.length)
                                    {
                                        pre+="<p>Los siguientes registros no se insertaron correctamente:</p>";
                                        showMsgSinTimer("Cambio de sueldo",pre + ok);
                                    }
                                    else if(cont==response.length)
                                    {
                                        ocultarUpCargador();
                                        CambioSueldoConfirm(pre);
                                    }
                                }
                                else
                                {
                                    ocultarUpCargador();
                                    showMsg("Mensaje","Ocurrió un error al realizar el cambio de sueldo");
                                    console.log(response);
                                }
                            }).fail(function(){
                                ocultarUpCargador();
                                showMsg("Mensaje","Ocurrió un error al realizar el cambio de sueldo");
                            });
                        }
                    },3000);
                }
            }
        }
        break;
        case 2: //Porcentaje
        if($("#porcentaje").val()=="")
        {
            showMsg("Mensaje","Por favor ingrese un porcentaje");
        }
        else
        {
            if(isNaN($("#porcentaje").val()))
            {
                showMsg("Mensaje","Por favor ingrese un porcentaje válido");
            }
            else
            {
                if(Number($("#porcentaje").val())>100)
                {
                    showMsg("Mensaje","Por favor ingrese un porcentaje válido");
                }
                else
                {
                    if(Number($("#porcentaje").val())<-100)
                    {
                        showMsg("Mensaje","Por favor ingrese un porcentaje válido");
                    }
                    else
                    {
                        mostrarUpCargador();
                        $.each(rows,function(i,row){
                            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                            ObtenerEmpleado(data.CURP,data.ID);
                        });
                        setTimeout(function(){
                            if(monitosError.length != 0)
                            {
                                let emps="";
                                $.each(monitosError,function(i,monito){
                                    emps+=monitosError[i]+"<br />";
                                });
                                ocultarUpCargador();
                                $.confirm({
                                    title: "Mensaje",
                                    content: "No se encontraron los datos de los siguientes "+monitosError.length+" empleados: <br />"+emps+" <br /> ¿Desea continuar? solo se procesarán " + monitos.length + " de " + rows.length + " empleados seleccionados",
                                    icon: 'fa fa-info-circle consultamovsico',
                                    type:'blue',
                                    typeAnimated:true,
                                    columnClass: 'medium',
                                    buttons: {
                                        aceptar: function () {
                                            emps="";
                                            monitos=new Array();
                                            monitosError=new Array();
                                        },
                                        cancelar:function(){
                                            emps="";
                                            monitos=new Array();
                                            monitosError=new Array();
                                        }
                                    }
                                });
                            }
                            else
                            {
                                const porcentaje=$("#porcentaje").val()/100;
                                const fechaini =formatDate($("#vigininuevosueldo").val());
                                $.each(monitos,function(i,row){
                                    let sm = monitos[i].salariomensual;
                                    let smporcentaje = sm*porcentaje;
                                    let nuevosalariomensual = sm+smporcentaje;
                                    let nuevosalariodiario=nuevosalariomensual/30;

                                    monitos[i].salariomensual=nuevosalariomensual.toFixed(4);
                                    monitos[i].salariodiario=nuevosalariodiario.toFixed(4);
                                    monitos[i].fechaingreso=fechaini;
                                    monitos[i].tipomovimiento=8;
                                });
    
                                var settings = {
                                    "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                                    "method": "POST",
                                    "timeout": 0,
                                    "headers": {
                                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                                        "Content-Type": "application/json",
                                    },
                                    "data": JSON.stringify({
                                        "API": "F2B11ED85FF1CB773B6D9D07EC759D7D8D6445C1D64CE4834FDBB41F6CAD6DB1",
                                        "Parameters": "",
                                        "JsonString": JSON.stringify(monitos),
                                        "Hash": getHSH(),
                                        "Bearer": getToken()
                                    }),
                                };
                                //let response=[{"Id_MPv3":"FE58B43E-D244-4A4B-B3E6-CE731B74650C","Mensaje":"Successfull"},{"Id_MPv3":"F05EA56A-3081-4564-A8AD-B814A80A8B20","Mensaje":"Successfull"},{"Id_MPv3":"E16FEFD1-3D4E-414A-B694-EEC34747CE00","Mensaje":"Successfull"},{"Id_MPv3":"1DB9AB20-E4C6-43BA-96E7-7ED49E1D821B","Mensaje":"Successfull"},{"Id_MPv3":"26092EE8-E77D-496F-91C6-60B33E816E4C","Mensaje":"Successfull"}]
                                $.ajax(settings).done(function (response) {
                                    if(typeof(response)=="string" && response!='"[]"')
                                    {
                                        response = JSON.parse(response);
                                        $("#offcanvasCambioSueldo").offcanvas('hide');
                                        let ok="<table class=\"table table-sm\">";
                                        ok+="<thead><tr><th scope=\"col\">UID</th></tr></thead>";
                                        ok+="<tbody>";
                                        let cont=0;
                                        $.each(response,function(i,reg){
                                            if(reg.Mensaje=="Successfull")
                                            {                                        
                                                cont=cont+1;
                                            }
                                            else
                                            {
                                                ok+="<tr><td>"+ reg.Id_MPv3+"</td></tr>";
                                            }
                                        });                               
                                        ok+="</tbody></table>";
                                        let pre = "<p>" + cont + " de " + response.length + " registros ingresados correctamente</p>";
                                        if(cont<response.length)
                                        {
                                            pre+="<p>Los siguientes registros no se insertaron correctamente:</p>";
                                            showMsgSinTimer("Cambio de sueldo",pre + ok);
                                        }
                                        else if(cont==response.length)
                                        {
                                            ocultarUpCargador();
                                            CambioSueldoConfirm(pre);
                                        }
                                    }
                                    else
                                    {
                                        ocultarUpCargador();
                                        showMsg("Mensaje","Ocurrió un error al realizar el cambio de sueldo");
                                        console.log(response);
                                    }
                                }).fail(function(){
                                    ocultarUpCargador();
                                    showMsg("Mensaje","Ocurrió un error al realizar el cambio de sueldo");
                                });
                            }
                        },3000);
                    }
                }
            }
        }
        break;
        case 3: //Importe fijo
        if($("#importefijomensual").val()=="")
        {
            showMsg("Mensaje","Por favor ingrese un importe fijo de aumento mensual");
        }
        else
        {
            if(isNaN($("#importefijomensual").val()))
            {
                showMsg("Mensaje","Por favor ingrese un importe fijo de aumento mensual válido");
            }
            else
            {
                if($("#importefijodiario").val()=="")
                {
                    showMsg("Mensaje","Por favor ingrese importe fijo de aumento diario");
                }
                else
                {
                    if(isNaN($("#importefijodiario").val()))
                    {
                        showMsg("Mensaje","Por favor ingrese un importe fijo de aumento diario válido");
                    }
                    else
                    {
                        mostrarUpCargador();
                        $.each(rows,function(i,row){
                            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
                            ObtenerEmpleado(data.CURP,data.ID);
                        });
                        setTimeout(function(){
                            if(monitosError.length != 0)
                            {
                                let emps="";
                                $.each(monitosError,function(i,monito){
                                    emps+=monitosError[i]+"<br />";
                                });
                                ocultarUpCargador();
                                $.confirm({
                                    title: "Mensaje",
                                    content: "No se encontraron los datos de los siguientes "+monitosError.length+" empleados: <br />"+emps+" <br /> ¿Desea continuar? solo se procesarán " + monitos.length + " de " + rows.length + " empleados seleccionados",
                                    icon: 'fa fa-info-circle consultamovsico',
                                    type:'blue',
                                    typeAnimated:true,
                                    columnClass: 'medium',
                                    buttons: {
                                        aceptar: function () {
                                            emps="";
                                            monitos=new Array();
                                            monitosError=new Array();
                                        },
                                        cancelar:function(){
                                            emps="";
                                            monitos=new Array();
                                            monitosError=new Array();
                                        }
                                    }
                                });
                            }
                            else
                            {
                                const importefijomensual=Number($("#importefijomensual").val());
                                const importefijodiario=Number($("#importefijodiario").val());
                                const fechaini =formatDate($("#vigininuevosueldo").val());
                                $.each(monitos,function(i,row){
                                    let sm = monitos[i].salariomensual + importefijomensual;
                                    let sd= monitos[i].salariodiario + importefijodiario;

                                    monitos[i].salariomensual=sm;
                                    monitos[i].salariodiario=sd;
                                    monitos[i].fechaingreso=fechaini;
                                    monitos[i].tipomovimiento=8;
                                });
    
                                var settings = {
                                    "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                                    "method": "POST",
                                    "timeout": 0,
                                    "headers": {
                                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                                        "Content-Type": "application/json",
                                    },
                                    "data": JSON.stringify({
                                        "API": "F2B11ED85FF1CB773B6D9D07EC759D7D8D6445C1D64CE4834FDBB41F6CAD6DB1",
                                        "Parameters": "",
                                        "JsonString": JSON.stringify(monitos),
                                        "Hash": getHSH(),
                                        "Bearer": getToken()
                                    }),
                                };
                                //let response=[{"Id_MPv3":"FE58B43E-D244-4A4B-B3E6-CE731B74650C","Mensaje":"Successfull"},{"Id_MPv3":"F05EA56A-3081-4564-A8AD-B814A80A8B20","Mensaje":"Successfull"},{"Id_MPv3":"E16FEFD1-3D4E-414A-B694-EEC34747CE00","Mensaje":"Successfull"},{"Id_MPv3":"1DB9AB20-E4C6-43BA-96E7-7ED49E1D821B","Mensaje":"Successfull"},{"Id_MPv3":"26092EE8-E77D-496F-91C6-60B33E816E4C","Mensaje":"Successfull"}]
                                $.ajax(settings).done(function (response) {
                                    if(typeof(response)=="string" && response!='"[]"')
                                    {
                                        response = JSON.parse(response);
                                        $("#offcanvasCambioSueldo").offcanvas('hide');
                                        let ok="<table class=\"table table-sm\">";
                                        ok+="<thead><tr><th scope=\"col\">UID</th></tr></thead>";
                                        ok+="<tbody>";
                                        let cont=0;
                                        $.each(response,function(i,reg){
                                            if(reg.Mensaje=="Successfull")
                                            {                                        
                                                cont=cont+1;
                                            }
                                            else
                                            {
                                                ok+="<tr><td>"+ reg.Id_MPv3+"</td></tr>";
                                            }
                                        });                               
                                        ok+="</tbody></table>";
                                        let pre = "<p>" + cont + " de " + response.length + " registros ingresados correctamente</p>";
                                        if(cont<response.length)
                                        {
                                            pre+="<p>Los siguientes registros no se insertaron correctamente:</p>";
                                            showMsgSinTimer("Cambio de sueldo",pre + ok);
                                        }
                                        else if(cont==response.length)
                                        {
                                            ocultarUpCargador();
                                            CambioSueldoConfirm(pre);
                                        }
                                    }
                                    else
                                    {
                                        ocultarUpCargador();
                                        showMsg("Mensaje","Ocurrió un error al realizar el cambio de sueldo");
                                        console.log(response);
                                    }
                                }).fail(function(){
                                    ocultarUpCargador();
                                    showMsg("Mensaje","Ocurrió un error al realizar el cambio de sueldo");
                                });
                            }
                        },3000);
                    }
                }
            }
        }
        break;
        default:
            break;
    }
}

function CambioSueldoConfirm(pre)
{
    $.confirm({
        title: "Cambio de sueldo",
        content: pre,
        icon: 'fa fa-check nuevoingresoico',
        type:'green',
        typeAnimated:true,
        columnClass: 'medium',
        buttons: {
            aceptar: function () { 
                this.close(); 
                cambioSueldo=true;                                             
                var puesto = $("#swcambiopuestonuevosueldo").prop('checked');
                var esquema = $("#swesquemanuevosueldo").prop('checked');
                RevisaBanderas();
                if(origen=="")
                {
                    if(puesto==true && esquema==false)
                    {
                        cambioPuesto=true;
                        cambioEsquema=false;
                        
                        //1)offcanvas puesto
                        //ocultar sueldo
                        $("#switchsueldopuesto").hide();
                        //check false sueldo
                        $("#swsueldo").prop('checked',false);
                        //ocultar esquema
                        $("#switchesquemapuesto").hide();
                        //check false esquema
                        $("#swesquema").prop('checked',false);

                        CambioPuesto();
                    }
                    else if(puesto==false && esquema==true)
                    {
                        cambioPuesto=false;
                        cambioEsquema=true;

                        //1)offcanvas esquema
                        //ocultar sueldo
                        $("#swcambiosueldoesquemarow").hide();
                        //check false sueldo
                        $("#swcambiosueldoesquema").prop('checked',false);
                        //ocultar puesto
                        $("#switchpuestoesquema").hide();
                        //check false puesto
                        $("#swcambiopuestoesquema").prop('checked',false);

                        CambioEsquema();

                    }
                    else if(puesto==true && esquema==true)
                    {
                        cambioSueldo=true;
                        cambioEsquema=true;

                        //1)offcanvas puesto
                        //ocultar sueldo
                        $("#switchsueldopuesto").hide();
                        //check false sueldo
                        $("#swsueldo").prop('checked',false);
                        //ocultar esquema
                        $("#switchesquemapuesto").hide();
                        //check false esquema
                        $("#swesquema").prop('checked',true);

                        //2)offcanvas esquema
                        //ocultar sueldo
                        $("#swcambiosueldoesquemarow").hide();
                        //check false sueldo
                        $("#swcambiosueldoesquema").prop('checked',false);
                        //ocultar puesto
                        $("#switchpuestoesquema").hide();
                        //check false puesto
                        $("#swcambiopuestoesquema").prop('checked',false);

                        CambioPuesto();
                    }
                    else
                    {
                        window.location.reload(1);
                    }
                }
            }
        }
    });
}

function RegistraTab(numTab)
{
    tabActva=numTab;
}

function CalculaSD(elem)
{
    var sueldoAnterior = Number($("#"+elem.id).val());
    var nuevoSueldo = (sueldoAnterior/30).toFixed(4);
    $("#salariodiario").val(nuevoSueldo);
}

function CalculaIF(elem)
{
    var sueldoAnterior = Number($("#"+elem.id).val());
    var nuevoSueldo = (sueldoAnterior/30).toFixed(4);
    $("#importefijodiario").val(nuevoSueldo);
}

function ObtenerEmpleado(curp,ocupacion)
{
    var obj=new Object();
    obj.CURP = curp;

    var ObjDatos = new Object();
    ObjDatos.API="A9BF89AA4713E434BD2872368786FF4B2191909791694F8FE23398473D0000D5";
    ObjDatos.Parameters="";
    ObjDatos.JsonString=JSON.stringify(obj);
    ObjDatos.Hash= getHSH();
    ObjDatos.Bearer= getToken();

    $.when(ajaxTokenFijo(ObjDatos)).done(function (response) {
        if(response.length>1)
        {
            if(response=="No se encontró el CURP. ")
            {
                monitosError.push(curp);
            }
            else
            {
                $.each(response,function(i,row)
                {
                    if(row.id_ocupacion==ocupacion)
                    {
                        //Depurar subcontratante
                        if(row.subcontratante.length==1)
                        {
                            let limpiar=false;
                            $.each(row.subcontratante,function(j,row1){
                                if(row1.Valor==0 && row1.Descripcion=="")
                                {
                                    limpiar=true;
                                }
                            });
                            if(limpiar==true)
                            {
                                row.subcontratante=[];
                            }                        
                        }
                        monitos.push(response[i]);
                    }
                });
            }

        }
        else if(response.length==1)
        {
            if(response[0].id_ocupacion==ocupacion)
            {
                //Depurar subcontratante
                if(response[0].subcontratante.length==1)
                {
                    let limpiar=false;
                    $.each(response[0].subcontratante,function(j,row1){
                        if(row1.Valor==0 && row1.Descripcion=="")
                        {
                            limpiar=true;
                        }
                    });
                    if(limpiar==true)
                    {
                        response[0].subcontratante=[];
                    }                        
                }
                monitos.push(response[0]);
            }
            else
            {
                monitosError.push(curp);
            }
        }
        else
        {
            monitosError.push(curp);
        }
    }).fail(function(){
        monitosError.push(curp);
    });
}

function RevisaBanderas()
{
    console.log("Origen:"+origen," CambioSueldo:"+cambioSueldo," CambioEsquema:"+cambioEsquema," CambioPuesto:"+cambioPuesto);
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'Promociones');
		}
		ocultarCargador();
	}, 1000);
}