var cambios=false;
var arregloCambios=new Array();

$(document).ready(function () {

    $.jqx.theme = "light";

    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px',todayString: '', clearString: '' });

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 

    Inicio();
   
});

function Inicio()
{
    $("#BtnPlantilla").addClass('selected');

    $("#BtnConsulta").removeClass('selected');

    $(".inicio").attr('disabled','disabled');   

    $("#BtnSimulacion").removeAttr('disabled');

    $("#BtnConsulta").removeAttr('disabled');

    GetGrid();

    GetCombo("1","Id_TipoFecha","0");

    GetCombo("2","Id_TipoFiniquito ","0");

    GetCombo("3","Id_TipoBaja","0");

}

function GetGrid()
{
    mostrarCargador();
    var opt=new Object();
    opt.op="0";
    opt.numempleado="0";

    var obj = new Object();
    obj.API="CBF78E8BBD22BEB2780375F3161FE94B513EC1EF653F6C92D55A4858AC10F38B";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(opt);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        if (response != null && response != '') {
            armaGrid(response,"DivGrid","gdPlantilla");
        }
        else 
        {
            showMsg('Advertencia','No se encontraron registros.');
        }
        ocultarCargador();
    }).fail(function(){
        showMsg('Advertencia','No se encontraron registros.');
        ocultarCargador();
    });
}

function ConsultaFiniquitos()
{
    mostrarCargador();
    $("#BtnPlantilla").removeClass('selected');
    $("#BtnConsulta").addClass('selected');
    $(".simula").removeAttr('disabled');
    $(".recibos").attr('disabled','disabled');
    $("#BtnPagoRibbon").attr('disabled','disabled');
    $("#DivGrid").show();
    $("#DivDatosFiniquito").hide();
    var opt=new Object();
    opt.op="0";
    opt.idcapturafiniquito="0";

    var obj = new Object();
    obj.API="1C6583AAB49DFF27B24D80A5527DF2CCB3A18981B11C202660EA291A6EBBE790";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(opt);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        if (response != null && response != '') {
            armaGrid(response,"DivGrid","gdPlantilla",true);
        }
        else 
        {
            showMsg('Advertencia','No se encontraron registros.');
        }
        ocultarCargador();
    }).fail(function(){
        showMsg('Advertencia','No se encontraron registros.');
        ocultarCargador();
    });
}

