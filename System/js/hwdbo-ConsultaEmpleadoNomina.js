var tipoConsulta;

$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";
    
    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, 
    filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", checkboxes: true, openDelay: 0, animationType: 'none'
    }).on('checkChange',function(ev){
        check(ev,$(this)[0].id);
    }); 

    $(".hwdbo-combo-simple").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, 
    filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", openDelay: 0, animationType: 'none', 
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

    $("#razon").on('close',function(ev){
        let ids=GetIds('razon');
        if(ids!="")
        {
            fillComboMultiple(137, 'registro', "&_Parameters='" + ids +"'",0);
        }
    });

    $("#registro").on('close',function(ev){
        let ids=GetIds('registro');
        if(ids!="")
        {
            fillComboMultiple(138, 'localidad', "&_Parameters='" + ids +"'",0);
        }
    });

    $("#localidad").on('close',function(ev){
        let ids=GetIds('razon');
        if(ids!="")
        {
            fillComboMultiple(139, 'esquema', "&_Parameters='" + ids +"'",0);
        }
    });

    $("#esquema").on('close',function(ev){
        let ids1=GetIds('grupo');
        let ids2=GetIds('razon');
        if(ids1 !="" && ids2!="")
        {
            fillComboMultiple(157, 'periodicidad', "&_Parameters='" + ids1 +"','"+ids2+"'",1);
        }
    });

    $("#periodicidad").on('close',function(ev){
        let ids1=GetIds('periodicidad');
        let ids2=GetIds('grupo');
        if(ids1 !="" && ids2!="")
        {
            fillComboMultiple(141, 'periodo', "&_Parameters='" + ids1 +"','"+ids2+"'",1);
            setTimeout(function() { 
                $("#anio").jqxDropDownList('checkIndex', 1);
            },1000);
            setTimeout(function() { 
                ocultarCargador();
            },2000);
        }
    });

    $("#periodicidad1").on('change',function(ev){
        mostrarCargador();
        let ids1=$('#periodicidad1').val();
        let ids2=GetIds('grupo1');
        if(ids1 !="" && ids2!="")
        {           
            fillCombo(141, 'periodo1', "&_Parameters='" + ids1 +"','"+ids2+"'",1);
            setTimeout(function() { 
                $("#anio").jqxDropDownList('checkIndex', 1);
            },1000);
            setTimeout(function() { 
                ocultarCargador();
            },2000);
        }
        ocultarCargador();
    });

    $(".accordion").hide();
    
});

async function Combos() {    
    const grupo = await fillComboMultiple(98, 'grupo', '',-1);
    const grupo1 = await fillComboMultiple(98, 'grupo1', '',-1);
    const años = await fillComboMultiple(140, 'anio', '',-1);
    const periodopago = await fillComboMultiple(13, 'periodicidad', '',-1);
    const periodopago1 = await fillCombo(13, 'periodicidad1', '',-1);
}

function Consulta(id)
{
    tipoConsulta=id;
    let nombre="";
    let nomcanvas="";
    $("#accordionExample").hide();
    switch(id)
    {
        case 1:
            nombre="Consulta general";
            nomcanvas="offcanvasConsulta";
            $("#lblTipoConsulta").text(nombre);
            break;
        case 2:
            nombre="Consulta detallada";
            nomcanvas="offcanvasConsulta";
            $("#lblTipoConsulta").text(nombre);
            break;  
        case 3:
            nombre="Consulta empleado";
            nomcanvas="offcanvasConsultaEmpleado";
            $("#lblTipoConsulta1").text(nombre);
            break;
        case 4:
            nombre="Consulta empleado detallada";
            nomcanvas="offcanvasConsultaEmpleado";
            $("#lblTipoConsulta1").text(nombre);
            break;  
    }

    $(".ini").jqxDropDownList('uncheckAll');
    $(".cl").jqxDropDownList('clear');
    $("#" + nomcanvas).offcanvas('show');
    $("#BtnRegresar").hide();
}

