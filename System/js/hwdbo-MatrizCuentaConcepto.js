var DatosInfo = {};

let idCuentaContable="";
let parametro="";
var dataAdapterTipAfe;
let metodo="";
$(document).ready(function () {

     //leturl = newURL(location.href);
     //let_IdRef = url.searchParams.get("id");
   
     var actualURL=window.location;
  
    idCuentaContable= actualURL.href.toString().split("=")[1];
    parametro="?Id_CuentaContable=" + idCuentaContable;
   
console.log('prueba');
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
     $("#jqxtabs").jqxTabs('disableAt', 1);

   
   
     Combos();

    GridNoAsociados();
  
    descConcepto();
    subCuentaCombo();
    comboConceptoAsociado();
 
    $('.class-link').click((event) => {
        
       
             window.location.href="CuentasContables.html";
        
     });
    
});



//---------Inicio Consulta de  grids No asociados y Asociados

function GridNoAsociados() 
{
   
    //let parametro="?Id_CuentaContable=1";
    let _data = {
        "API": "0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1",
        "Parameters": "?_Id=95&_Domain={d}",
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer":getToken()
    }
  
    $.when(ajaxCat(_data)).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            armaGridNA(response);
            setTimeout(()=> { ocultarCargador();},1500);
        }
        else
        {
            showMsg('Mensaje',response);
        }
        ocultarCargador();
    }).fail(function(){
        
        armaGridNA('');
    });


    setTimeout(()=>{
        
    let _dataAsocaidos = {
        "API": "501714CB80890655883D2D910FBFF30D8053F9F89791544ABB6E6E715A1986C2",
        "Parameters": parametro,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer":getToken()
    }
  
    $.when(ajaxCat(_dataAsocaidos)).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            armaGridAsociados(response);
        }
        else
        {
            showMsg('Mensaje',response);
        }
        ocultarCargador();
    });
    },1);


}
function GridAsociados(idCuentaContable) 
{
   
    let _data = {
        "API": "501714CB80890655883D2D910FBFF30D8053F9F89791544ABB6E6E715A1986C2",
        "Parameters": "?Id_CuentaContable=" + idCuentaContable,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer":getToken()
    }
  
    $.when(ajaxCat(_data)).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            armaGriA(response);
            ocultarCargador();
        }
        else
        {
            showMsg('Mensaje',response);
            ocultarCargador();
        }
       
    }).fail(function(){
        
        armaGriA('');
    });
   


}


function ajaxCat(_objeto){
    return $.ajax({
        method: "POST",
        url: "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        crossDomain:true,
        contentType: "application/json; charset=utf-8",
        timeout:0,
        headers: {
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
        },
        dataType: "json",
        data: JSON.stringify(_objeto)
    });

}

