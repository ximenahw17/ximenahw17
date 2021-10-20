var reporteActual="";
var tipo="";
var idLayout="";

$(document).ready(function () 
{
    mostrarCargador();
    
    $.jqx.theme = "light";
    
    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, 
    filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", checkboxes: true, openDelay: 0, animationType: 'none'
    }).on('checkChange',function(ev){
        check(ev,$(this)[0].id);
    }); 

    $(".hwdbo-comboPlantilla").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, 
    filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", checkboxes: true, openDelay: 0, animationType: 'none'
    }).on('checkChange',function(ev){
        checkPlantilla(ev,$(this)[0].id);
    });
    
    Combos().then(r=>{       
        ocultarCargador();                
    });

    $("#grupo").on('close',function(ev){
        let ids=GetIds('grupo');
        if(ids!="")
        {
            mostrarCargador();
            
            fillComboMultiple(136, 'razon', "&_Parameters='" + ids +"'",0);
        }
    });

    $("#grupoPlantilla").on('close',function(ev){
        let ids=GetIds('grupoPlantilla');
        if(ids!="")
        {
            mostrarCargador();
            var params=new Object();
            params.idgrupoempresarial = ids;
            params.idrazonsocial = "0";
            params.idregistropatronal = "0";
            params.idlocalidadsucursal = "0";
            params.idclasenomina="0";
            params.estatus="0";
            fillComboPlantilla('1', 'razonPlantilla', JSON.stringify(params),0);
        }
    });

    $("#razon").on('close',function(ev){        
        let ids=GetIds('razon');
        if(ids!="")
        {
            mostrarCargador();
            fillComboMultiple(137, 'registro', "&_Parameters='" + ids +"'",0);
        }
    });

    $("#razonPlantilla").on('close',function(ev){
        let ids=GetIds('razonPlantilla');
        if(ids!="")
        {
            mostrarCargador();
            var params=new Object();
            params.idgrupoempresarial = "0";
            params.idrazonsocial = ids;
            params.idregistropatronal = "0";
            params.idlocalidadsucursal = "0";
            params.idclasenomina="0";
            params.estatus="0";
            fillComboPlantilla('2', 'registroPlantilla', JSON.stringify(params),0);
        }
    });

    $("#registro").on('close',function(ev){       
        let ids=GetIds('razon');
        if(ids!="")
        {
            mostrarCargador();
            fillComboMultiple(138, 'localidad', "&_Parameters='" + ids +"'",0);
        }
    });

    $("#registroPlantilla").on('close',function(ev){
        let ids=GetIds('razonPlantilla');
        if(ids!="")
        {
            mostrarCargador();
            var params=new Object();
            params.idgrupoempresarial = "0";
            params.idrazonsocial = ids;
            params.idregistropatronal = "0";
            params.idlocalidadsucursal = "0";
            params.idclasenomina="0";
            params.estatus="0";
            fillComboPlantilla('3', 'localidadPlantilla', JSON.stringify(params),0);
        }
    });

    $("#localidadPlantilla").on('close',function(ev){
        let ids=GetIds('localidadPlantilla');
        if(ids!="")
        {
            $("#esquemaPlantilla").jqxDropDownList('checkIndex', 0);
            $("#estatusPlantilla").jqxDropDownList('checkIndex', 0);
        }
        ocultarCargador();
    });

    $("#localidad").on('close',function(ev){       
        let ids=GetIds('razon');
        let ids2=GetIds('localidad');
        if(ids!="")
        {
            if(ids2!="")
            {
                mostrarCargador();
            }
            fillComboMultiple(139, 'esquema', "&_Parameters='" + ids +"'",0);           
        }
    });

    $("#esquema").on('close',function(ev){        
        let ids1=GetIds('grupo');
        let ids2=GetIds('razon');
        let ids3=GetIds('esquema');
        if(ids1 !="" && ids2!="")
        {
            if(ids3!="")
            {
                mostrarCargador();
            }
            fillComboMultiple(157, 'periodicidad', "&_Parameters='" + ids1 +"','"+ids2+"'",1);
        }
    });

    $("#periodicidad").on('close',function(ev){       
        let ids1=GetIds('periodicidad');
        let ids2=GetIds('grupo');
        if(ids1 !="" && ids2!="")
        {
            mostrarCargador();
            if(reporteActual=="DispersionBancomer")
            {
                fillCombo(141, 'periodo', "&_Parameters='" + ids1 +"','"+ids2+"'").then(r=>{
                    setTimeout(function() { 
                        $("#anio").jqxDropDownList('checkIndex', 1);
                        $("#periodo").jqxDropDownList('selectIndex', 0);
                    },1000);
                    setTimeout(function() { 
                        ocultarCargador();
                    },2000);
                });
            }
            else
            {
                $("#periodo").jqxDropDownList({ checkboxes: true });
                fillComboMultiple(141, 'periodo', "&_Parameters='" + ids1 +"','"+ids2+"'",1).then(r=>{
                    setTimeout(function() { 
                        $("#anio").jqxDropDownList('checkIndex', 1);
                    },1000);
                    setTimeout(function() { 
                        ocultarCargador();
                    },2000);
                });
            }

        }
    });

    var btnCreateFile = document.getElementById('btnCreateFile');

    btnCreateFile.addEventListener('click', function () 
    {
        var json= new Object();

        if(GetIds('grupo')=="")
        {
            showMsg("Mensaje","Por favor seleccione uno o varios grupos empresariales");
        }
        else
        {
            if(GetIds('razon')=="")
            {
                showMsg("Mensaje","Por favor seleccione una o varias razones sociales");
            }
            else
            {
                if(GetIds('registro')=="")
                {
                    showMsg("Mensaje","Por favor seleccione uno o varios registros patronales ");
                }
                else
                {
                    if(GetIds('localidad')=="")
                    {
                        showMsg("Mensaje","Por favor seleccione una o varias localidades");
                    }
                    else
                    {
                        if(GetIds('esquema')=="")
                        {
                            showMsg("Mensaje","Por favor seleccione uno o varios esquemas de pago");
                        }
                        else
                        {
                            if(GetIds('periodicidad')=="")
                            {
                                showMsg("Mensaje","Por favor seleccione una o varias periodicidades");
                            }
                            else
                            {
                                if(GetIds('anio')=="")
                                {
                                    showMsg("Mensaje","Por favor seleccione uno o varios años");
                                }
                                else
                                {
                                    if(GetIds('periodo')=="")
                                    {
                                        if(reporteActual=="DispersionBancomer")
                                        {
                                            showMsg("Mensaje","Por favor seleccione un periodo");
                                        }
                                        else
                                        {
                                            showMsg("Mensaje","Por favor seleccione uno o varios periodos");
                                        }                                   
                                    }
                                    else
                                    {
                                        mostrarCargador();

                                        switch(reporteActual)
                                        {
                                            case "Davivienda Pagos Interbancarios (TXT)":
                                            case "Davivienda Transferencias Exterior (TXT)":
                                            case "Davivienda Pagos Interbancarios (CSV)":
                                            case "Davivienda Transferencias Exterior (CSV)":
                                                json.idgrupoempresarial= GetIds('grupo');
                                                json.idrazonsocial= GetIds('razon');
                                                json.idregistropatronal=  GetIds('registro');
                                                json.idlocalidadsucursal= GetIds('localidad');
                                                json.idclasenomina= GetIds('esquema');
                                                json.idtipoperiodo= GetIds('periodicidad');
                                                json.ano= GetIds('anio');
                                                json.idcontrolnomina= GetIds('periodo');
                                                json.idlayout= idLayout.toString();
                                    
                                                apiId="559DE72B1263D3C920524950ECBC029848A5C0250692A69B5E78AD4A95134D88";
                                                DoReporteLayout(json,apiId,tipo);
                                                return false;
                                
                                            case "Ficosha (TXT)":                                        
                                            case "Ficosha (CSV)":
                                            
                                                json.idgrupoempresarial= GetIds('grupo');
                                                json.idrazonsocial= GetIds('razon');
                                                json.idregistropatronal=  GetIds('registro');
                                                json.idlocalidadsucursal= GetIds('localidad');
                                                json.idclasenomina= GetIds('esquema');
                                                json.idtipoperiodo= GetIds('periodicidad');
                                                json.ano= GetIds('anio');
                                                json.idcontrolnomina= GetIds('periodo');
                                                json.idlayout= idLayout.toString();
                                    
                                                apiId="2CE008ECD6C1DF5B1D0BBBA5DC8D323727F635DB7DA87D733339C6DE13F5749D";
                                                DoReporteLayout(json,apiId,tipo);  
                                                return false;  
                                
                                            case "Bancaria popular (TXT)":
                                            case "Bancaria popular (CSV)":  
                                            
                                                json.idgrupoempresarial= GetIds('grupo');
                                                json.idrazonsocial= GetIds('razon');
                                                json.idregistropatronal=  GetIds('registro');
                                                json.idlocalidadsucursal= GetIds('localidad');
                                                json.idclasenomina= GetIds('esquema');
                                                json.idtipoperiodo= GetIds('periodicidad');
                                                json.ano= GetIds('anio');
                                                json.idcontrolnomina= GetIds('periodo');
                                                json.idlayout= idLayout.toString();
                                    
                                                apiId="E1378BB7CCF1B5BFA0CB60F7D0AEF560541C7AA7DED4ED05EC2E3C8B30497706";
                                                DoReporteLayout(json,apiId,tipo);
                                                return false;

                                            case "DispersionBancomer": 
                                                json.idcontrolnomina=$("#periodo").val().toString().split('»')[0];
                                                apiId="2ECE56C4A66B75D727FF1AEE7FCE36848540595652381500673904192F304A74";
                                                DoReporteLayout(json,apiId,'txt');
                                                return false;   
                                
                                        default:                                        
                                            break;
                                        }                                                                            
                                    }
                                }
                            }
                        }
                    }
                }
            }   
        }

    }, false);

    $("#downloadFile").on('click',function(ev){
        $("#offcanvasReporte").offcanvas('hide');
    });
});