function DoConsulta()
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
                                    let razon = GetIds('razon');
                                    let registro=GetIds('registro');
                                    let localidad=GetIds('localidad');
                                    let esquema = GetIds('esquema');
                                    let periodo = GetIds('periodo');
                                    let tipo = tipoConsulta==1?"1":"0";
                                    $("#Empleado").hide();

                                    var obj = new Object();
                                    obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
                                    obj.Parameters="?_Id=142&_Domain={d}&_Parameters=" + tipo + ",'"+razon+"','"+registro+"','"+localidad+"','"+esquema+"','"+periodo+"'";
                                    obj.JsonString="";
                                    obj.Hash= getHSH();
                                    obj.Bearer= getToken();
                                    
                                    $.when(ajaxTokenFijo(obj)).done(function (res) {
                                        if(res.length>0)
                                        {
                                            if(res[0].Percepciones)
                                            {
                                                $("#DivPer").html('<div id="GridPer"></div>');
                                                armaGrid(res[0].Percepciones,'GridPer',true,false,true,'100%',false);
                                            }

                                            if(res[0].Deducciones)
                                            {
                                                $("#DivDed").html('<div id="GridDed"></div>');
                                                armaGrid(res[0].Deducciones,'GridDed',true,false,true,'100%',false);
                                            }

                                            if(res[0].Aportaciones)
                                            {
                                                $("#DivAp").html('<div id="GridAp"></div>');
                                                armaGrid(res[0].Aportaciones,'GridAp',true,false,true,'100%',false);
                                            }

                                            if(res[0].Totales)
                                            {
                                                $("#DivTotales").html('<div id="GridTotales"></div>');
                                                armaGrid(res[0].Totales,'GridTotales',false,false,false,'228',false);
                                            }

                                            $("#offcanvasConsulta").offcanvas('hide');
                                            $(".accordion").show();
                                            ocultarCargador();
                                        }
                                        else
                                        {
                                            showMsg("Mensaje","Ocurrió un error al obtener la consulta con los parámetros seleccionados");
                                        }
                                        ocultarCargador();

                                    }).fail(function(){
                                        console.log("Ocurrió un error al obtener la consulta");
                                        showMsg("Mensaje","Ocurrió un error al obtener la consulta");
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

function DoConsultaEmpleado()
{
    if(GetIds('grupo1')=="")
    {
        showMsg("Mensaje","Por favor seleccione uno o varios grupos empresariales");
    }
    else
    {
        if($('#periodicidad1').val()=="")
        {
            showMsg("Mensaje","Por favor seleccione una periodicidad");
        }
        else
        {
            if($("#periodo1").val()=="")
            {
                showMsg("Mensaje","Por favor seleccione un periodo");
            }
            else
            {
                mostrarCargador();
                let periodo1 = $('#periodo1').val();
                let tipo1 = tipoConsulta==3?"1":"0";

                var obj = new Object();
                obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
                obj.Parameters="?_Id=143&_Domain={d}&_Parameters='" + periodo1+"'";
                obj.JsonString="";
                obj.Hash= getHSH();
                obj.Bearer= getToken();

                $.when(ajaxTokenFijo(obj)).done(function (res) 
                {
                    if(res!="")
                    {
                        $("#DivEmpleado").html('<div id="GridEmpleado" style="margin-top:1%"></div>');
                        armaGridEmpleado(res,'GridEmpleado',true,true,true,$("#divContenedorInterno").height()-150,false);
                        $("#offcanvasConsultaEmpleado").offcanvas('hide');
                        $("#DivEmpleado").show();
                        $(".accordion").hide();
                        $("#BtnRegresar").hide();
                        $("#GridEmpleado").on('rowdoubleclick',function(ev){
                            mostrarCargador();
                            let datos = ev.args.row.bounddata;
                            let NumEmp = datos.Empleado;

                            var obj = new Object();
                            obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
                            obj.Parameters="?_Id=144&_Domain={d}&_Parameters=" + tipo1 + ",'"+periodo1+"',"+NumEmp;
                            obj.JsonString="";
                            obj.Hash= getHSH();
                            obj.Bearer= getToken();
                            $.when(ajaxTokenFijo(obj)).done(function (res) 
                            {
                                if(res=='No existe el catálogo. ')
                                {
                                    $("#DivDatosEmp").html('<div id="GridEmpleado" style="margin-top:1%"></div>');
                                    $("#DivPer").html('<div id="GridPer"></div>');
                                    $("#DivDed").html('<div id="GridDed"></div>');
                                    $("#DivAp").html('<div id="GridAp"></div>');
                                    $("#offcanvasConsultaEmpleado").offcanvas('hide');
                                    $(".accordion").hide();
                                    $("#BtnRegresar").hide();
                                    showMsg("Mensaje","No fue posible obtener la información del empleado");
                                }
                                else if(res.length>0)
                                {
                                    //$("#DivEmpleado").html('');
                                    $("#DivEmpleado").hide();

                                    if(res[0].DatosGenerales)
                                    {
                                        ArmaDatosEmpleado(res[0].DatosGenerales[0]);
                                        $("#Empleado").show();
                                    }

                                    if(res[0].Percepciones)
                                    {
                                        $("#DivPer").html('<div id="GridPer"></div>');
                                        armaGrid(res[0].Percepciones,'GridPer',true,false,true,'300',true);
                                    }
            
                                    if(res[0].Deducciones)
                                    {
                                        $("#DivDed").html('<div id="GridDed"></div>');
                                        armaGrid(res[0].Deducciones,'GridDed',true,false,true,'300',true);
                                    }
            
                                    if(res[0].Aportaciones)
                                    {
                                        $("#DivAp").html('<div id="GridAp"></div>');
                                        armaGrid(res[0].Aportaciones,'GridAp',true,false,true,'300',true);
                                    }
            
                                    if(res[0].Totales)
                                    {
                                        $("#DivTotales").html('<div id="GridTotales"></div>');
                                        armaGrid(res[0].Totales,'GridTotales',false,false,false,'228',false);
                                    }

                                    $("#offcanvasConsultaEmpleado").offcanvas('hide');
                                                        
                                    $(".accordion").show();

                                    $("#BtnRegresar").show();
            
                                    ocultarCargador();
                                }
                                else
                                {
                                    showMsg("Mensaje","Ocurrió un error al obtener la consulta con los parámetros seleccionados");
                                }
                                ocultarCargador();
                            }).fail(function(){
                                console.log("Ocurrió un error al obtener la consulta");                   
                                ocultarCargador();
                            });
                        });
                    }
                    ocultarCargador();

                }).fail(function(){
                    console.log("Ocurrió un error al obtener la consulta");                   
                    ocultarCargador();
                });
            }
        }
    }
}

function GetIds(combo)
{
    let ids="";
    var items = $("#" + combo).jqxDropDownList('getCheckedItems'); 
    if(items!=undefined && items.length>0)
    {
        $.each(items,function(i,item){
            if(item.value!='*')
            {
                ids+=item.value+",";
            }
        });
        return ids.substring(0,ids.length-1);
    }
    else
    {
        return "";
    }
}

function armaGrid(_data,nomGrid,filtro,pagina,barra,altura,auto) {

    let _columns = [];
    let _jsonData = [];

    let titulosGrid = Object.keys(_data[0]);    
    $.each(titulosGrid, function (index, element) {
        if(element=="Importe")
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '13%',
                cellsalign:'right',
                align:'center',
                cellsformat: 'c2',
                aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { var ntotal = currentValue.split('$')[1].replaceAll(",",""); var total = parseFloat(ntotal).toFixed(2); var agg=aggregatedValue.toFixed(2); return Number(agg) + Number(total) } }]
            });
        }
        else if(element=="Gravable")
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '13%',
                cellsalign:'right',
                align:'center',
                cellsformat: 'c2',
                aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { var ntotal = currentValue.split('$')[1].replaceAll(",",""); var total = parseFloat(ntotal).toFixed(2); var agg=aggregatedValue.toFixed(2); return Number(agg) + Number(total) } }]
            });
        }
        else if(element=="Exento")
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '13%',
                cellsalign:'right',
                align:'center',
                cellsformat: 'c2',
                aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { var ntotal = currentValue.split('$')[1].replaceAll(",",""); var total = parseFloat(ntotal).toFixed(2); var agg=aggregatedValue.toFixed(2); return Number(agg) + Number(total) } }]
            });
        }
        else if(element=="Totales")
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: 150,
                cellsalign:'right',
                align:'center'
            });
        }
        else if(element=="Tipo")
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: 150,
                cellsalign:'left',
                align:'center'
            });
        }
        else if(element=="Descripcion" || element=="Descripción")
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '40%',
                cellsalign:'left',
                align:'center'
            });
        }
        else
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '9%',
                cellsalign:'center',
                align:'center'
            });
        }
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

    $("#" + nomGrid).jqxGrid({
        columns: _columns,
        source: dataAdapter,
        width: '100%',
        autoheight:true,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: filtro,
        autoshowfiltericon: filtro,
        showfiltermenuitems: filtro,
        filterable: filtro,
        pageable: pagina,
        pagesizeoptions: [_jsonData.length],
        pagesize: _jsonData.length,
        showaggregates: barra,
        showstatusbar:barra, 
        statusbarheight: 35,
        ready:function(){
            $("#" + nomGrid).jqxGrid('updatebounddata');
            setTimeout(function(){
                $("#" + nomGrid).jqxGrid('hidecolumn','NumEmpleado');
                $("#" + nomGrid).jqxGrid('hidecolumn','Id_Ocupacion');
                $("#" + nomGrid).jqxGrid('hidecolumn','Id_Concepto');
                $("#" + nomGrid).jqxGrid('hidecolumn','Id_ConceptoGenerico');
                $("#" + nomGrid).jqxGrid('hidecolumn','NumPlaza');
            },500);
            if(auto==true)
            {
                $("#" + nomGrid).jqxGrid('autoresizecolumns');
                setTimeout(function(){ 
                    $("#" + nomGrid).jqxGrid('setcolumnproperty','Importe','width','13%');
                    $("#" + nomGrid).jqxGrid('setcolumnproperty','Gravable','width','13%');
                    $("#" + nomGrid).jqxGrid('setcolumnproperty','Exento','width','13%');
                    $("#" + nomGrid).jqxGrid('setcolumnproperty','Descripcion','width','30%');
                    $("#" + nomGrid).jqxGrid('setcolumnproperty','Descripción','width','30%');
                },500);
            }
        },
    });

    if(auto==true)
    {
        setTimeout(function(){ 
            $("#" + nomGrid).jqxGrid('setcolumnproperty','Importe','width','13%');
            $("#" + nomGrid).jqxGrid('setcolumnproperty','Gravable','width','13%');
            $("#" + nomGrid).jqxGrid('setcolumnproperty','Exento','width','13%');
            $("#" + nomGrid).jqxGrid('setcolumnproperty','Descripcion','width','30%');
            $("#" + nomGrid).jqxGrid('setcolumnproperty','Descripción','width','30%');
        },500);
    }

    setTimeout(function(){
        $("#" + nomGrid).jqxGrid('hidecolumn','NumEmpleado');
        $("#" + nomGrid).jqxGrid('hidecolumn','Id_Ocupacion');
        $("#" + nomGrid).jqxGrid('hidecolumn','Id_Concepto');
        $("#" + nomGrid).jqxGrid('hidecolumn','Id_ConceptoGenerico');
        $("#" + nomGrid).jqxGrid('hidecolumn','TipoConcepto');
    },500);

    return false;
}