function armaGridNA(_data) {
    
    let _columns = [];
    let _jsonData = [];
 

    let _nuevoDataNA=[];
    let source;

    if(_data=="No se encontro información.")
    {
        showMsg('Error',_data);
    }
    else if(_data ===""){
        _data=[{
             Id_RelConceptoCuentaContable:""
            ,Id_Concepto:""
            ,"Clave de concepto":""
            ,"Número de concepto":""
            ,"Descripción de concepto":""
            ,Id_CuentaContable:""
            ,"Id_MovimientoContable":""
            ,"Tipo de afectación":""
            }];
     
        let titulosGrid = Object.keys(_data[0]);
        $.each(titulosGrid, function (index, element) {
            var ancho=index==0?"10%":"18%";
               _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    type: 'string',
                    width: ancho,
                    cellsalign:'center',
                    align:'center',
                    editable: false,
                });         
        });
        _jsonData=[];
         source = { datatype: 'json', localdata: _jsonData };
    }
    else
    {

        _data.forEach(function(datos,keyDx){
            _nuevoDataNA.push({
                 Id_RelConceptoCuentaContable:""
                ,Id_Concepto:datos.Id_Concepto
                ,"Clave de concepto":_data[keyDx]["Clave Concepto"]
                ,"Número de concepto":_data[keyDx]["Número Comcepto"]
                ,"Descripción de concepto":_data[keyDx]["Descripción Concepto"]
                ,Id_CuentaContable:""
                ,"Id_MovimientoContable":""
                ,"Tipo de afectación":""
            });
        });
        let titulosGrid = Object.keys(_nuevoDataNA[0]);
        $.each(titulosGrid, function (index, element) {
            var ancho=index==0?"10%":"18%";

                _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    type: 'string',
                    width: ancho,
                    cellsalign:'center',
                    align:'center',
                    editable: false,
                });
    
            
        });
    
        $.each(_nuevoDataNA, function (index, data) {
            let oldKeys = Object.keys(data);
            let newjson = new Object();
            $.each(oldKeys, function (i, d) {
                let newProperty = textotodatafield(d);
                newjson[newProperty] = data[d];
            });
    
            _jsonData.push(newjson);
        });
    }

     source = { datatype: 'json', localdata: _jsonData };

    let dataAdapter = new $.jqx.dataAdapter(source);

    let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
        botones+="<div class=\"col-md-1\"><button id=\"BtnConceptoNuevo\"><i class=\"fa fa-plus-circle\"></i> Agregar concepto</button></div>";
        //botones+="<div class=\"col-md-1 offset-1\"><button id=\"btnEliminar\"><i class=\"fa fa-trash \"></i>Eliminar concepto</button></div>";
        //botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
        botones+="</div>";

    $("#DivNoAsociados").html('<div id=\"gdMatrizNoAsoacidos\"></div>');
    $("#gdMatrizNoAsoacidos").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        showstatusbar: false,
        width: '98%',
        //height:$("#jqxtabs").height() - 35,
        autoheight:true,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 12,
        sortable: true,
        showstatusbar:true, 
        statusbarheight: 64, 
        editable: true,
        ready:function(){
            // $("#gdMatrizNoAsoacidos").jqxGrid('updatebounddata');
            // $("#gdMatrizNoAsoacidos").jqxGrid('autoresizecolumns');
            $("#gdMatrizNoAsoacidos").jqxGrid('hidecolumn','Id_Concepto');
            $("#gdMatrizNoAsoacidos").jqxGrid('hidecolumn','Id_RelConceptoCuentaContable');
            $("#gdMatrizNoAsoacidos").jqxGrid('hidecolumn','Tipodeafectacion');
            $("#gdMatrizNoAsoacidos").jqxGrid('hidecolumn','Id_CuentaContable');
            $("#gdMatrizNoAsoacidos").jqxGrid('hidecolumn','Id_MovimientoContable');
            // $("#gdMatrizNoAsoacidos").jqxGrid('hidecolumn','Id_Concepto');
          //  $("#gdPlantillaMatrizCC").jqxGrid('hidecolumn','IdZonaEconomica');
        },
        renderstatusbar: function(statusbar){ 
            statusbar.append(botones); 
           // $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel('gdMatrizNoAsoacidos'); }); 
            $("#BtnConceptoNuevo").jqxButton({ width: 150, height: 30 }).on('click',function(){ PasarGridAGrid(); });
           // $("#btnEliminar").jqxButton({ width: 150, height: 30 }).on('click',function(){ eliminarConcepto('gdMatrizNoAsoacidos'); });
        },

    });


    
}
function armaGriA(_data) {
    
    let _columns = [];
    let _jsonData = [];

    let _nuevoDataA=[];

    let source;
    if(_data=="No se encontro información.")
    {
        showMsg('Error',_data);
    }
    else if(_data ===""){
        _data=[{
            Id_RelConceptoCuentaContable:""
            ,Id_Concepto:""
            ,"Clave de concepto":""
            ,"Número de concepto":""
            ,"Descripción de concepto":""
            ,Id_CuentaContable:""
            ,"Id_MovimientoContable":""
            ,"Tipo de afectación":""
        }];
     
        let titulosGrid = Object.keys(_data[0]);
        $.each(titulosGrid, function (index, element) {
            var ancho=index==0?"10%":"18%";
            
            if(element ==="Tipo de afectación"){
                _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    type: 'string',
                    width: ancho,
                    cellsalign:'center',
                    align:'center',
                    editable: true,
                    columntype: 'dropdownlist',
                    createeditor: function (row, column, editor) {

                       
                    
                        editor.jqxDropDownList({ source: dataAdapterTipAfe, placeHolder: '-- Seleccione --',displayMember: "Descripcion",valueMember: "Valor", });
                    
                    },
                
                });
            }else{
                _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    type: 'string',
                    width: ancho,
                    cellsalign:'center',
                    align:'center',
                    editable: false,
                });
    
            }
        });
    
     
        _jsonData=[];
         source = { datatype: 'json', localdata: _jsonData };
    }
    else
    {
        _data.forEach(function(datosA,keyDxA){

           
            _nuevoDataA.push({
       
            Id_RelConceptoCuentaContable:datosA.Id_RelConceptoCuentaContable
            ,Id_Concepto:datosA.Id_Concepto
            ,"Clave de concepto":datosA.ClaveConcepto
            ,"Número de concepto":datosA.NumeroConcepto
            ,"Descripción de concepto":""
            ,Id_CuentaContable:datosA.Id_CuentaContable
            ,"Id_MovimientoContable":datosA.Id_MovimientoContable
            ,"Tipo de afectación":datosA.Descripcion_movimientoContable
            });
        });


        _data=[{
            
        }];

        let titulosGrid = Object.keys(_nuevoDataA[0]);
        $.each(titulosGrid, function (index, element) {
            var ancho=index==0?"10%":"18%";
            
            if(element ==="Tipo de afectación"){
                _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    type: 'string',
                    width: ancho,
                    cellsalign:'center',
                    align:'center',
                    editable: true,
                    columntype: 'dropdownlist',
                    createeditor: function (row, column, editor) {
                           
                         if(row["Id_MovimientoContable"]  !==""){
                            console.log(row["Id_MovimientoContable"]);
                         } 
                        editor.jqxDropDownList({ source: dataAdapterTipAfe, placeHolder: '-- Seleccione --',displayMember: "Descripcion",valueMember: "Valor", });
                     
                    },
                   
                });
            }else{
                _columns.push({
                    text: element,
                    datafield: textotodatafield(element),
                    type: 'string',
                    width: ancho,
                    cellsalign:'center',
                    align:'center',
                    editable: false,
                });
    
            }
        });
    
        $.each(_nuevoDataA, function (index, data) {
            let oldKeys = Object.keys(data);
            let newjson = new Object();
            $.each(oldKeys, function (i, d) {
                let newProperty = textotodatafield(d);
                newjson[newProperty] = data[d];
            });
    
            _jsonData.push(newjson);
        });
         source = { datatype: 'json', localdata: _jsonData };
    }

    

    let dataAdapter = new $.jqx.dataAdapter(source);

    let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
        botones+="<div class=\"col-md-1\"><button id=\"BtnConceptoNuevoNA\"><i class=\"fa fa-plus-circle\"></i> Guardar concepto</button></div>";
        botones+="<div class=\"col-md-1 offset-1\"><button id=\"btnEliminarNA\"><i class=\"fa fa-trash \"></i>Eliminar concepto</button></div>";
        botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnExcelNA\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
        botones+="</div>";

    $("#DivAsociados").html('<div id=\"gdMatrizAsoacidos\"></div>');
    $("#gdMatrizAsoacidos").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        showstatusbar: false,
        width: '98%',
        //height:$("#jqxtabs").height() - 35,
        autoheight:true,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 12,
        sortable: true,
        showstatusbar:true, 
        statusbarheight: 64, 
        editable: true,
        ready:function(){
            // $("#gdMatrizAsoacidos").jqxGrid('updatebounddata');
            $("#gdMatrizAsoacidos").jqxGrid('hidecolumn','Id_RelConceptoCuentaContable');
            $("#gdMatrizAsoacidos").jqxGrid('hidecolumn','Id_CuentaContable');
            $("#gdMatrizAsoacidos").jqxGrid('hidecolumn','Descripciondeconcepto');
            $("#gdMatrizAsoacidos").jqxGrid('hidecolumn','Id_MovimientoContable');
            $("#gdMatrizAsoacidos").jqxGrid('hidecolumn','Id_Concepto');
            // $("#gdMatrizAsoacidos").jqxGrid('hidecolumn','Clavedeconcepto');
            // $("#gdMatrizAsoacidos").jqxGrid('hidecolumn','Numerodeconcepto');
            
        },
        renderstatusbar: function(statusbar){ 
            statusbar.append(botones); 
            $("#BtnExcelNA").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel('gdMatrizAsoacidos'); }); 
            $("#BtnConceptoNuevoNA").jqxButton({ width: 150, height: 30 }).on('click',function(){ nuevoConcepto('gdMatrizAsoacidos'); });
            $("#btnEliminarNA").jqxButton({ width: 150, height: 30 }).on('click',function(){ eliminarConcepto('gdMatrizAsoacidos'); });
        },

    });


   
}

