$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 

    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px',todayString: '', clearString: '' });

    $("#fechafinal").val('');

    $("#fechabaja").val('');

    $("#swtemporal").on('change',function(event){
        if($(this).prop('checked'))
        {
            $(".temp").fadeIn(500);
        }
        else
        {
            $(".temp").fadeOut(500);
        }
    });

    $(".temp").hide();

    Combos();

    GetGrid();

});

function GetGrid() 
{
    var obj = new Object();
    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
    obj.Parameters="?_Id=93&_Domain={d}&_Parameters='1'";
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

    let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
    botones+="<div class=\"d-grid gap-2 d-md-flex\">";
    botones+="<div class=\"col-sm-2\"><button onclick=\"Renovacion();\" class=\"btn btn-outline-dark btn-sm\" ><span class=\"fa fa-refresh\"></span> Renovación de contrato</button></div>";
    botones+="<div class=\"col-sm-2\"><button onclick=\"Baja();\" class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-user-times\"></span> Baja definitiva</button></div>";
    botones+="<div class=\"col-sm-2\"><button class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-file-excel-o\"></span> Exportar</button></div>";
    botones+="<div class=\"col-sm-2 offset-5\"><button onclick=\"GetGridHistoria();\" class=\"btn btn-outline-dark btn-sm\"><span class=\"fa fa-hourglass\"></span> Historia <span class=\"fa fa-chevron-right\"></span></button></div>";
    botones+="</div></div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        showstatusbar: false,
        width: '100%',
        height:$("#divContenedorInterno").height() - 20,
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
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RelOcupacionContratoTemporal');
            $("#gdPlantilla").jqxGrid('hidecolumn','UID');
            $("#gdPlantilla").jqxGrid('hidecolumn','NumPlaza');
            $("#gdPlantilla").jqxGrid('hidecolumn','ApellidoPaterno');
            $("#gdPlantilla").jqxGrid('hidecolumn','ApellidoMaterno');
            $("#gdPlantilla").jqxGrid('hidecolumn','Nombre');
            //$("#gdPlantilla").jqxGrid('hidecolumn','NoAnt');
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

function Combos()
{
    fillCombo(10, 'idtipocontrato', '');
    fillCombo(14, 'idtipobaja', '');
}

function Renovacion()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        $("#fechafinal").val('');
        $("#idtipocontrato").jqxDropDownList('clearSelection');
        var items = $("#idtipocontrato").jqxDropDownList('getItems'); 
        let indice=0;
        $.each(items,function(i,row)
        {
            if(row.label==data.TipodeContrato)
            {
                indice=row.index;
            }
        });
        $("#idtipocontrato").jqxDropDownList('selectIndex', indice );
        $("#swtemporal").prop('checked',false);
        $("#swtemporal").trigger('change');
        $("#swbajaauto").prop('checked',false);
        $("#offcanvasRenovacion").offcanvas('show');
    }    
}