function GetCombo(opc,divCombo,emp)
{
    var opt=new Object();
    opt.op=opc;
    //opt.numempleado=emp;

    var obj = new Object();
    obj.API="CBF78E8BBD22BEB2780375F3161FE94B513EC1EF653F6C92D55A4858AC10F38B";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(opt);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        if (response != null && response != '') {
            var dataAdapter = new $.jqx.dataAdapter(response);

            $("#" + divCombo + "").jqxDropDownList({
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

function Simulacion()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    var data0 = $('#gdPlantilla').jqxGrid('getrowdata', rows[0]);
    if(rows.length==0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios empleados para la simulación");
    }
    else
    {
        $(".hwdbo-combo").jqxDropDownList('clearSelection');
        GetCombo("1","fechabene",data0.NoEmpleado.toString());
        GetCombo("2","tipofini",data0.NoEmpleado.toString());
        GetCombo("3","tipobaja",data0.NoEmpleado.toString());
        $("#fechabaja").val('');
        $("#observaciones").val('');
        $("#offcanvasSimulacion").offcanvas('show');
    }
    
}

function armaGrid(_data,NomDiv,NomGrid,dobleclick=false) {
    
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
            if(element.indexOf('Fecha')>=0)
            {
                _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    columntype : 'datetimeinput',
                    filtertype: 'date',
                    cellsformat: 'dd/MM/yyyy',
                    width: '20%',
                    cellsalign:'center',
                    align:'center'
                });
            }
            else 
            {
                _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    columntype: 'textbox',
                    filtertype: 'textbox',
                    filtercondition: 'contains',
                    width: '20%',
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
    }

    let source = { datatype: 'json', localdata: _jsonData };

    let dataAdapter = new $.jqx.dataAdapter(source);

    $("#" + NomDiv).html('<div id=\"' + NomGrid + '\"></div>');

    let selmode=dobleclick==true?"multiplerows":"checkbox";

    $("#" + NomGrid).jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: selmode,
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
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_CapturaFiniquito');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_TipoPeriodo');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RegistroPatronal');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_RazonSocial');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_Sindicato');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_PerfilCalendario');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_Tabulador');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_Categoria');
            if(dobleclick==false)
            {
                $("#gdPlantilla").jqxGrid('hidecolumn','Estatus');
            }
            
            $("#gdPlantilla").jqxGrid('autoresizecolumns');
        }

    });

    if(dobleclick==true)
    {        
        $("#" + NomGrid).on('rowdoubleclick',function(ev){
            mostrarCargador();            
            let data = ev.args.row.bounddata;
            //console.log(data);
            
            $("#txtEstatus").val(data.Estatus);
            $("#txtNeto").val(data.Netoapagar);

            setTimeout(function(){
                if(data.Estatus!="Simulación")
                {
                    $("#BtnAutorizaGuarda").attr('disabled','disabled');
                    $("#BtnPagoRibbon").removeAttr('disabled');
                }
                else
                {
                    $("#BtnAutorizaGuarda").removeAttr('disabled');
                    $("#BtnPagoRibbon").attr('disabled','disabled');
                }
            },1000);

            var opt=new Object();
            opt.op="1";
            opt.idcapturafiniquito=data.Id_CapturaFiniquito.toString();

            var obj = new Object();
            obj.API="1C6583AAB49DFF27B24D80A5527DF2CCB3A18981B11C202660EA291A6EBBE790";
            obj.Parameters="";
            obj.JsonString=JSON.stringify(opt);
            obj.Hash= getHSH();
            obj.Bearer= getToken();
        
            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.length>0)
                {
                    $("#DivGrid").hide();
                    $("#DivDatosFiniquito").show();
                    $("#" + NomGrid).jqxGrid('clearselection');
                    let objKeys = Object.keys(response[0]);
                    $.each(objKeys, function (index, data) {
                        let htmlObj = $("#" + textotodatafield(data) + "");
                        let valor = response[0][data];
                                                
                        if (htmlObj.hasClass("hwdbo-texto")) {
                            $("#" + textotodatafield(data) + "").val(valor);
                            $("#" + textotodatafield(data) + "").attr('disabled','disabled');
                        }
                        else if (htmlObj.hasClass("hwdbo-calendario")) {
                            $("#" + textotodatafield(data) + "").jqxDateTimeInput('setDate', valor.split('T')[0]);
                            $("#" + textotodatafield(data) + "").jqxDateTimeInput({ disabled: true });
                        }
                        else if (htmlObj.hasClass("hwdbo-combo")) {           
                            setTimeout(function()
                            {
                                $("#" + textotodatafield(data) + "").val(valor);
                                if(htmlObj.hasClass("editar"))
                                {
                                    $("#" + textotodatafield(data) + "").jqxDropDownList({ disabled: false });
                                }
                                else
                                {
                                    $("#" + textotodatafield(data) + "").jqxDropDownList({ disabled: true });
                                }

                                
                            },500);
                        }
                        else if(htmlObj.hasClass("hwdbo-text-area"))
                        {
                            $("#" + textotodatafield(data) + "").val(valor);
                            $("#" + textotodatafield(data) + "").attr('disabled','disabled');
                        }
                    });
                    
                    $(".inicio").removeAttr('disabled'); 
                    $(".recibos").attr('disabled','disabled'); 

                    var opt=new Object();
                    opt.consulta="0";
                    opt.idfolio=data.Id_CapturaFiniquito.toString();
                    opt.idconcepto="0";

                    var obj = new Object();
                    obj.API="E5623BD04BA0AE0785F6B4818C0F3A7F8E38D5ACC9302BD3A9B75276FAD05AAB";
                    obj.Parameters="";
                    obj.JsonString=JSON.stringify(opt);
                    obj.Hash= getHSH();
                    obj.Bearer= getToken();

                    $.when(ajaxTokenFijo(obj)).done(function (response) {
                        if(response.Table)
                        {
                            $("#DivPer").html('<div id="GridPer"></div>');
                            armaGridC(response.Table,'GridPer',true,false,true,'300',true,true);
                        }

                        if(response.Table1)
                        {
                            $("#DivDed").html('<div id="GridDed"></div>');
                            armaGridC(response.Table1,'GridDed',true,false,true,'300',true,true);
                        }

                        if(response.Table2)
                        {
                            $("#DivAp").html('<div id="GridAp"></div>');
                            armaGridC(response.Table2,'GridAp',true,false,true,'300',true,true);
                        }

                        if(response.Table3)
                        {
                            $("#DivTotales").html('<div id="GridTotales"></div>');
                            armaGridC(response.Table3,'GridTotales',false,false,false,'228',false,false);
                        }

                        ocultarCargador();
                    }).fail(function(){
                        showMsg('Advertencia','No se encontraron registros.');
                        ocultarCargador();
                    });
                }
                else
                {
                    ocultarCargador();
                }
                
            }).fail(function(){
                showMsg('Advertencia','No se encontraron registros.');
                ocultarCargador();
            });
        });
    }
    else
    {
        $("#DivGrid").show();
        $("#DivDatosFiniquito").hide();
    }

    $("#" + NomGrid).on('bindingcomplete',function(){ $("#" + NomGrid).jqxGrid('autoresizecolumns','all');});
    $("#" + NomGrid).on('filter',function(){ $("#" + NomGrid).jqxGrid('autoresizecolumns','all');});
    $("#" + NomGrid).on('sort',function(){ $("#" + NomGrid).jqxGrid('autoresizecolumns','all');});
    $("#" + NomGrid).on('pagechanged',function(){ $("#" + NomGrid).jqxGrid('autoresizecolumns','all');});

    ocultarCargador();
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'Finiquitos');
		}
		ocultarCargador();
	}, 1000);
}

