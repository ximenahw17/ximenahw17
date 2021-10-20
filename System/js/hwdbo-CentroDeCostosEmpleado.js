var DatosInfo = {};

$(document).ready(function () {
    mostrarCargador();
   
    $.jqx.theme = "light";
    
    $("#jqxtabs").jqxTabs({ width: '100%', height: '101%', position: 'top', disabled:true }).on('tabclick', function (event) {
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
    $(".hwdbo-combo").jqxDropDownList({ width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none',theme:'fresh' });
    
    GetGridas();
    $('#myModal2').modal('hide');
    Combos();
    $('.class-link').click((event) => {
       
                         
        window.location.href="CentroDeCostos.html";
                           
                           
                 
  
       });
});


function Combos(){
    fillCombo(97, 'idCentroCostos', '');
    fillCombo(112, 'idPeriodos', '');
}
function GetGridas() 
{
   
    let _data = {
        "API": "74B36AC8E8A9B417AB6DC40DDD9A6036039E4689E95550E22A3170159783C2C5",
        "Parameters": "",
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer":getToken()
    }
  
    $.when(ajaxCatalogo("","")).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            armaGrid(response);
        }
        else
        {
            showMsg('Mensaje',response);
        }
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
            let ancho = element=="Nombre Corto" || element=="Nombre Largo" ? "30%":"13%";
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

    let botones="<div class=\"row\" style=\"margin-top:1.5%;margin-left:1%\">";
    botones+="<div class=\"col-md-1\"><button id=\"BtnAsignacion\"><i class=\"fa fa-plus-circle\"></i> Asignación CeCo</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
    botones+="</div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        showstatusbar: false,
        width: '101.45%',
        height:$("#jqxtabs").height() - 35,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 40,
        sortable: true,
        showstatusbar:true, 
        statusbarheight: 64, 
        ready:function(){
            $("#gdPlantilla").jqxGrid('updatebounddata');
            //$('#gdPlantilla').jqxGrid('autoresizecolumns','all');
        },
        renderstatusbar: function(statusbar){ 
            statusbar.append(botones); 
            $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel(); }); 
            $("#BtnAsignacion").jqxButton({ width: 156, height: 30 }).on('click',function(){ AsignacionCostos(); });
        },

    });

    /*$('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});*/

    //autoWidth(Object.keys(_data[0]));

    ocultarCargador();
}

function ajaxCatalogo(id,params){
    let _data = {
        "API": "74B36AC8E8A9B417AB6DC40DDD9A6036039E4689E95550E22A3170159783C2C5",
        "Parameters": "",
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer": getToken()
    }
    
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
        data: JSON.stringify(_data)
    });
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'Consulta');
		}
		ocultarCargador();
	}, 1000);
}

function AsignacionCostos(){
    var rowindexes = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if (rowindexes.length > 0) {
    $('#myModal2').modal('show');
    }else {
        showMsg('Mensaje','Seleccione uno o más registros');
        arregloJson=[];
    }
}
function genreaJson()
{

    var arregloJson=[];
    var arregloOcupacion=[];
    var rowindexes = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if (rowindexes.length > 0) {
        rowindexes.forEach(element => {
            var data = $('#gdPlantilla').jqxGrid('getrowdata', element);
            arregloOcupacion.push({"id_Ocupacion": data["ID"]});
        });
        var centroconsto=parseInt($('#idCentroCostos').val());
        var periodo=parseInt($('#idPeriodos').val());
        arregloJson.push({"id_CentroCosto":centroconsto,"periodoAplicacion": periodo,"id_Empleado": arregloOcupacion});
    } 
 return arregloJson;
   
} 

function validaCampos(elem) {
    mostrarUpCargador();
    let divId = elem.dataset.contenido;
    let resultValidacion = [];
    let arrObjetosValdiar = $("#" + divId + "").find('.aweb0');

    $.each(arrObjetosValdiar, function (index, data) {
        let idObjhtml = data.id;
        if ($("#" + idObjhtml + "").val() == "") {
            let ObjLabel = document.getElementById(divId).querySelector("label[for =" + idObjhtml + "]");
            resultValidacion.push("Falta asignar valor al campo " + ObjLabel.textContent + ". ");
        }
    });

    if (resultValidacion.length == 0) 
    {
        var apino = "ACA58CF4A3A17F129AB28B81D6FB3091D62BBED9567D7A6936209BEBEE60AE35";
        var jsonguardar=genreaJson();
        if (jsonguardar.length > 0) {
            var obj = new Object();
        obj.API=apino;
        obj.Parameters="";
        obj.JsonString=JSON.stringify(jsonguardar);
        obj.Hash= getHSH();
        obj.Bearer= getToken();
        
        setTimeout(function() {
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
                            content: 'Registro guardado con éxito.',
                            buttons: {
                                Aceptar: function () {
                                    let url = new URL(location.href).toString();
                                    changeLocation(url.split('?')[0]);
                                },
                            }
                        });
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
            });    
        },1500);
        } 
         
    }
    else
    {
        armaListaErrores(resultValidacion);
        ocultarUpCargador();
    }
}