async function Combos() {    
    const grupo = await fillComboMultiple(98, 'grupo', '',-1);
    const años = await fillComboMultiple(140, 'anio', '',-1);
}

async function CombosPlantilla()
{
    var params=new Object();
    params.idgrupoempresarial = "0";
    params.idrazonsocial = "0";
    params.idregistropatronal = "0";
    params.idlocalidadsucursal = "0";
    params.idclasenomina="0";
    params.estatus="0";

    const grupo = await fillComboPlantilla('0', 'grupoPlantilla', JSON.stringify(params),-1);
    const clase = await fillComboPlantilla('4', 'esquemaPlantilla', JSON.stringify(params),-1);
    const estatus = await fillComboPlantilla('5', 'estatusPlantilla', JSON.stringify(params),-1);
}

function ReporteExentoGravado()
{
    $("#DivGrid").hide();

    $("#btnCreateFile").hide();

    $("#downloadFile").hide();

    $("#BtnConsultar").show();

    $("#lblTipoConsulta").text('Excento/Gravado');

    $(".ini").jqxDropDownList('uncheckAll');

    $(".cl").jqxDropDownList('clear');

    reporteActual="ReporteExentoGravado";

    /*clippy.load('Clippy', function(agent){
        // do anything with the loaded agent  
        agent.show();     
        agent.moveTo(950,300);        
        console.log(agent.animations());
        agent.play('Greeting');
        agent.play('Wave');
        agent.speak('Hola Emmanuel! Ya configuraste correctamente los conceptos de nómina?');
        agent.play('Explain');       
        agent.gestureAt(200,200);       
        agent.play('GetTechy');
        agent.play('IdleHeadScratch');        
        setTimeout(function(){
            agent.speak('No quiero mas cambiaderas ok???, saludos!');
            agent.play('IdleEyeBrowRaise');
            agent.gestureAt(200,200);
        },2000);
    });

    $("#offcanvasReporte").offcanvas('show').on('hidden.bs.offcanvas',function(ev){
        var clip =$(".clippy");
        clip.remove();
    });*/

    $("#offcanvasReporte").offcanvas('show');
}