function armaGridC(_data,nomGrid,filtro,pagina,barra,altura,auto,edita) {
    let _columns = [];
    let _jsonData = [];
    
    if(_data.length >0)
    {
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
                    aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { 
                        var ntotal = currentValue.toString().indexOf('$')>=0 ? currentValue.split('$')[1].replaceAll(",",""): currentValue; 
                        var total = parseFloat(ntotal).toFixed(2); 
                        var agg=aggregatedValue.toFixed(2); 
                        return Number(agg) + Number(total); 
                    } }]
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
                    aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { 
                        var ntotal = currentValue.toString().indexOf('$')>=0 ? currentValue.split('$')[1].replaceAll(",",""): currentValue;  
                        var total = parseFloat(ntotal).toFixed(2); 
                        var agg=aggregatedValue.toFixed(2); 
                        return Number(agg) + Number(total); 
                    } }]
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
                    aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { 
                        var ntotal = currentValue.toString().indexOf('$')>=0 ? currentValue.split('$')[1].replaceAll(",",""): currentValue;  
                        var total = parseFloat(ntotal).toFixed(2); 
                        var agg=aggregatedValue.toFixed(2);
                        return Number(agg) + Number(total); 
                    } }]
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

        var botones = "<div class=\"col-md-12\" style=\"margin-top:0.5%\">";
        botones+="<button class=\"btn btn-primary btn-sm consultamovs dogrid\" style=\"margin-bottom:1%;margin-left:1%\" onclick=\"Agregar('"+nomGrid+"');\">Agregar</button>";
        botones+="<button class=\"btn btn-primary btn-sm consultamovs dogrid\" style=\"margin-bottom:1%;margin-left:2%\" onclick=\"Editar('"+nomGrid+"');\">Editar</button>";
        botones+="<button class=\"btn btn-primary btn-sm consultamovs dogrid\" style=\"margin-bottom:1%;margin-left:2%\" onclick=\"EliminarConcepto('"+nomGrid+"');\">Eliminar</button>";
        botones+="</div>";
        let modo = edita==true?"checkbox":"none";
    
        $("#" + nomGrid).jqxGrid({
            columns: _columns,
            source: dataAdapter,
            width: '100%',
            autoheight:true,
            columnsresize: true,
            columnsautoresize: true,
            scrollmode: 'logical',
            selectionmode:modo,
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
            showtoolbar:barra,
            statusbarheight: 35,
            toolbarheight:45,
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
            rendertoolbar:function(toolbar){
                if(edita==true)
                {
                    if($("#txtEstatus").val()=="Simulación")
                    {
                        toolbar.append(botones);
                    }                   
                }
            }
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
    }
    else
    {
        let titulosGrid = new Array();
        titulosGrid.push("Concepto");
        titulosGrid.push("Descripción");
        titulosGrid.push("Importe");
        titulosGrid.push("Exento");
        titulosGrid.push("Gravable");
        titulosGrid.push("Unidades");
        titulosGrid.push("Periodo");
        titulosGrid.push("Tipo cálculo");
        titulosGrid.push("Id_Concepto");
        

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
                    aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { 
                        var ntotal = currentValue.toString().indexOf('$')>=0 ? currentValue.split('$')[1].replaceAll(",",""): currentValue; 
                        var total = parseFloat(ntotal).toFixed(2); 
                        var agg=aggregatedValue.toFixed(2); 
                        return Number(agg) + Number(total); 
                    } }]
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
                    aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { 
                        var ntotal = currentValue.toString().indexOf('$')>=0 ? currentValue.split('$')[1].replaceAll(",",""): currentValue;  
                        var total = parseFloat(ntotal).toFixed(2); 
                        var agg=aggregatedValue.toFixed(2); 
                        return Number(agg) + Number(total); 
                    } }]
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
                    aggregates: [{ '<b>Total</b>': function(aggregatedValue, currentValue, column, record) { 
                        var ntotal = currentValue.toString().indexOf('$')>=0 ? currentValue.split('$')[1].replaceAll(",",""): currentValue;  
                        var total = parseFloat(ntotal).toFixed(2); 
                        var agg=aggregatedValue.toFixed(2);
                        return Number(agg) + Number(total); 
                    } }]
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

        var botones = "<div class=\"col-md-12\" style=\"margin-top:0.5%\">";
        botones+="<button class=\"btn btn-primary btn-sm consultamovs dogrid\" style=\"margin-bottom:1%;margin-left:1%\" onclick=\"Agregar('"+nomGrid+"');\">Agregar</button>";
        botones+="<button class=\"btn btn-primary btn-sm consultamovs dogrid\" style=\"margin-bottom:1%;margin-left:2%\" onclick=\"Editar('"+nomGrid+"');\">Editar</button>";
        botones+="<button class=\"btn btn-primary btn-sm consultamovs dogrid\" style=\"margin-bottom:1%;margin-left:2%\" onclick=\"EliminarConcepto('"+nomGrid+"');\">Eliminar</button>";
        botones+="</div>";

        $("#" + nomGrid).jqxGrid({
            columns: _columns,
            source: [],
            width: '100%',
            autoheight:true,
            columnsresize: true,
            columnsautoresize: true,
            scrollmode: 'logical',
            selectionmode:'checkbox',
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
            showtoolbar:barra,
            statusbarheight: 35,
            toolbarheight:45,
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
            rendertoolbar:function(toolbar){
                if(edita==true)
                {
                    if($("#txtEstatus").val()=="Simulación")
                    {
                        toolbar.append(botones);
                    }
                }
            }
        });

    }

    return false;
}