function GuardaRenovacion()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');

    if($("#idtipocontrato").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione un tipo de contrato");
    }
    else
    {
        if($("#swtemporal").prop('checked')==true && $("#fechafinal").val()=="")
        {
            showMsg("Mensaje","Por favor ingrese una fecha de final");
        }
        else
        {           
            mostrarUpCargador();
            let mensajes="";
            var json = new Array();
            $.each(rows,function(i,row){
                var data = $('#gdPlantilla').jqxGrid('getrowdata', row);
                var obj = new Object();
                obj.idrelocupacioncontratotemporal = data.Id_RelOcupacionContratoTemporal.toString();
                obj.idocupacion= data.ID.toString();
                obj.idtipocontrato=$("#idtipocontrato").val().toString();
                obj.bajaautomatica=$("#swbajaauto").prop('checked')==true?"1":"0";
                obj.fechabaja="";
                obj.observaciones=data.Observaciones;
                obj.vigenciainicial="";
                obj.vigenciafinal=$("#fechafinal").val()==""?"":formatDate($("#fechafinal").val());
                obj.contratotemporal=$("#swtemporal").prop('checked')==true?"1":"0";
                let ffinalcomparar=data.VigenciaFinal==undefined || data.VigenciaFinal==""?"1900-12-31":formatDate(data.VigenciaFinal);
                console.log(obj.vigenciafinal,ffinalcomparar,new Date(obj.vigenciafinal)< new Date(ffinalcomparar));
                if(new Date(obj.vigenciafinal)< new Date(ffinalcomparar))
                {
                    mensajes+="La fecha final debe ser mayor a la vigencia final del empleado " + data.ID + ": "+ data.VigenciaFinal+"<br />";
                }

                json.push(obj);
            });

            var obj = new Object();
            obj.API="E491691CFA48AC40796C92BFDA60031D69F2F1520A807D2D2FA2A2D7E12688A3";
            obj.Parameters="";
            obj.JsonString=JSON.stringify(json);
            obj.Hash= getHSH();
            obj.Bearer= getToken();

            if (mensajes=="")
            {
                $("#offcanvasRenovacion").offcanvas('hide');
                setTimeout(function(){
                    $.when(ajaxTokenFijo(obj)).done(function (res) 
                    {   
                        if(res.error=="0")
                        {
                            $.confirm({
                                title: "Éxito",
                                content: "Se realizó la renovación correctamente",
                                icon: 'fa fa-check-circle nuevoingresoico',
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
                            showMsg('Mensaje',res.msg);
                        }                               
                        ocultarUpCargador();
                    }).fail(function(){
                            showMsg("Error","Ocurrió un error en la renovación");            
                        ocultarUpCargador();
                    });  
                },1500);
            }
            else
            {
                if($("#swtemporal").prop('checked')==false)
                {
                    $("#offcanvasRenovacion").offcanvas('hide');
                    setTimeout(function(){
                        $.when(ajaxTokenFijo(obj)).done(function (res) 
                        {   
                            if(res.error=="0")
                            {
                                $.confirm({
                                    title: "Éxito",
                                    content: "Se realizó la renovación correctamente",
                                    icon: 'fa fa-check-circle nuevoingresoico',
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
                                showMsg('Mensaje',res.msg);
                            }                               
                            ocultarUpCargador();
                        }).fail(function(){
                                showMsg("Error","Ocurrió un error en la renovación");            
                            ocultarUpCargador();
                        });  
                    },1500);                   
                }
                else
                {
                    ocultarUpCargador();
                    $.confirm({
                        title: "Validación",
                        content: mensajes,
                        icon: 'fa fa-close bajasico',
                        type:'red',
                        typeAnimated:true,
                        columnClass: 'medium',
                        buttons: {
                            aceptar: function () {
                            }
                        }
                    });
                }
            }
        }
    }
}

function Baja()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        $("#fechabaja").val('');
        $("#observaciones").val('');
        $("#idtipobaja").jqxDropDownList('clearSelection');
        $("#idtipobaja").jqxDropDownList('selectIndex', 0 );
        var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
        var ffinal=data.VigenciaFinal==undefined || data.VigenciaFinal==""?"":formatDate(data.VigenciaFinal);
        if(rows.length>1)
        {
            //Encontrar la fecha mayor
            $.each(rows,function(i,row){
                var data = $('#gdPlantilla').jqxGrid('getrowdata', row);
                let ff = data.VigenciaFinal==undefined || data.VigenciaFinal==""?"1900-12-31":formatDate(data.VigenciaFinal);
                if(new Date(ff)> new Date(ffinal))
                {
                    ffinal=ff;
                }
            });
            $("#fechabaja").val(ffinal);
        }
        else
        {
            $("#fechabaja").val(ffinal);
        }

        $("#offcanvasBaja").offcanvas('show');
    }
}

function GuardarBaja()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if($("#fechabaja").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione una fecha de baja");
    }
    else
    {
        if($("#idtipobaja").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione tipo de baja");
        }
        else
        {
            if($("#observaciones").val()=="")
            {
                showMsg("Mensaje","Por favor ingrese observaciones ");
            }
            else
            {
                
                mostrarUpCargador();
                var mensajes="";
                var json = new Array();
                var jsonBajaArray=new Array();
                var ErrorGuardado=new Array();
                var GuardadoOK = new Array();
                const fb = formatDate($("#fechabaja").val());
                const tb = $("#idtipobaja").val().toString();
                const ob = $("#observaciones").val();

                $.each(rows,function(i,row)
                {
                    var data = $('#gdPlantilla').jqxGrid('getrowdata', row);
                    var obj = new Object();
                    obj.idrelocupacioncontratotemporal = data.Id_RelOcupacionContratoTemporal.toString();
                    obj.idocupacion= data.ID.toString();
                    obj.idtipocontrato="";
                    obj.bajaautomatica="0";
                    obj.fechabaja=$("#fechabaja").val()==""?"":formatDate($("#fechabaja").val());
                    obj.observaciones=$("#observaciones").val();
                    obj.vigenciainicial="";
                    obj.vigenciafinal="";
                    obj.contratotemporal="0";
                    let ffinalcomparar=data.VigenciaFinal==undefined || data.VigenciaFinal==""?"1900-12-31":formatDate(data.VigenciaFinal);

                    if(new Date(obj.fechabaja)<new Date(ffinalcomparar))
                    {
                        mensajes+="¿Deseas dar una baja anticipada al empleado " + data.CURP + "?" + "<br />";
                    }
                    if(new Date(obj.fechabaja)>new Date(ffinalcomparar))
                    {
                        mensajes+="El contrato del empleado " + data.CURP + " vencía antes de la fecha de baja, ¿es correcto?" + "<br />";
                    }
                    jsonBajaArray.push(data.CURP);            
                    json.push(obj);
                });

                if(mensajes=="")
                {
                    $("#offcanvasBaja").offcanvas('hide');
                    _baja(jsonBajaArray,ErrorGuardado,GuardadoOK,fb,tb,ob,json);
                }
                else
                {
                    ocultarUpCargador();
                    $.confirm({
                        title: "Validación",
                        content: mensajes,
                        icon: 'fa fa-exclamation-triangle modificacionesico',
                        type:'orange',
                        typeAnimated:true,
                        columnClass: 'medium',
                        buttons: {
                            aceptar: function () {
                                $("#offcanvasBaja").offcanvas('hide');
                                mostrarUpCargador();
                                _baja(jsonBajaArray,ErrorGuardado,GuardadoOK,fb,tb,ob,json);       
                            },
                            cancelar: function(){}
                        }
                    });
                }
            }
        }
    }
}