function ReporteImpuestoHonduras()
{
    $("#DivGrid").hide();

    mostrarCargador();

    reporteActual="ReporteImpuestoHonduras";

    $.when(ajaxCatalogo(158,"")).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            if(response=="")
            {
                showMsg("Mensaje","Sin información");

                $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');

                $("#gdPlantilla").jqxGrid({
                    autoshowfiltericon: true,
                    columns: [],
                    source: [],
                    selectionmode: 'singlerow',
                    showstatusbar: false,
                    width: '100%',
                    height:$("#divContenedorInterno").height() - 150,
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
                        $("#gdPlantilla").jqxGrid('autoresizecolumns');
                    }          
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

        $("#DivGrid").show();
        ocultarCargador();
    });
}

function ReporteListadoNomina()
{
    $("#DivGrid").hide();

    $("#btnCreateFile").hide();

    $("#BtnConsultar").show();

    $("#downloadFile").hide();

    reporteActual="ReporteListadoNomina";

    $("#lblTipoConsulta").text('Listado nómina');

    $(".ini").jqxDropDownList('uncheckAll');

    $(".cl").jqxDropDownList('clear');

    $("#offcanvasReporte").offcanvas('show');
}

function AdminVacaciones()
{
    $("#DivGrid").hide();

    mostrarCargador();

    reporteActual="AdministracionVacaciones";

    $.when(ajaxCatalogo(159,"")).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            if(response=="")
            {
                showMsg("Mensaje","Sin información");

                $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');

                $("#gdPlantilla").jqxGrid({
                    autoshowfiltericon: true,
                    columns: [],
                    source: [],
                    selectionmode: 'singlerow',
                    showstatusbar: false,
                    width: '100%',
                    height:$("#divContenedorInterno").height() - 150,
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
                        $("#gdPlantilla").jqxGrid('autoresizecolumns');
                    }          
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

        $("#DivGrid").show();
        ocultarCargador();
    });  
}