function armaGridEmpleado(_data,nomGrid,filtro,pagina,barra,altura,auto) {

    let _columns = [];
    let _jsonData = [];

    let titulosGrid = Object.keys(_data[0]);    
    $.each(titulosGrid, function (index, element) {
        if(element=="RFC" || element=="CURP" || element=="Nombre")
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '16%',
                cellsalign:'left',
                align:'center'
            });
        }
        else if(element=='Apellido1')
        {
            _columns.push({
                text: 'Paterno',
                datafield: textotodatafield(element),
                type: 'string',
                width: '15%',
                cellsalign:'left',
                align:'center'
            });
        }
        else if(element=='Apellido2')
        {
            _columns.push({
                text: 'Materno',
                datafield: textotodatafield(element),
                type: 'string',
                width: '15%',
                cellsalign:'left',
                align:'center'
            });
        }
        else
        {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '11%',
                cellsalign:'center',
                align:'center'
            });
        }
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

    $("#" + nomGrid).jqxGrid({
        columns: _columns,
        source: dataAdapter,
        width: '100%',
        height:altura,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: filtro,
        autoshowfiltericon: filtro,
        showfiltermenuitems: filtro,
        filterable: filtro,
        pageable: pagina,
        pagesizeoptions: [_jsonData.length],
        pagesize: _jsonData.length,
        showaggregates: barra,
        showstatusbar:barra, 
        statusbarheight: 35,
        ready:function(){
            $("#" + nomGrid).jqxGrid('updatebounddata');
            if(auto==true)
            {
                $("#" + nomGrid).jqxGrid('autoresizecolumns');
            }
        },
    });

    return false;
}