function DoSimulacion()
{
    if($("#fechabene").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione fecha inicio de beneficios");
    }
    else
    {
        if($("#tipofini").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione tipo de finiquito");
        }
        else
        {
            if($("#fechabaja").val()=="")
            {
                showMsg("Mensaje","Por favor seleccione fecha de baja");
            }
            else
            {
                if($("#tipobaja").val()=="")
                {
                    showMsg("Mensaje","Por favor seleccione tipo de baja");
                }
                else
                {
                    $("#Calculando").show();

                    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
                    var _json=new Array();

                    $.each(rows,function(i,row){
                        var data = $('#gdPlantilla').jqxGrid('getrowdata', row);
                        var obj=new Object();
                        obj.op="0";
                        obj.idcapturafiniquito= "";
                        obj.noempleado= data.NoEmpleado.toString();
                        obj.nss= data.NSS;
                        obj.id= data.ID.toString();                       
                        obj.fechainicioperiodo= data.Fechainicioperiodo.split('T')[0];
                        obj.fechafinperiodo= data.Fechafinperiodo!=null?data.Fechafinperiodo.split('T')[0]:data.Fechafinperiodo;
                        obj.fechainiciobeneficio= $("#fechabene").val().toString();
                        obj.fechaingreso= data.Fechadeingreso.split('T')[0];
                        obj.tipofiniquito= $("#tipofini").val().toString();
                        obj.tipobaja= $("#tipobaja").val().toString();
                        obj.fechabaja= formatDate($("#fechabaja").val());
                        obj.idtipoperiodo= data.Id_TipoPeriodo.toString();
                        obj.idregistropatronal= data.Id_RegistroPatronal.toString();
                        obj.idrazonsocial= data.Id_RazonSocial.toString();
                        obj.idsindicato= data.Id_Sindicato.toString();
                        obj.idperfilcalendario = data.Id_PerfilCalendario!=null ? data.Id_PerfilCalendario.toString():data.Id_PerfilCalendario;
                        obj.idtabulador= data.Id_Tabulador;
                        obj.idcategoria= data.Id_Categoria;
                        obj.observaciones= $("#observaciones").val();
                        obj.usuario= "usuario@harwebdbo.mx";

                        _json.push(obj);
                    });

                    console.log(_json);
                    var obj = new Object();
                    obj.API="A7088049470B40300ACCD899B70E42402718FE601E5EAE334C03D41F19E964E7";
                    obj.Parameters="";
                    obj.JsonString=JSON.stringify(_json);
                    obj.Hash= getHSH();
                    obj.Bearer= getToken();

                    $.when(ajaxTokenFijo(obj)).done(function (response) {
                        console.log(response);
                        if(response)
                        {
                            if(response.error=="0")
                            {
                                $.confirm({
                                    title: 'Éxito',
                                    content: 'Simulación generada correctamente, ¿desea consultarla?',
                                    icon: 'fa fa-check nuevoingresoico',
                                    type:'green',
                                    typeAnimated:true,
                                    columnClass: 'medium',
                                    buttons: {
                                        aceptar: function () {
                                            $("#offcanvasSimulacion").offcanvas('hide');
                                            $("#BtnConsulta").trigger('click');
                                        },
                                        cancelar:function(){
                                            $("#offcanvasSimulacion").offcanvas('hide');
                                            Inicio();
                                        }
                                    }
                                });
                            }
                            else
                            {
                                showMsg("Error",response.msg);
                            }
                        }
                        else
                        {
                            showMsg("Error","Ocurrió un error al obtener la simulación de los empleados");
                        }
                        $("#Calculando").hide();
                    }).fail(function(){
                        showMsg("Error","Ocurrió un error al obtener la simulación");
                        $("#Calculando").hide();
                    });
                }
            }
        }
    }
}

function AccionFini(idaccion)
{
    let id=$("#Id_CapturaFiniquito").val();
    var rowindexes = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    var _json=new Array();
    let continua=false;
    let _op= idaccion==1?"2":"3";
    let verbo = idaccion==1?"eliminar":"autorizar";
    let verbo2 = idaccion==1?"eliminado":"autorizado";
    let titulo= idaccion==1?"Eliminar":"Autorizar";
    let msjneto="";

    if(id==0 && rowindexes.length==0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros para " + verbo);
    }
    else if(rowindexes.length>0)
    {
        $.each(rowindexes,function(i,index){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', index);
            if(data.Estatus=='Simulación')
            {
                var neto = data.Netoapagar.split('$')[1].replaceAll(',','');
                if(Number(neto)>0)
                {
                    var j = new Object();
                    j.op=_op;
                    j.usuario="usuario@harwebdbo.mx";
                    j.idcapturafiniquito=data.Id_CapturaFiniquito.toString();
                    _json.push(j);
                    msjneto="";
                }
                else
                {
                    if(idaccion==1)
                    {
                        var j = new Object();
                        j.op=_op;
                        j.usuario="usuario@harwebdbo.mx";
                        j.idcapturafiniquito=data.Id_CapturaFiniquito.toString();
                        _json.push(j);
                        msjneto="";
                    }
                    else
                    {
                        msjneto="y el neto a pagar mayor a 0";
                    }
                }
            }
        });
        if(_json.length>0 && _json.length==rowindexes.length)
        {
            continua=true;
        }
    }
    else
    {
        let estatus=$("#txtEstatus").val();
        let neto2 = $("#txtNeto").val().split('$')[1].replaceAll(',','');
        if(estatus=='Simulación')
        {
            if(Number(neto2)>0)
            {
                var j = new Object();
                j.op=_op;
                j.usuario="usuario@harwebdbo.mx";
                j.idcapturafiniquito=id.toString();
                _json.push(j);
                msjneto="";
                continua=true;
            }
            else
            {
                if(idaccion==1)
                {
                    var j = new Object();
                    j.op=_op;
                    j.usuario="usuario@harwebdbo.mx";
                    j.idcapturafiniquito=data.Id_CapturaFiniquito.toString();
                    _json.push(j);
                    msjneto="";
                    continua=true;
                }
                else
                {                    
                    msjneto="y el neto a pagar mayor a 0";
                    continua=false;
                }                
            }
        }
    }

    if(continua==true)
    {

        let mensaje=_json.length>1?"¿Está seguro de " + verbo + " los registros?":"¿Está seguro de " + verbo + " este registro?";

        $.confirm({
            title: titulo,
            content: mensaje,
            icon: 'fa fa-info-circle',
            type:'blue',
            typeAnimated:true,
            columnClass: 'medium',
            buttons: {
                aceptar: function () {
                    mostrarUpCargador();
                    var obj = new Object();
                    obj.API="A7088049470B40300ACCD899B70E42402718FE601E5EAE334C03D41F19E964E7";
                    obj.Parameters="";
                    obj.JsonString=JSON.stringify(_json);
                    obj.Hash= getHSH();
                    obj.Bearer= getToken();

                    console.log(_json);

                    mostrarUpCargador();
                    $.when(ajaxTokenFijo(obj)).done(function (response) {
                        if(response)
                        {
                            if(response.error=="0")
                            {
                                $.confirm({
                                    title: 'Éxito',
                                    content: "Registro(s) "+ verbo2 + "(s) correctamente ",
                                    icon: 'fa fa-check nuevoingresoico',
                                    type:'green',
                                    typeAnimated:true,
                                    columnClass: 'medium',
                                    buttons: {
                                        aceptar: function () {
                                            ConsultaFiniquitos();
                                        }
                                    }
                                });
                            }
                            else
                            {
                                showMsg("Error",response.msg);
                            }
                        }
                        ocultarUpCargador();
                    }).fail(function(){
                        showMsg('Advertencia','Ocurrió un error al ' + verbo);
                        ocultarUpCargador();
                    });
                },
                cancelar:function(){}
            }
        });
    }
    else 
    {
        showMsg("Mensaje","No es posible " + verbo + ", ya que debe tener status 'Simulación' " + msjneto);
    }
}