function DispersionBancomer()
{
    $("#DivGrid").hide();

    $("#btnCreateFile").show();

    $("#BtnConsultar").hide();

    $("#downloadFile").hide();

    reporteActual="DispersionBancomer";

    $("#periodo").jqxDropDownList({ checkboxes: false });

    $("#lblTipoConsulta").text('Layout Bancomer');

    $(".ini").jqxDropDownList('uncheckAll');

    $(".cl").jqxDropDownList('clear');

    $("#offcanvasReporte").offcanvas('show');
}

function DispLayout(id)
{
    $("#DivGrid").hide();

    $("#btnCreateFile").show();

    $("#downloadFile").hide();

    $("#BtnConsultar").hide();
   
    $(".ini").jqxDropDownList('uncheckAll');

    $(".cl").jqxDropDownList('clear');

    idLayout=id;

    switch(id)
    {
        case 134:
            reporteActual="Davivienda Pagos Interbancarios (TXT)";
            tipo="txt";
            break;
        case 138:
            reporteActual="Davivienda Pagos Interbancarios (CSV)";
            tipo="csv";
            break;
        case 135:
            reporteActual="Davivienda Transferencias Exterior (TXT)";
            tipo="txt";
            break;
        case 139:
            reporteActual="Davivienda Transferencias Exterior (CSV)";
            tipo="csv";
            break;  
        case 136:
            reporteActual="Ficosha (TXT)";
            tipo="txt";
            break;
        case 140:
            reporteActual="Ficosha (CSV)";
            tipo="csv";
            break;  
        case 137:
            reporteActual="Bancaria popular (TXT)";
            tipo="txt";
            break;
        case 141:
            reporteActual="Bancaria popular (CSV)";
            tipo="csv";
            break;                                
    }

    $("#lblTipoConsulta").text(reporteActual);

    $("#offcanvasReporte").offcanvas('show');
}

async function Plantilla()
{
    mostrarCargador();

    $("#DivGrid").hide();

    $(".ini").jqxDropDownList('uncheckAll');

    $(".cl").jqxDropDownList('clear');

    reporteActual="Plantilla";

    CombosPlantilla().then(r=>{       
        ocultarCargador(); 
        $("#offcanvasPlantilla").offcanvas('show');               
    });
}