//---------Fin Consulta de  grids No asociados y Asociados

//--------- Inicio Consulta de combos

function  descConcepto(){
    let _data = {
        "API": "6ABF727DDC52F35E6F3CB0A01AB006F0169F1D5ACC8660ED87F99EA95F8C07A5",
        "Parameters": parametro,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer":getToken()
    }
 
    $.when(ajaxCat(_data)).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            // console.log(response);
            $('#etiqueDescip').text('');
            $('#etiqueDescip').text(response[0]["Descripcion_CuentaContable"] + "");

        }
        else
        {
            showMsg('Mensaje',response);
        }
        ocultarCargador();
    });
}

function subCuentaCombo(){
    let _data = {
        "API": "872EB7623E443E6CDADEDEE5CA5B7ED54A82A2F788BF1A033F8606F6BAEF3E87",
        "Parameters": parametro,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer":getToken()
    }
 
    $.when(ajaxCat(_data)).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            // console.log(response);

            var dataAdapter = new $.jqx.dataAdapter(response);
            dASat=new $.jqx.dataAdapter(response);
            $('#idSubuentaMCC').jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            }); 
        }
        else
        {
            showMsg('Mensaje',response);
        }
        ocultarCargador();
    });
}
function comboConceptoAsociado(){
    let _data = {
        "API": "501714CB80890655883D2D910FBFF30D8053F9F89791544ABB6E6E715A1986C2",
        "Parameters": parametro,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer":getToken()
    }
 
    $.when(ajaxCat(_data)).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
      
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
    let id=86;
    let _data = {
        "API": "0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1",
        "Parameters": "?_Id=" + id + "&_Domain={d}",
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
        try {
            
             dataAdapterTipAfe = new $.jqx.dataAdapter(response);
              
        } catch (error) {

        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        //console.error('ERROR EN LA FUNCION -> ' + divCombo);
        //console.error(XMLHttpRequest);
        //console.error(textStatus);
        //console.error(errorThrown);
    });

//-----------Acción del combo de subcuentas 
$('#idSubuentaMCC').on('change', function (event)
{     
    mostrarCargador();
    var args = event.args;
    if (args) {
    // index represents the item's index.                      
    var index = args.index;
    var item = args.item;
    // get item's label and value.
    var label = item.label;
    var value = item.value;
    var type = args.type; // keyboard, mouse or null depending on how the item was selected.

    GridAsociados(value);
} 
});

}
//---------Fin Consulta de combos