function Agregar(nomgrid)
{
    mostrarCargador();
    switch(nomgrid)
    {
        case 'GridPer':
            $("#lblTituloConceptos").text(' Percepciones');
            $("#txttipoconcepto").val(1);     
            fillCombo(154,'idconcepto','');       
            break;
        case 'GridDed':
            $("#lblTituloConceptos").text(' Deducciones');
            $("#txttipoconcepto").val(2);
            fillCombo(155,'idconcepto','');
            break;
        case 'GridAp':
            $("#lblTituloConceptos").text(' Aportaciones');
            $("#txttipoconcepto").val(3);
            fillCombo(156,'idconcepto','');
            break;    
    }

    //Mostrar botones
    $("#BotonConceptosAdd").show();
    $("#BotonConceptosEdit").hide();

    //limpiar formulario
    $("#idconcepto").jqxDropDownList('clearSelection');
    $("#importe").val('');
    $("#gravable").val('');
    $("#exento").val('');
    $("#idconcepto").jqxDropDownList({ disabled: false });

    //Abrir canvas
    setTimeout(ocultarCargador,2500);
    $("#offcanvasConceptos").offcanvas('show');
}

function AgregarConcepto()
{
    let tipo = $("#txttipoconcepto").val();

    var item = $("#idconcepto").jqxDropDownList('getSelectedItem'); 

    if(item==null)
    {
        showMsg("Mensaje","Por favor seleccione un concepto");
    }
    else if($("#importe").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese un importe");
    }
    else if($("#gravable").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese un importe gravable");
    }
    else if($("#exento").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese un importe exento");
    }
    else if(Number($("#exento").val()) + Number($("#gravable").val()) != Number($("#importe").val()))
    {
        showMsg("Alerta","Por favor revise sus montos. La suma de exentos y gravables deben ser iguales al importe");
    }
    else 
    {    
        //Agregar al grid
        var obj = new Object();
        obj.Id_Concepto=item.value;
        obj.Concepto=item.label.split('-')[0];
        obj.Descripcion=item.label.split('-')[1];
        obj.Importe =  "$" + Number($("#importe").val()).toFixed(2).toString();
        obj.Gravable = "$" + Number($("#gravable").val()).toFixed(2).toString();
        obj.Exento   = "$" + Number($("#exento").val()).toFixed(2).toString();
        let ok=false;
    
        switch(tipo)
        {
            case 1:
            case "1":
                if(RevisaExistente("GridPer",item.value)==true)
                {
                    showMsg("Alerta","Este concepto ya se encuentra registrado");
                    ok=false;
                }    
                else
                {
                    $("#offcanvasConceptos").offcanvas('hide');

                    ok=true;
                    
                    var rows = $('#GridPer').jqxGrid('getrows');
                    if(rows.length >0)
                    {
                        obj.Unidades=rows[0].Unidades;
                        obj.Periodo=rows[0].Periodo;
                        obj.Tipocalculo=rows[0].Tipocalculo;
                    }
                    
                    $("#GridPer").jqxGrid('addrow', null, obj);
                    
                    cambios=true;
                    
                    setTimeout(function(){                       
                        let totales = 0.00;
                        $.each(rows,function(i,row){
                            let importe = row.Importe.toString().indexOf('$')>=0 ? Number(row.Importe.toString().split('$')[1]):row.Importe;
                            totales = totales + importe;
                        });
                        ActualizaTotales("GridPer",totales.toFixed(2));
                    },500);  
                                    
                }
                break;
            case 2:
            case "2":
                if(RevisaExistente("GridDed",item.value)==true)
                {
                    showMsg("Alerta","Este concepto ya se encuentra registrado");
                    ok=false;
                }
                else 
                {
                    $("#offcanvasConceptos").offcanvas('hide');

                    ok=true;

                    var rowsD = $('#GridDed').jqxGrid('getrows');
                    if(rowsD.length >0)
                    {
                        obj.Unidades=rowsD[0].Unidades;
                        obj.Periodo=rowsD[0].Periodo;
                        obj.Tipocalculo=rowsD[0].Tipocalculo;
                    }

                    $("#GridDed").jqxGrid('addrow', null, obj);
                    
                    cambios=true;

                    setTimeout(function(){                       
                        let totalesD = 0.00;
                        $.each(rowsD,function(i,row){
                            let importeD = row.Importe.toString().indexOf('$')>=0 ? Number(row.Importe.toString().split('$')[1]):row.Importe;
                            totalesD = totalesD + importeD;
                        });
                        ActualizaTotales("GridDed",totalesD.toFixed(2));
                    },500); 
                }                    
                break; 
            case 3:
            case "3":
                if(RevisaExistente("GridAp",item.value)==true)
                {
                    showMsg("Alerta","Este concepto ya se encuentra registrado");
                    ok=false;
                }
                else 
                {
                    $("#offcanvasConceptos").offcanvas('hide');

                    ok=true;

                    var rowsA = $('#GridAp').jqxGrid('getrows');
                    if(rowsA.length >0)
                    {
                        obj.Unidades=rowsA[0].Unidades;
                        obj.Periodo=rowsA[0].Periodo;
                        obj.Tipocalculo=rowsA[0].Tipocalculo;
                    }

                    $("#GridAp").jqxGrid('addrow', null, obj);

                    cambios=true;

                    setTimeout(function(){                       
                        let totalesA = 0.00;
                        $.each(rowsA,function(i,row){
                            let importeA = row.Importe.toString().indexOf('$')>=0 ? Number(row.Importe.toString().split('$')[1]):row.Importe;
                            totalesA = totalesA + importeA;
                        });
                        ActualizaTotales("GridAp",totalesA.toFixed(2));
                    },500);
                }                
                break;           
        }

        //agregar a arreglo global
        if(ok==true)
        {
            var par=new Object();
            par.tipomovimiento="A";
            par.usuario="usuario@harwebdbo.mx";
            par.idcapturafiniquito=$("#Id_CapturaFiniquito").val().toString();
            par.idconcepto=item.value.toString();
            par.importe=Number($("#importe").val()).toFixed(2).toString();
            par.exento=Number($("#gravable").val()).toFixed(2).toString();
            par.gravable=Number($("#exento").val()).toFixed(2).toString();

            console.log(par);

            arregloCambios.push(par);
        }

    }

}