function GetIds(combo)
{
    let ids="";
    var items = $("#" + combo).jqxDropDownList('getCheckedItems');
    if(combo=="periodo" && reporteActual=="DispersionBancomer")
    {
        ids=$("#periodo").val().toString();
        return ids;
    }
    else
    {
        if(items!=undefined && items.length>0)
        {
            if(combo=="periodo")
            {
                $.each(items,function(i,item){
                    if(item.value!='*')
                    {
                        let valor = item.value.toString();
                        valor = valor.split('»')[0];
                        ids+=valor+",";
                    }
                });
            }
            else
            {
                $.each(items,function(i,item){
                    if(item.value!='*')
                    {
                        ids+=item.value+",";
                    }
                });
            }
    
            return ids.substring(0,ids.length-1);
        }
        else
        {
            return "";
        }
    }
}

function check(event,nomCombo)
{
    if (event.args.value === "*") {
        if (event.args.checked) {
            $("#" + nomCombo).jqxDropDownList('checkAll');
        }
        else {
            $("#" + nomCombo).jqxDropDownList('uncheckAll');
        }
    }
}

function checkPlantilla(event,nomCombo)
{
    if (event.args.label === "*") {
        if (event.args.checked) {
            $("#" + nomCombo).jqxDropDownList('checkAll');
        }
        else {
            $("#" + nomCombo).jqxDropDownList('uncheckAll');
        }
    }
}

async function fillComboMultiple(id, divCombo, params,indice) {
    let _data = {
        "API": "0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1",
        "Parameters": "?_Id=" + id + "&_Domain={d}" + params,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer": ""
    }

    var settings = {
        "url": "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        "method": "POST",
        "crossDomain": true,
        "contentType": "application/json; charset=utf-8",
        "dataType": "json",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(_data),
    };

    $.ajax(settings).done(function (response) {
        try 
        {
            //agregar el 'Todos' para seleccionar todos los registros
            let newResp = new Array();
            newResp.push({Valor:"*",Descripcion:'*',uid:0});
            $.each(response,function(i,row){
                newResp.push({Valor:row.Valor,Descripcion:row.Descripcion,uid:i+1});
            });

            //console.log(divCombo,newResp);
            var dataAdapter = new $.jqx.dataAdapter(newResp);

            $("#" + divCombo + "").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });

            setTimeout(function() { 
                $("#" + divCombo + "").jqxDropDownList('checkIndex', indice);
                $("#" + divCombo + "").trigger('close');
            },1000);

        } catch (error) {
            ocultarCargador();
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        ocultarCargador();
    });
}

async function fillCombo(id, divCombo, params) {
    let _data = {
        "API": "0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1",
        "Parameters": "?_Id=" + id + "&_Domain={d}" + params,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer": ""
    }

    var settings = {
        "url": "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        "method": "POST",
        "crossDomain": true,
        "contentType": "application/json; charset=utf-8",
        "dataType": "json",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        },
        "data": JSON.stringify(_data),
    };

    $.ajax(settings).done(function (response) {
        //llenar combo con puros elementos de historia
        var dataAdapter = new $.jqx.dataAdapter(response,
            {
                beforeLoadComplete:function(records){
                    var nuevo = new Array();
                    $.each(records,function(i,elem){
                        if(elem.Valor.toString().indexOf("Historia")>=0)
                        {
                            nuevo.push(elem);
                        }
                    });

                    return nuevo;
                }
            }
        );

        $("#" + divCombo + "").jqxDropDownList({
            source: dataAdapter,
            displayMember: "Descripcion",
            valueMember: "Valor",
            placeHolder:"--Seleccione--"                
        });

    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        ocultarCargador();
    });
}