function PasarGridAGrid(){
   mostrarCargador();
    let rowIndex=$('#gdMatrizNoAsoacidos').jqxGrid('selectedrowindexes');
   
    if(rowIndex !== -1){
       let rowsCNAsociados= $("#gdMatrizNoAsoacidos").jqxGrid('getboundrows');
        //----No asociados selccionados 
        let conceptoSeleccionado=new Array();
        //----No asociados seleccionados 
        let conceptoNosolecccionados=new Array();
        var rowIDs = new Array();
        rowsCNAsociados.map((row, index) => {
            //---si no esta seleccionado
            if(rowIndex.indexOf(row.uid) == -1){
                conceptoNosolecccionados.push(row);
            }
            else{
                conceptoSeleccionado.push(row);
    
            }
        });
       
        //----Comporbando si los conceptos seleccionados existen en el grid destino
        var conceptosRepetidos=new Array();
        var numConcepto=new Array();
        var conceptosAsoaciados=$('#gdMatrizAsoacidos').jqxGrid('getrows');
        conceptosAsoaciados.forEach((elmnt,index) => {
            conceptoSeleccionado.forEach((cAelmnt,indexd) => {
                var hola="";
                if(elmnt.Id_Concepto  === cAelmnt.Id_Concepto){
                    conceptoSeleccionado.splice(indexd, 1);
                    numConcepto.push(elmnt.Numerodeconcepto);
                   
                    //Seleccionamos el indice
                    let indice=conceptoSeleccionado.indexOf(elmnt); 
                    //Eliminamos el indice
                    conceptosRepetidos.push(cAelmnt);
                    
                }
            });
           
        });
        
        let copiaArreglo=[...conceptoNosolecccionados];
        conceptoNosolecccionados=[];
        conceptoNosolecccionados=[...copiaArreglo,...conceptosRepetidos];
        //---Muestra  mensaje de los conceptos que ya estaban asociados
       if(numConcepto.length > 0){
           let n="";
                numConcepto.forEach(element => {
                    n +=element + ",";
                });
           let v=n.replace(/,\s*$/, "");
           let mensaje="";
         if(numConcepto.length === 1){
             mensaje=`El  Número de concepto ${v}  ya se encuentra asociado. `;
         }else{
             mensaje=`Los)  Número de conceptos ${v}  ya se encuentra asociados. `;
         }       
               
                    showMsgSinTimer('Mensaje',mensaje);
       }
        
        //----Respaldamos la información del grid destino 
        //let rowIndexs=$('#gdMatrizAsoacidos').jqxGrid('clearfilters');
        var conceptosAgregados=$('#gdMatrizAsoacidos').jqxGrid('getrows');
        if (conceptosAgregados.length > 0)
        conceptosAgregados.map((presel) => {
            conceptoSeleccionado.push(presel);
            //arrPlazasSeleccionados.push();
        });

        //---Actualziando el grid destino 
        $(eval('gdMatrizAsoacidos')).localdata = conceptoSeleccionado;
        
        $("#gdMatrizAsoacidos").jqxGrid('updatebounddata');
        $("#gdMatrizAsoacidos").jqxGrid('refresh');

        let source = {
            datatype: 'json',
            localdata: conceptoSeleccionado
        };
        let dataAdapter = new $.jqx.dataAdapter(source);
        $("#gdMatrizAsoacidos").jqxGrid({ source: dataAdapter });
        
        
        //Actualiza Grid No Asociados 

         $('#gdMatrizNoAsoacidos').jqxGrid('clear');
        let sourceNO = {
            datatype: 'json',
            localdata: conceptoNosolecccionados
        };
        let dataAdapterNO = new $.jqx.dataAdapter(sourceNO);
        $("#gdMatrizNoAsoacidos").jqxGrid({ source: dataAdapterNO });
        
        $("#gdMatrizNoAsoacidos").jqxGrid('updatebounddata');
        $("#gdMatrizNoAsoacidos").jqxGrid('refresh');
        $('#gdMatrizNoAsoacidos').jqxGrid('clearselection');
     
    }
    else{
        showMsgSinTimer('Mensaje','Seleccione uno o más regsitros');
    }

    setTimeout(()=>{ocultarCargador();},1900);
}