function _baja(jsonBajaArray,ErrorGuardado,GuardadoOK,fb,tb,ob,json)
{
    $.each(jsonBajaArray,function(i,row){

        var obj=new Object();
        obj.CURP = row;

        var ObjDatos = new Object();
        ObjDatos.API="12748271D4C2C1B077DFF974ECFE3F0BF515CD3E0E651F0C1FAB50A6AB567B10";
        ObjDatos.Parameters="";
        ObjDatos.JsonString=JSON.stringify(obj);
        ObjDatos.Hash= getHSH();
        ObjDatos.Bearer= getToken();

        $.when(ajaxTokenFijo(ObjDatos)).done(function (response) {
            if (valdiateResponse(response)) {
                response.fechabaja=fb;
                response.tipobaja=tb;
                response.observacionesbaja=ob;
                response.tipomovimiento=5;

                //Depurar subcontratante
                if(response.subcontratante.length==1)
                {
                    let limpiar=false;
                    $.each(response.subcontratante,function(i,row){
                        if(row.Valor==0 && row.Descripcion=="")
                        {
                            limpiar=true;
                        }
                    });
                    if(limpiar==true)
                    {
                        response.subcontratante=[];
                    }
                }

                var settings = {
                    "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                        "Content-Type": "application/json",
                    },
                    "data": JSON.stringify({
                        "API": "67AF62FB54F3BF6DC2458B88CE0C4EEC9214FED6B3078ECD1C1EBEF124790794",
                        "Parameters": "",
                        "JsonString": JSON.stringify(response),
                        "Hash": getHSH(),
                        "Bearer": getToken()
                    }),
                };

                //Baja con API de movimientos de personal
                $.ajax(settings).done(function (response) {
                    if(response=='"Successfull"')
                    {
                        GuardadoOK.push(row);
                        //llamar el api de este modulo gestion temporal
                        var obj = new Object();
                        obj.API="6ADC5E54EE734F4BFAE17C1D1C167ADC1809E4F8ACF23201CD98D395FB5B1749";
                        obj.Parameters="";
                        obj.JsonString=JSON.stringify(json);
                        obj.Hash= getHSH();
                        obj.Bearer= getToken();
                        $.when(ajaxTokenFijo(obj)).done(function (res) 
                        {   
                            if(res.error=="0")
                            {
                                $.confirm({
                                    title: 'Éxito',
                                    type:'green',
                                    icon: 'fa fa-check',
                                    typeAnimated:true,
                                    content: 'Registro guardado con éxito.',
                                    buttons: {
                                        Aceptar: function () {     
                                            window.location.reload(1);                                                                  
                                        },
                                    }
                                });
                            }
                            else
                            {
                                showMsg('Mensaje',res.msg);
                            }                               
                            ocultarUpCargador();
                        }).fail(function(){
                                showMsg("Error","Ocurrió un error en la baja");            
                            ocultarUpCargador();
                        });
                    }
                    else
                    {
                        ErrorGuardado.push("Baja del empleado: " + row + " error");
                    }                        
                });
            } 
        }).fail(function(){
            ocultarUpCargador();
            showMsg("Mensaje","Ocurrió un error al dar la baja");
        });
    });
}