async function fillComboPlantilla(id,divCombo,params,indice)
{
    params = JSON.parse(params);

    var json = new Object();
    json.op=id;
    json.idgrupoempresarial = params.idgrupoempresarial;
    json.idrazonsocial = params.idrazonsocial;
    json.idregistropatronal = params.idregistropatronal;
    json.idlocalidadsucursal = params.idlocalidadsucursal;
    json.idclasenomina=params.idclasenomina;
    json.estatus=params.estatus;

    var obj = new Object();
    obj.API="5D7C69F8B8805CA813571EE35EEC2F72C3773C4265A366A0FC97B44017DE8E57";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) 
    {
        try 
        {
            console.log(divCombo,response);
            var dataAdapter = new $.jqx.dataAdapter(response.Table);

            $("#" + divCombo + "").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });

            setTimeout(function() { 
                $("#" + divCombo + "").jqxDropDownList('checkIndex', indice);
                $("#" + divCombo + "").trigger('close');
            },1000);

        } catch (error) {
            ocultarCargador();
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        ocultarCargador();
    });
}

function DescargaExcel() {
    if(reporteActual!="")
    {
        mostrarCargador();
        setTimeout(() => {
            const rows = $("#gdPlantilla").jqxGrid('getRows');
            if (rows.length > 0) {
                WriteExcel(rows, reporteActual);
            }
            ocultarCargador();
        }, 1000);
    }
    else
    {
        showMsg("Mensaje","Por favor seleccione algún reporte para exportar información");
    }
}