function nuevoConcepto(){
    metodo="Agregar";
  let seleccion= validaSeleccion('nuevoConcepto');
  if(!seleccion){

    showMsg('Mensaje','Seleccione un registro.');
    cuentaContableId="Error";
   }
   else if(seleccion ==="Seleccione una subcuenta"){
    showMsg('Mensaje',seleccion);
   }
   else{
    
    if (seleccion.length < 1) {
        showMsgSinTimer('Mensaje','Seleccione uno o más registros');
    } else {

        let vacioTF=false;

        for (let index = 0; index < seleccion.length; index++) {
            const element = seleccion[index];
            if (element.id_MovimientoContable === null || element.id_MovimientoContable === "" ) {
                vacioTF=true;
                showMsg('Mensaje','Seleccione el tipo de afectación');
                break;
            }
        }

        if (vacioTF) {
            var obj = new Object();
            obj.API="C1D5E1F4B84BF8C6922570131F91A1F3566C6544C8F3131440A4DC5CB26455FE";
            obj.Parameters="";
            //obj.JsonString=JSON.stringify(DatosInfo);
            obj.JsonString=JSON.stringify(seleccion);
            obj.Hash= getHSH();
            obj.Bearer= getToken();
        
            setTimeout(function(){
                $.when(ajaxTokenFijo(obj)).done(function (res) {
                if(res)
                {
                    if(res[0].Exito)
                    {
                       
                        $.confirm({
                            title: 'Éxito',
                            type:'green',
                            icon: 'fa fa-check nuevoingresoico',
                            typeAnimated:true,
                            content:res[0].MSJ,
                            buttons: {
                                Aceptar: function () {
                             
                                },
                            }
                        });
                        let cuenta=$('#idSubuentaMCC').val();
                        GridAsociados(cuenta);
                    }
                    else
                    {
                        $.confirm({
                            title: 'Error',
                            type:'red',
                            icon: 'fa fa-check bajasico',
                            typeAnimated:true,
                            content: res[0].MSJ,
                            buttons: {
                                Aceptar: function () {
                                    
                                },
                            }
                        });
                    }
                }
                else
                {
                    showMsg("Error","Ocurrió un error al guardar: " + res[0].MSJ);
                }
        
                ocultarUpCargador();
            });  },1500);
        }



        
    }


  

   }
}