function check(event,nomCombo)
{
    if (event.args.label === "Todos") {
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
            //console.log(divCombo,response);
            let newResp = new Array();
            newResp.push({Valor:"*",Descripcion:'Todos',uid:0});
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

            if(indice>=0)
            {
                setTimeout(function() { 
                    $("#" + divCombo + "").jqxDropDownList('checkIndex', indice);
                    $("#" + divCombo + "").trigger('close');
                },1000);
            }

        } catch (error) {
            ocultarCargador();
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        //console.error('ERROR EN LA FUNCION -> ' + divCombo);
        ocultarCargador();
    });
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
        var wb = XLSX.utils.book_new();
        
        wb.Props = {
            Title: "ResumenNomina",
            Subject: "Resumen de Nómina",
            Author: "GrupoGSMéxico",
            CreatedDate: new Date()
        };

        if($("#GridPer").length>0)
        {            
            const rowsPer = $("#GridPer").jqxGrid('getRows');
            console.log(rowsPer);
            if (rowsPer.length > 0) {
                var rp=new Array();
                if(tipoConsulta==3 || tipoConsulta==4)
                {
                    $.each(rowsPer,function(i,row){
                        rp.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe, Gravable:row.Gravable, Exento:row.Exento,Unidades:row.Unidades,Periodo:row.Periodo,TipoCalculo:row.TipoCalculo});
                    });
                }
                else
                {
                    $.each(rowsPer,function(i,row){
                        rp.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe});
                    });
                }

                wb.SheetNames.push("Percepción");
                var ws_data = rp;
                var ws = XLSX.utils.json_to_sheet(ws_data);
                wb.Sheets["Percepción"] = ws;                
            }
        }
        if($("#GridDed").length>0)
        {
            const rowsDed = $("#GridDed").jqxGrid('getRows');
            if (rowsDed.length > 0) {
                var rd=new Array();
                if(tipoConsulta==3 || tipoConsulta==4)
                {
                    $.each(rowsDed,function(i,row){
                        rd.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe, Gravable:row.Gravable, Exento:row.Exento,Unidades:row.Unidades,Periodo:row.Periodo,TipoCalculo:row.TipoCalculo});
                    });
                }
                else
                {
                    $.each(rowsDed,function(i,row){
                        rd.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe});
                    });
                }
                wb.SheetNames.push("Deducción");
                var ws_data = rd;
                var ws = XLSX.utils.json_to_sheet(ws_data);
                wb.Sheets["Deducción"] = ws;
            }
        }
        if($("#GridAp").length>0)
        {
            const rowsAp = $("#GridAp").jqxGrid('getRows');
            if (rowsAp.length > 0) {
                var ra=new Array();
                if(tipoConsulta==3 || tipoConsulta==4)
                {
                    $.each(rowsAp,function(i,row){
                        ra.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe, Gravable:row.Gravable, Exento:row.Exento,Unidades:row.Unidades,Periodo:row.Periodo,TipoCalculo:row.TipoCalculo});
                    });
                }
                else
                {
                    $.each(rowsAp,function(i,row){
                        ra.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe});
                    });
                }

                wb.SheetNames.push("Aportación");
                var ws_data = ra;
                var ws = XLSX.utils.json_to_sheet(ws_data);
                wb.Sheets["Aportación"] = ws;
            }
        }
        if($("#GridTotales").length>0)
        {
            const rowsTot = $("#GridTotales").jqxGrid('getRows');
            if (rowsTot.length > 0) {
                var rt=new Array();
                $.each(rowsTot,function(i,row){
                    rt.push({Tipo:row.Tipo,Totales:row.Totales});
                });
                wb.SheetNames.push("Totales");
                var ws_data = rt;
                var ws = XLSX.utils.json_to_sheet(ws_data);
                wb.Sheets["Totales"] = ws;
            }
        }

        try
        {
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream"' }), "ResumenNomina" + '.xlsx');
        }
        catch{}

		ocultarCargador();
	}, 1000);
}

function ArmaDatosEmpleado(emp)
{
    let llaves= Object.keys(emp);       
    let html="<div class=\"col-md-12\" style=\"margin-left:1%;margin-top:1%;width:99%\">";
    html+="<dl class=\"row\">";
    $.each(llaves,function(i,em){
        html+="<dt class=\"col-sm-2\">" + em + ":</dt>";
        html+= "<dd class=\"col-sm-4\">" + emp[em] + "</dd>";
    });
    html+="</dl>";
    html+="</div>";

    $("#DivDatosEmp").html(html);
}

function Regresar()
{
    $("#DivEmpleado").show();
    $(".accordion").hide();
    $("#BtnRegresar").hide();
}