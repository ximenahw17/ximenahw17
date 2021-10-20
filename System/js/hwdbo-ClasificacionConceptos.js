$(document).ready(function () {
    mostrarCargador();

    sessionStorage.removeItem('resp');

    sessionStorage.removeItem('dat4');
    
    $.jqx.theme = "light";

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 
    
    $(".hwdbo-combo-multiple").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, 
    filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", checkboxes: true, openDelay: 0, animationType: 'none'
    }).on('checkChange',function(ev){
        check(ev,$(this)[0].id);
    }); 

    $("#tipoconcepto").on('change',function(){
        mostrarCargador();
        var tipo = $(this).val();
        if(tipo==1)
        {
            fillComboMultiple(154,'conceptoclasi','',-1);
        }
        else if(tipo==2)
        {
            fillComboMultiple(155,'conceptoclasi','',-1);
        }
        else if(tipo==3)
        {
            fillComboMultiple(156,'conceptoclasi','',-1);
        }
        ocultarCargador();
    });

    $(".concepto").attr('disabled','disabled');
    
    GetGrid();

    ComboTipo();

});

function GetGrid() 
{
    $.when(ajaxCatalogo(161,"")).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            if(response=="")
            {
                showMsg("Mensaje","Sin información");
                let botones="<div class=\"row\" style=\"margin-top:1.5%;margin-left:1%\">";
                botones+="<button class=\"btn btn-primary btn-sm consultamovs\" style=\"margin-bottom:1%;margin-left:1%\" onclick=\"Agregar('"+nomGrid+"');\">Agregar</button>";
                botones+="</div>";

                $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');

                $("#gdPlantilla").jqxGrid({
                    autoshowfiltericon: true,
                    columns: [],
                    source: [],
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
                    showstatusbar:true, 
                    statusbarheight: 65, 
                    ready:function(){
                        $("#gdPlantilla").jqxGrid('updatebounddata');
                        $("#gdPlantilla").jqxGrid('autoresizecolumns');
                    },
                    renderstatusbar: function(statusbar){ 
                        statusbar.append(botones); 
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

function ComboTipo()
{
    var data=[{"Valor":1,"Descripcion":"Percepción"},{"Valor":2,"Descripcion":"Deducción"},{"Valor":3,"Descripcion":"Aportación"}];
    var source={dataType:"json", localdata:data}

    var dataAdapter = new $.jqx.dataAdapter(source);

    $("#tipoconcepto").jqxDropDownList({
        source: dataAdapter,
        displayMember: "Descripcion",
        valueMember: "Valor",
        placeHolder:"--Seleccione--"                
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
            if(index==0)
            {
                _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    columntype: 'textbox',
                    filtertype: 'textbox',
                    filtercondition: 'contains',
                    width: '10%',
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
                    width: '88%',
                    cellsalign:'left',
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

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        width: '100%',
        height:$("#divContenedorInterno").height()-190,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode:'logical',
        localization: getLocalization(),
        showfilterrow: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 50,
        sortable: true, 
        ready:function(){
            $("#gdPlantilla").jqxGrid('updatebounddata');
        }
    }).on('rowdoubleclick',function(ev)
    {
        mostrarCargador();
        let data = ev.args.row.bounddata;
        $.when(ajaxCatalogo(162,"&_Parameters='" + data.IdClasificacion + "'")).done(function (response) {
            $(".concepto").removeAttr('disabled');
            $(".clasi").attr('disabled','disabled');
            $("#IdClasi").val(data.IdClasificacion);
            sessionStorage.setItem('resp',JSON.stringify(response));
            sessionStorage.setItem('dat4',JSON.stringify(data));
            armaGrid2(response,data);
        });

    });

    ocultarCargador();
}

function armaGrid2(_data,datos) {
    
    let _columns = [];
    let _jsonData = [];

    if(_data=="No se encontro información.")
    {
        showMsg('Error',_data);
    }
    else if(_data!="")
    {
        let titulosGrid = Object.keys(_data[0]);
        $.each(titulosGrid, function (index, element) {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                columntype: 'textbox',
                filtertype: 'textbox',
                filtercondition: 'contains',
                width: '13%',
                cellsalign:'left',
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
    else
    {
        _columns.push({
            text: "",
            datafield: "Sin datos",
            columntype: 'textbox',
            filtertype: 'textbox',
            filtercondition: 'contains',
            width: '13%',
            cellsalign:'left',
            align:'center'
        });
    }

    let source = { datatype: 'json', localdata: _jsonData };

    let dataAdapter = new $.jqx.dataAdapter(source);

    var desc='<div class="alert alert-dark" role="alert"><table><tr><td style="width:150px"><b>Clasificación:</b></td><td>' + datos.Clasificacion +
    '</td></tr></table><center><button class="btn btn-outline-dark btn-sm" onclick="Regresar()">Regresar</button></center></div><input id="txtIdClasificacion" type="text" style="display:none" value="'+ 
    datos.IdClasificacion +'" />';

    var acc='<div class="accordion" id="accordionExample">';
    acc+='<div class="accordion-item">'
    acc+='<h2 class="accordion-header" id="headingOne">'
    acc+='<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'
    acc+='<div class="row" style="width:100%">'
    acc+='<div class="col-3"><dl><dt>Clasificación</dt>' + '<dd>' + datos.Clasificacion+'<input id="txtClasi" type="text" style="display:none" value="'+datos.Clasificacion+'" /></dd></dl></div>'
    acc+='<div class="col-3"><dl><dt>Id Clasificación</dt><dd>' + datos.IdClasificacion + '</dd></dl></div>'
    acc+='</div>'
    acc+='</button>'
    acc+='</h2>'
    acc+='<div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">'
    acc+='<div class="accordion-body">'
    acc+='<div id="gdPlantilla" ></div>';    
    acc+='</div>'
    acc+='</div>'
    acc+='</div>'
    acc+='</div>';

    $("#DivGrid").html(acc);
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        width: '100%',
        height:$("#divContenedorInterno").height()-270,
        columnsresize: true,
        columnsautoresize: true,
        localization: getLocalization(),
        showfilterrow: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 50,
        sortable: true, 
        ready:function(){
            $("#gdPlantilla").jqxGrid('updatebounddata');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_Concepto');
            $('#gdPlantilla').jqxGrid('autoresizecolumns');
        }
    });

    ocultarCargador();
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'ClasificacionConceptos');
		}
		ocultarCargador();
	}, 1000);
}

function Regresar()
{
    mostrarCargador();
    $(".concepto").attr('disabled','disabled');
    $(".clasi").removeAttr('disabled');
    GetGrid();
}

function AgregarClasificacion(){
    $(".NombreBoton").text("Agregar");
    $("#IdClasi").val(0);
    $("#nombre").val('');
    $("#offcanvasClasificacion").offcanvas('show');
}

function ModificarClasificacion ()
{
    let rowindexes = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rowindexes.length ==0)
    {
        showMsg("Mensaje","Por favor seleccione un registro para modificar");
    }
    else if(rowindexes.length==1)
    {
        var data = $('#gdPlantilla').jqxGrid('getrowdata', rowindexes[0]);
        console.log(data);
        $("#nombre").val(data.Clasificacion);
        $("#IdClasi").val(data.IdClasificacion);
        $(".NombreBoton").text("Modificar");
        $("#offcanvasClasificacion").offcanvas('show');
    }
    else
    {
        showMsg("Mensaje","Únicamente puede seleccionar un registro");
    }
}

function AgregarConcepto()
{
    $(".hwdbo-combo").jqxDropDownList('clearSelection');
    $("#offcanvasConcepto").offcanvas('show');
}

function EliminarConcepto()
{
    let rowindexes = $("#gdPlantilla").jqxGrid('getselectedrowindexes');
    if(rowindexes.length==0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios conceptos para eliminar");
    }
    else
    {
        mostrarCargador();
        var ids="";
        $.each(rowindexes,function(i,row){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', row);
            console.log(data);
            ids+=data.Id_Concepto + ",";
        });

        ids = ids.substring(0,ids.length-1);

        console.log(ids);

        let params="&_Parameters='" + $("#IdClasi").val().toString() + "','" + ids + "'"

        $.confirm({
            title: 'Eliminar conceptos',
            content: '¿Realmente desea eliminar los '+rowindexes.length+' registros?',
            icon: 'fa fa-info-circle consultamovsico',
            type:'blue',
            typeAnimated:true,
            columnClass: 'medium',
            buttons: {
                aceptar: function () {
                    $.when(ajaxCatalogo(165,params)).done(function (response) {
                        if(response != "No existe el catálogo. ")
                        {
                            console.log(response);
                            $.confirm({
                                title: 'Eliminar concepto(s)',
                                content: 'Concepto(s) eliminado(s) correctamente',
                                icon: 'fa fa-info-circle nuevoingresoico',
                                type:'green',
                                typeAnimated:true,
                                columnClass: 'medium',
                                buttons: {
                                    aceptar: function () {
                                        GetGridConceptos();
                                    }
                                }
                            });
                        }
                        else
                        {
                            showMsg('Mensaje',response);
                        }
                
                        ocultarCargador();
                    });
                },
                cancelar:function(){

                }
            }
        });
    }
}

function EliminarClasificacion()
{
    let rowindexes = $("#gdPlantilla").jqxGrid('getselectedrowindexes');
    if(rowindexes.length==0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varias clasificaciones para eliminar");
    }
    else
    {
        var ids="";
        $.each(rowindexes,function(i,row){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', row);
            ids+=data.IdClasificacion + ",";
        });

        ids = ids.substring(0,ids.length-1);

        console.log(ids);

        $.confirm({
            title: 'Eliminar clasificación',
            content: '¿Realmente desea eliminar los '+rowindexes.length+' registros?',
            icon: 'fa fa-info-circle consultamovsico',
            type:'blue',
            typeAnimated:true,
            columnClass: 'medium',
            buttons: {
                aceptar: function () {

                },
                cancelar:function(){

                }
            }
        });
    }
}

function DoAgregarClasi()
{
    if($("#nombre").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese un nombre de clasificación");
    }
    else
    {
        mostrarUpCargador();
        let num=0;
        let params="";
        let verbo=$("#IdClasi").val()!=0?"Modificar":"Agregar";
        let verbo2=$("#IdClasi").val()!=0?"modificado":"agregado";
        if($("#IdClasi").val()!=0)
        {
            num=166;
            params="&_Parameters=" + $("#IdClasi").val() + ",'" + $("#nombre").val() + "'"
        }
        else
        {
            num=163;
            params="&_Parameters='" + $("#nombre").val() + "'";
        }

        $.when(ajaxCatalogo(num,params)).done(function (response) {
            if(response != "No existe el catálogo. ")
            {
                $("#offcanvasClasificacion").offcanvas('hide');
                $.confirm({
                    title: verbo + ' clasificación',
                    content: 'Registro '+verbo2+' correctamente',
                    icon: 'fa fa-info-circle nuevoingresoico',
                    type:'green',
                    typeAnimated:true,
                    columnClass: 'medium',
                    buttons: {
                        aceptar: function () {
                            GetGrid();
                        },
                        cancelar:function(){
        
                        }
                    }
                });
                
            }
            else
            {
                showMsg('Mensaje',response);
            }
    
            ocultarUpCargador();
        });
    }
}

function DoAgregarConcepto()
{
    if($("#conceptoclasi").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione un concepto");
    }
    else
    {
        mostrarCargador();

        let ids=GetIds('conceptoclasi');

        let params="&_Parameters='" + $("#IdClasi").val().toString() + "','" + ids + "'"

        $.when(ajaxCatalogo(164,params)).done(function (response) {
            if(response != "No existe el catálogo. ")
            {
                console.log(response);
                $("#offcanvasConcepto").offcanvas('hide');
                $.confirm({
                    title: 'Agregar concepto',
                    content: 'Concepto(s) agregado(s) correctamente',
                    icon: 'fa fa-info-circle nuevoingresoico',
                    type:'green',
                    typeAnimated:true,
                    columnClass: 'medium',
                    buttons: {
                        aceptar: function () {
                            GetGridConceptos();
                        }
                    }
                });
            }
            else
            {
                showMsg('Mensaje',response);
            }
    
            ocultarCargador();
        });
    }
}

function GetGridConceptos()
{
    mostrarCargador();
    $.when(ajaxCatalogo(162,"&_Parameters='" + $("#IdClasi").val() + "'")).done(function (response) {
        var data=new Object();
        data.IdClasificacion=$("#IdClasi").val();
        data.Clasificacion=$("#txtClasi").val();
        armaGrid2(response,data);
    });
}

function check(event,nomCombo)
{
    if (event.args.label === "*") {
        mostrarCargador();
        if (event.args.checked) {
            $("#" + nomCombo).jqxDropDownList('checkAll');
        }
        else {
            $("#" + nomCombo).jqxDropDownList('uncheckAll');
        }
        ocultarCargador();
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