function eliminarConcepto(id){
    metodo="Eliminar";
    let seleccion= validaSeleccion('eliminarConcepto');
    if(!seleccion){
  
      showMsg('Mensaje','Seleccione un registro.');
      cuentaContableId="Error";
     }
    //  else if(seleccion ==="Seleccione una subcuenta"){
    //   showMsg('Mensaje',seleccion);
    //  }
     else{
   

        if (seleccion.length < 1) {
            showMsgSinTimer('Mensaje','Seleccione uno o más registros');
        }
        else{

                mostrarCargador();
            let rowsCNAsociados= $("#gdMatrizAsoacidos").jqxGrid('getboundrows');
            //----No asociados selccionados 
            let conceptoSeleccionado=new Array();
            //----No asociados seleccionados 
            let conceptoNosolecccionados=new Array();
            var rowIDs = new Array();
            let rowIndex=$('#gdMatrizAsoacidos').jqxGrid('selectedrowindexes');
            rowsCNAsociados.map((row, index) => {
                //---si no esta seleccionado
                if(rowIndex.indexOf(row.uid) == -1){
                    conceptoNosolecccionados.push(row);
                }
                else{
                    conceptoSeleccionado.push(row);
                    
                }
            });
            $(eval('gdMatrizAsoacidos')).localdata = conceptoNosolecccionados;
            let source = {
                datatype: 'json',
                localdata: conceptoNosolecccionados
            };
                let dataAdapter = new $.jqx.dataAdapter(source);
                $('#gdMatrizAsoacidos').jqxGrid('clear');
                $("#gdMatrizAsoacidos").jqxGrid({ source: dataAdapter });
                $("#gdMatrizAsoacidos").jqxGrid('updatebounddata');
                $("#gdMatrizAsoacidos").jqxGrid('refresh');
                $('#gdMatrizAsoacidos').jqxGrid('clearselection');

                eliminar(seleccion);

        }

    }
}
function eliminar(jsonDeleteC){
  
    var obj = new Object();
    var apino =  "D2DE9DCD0C5CB5F414025568293C9F397565FAA2A12F44623368161BAF4FCC32";
    
   
    obj.API=apino;
    obj.Parameters="";
    //obj.JsonString=JSON.stringify(DatosInfo);
    obj.JsonString=JSON.stringify(jsonDeleteC);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    setTimeout(function(){
        $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res)
        {
            if(res[0].Exito)
            {
               
                $.confirm({
                    title: 'Éxito',
                    type:'green',
                    icon: 'fa fa-check nuevoingresoico',
                    typeAnimated:true,
                    content: res[0].MSJ,
                    buttons: {
                        Aceptar: function () {
                     
                        },
                    }
                });

                ocultarCargador();

            }
            else
            {
                $.confirm({
                    title: 'Error',
                    type:'red',
                    icon: 'fa fa-check bajasico',
                    typeAnimated:true,
                    content: res[0].MSJ,
                    buttons: {
                        Aceptar: function () {
                            getConfig();
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
    });  },1500); 
}
function pasaGridNAaADeleteC(){
    var uIds = new Array();
    let rowIndex=$('#gdMatrizAsoacidos').jqxGrid('selectedrowindexes');
   // let dataRow=$('#gdMatrizNoAsoacidos').jqxGrid('getrowdata', selectionIndex);
    if(rowIndex !== -1){
       let rowsCNAsociados= $("#gdMatrizAsoacidos").jqxGrid('getboundrows');
        //----No asociados selccionados 
        let conceptoSeleccionado=new Array();
        //----No asociados seleccionados 
        let conceptoNosolecccionados=new Array();
        var rowIDs = new Array();
        rowsCNAsociados.map((row, index) => {
            //---si no esta seleccionado
            if(rowIndex.indexOf(row.uid) == -1){
                conceptoNosolecccionados.push(row);
            }
            else{
                conceptoSeleccionado.push(row);
                
            }
        });

      
        
        //----Respaldamos la información del grid destino 
        
        var conceptosAgregados=$('#gdMatrizNoAsoacidos').jqxGrid('getrows');
        if (conceptosAgregados.length > 0)
        conceptosAgregados.map((presel) => {
            conceptoSeleccionado.push(presel);
            //arrPlazasSeleccionados.push();
        });

        //---Actualziando el grid destino 
        $(eval('gdMatrizNoAsoacidos')).localdata = conceptoSeleccionado;
        
        $("#gdMatrizNoAsoacidos").jqxGrid('updatebounddata');
        $("#gdMatrizNoAsoacidos").jqxGrid('refresh');

        let source = {
            datatype: 'json',
            localdata: conceptoSeleccionado
        };
        let dataAdapter = new $.jqx.dataAdapter(source);
        $("#gdMatrizNoAsoacidos").jqxGrid({ source: dataAdapter });

        //Actualiza Grid No Asociados
        $('#gdMatrizNoAsoacidos').jqxGrid('clear');
        let sourceNO = {
            datatype: 'json',
            localdata: conceptoNosolecccionados
        };
        let dataAdapterNO = new $.jqx.dataAdapter(sourceNO);
        $("#gdMatrizAsoacidos").jqxGrid({ source: dataAdapterNO });
     
    }
}

function DescargaExcel(id) {
	mostrarCargador();
   
            setTimeout(() => {
                const rows = $("#"+ id).jqxGrid('getRows');
                if (rows.length > 0) {
                    if(id==="gdMatrizNoAsoacidos"){
                        WriteExcel(rows, 'Consulta no asociados');
                    }else{
                        WriteExcel(rows, 'Consulta asociados');
                    }
                    //WriteExcel(rows, 'Consulta');
                }
                ocultarCargador();
            }, 1000);
    
}

//---------Fin Funciones del grid

function validaSeleccion(accion9) {
    let selectionIndex=$('#gdMatrizAsoacidos').jqxGrid('selectedrowindexes');
    let dataRow=$('#gdMatrizAsoacidos').jqxGrid('getrowdata', selectionIndex);
    let arrJson=[];
    if(metodo==="Agregar" && $('#idSubuentaMCC').val() !=="" && selectionIndex !== -1){
          selectionIndex.forEach((element,index) => {

                dataRow=$('#gdMatrizAsoacidos').jqxGrid('getrowdata', element);
                if(accion9==="nuevoConcepto"){
                    const idConcepto=parseInt(dataRow["Id_Concepto"]);
                    //let tipoAfectacion= dataRow["Tipodeafectacion"].toString();
                    let tipoAfectacion= dataRow["Tipodeafectacion"].toString();
                    const idCuentaContable=parseInt($('#idSubuentaMCC').val());

                    if (dataAdapterTipAfe._source.localdata != undefined ) {
                        let arreglo=new Array();
                        arreglo=[...dataAdapterTipAfe._source.localdata];
                        arreglo.forEach(element => {
                            if (element.Descripcion === dataRow["Tipodeafectacion"].toString() ) {
                                tipoAfectacion= element.Valor;
                            }
                        });
                    }
                        $("#gdMatrizAsoacidos").jqxGrid('endcelledit', element, "Tipodeafectacion", false);
                        arrJson.push({id_Concepto:idConcepto,id_CuentaContable:idCuentaContable,id_MovimientoContable:tipoAfectacion });
                       
                    
                  
                }
            });

            return arrJson;
        
        
    }
    else if(metodo==="Eliminar"  && selectionIndex !== -1){
        selectionIndex.forEach((element,index) => {

              dataRow=$('#gdMatrizAsoacidos').jqxGrid('getrowdata', element);
              if(accion9 !=="nuevoConcepto"){
                
                  const idConcepto=parseInt(dataRow["Id_RelConceptoCuentaContable"]);
                  arrJson.push({"id_RelConceptoCuentaContable":idConcepto});
              }
          });

          return arrJson;
      
      
  }
    else if(selectionIndex === -1){
        return false;
    }
    else if( accion="Agregar" && $('#idSubuentaMCC').val() === ""){
        return 'Seleccione una subcuenta';
    }
}