function RevisaExistente(nomgrid,idconcepto)
{
    var rows = $('#' + nomgrid).jqxGrid('getrows');
    if(rows.length==0)
    {
        return false;
    }
    else
    {
        let ok=false;
        $.each(rows,function(i,row){
            if(row.Id_Concepto==idconcepto)
            {
                ok=true;
            }
        });

        return ok;
    }
}

function Editar(nomgrid)
{
    mostrarCargador();
    switch(nomgrid)
    {
        case 'GridPer':
            $("#lblTituloConceptos").text(' Percepciones');
            $("#txttipoconcepto").val(1);
            fillCombo(154,'idconcepto','');            
            break;
        case 'GridDed':
            $("#lblTituloConceptos").text(' Deducciones');
            $("#txttipoconcepto").val(2);
            fillCombo(155,'idconcepto','');
            break;
        case 'GridAp':
            $("#lblTituloConceptos").text(' Aportaciones');
            $("#txttipoconcepto").val(3);
            fillCombo(156,'idconcepto','');
            break;    
    }

    let rowindexes = $("#" + nomgrid).jqxGrid('getselectedrowindexes');
    if(rowindexes.length==0)
    {
        ocultarCargador();
        showMsg("Mensaje","Por favor seleccione un registro para modificar");
    }
    else if(rowindexes.length>1)
    {
        ocultarCargador();
        showMsg("Mensaje","Únicamente puede editar un registro");
    }
    else
    {
        var data = $('#' + nomgrid).jqxGrid('getrowdata', rowindexes[0]);
        console.log(data);
        let importe= data.Importe.toString().indexOf('$')>=0 ? data.Importe.split('$')[1] : data.Importe;
        let exento = data.Exento.toString().indexOf('$')>=0 ? data.Exento.split('$')[1] : data.Exento;
        let gravable = data.Gravable.toString().indexOf('$')>=0 ? data.Gravable.split('$')[1] : data.Gravable;
       
        setTimeout(function() { 
            $("#idconcepto").val(data.Id_Concepto);
            $("#idconcepto").jqxDropDownList({ disabled: true });
        },3000);                

        $("#importe").val(importe);
        $("#gravable").val(gravable);
        $("#exento").val(exento);

        $("#BotonConceptosAdd").hide();
        $("#BotonConceptosEdit").show();

        setTimeout(ocultarCargador,3500);
        $("#offcanvasConceptos").offcanvas('show');
    }

}

function EditarConcepto()
{

    let tipo = $("#txttipoconcepto").val();
    var item = $("#idconcepto").jqxDropDownList('getSelectedItem');

    if(item==null)
    {
        showMsg("Mensaje","Por favor seleccione un concepto");
    }
    else if($("#importe").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese un importe");
    }
    else if($("#gravable").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese un importe gravable");
    }
    else if($("#exento").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese un importe exento");
    }
    else if(Number($("#exento").val()) + Number($("#gravable").val()) != Number($("#importe").val()))
    {
        showMsg("Alerta","Por favor revise sus montos. La suma de exentos y gravables deben ser iguales al importe");
    }    
    else
    {
        let nomGrid="";
        switch(tipo)
        {
            case 1:
            case "1":
                nomGrid="GridPer";
                break;
                case 2:
            case "2":
                nomGrid="GridDed";
                break;
            case 3:
            case "3":
                nomGrid="GridAp";
                break;
        }

        //editar en grid
        let rowindexes = $("#" + nomGrid + "").jqxGrid('getselectedrowindexes');
        $("#" + nomGrid + "").jqxGrid('setcellvalue', rowindexes[0], "Importe", Number($("#importe").val()).toFixed(2));
        $("#" + nomGrid + "").jqxGrid('setcellvalue', rowindexes[0], "Exento", Number($("#exento").val()).toFixed(2));
        $("#" + nomGrid + "").jqxGrid('setcellvalue', rowindexes[0], "Gravable",Number($("#gravable").val()).toFixed(2));

        setTimeout(function(){                       
            let totales = 0.00;
            var rowsA = $("#" + nomGrid + "").jqxGrid('getrows');
            $.each(rowsA,function(i,row){
                let importe = row.Importe.toString().indexOf('$')>=0 ? Number(row.Importe.toString().split('$')[1]):row.Importe;
                totales = totales + importe;
            });
            ActualizaTotales(nomGrid,totales.toFixed(2));
        },500);

        $("#" + nomGrid + "").jqxGrid('clearselection');

        //editar por API
        var par=new Object();
        par.tipomovimiento="C";
        par.usuario="usuario@harwebdbo.mx";
        par.idcapturafiniquito=$("#Id_CapturaFiniquito").val().toString();
        par.idconcepto=item.value.toString();
        par.importe=Number($("#importe").val()).toFixed(2).toString();
        par.exento=Number($("#gravable").val()).toFixed(2).toString();
        par.gravable=Number($("#exento").val()).toFixed(2).toString();

        console.log(par);

        arregloCambios.push(par);

        cambios=true;

        $("#offcanvasConceptos").offcanvas('hide');
    }
}