function DoReporte()
{
    if(GetIds('grupo')=="")
    {
        showMsg("Mensaje","Por favor seleccione uno o varios grupos empresariales");
    }
    else
    {
        if(GetIds('razon')=="")
        {
            showMsg("Mensaje","Por favor seleccione una o varias razones sociales");
        }
        else
        {
            if(GetIds('registro')=="")
            {
                showMsg("Mensaje","Por favor seleccione uno o varios registros patronales ");
            }
            else
            {
                if(GetIds('localidad')=="")
                {
                    showMsg("Mensaje","Por favor seleccione una o varias localidades");
                }
                else
                {
                    if(GetIds('esquema')=="")
                    {
                        showMsg("Mensaje","Por favor seleccione uno o varios esquemas de pago");
                    }
                    else
                    {
                        if(GetIds('periodicidad')=="")
                        {
                            showMsg("Mensaje","Por favor seleccione una o varias periodicidades");
                        }
                        else
                        {
                            if(GetIds('anio')=="")
                            {
                                showMsg("Mensaje","Por favor seleccione uno o varios años");
                            }
                            else
                            {
                                if(GetIds('periodo')=="")
                                {
                                    showMsg("Mensaje","Por favor seleccione uno o varios periodos");                                   
                                }
                                else
                                {
                                    mostrarCargador();
                                    $("#offcanvasReporte").offcanvas('hide');
                                    var json=new Object();
                                    var apiId="";

                                    switch(reporteActual)
                                    {
                                        case "ReporteExentoGravado":
                                            json.idgrupoempresarial = GetIds('grupo');
                                            json.idrazonsocial = GetIds('razon');
                                            json.idregistropatronal = GetIds('registro');
                                            json.idlocalidadsucursal = GetIds('localidad');
                                            json.idclasenomina=GetIds('esquema');
                                            json.idtipoperiodo = GetIds('periodicidad'); 
                                            json.ano = GetIds('anio');
                                            json.idcontrolnomina=GetIds('periodo');

                                            apiId="C1E6A5A790FB3CD8F72EFA800246F0C93CCC677354EFB4F726EECE3569EFB08A";
                                            break;
                                        
                                        case "ReporteListadoNomina":
                                            json.nominas=GetIds('periodo');

                                            apiId="5327AB582004A70F6065B485941BE22C9D0C93E63D8863C63DD7BFDD4A88CC1D";
                                            break;
                                                                                    
                                        default:
                                            break;
                                    }

                                    console.log(json);

                                    var obj = new Object();
                                    obj.API=apiId;
                                    obj.Parameters="";
                                    obj.JsonString=JSON.stringify(json);
                                    obj.Hash= getHSH();
                                    obj.Bearer= getToken();
                                    
                                    $.when(ajaxTokenFijo(obj)).done(function (res) {
                                        console.log(res);
                                        if(res)
                                        {
                                            if(res.Table)
                                            {                                                
                                                armaGrid(res.Table);
                                            }
                                        }
                                        $("#DivGrid").show();
                                        ocultarCargador();
                                    }).fail(function(){
                                        console.log("Ocurrió un error al obtener la consulta");
                                        ocultarCargador();
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

function DoReporteLayout(json,apiId,tipo)
{
    var obj = new Object();
    obj.API=apiId;
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res)
        {
            if(res.Table)
            {
                let texto="";
                $.each(res.Table,function(i,elem)
                {
                    if(reporteActual=="DispersionBancomer")
                    {
                        texto+=elem.layout + "\n";
                    }
                    else
                    {
                        texto+=elem.Column1 + "\n";
                    }
                });
 
                $("#txtBlob").val(texto);

                var link = document.getElementById('downloadFile');

                link.download = reporteActual + "." + tipo;

                if(tipo=="txt")
                {
                    link.href = window.URL.createObjectURL(new Blob([texto], { type: 'text/plain' })); 
                }

                if(tipo=="csv")
                {
                    link.href = window.URL.createObjectURL(new Blob([texto], { type: 'text/csv' }));
                }

                link.style.display = 'inline-block';
               
            }
        }
        ocultarCargador();
    }).fail(function(){
        console.log("Ocurrió un error al obtener la dispersión");
        ocultarCargador();
    });
}

function DoPlantilla()
{
    if(GetIds('grupoPlantilla')=="")
    {
        showMsg("Mensaje","Por favor seleccione uno o varios grupos empresariales");
    }
    else
    {
        if(GetIds('razonPlantilla')=="")
        {
            showMsg("Mensaje","Por favor seleccione una o varias razones sociales");
        }
        else
        {
            if(GetIds('registroPlantilla')=="")
            {
                showMsg("Mensaje","Por favor seleccione uno o varios registros patronales ");
            }
            else
            {
                if(GetIds('localidadPlantilla')=="")
                {
                    showMsg("Mensaje","Por favor seleccione una o varias localidades");
                }
                else
                {
                    if(GetIds('esquemaPlantilla')=="")
                    {
                        showMsg("Mensaje","Por favor seleccione uno o varios esquemas de pago");
                    }
                    else
                    {
                        if(GetIds("estatusPlantilla")=="")
                        {
                            showMsg("Mensaje","Por favor seleccione uno o varios estatus");
                        }
                        else
                        {
                            mostrarCargador();
                            $("#offcanvasPlantilla").offcanvas('hide');
                            var json=new Object();
                            var apiId="";
    
                            switch(reporteActual)
                            {
                                case "Plantilla":
                                    json.op="10";
                                    json.idgrupoempresarial = GetIds('grupoPlantilla');
                                    json.idrazonsocial = GetIds('razonPlantilla');
                                    json.idregistropatronal = GetIds('registroPlantilla');
                                    json.idlocalidadsucursal = GetIds('localidadPlantilla');
                                    json.idclasenomina=GetIds('esquemaPlantilla');
                                    json.estatus=GetIds('estatusPlantilla');
    
                                    apiId="5D7C69F8B8805CA813571EE35EEC2F72C3773C4265A366A0FC97B44017DE8E57";
                                    break;
                                                                                                        
                                default:
                                    break;
                            }
    
                            console.log(json);
    
                            var obj = new Object();
                            obj.API=apiId;
                            obj.Parameters="";
                            obj.JsonString=JSON.stringify(json);
                            obj.Hash= getHSH();
                            obj.Bearer= getToken();
                            
                            $.when(ajaxTokenFijo(obj)).done(function (res) {
                                console.log(res);
                                if(res)
                                {
                                    if(res.Table)
                                    {                                                
                                        armaGrid(res.Table);
                                    }
                                }
                                $("#DivGrid").show();
                                ocultarCargador();
                            }).fail(function(){
                                console.log("Ocurrió un error al obtener la consulta");
                                ocultarCargador();
                            });
                        }
                    }
                }
            }
        }   
    }
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
                columntype: 'string',
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
        selectionmode: 'singlerow',
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
            $("#gdPlantilla").jqxGrid('autoresizecolumns');
        }
    });

    $('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});

    ocultarCargador();
}