function EliminarConcepto(nomgrid)
{
    let rowindexes = $("#" + nomgrid).jqxGrid('getselectedrowindexes');
    if(rowindexes.length==0)
    {
        showMsg("Mensaje","Por favor seleccione un registro para eliminar");
    }
    else
    {
        let ids = new Array();
        $.each(rowindexes,function(i,rowid){
            ids.push(rowid);
        });

        let temp=new Array();
        $.each(ids,function(i,elem){
            var data = $('#' + nomgrid).jqxGrid('getrowdata', elem);
            //eliminar por API
            var par=new Object();
            par.tipomovimiento="B";
            par.usuario="usuario@harwebdbo.mx";
            par.idcapturafiniquito=$("#Id_CapturaFiniquito").val().toString();
            par.idconcepto=data.Id_Concepto.toString();
            let importe=data.Importe.toString().indexOf('$')>=0 ? data.Importe.split('$')[1].replaceAll(",",""):data.Importe;
            let exento=data.Exento.toString().indexOf('$')>=0 ? data.Exento.split('$')[1].replaceAll(",",""):data.Exento;
            let gravable=data.Gravable.toString().indexOf('$')>=0 ? data.Gravable.split('$')[1].replaceAll(",",""):data.Gravable;
            par.importe=importe.toString();
            par.exento=exento.toString();
            par.gravable=gravable.toString();

            temp.push(par);

        });
                                        
        $.confirm({
            title: 'Eliminar',
            content: '¿Realmente desea eliminar el/los concepto(s) seleccionado(s)?',
            icon: 'fa fa-info-circle',
            type:'blue',
            typeAnimated:true,
            columnClass: 'medium',
            buttons: {
                aceptar: function () 
                {
    
                    //eliminar del grid
                    $("#" + nomgrid + "").jqxGrid('deleterow', ids);
    
                    $("#" + nomgrid + "").jqxGrid('clearselection');

                    setTimeout(function(){ $("#" + nomgrid + "").jqxGrid('autoresizecolumns');},500);
                    setTimeout(function(){ 
                        $("#" + nomgrid).jqxGrid('setcolumnproperty','Importe','width','13%');
                        $("#" + nomgrid).jqxGrid('setcolumnproperty','Gravable','width','13%');
                        $("#" + nomgrid).jqxGrid('setcolumnproperty','Exento','width','13%');
                        $("#" + nomgrid).jqxGrid('setcolumnproperty','Descripcion','width','30%');
                        $("#" + nomgrid).jqxGrid('setcolumnproperty','Descripción','width','30%');
                    },1000);
                    
                    var rows = $("#" + nomgrid + "").jqxGrid('getrows');
                    var nuevas = new Array();
                    $.each(rows,function(i,row){
                        nuevas.push(row);
                    });
    
                    let source = {
                        datatype: 'array',
                        localdata: nuevas
                    };
    
                    let dataAdapter = new $.jqx.dataAdapter(source);
                    
                    $("#" + nomgrid).jqxGrid({ source: dataAdapter });
    
                    setTimeout(function(){                       
                        let totales = 0.00;
                        $.each(rows,function(i,row){
                            let importe = row.Importe.toString().indexOf('$')>=0 ? Number(row.Importe.toString().split('$')[1]):row.Importe;
                            totales = totales + importe;
                        });
                        ActualizaTotales(nomgrid,totales.toFixed(2));
                        cambios=true;
                    },500);

                    $.each(temp,function(i,row){
                        arregloCambios.push(row);
                    });                      
                },
                cancelar:function(){
    
                }
            }
        });
    }
}

function ActualizaTotales(nomgrid,importe)
{
    switch(nomgrid)
    {
        case "GridPer":
            $("#GridTotales").jqxGrid('setcellvalue', 0, "Importe", importe);
            let deduccion= $('#GridTotales').jqxGrid('getcellvalue', 1, "Importe");
            let NetoNuevo = importe - deduccion;
            $("#GridTotales").jqxGrid('setcellvalue', 2, "Importe", NetoNuevo);
            break;
        case "GridDed":
            $("#GridTotales").jqxGrid('setcellvalue', 1, "Importe", importe);
            let percepcion= $('#GridTotales').jqxGrid('getcellvalue', 0, "Importe");
            let NetoNuevoD = percepcion - importe;
            $("#GridTotales").jqxGrid('setcellvalue', 2, "Importe", NetoNuevoD);
            break;
        case "GridAp":
            $("#GridTotales").jqxGrid('setcellvalue', 3, "Importe", importe);
            break;
    }
}

function Guardar()
{
    if(cambios==true && arregloCambios.length>0)
    {
        console.log(arregloCambios);
        
        $.confirm({
            title: 'Guardar',
            content: '¿Desea guardar los cambios?',
            icon: 'fa fa-question-circle',
            type:'blue',
            typeAnimated:true,
            columnClass: 'medium',
            buttons: {
                aceptar: function () 
                {
                    $("#Calculando").show();

                    var obj = new Object();
                    obj.API="E687267A53C8A4190F22CCD346CB6E3C54ADA2EB64C7BEDCAF0F2DB5B2AC3809";
                    obj.Parameters="";
                    obj.JsonString=JSON.stringify(arregloCambios);
                    obj.Hash= getHSH();
                    obj.Bearer= getToken();

                    $.when(ajaxTokenFijo(obj)).done(function (response) {
                        console.log(response);    
                        if(response)
                        {
                            if(response.error=="0")
                            {
                                $.confirm({
                                    title: 'Éxito',
                                    content: 'Simulación guardada correctamente',
                                    icon: 'fa fa-check nuevoingresoico',
                                    type:'green',
                                    typeAnimated:true,
                                    columnClass: 'medium',
                                    buttons: {
                                        aceptar: function () {
                                            ConsultaFiniquitos();
                                        }
                                    }
                                });
                            }
                            else
                            {
                                showMsg("Mensaje",response.msg);
                            }
                        }   
                        $("#Calculando").hide();
                    }).fail(function(){
                        console.error("Error");
                        $("#Calculando").hide();
                    });
                },
                cancelar:function(){

                }
            }
        });
    }
    else
    {
        showMsg("Mensaje","No ha realizado cambios para guardar");
    }
}

function Pago()
{
    mostrarCargador();

    let id=$("#Id_CapturaFiniquito").val();
    let estatus=$("#txtEstatus").val();
    var _json=new Array();
    let continua=false;

    if(id==0)
    {
        showMsg("Mensaje","Por favor seleccione un registro para pago");
        continua=false;
    }
    else
    {
        if(estatus=='Autorizado')
        {
            var j = new Object();
            j.op="2";
            //j.idcapturafiniquito=id.toString();
            j.idcapturafiniquito="0";
            _json.push(j);
            continua=true;
        }
    }

    if(continua==true)
    { 
        var obj = new Object();
        obj.API="1C6583AAB49DFF27B24D80A5527DF2CCB3A18981B11C202660EA291A6EBBE790";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(_json);
        obj.Hash= getHSH();
        obj.Bearer= getToken();
    
        $.when(ajaxTokenFijo(obj)).done(function (response) 
        {
            if (response != null && response != '') 
            {
                console.log(response);
                $("#RowPago").html('');
                $("#BtnPago").show();
                $("#LinkApertura").hide();
                $("#offcanvasPago").offcanvas('show');
            }
            else 
            {
                $("#RowPago").html('<div class="col alert alert-primary" role="alert"><i class="fa fa-info-circle fa-2x consultamovsico"></i> No existen nóminas de finiquito abiertas, por favor vaya a la página de apertura de nóminas para poder realizar la operación</div>');
                $("#BtnPago").hide();
                $("#LinkApertura").show();
                $("#offcanvasPago").offcanvas('show');
            }
            ocultarCargador();
        }).fail(function()
        {
            $("#RowPago").html('<div class="col alert alert-primary" role="alert"><i class="fa fa-info-circle fa-2x consultamovsico"></i> No existen nóminas de finiquito abiertas, por favor vaya a la página de apertura de nóminas para poder realizar la operación</div>');
            $("#BtnPago").hide();
            $("#LinkApertura").show();
            $("#offcanvasPago").offcanvas('show');
            ocultarCargador();
        });
    }
    else
    {
        showMsg("Mensaje","Debe tener status 'Autorizado' para poder realizar el pago.");
        ocultarCargador();
    }

}

function ExportarSimulacion()
{
    mostrarCargador();
	setTimeout(() => {
        var wb = XLSX.utils.book_new();
        
        wb.Props = {
            Title: "Simulación finiquito",
            Subject: "Simulación finiquito",
            Author: "GrupoGSMéxico",
            CreatedDate: new Date()
        };

        if($("#GridPer").length>0)
        {            
            const rowsPer = $("#GridPer").jqxGrid('getRows');
            console.log(rowsPer);
            if (rowsPer.length > 0) {
                var rp=new Array();

                $.each(rowsPer,function(i,row){
                    rp.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe, Gravable:row.Gravable, Exento:row.Exento,Unidades:row.Unidades,Periodo:row.Periodo,TipoCalculo:row.TipoCalculo});
                });

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

                $.each(rowsDed,function(i,row){
                    rd.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe, Gravable:row.Gravable, Exento:row.Exento,Unidades:row.Unidades,Periodo:row.Periodo,TipoCalculo:row.TipoCalculo});
                });

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

                $.each(rowsAp,function(i,row){
                    ra.push({Concepto:row.Concepto,Descripcion:row.Descripcion,TipoConcepto:row.TipoConcepto,ID:row.ID,Empleados:row.Empleados,Importe:row.Importe, Gravable:row.Gravable, Exento:row.Exento,Unidades:row.Unidades,Periodo:row.Periodo,TipoCalculo:row.TipoCalculo});
                });

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
                    rt.push({Tipo:row.Tipodeconcepto,Totales:row.Importe});
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
            saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream"' }), "SimulacionFiniquito" + '.xlsx');
        }
        catch{}

		ocultarCargador();
	}, 1000);
}

function DoPago()
{
    mostrarUpCargador();
    var obj=new Object();
    obj.op="4";
    obj.idcapturafiniquito= $("#Id_CapturaFiniquito").val().toString();
    obj.usuario= "usuario@harwebdbo.mx";
    obj.idcontrolnomina = $("#idperiodopago").val().toString();

    var obj = new Object();
    obj.API="A7088049470B40300ACCD899B70E42402718FE601E5EAE334C03D41F19E964E7";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(obj);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        console.log(response);
        if(response)
        {
            if(response.error=="0")
            {
                $.confirm({
                    title: 'Éxito',
                    content: 'Pago realizado correctamente',
                    icon: 'fa fa-check nuevoingresoico',
                    type:'green',
                    typeAnimated:true,
                    columnClass: 'medium',
                    buttons: {
                        aceptar: function () {
                            ConsultaFiniquitos();
                        }
                    }
                });
            }
            else
            {
                showMsg("Error",response.msg);
            }
        }
        else
        {
            showMsg("Error","Ocurrió un error al pagar");
        }
        ocultarUpCargador();
    }).fail(function(){
        showMsg("Error","Ocurrió un error al pagar");
        ocultarUpCargador();
    });
}