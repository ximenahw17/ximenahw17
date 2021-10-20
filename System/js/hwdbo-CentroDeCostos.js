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

    $(".hwdbo-texto").jqxInput({ width: '99%', height: '30px' });
        
    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px' });
    
    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' });

    $(".hwdbo-texto, .hwdbo-combo, .hwdbo-checkBox").on("change", function (event) {
        let idelem = this.id;
        let htmlObj = $("#" + idelem + "");
        let val = '';
        if(event.args.type=="mouse" || event.args.type=="keyboard")
        {
            if (htmlObj.hasClass("hwdbo-texto")) 
            {
                val = htmlObj.val().toString().toUpperCase();
            }
            else if (htmlObj.hasClass("hwdbo-combo")) 
            {
                var item = htmlObj.jqxDropDownList('getSelectedItem');
                val = item.value.toString();
            }
            else if (htmlObj.hasClass("hwdbo-checkBox")) 
            {            
                val = htmlObj.jqxCheckBox('val') ? "1" : "0";
            }

            DatosInfo[idelem] = val.toString();
        }
    });

    $(".hwdbo-calendario").on('change',function(event){
        if(event.args.type=="mouse" || event.args.type=="keyboard")
        {
            let idelem = this.id;
            let htmlObj = $("#" + idelem + "");
            let val = '';
            val = stringtoDate(htmlObj.val());
            DatosInfo[idelem] = val;
        }
    });
    
    GetGrid();

    let url = new URL(location.href);
    let _IdRef = url.searchParams.get("id");
    if(_IdRef!=null)
    {
        Nuevo();
    }

    InitDatos();
    ocultarCargador();
    //console.log(DatosInfo);
    $('.class-link').click((event) => {
       
                         
      window.location.href="CentroDeCostosEmpleado.html";
                         
                         
               

     });
});

function GetGrid() 
{
    $.when(ajaxCatalogo(102,"")).done(function (response) {
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
    botones+="<div class=\"col-md-1\"><button id=\"BtnNuevo\"><i class=\"fa fa-plus-circle\"></i> Nuevo</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
    botones+="</div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'singlerow',
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
        pagesize: 50,
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
            $("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
        },

    }).on('rowdoubleclick',function(event){
        var obj = event.args.row.bounddata;
        mostrarCargador();
        MapeaDatos(obj);
    });

    /*$('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});*/

    //autoWidth(Object.keys(_data[0]));

    ocultarCargador();
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

function Nuevo()
{
    $("#jqxtabs").jqxTabs('enableAt', 1); 
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo'); 
    limpiaCampos();
    $("#id_CentroCosto").val("0");
    DatosInfo["id_CentroCosto"]="0";
    $("#jqxtabs").jqxTabs('select',1);
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
        let infoJson=new Array();
        if (DatosInfo.id_CentroCosto=="0") {
            // DatosInfo.forEach(element => {
                infoJson.push({"claveCentroDeCostos": DatosInfo.claveCentroDeCostos,"nombreCorto":DatosInfo.nombreCorto,
                                "nombreLargo": DatosInfo.nombreLargo,"claveAntecedente":DatosInfo.claveAntecedente,
                                "vigenciaIncial":DatosInfo.vigenciaIncial,"vigenciaFinal": DatosInfo.vigenciaFinal});
            // });
        } else {
            // DatosInfo.forEach(element => {

                if (DatosInfo.vigenciaFinal === null || DatosInfo.vigenciaFinal ==="") {
                    infoJson.push({"id_CentroCosto": parseInt(DatosInfo.id_CentroCosto),"claveCentroDeCostos": DatosInfo.claveCentroDeCostos,
                    "nombreCorto": DatosInfo.nombreCorto,"nombreLargo": DatosInfo.nombreLargo,
                    "claveAntecedente":DatosInfo.claveAntecedente,"vigenciaIncial": DatosInfo.vigenciaIncial });
// });
                } else {
                    infoJson.push({"id_CentroCosto":parseInt(DatosInfo.id_CentroCosto),"claveCentroDeCostos": DatosInfo.claveCentroDeCostos,
                    "nombreCorto": DatosInfo.nombreCorto,"nombreLargo": DatosInfo.nombreLargo,
                    "claveAntecedente":DatosInfo.claveAntecedente,"vigenciaIncial": DatosInfo.vigenciaIncial,
                    "vigenciaFinal": DatosInfo.vigenciaFinal});
// });
                }
               
        }

        var apino =DatosInfo.id_CentroCosto=="0" ? "322158F879429EADEDAD049AFAC4F1F1CAD8C4B26F53B0EDD18A3BD90C116161":"8AA77C9D7273F0C3E3C459272677009FAB868E1038B1DB24F20D741C565E8D79";
        
        var obj = new Object();
        obj.API=apino;
        obj.Parameters="";
        obj.JsonString=JSON.stringify(infoJson);
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
                    showMsg("Error","Ocurrió un error al guardar: " + res.Msg);
                }
                ocultarUpCargador();
            });    
        },1500); 
    }
    else
    {
        armaListaErrores(resultValidacion);
        ocultarUpCargador();
    }
}

function MapeaDatos(obj2)
{

    var apino ="DFD2EE0EB7FC1C00DCF28956E6A2C964D2BCCAD4F4B3E215AA59AC31B489AD13";
        
    var obj = new Object();
    obj.API=apino;
    obj.Parameters="?Id_CentroCosto=" + obj2.IDcentrodecostos ;
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();
    
    setTimeout(function() {
        $.when(ajaxTokenFijo(obj)).done(function (res) {
            if(res)
            {
              
                //console.log(obj);
                DatosInfo.id_CentroCosto= obj2.IDcentrodecostos  !==  "" ? obj2.IDcentrodecostos .toString() : "";
                DatosInfo.claveCentroDeCostos= res[0]["Clave Centro de Costos"] !==  "" ?  res[0]["Clave Centro de Costos"].toUpperCase() : "";
                DatosInfo.nombreLargo=res[0]["Nombre Largo"] !==  "" ?  res[0]["Nombre Largo"].toUpperCase() : "";
                DatosInfo.nombreCorto=res[0]["Nombre Corto"] !== "" ? res[0]["Nombre Corto"].toUpperCase() : "";
                DatosInfo.claveAntecedente=res[0]["Clave Antecedente"] !==  "" ? res[0]["Clave Antecedente"].toString() : "";
                if(res[0]["Vigencia Inicial"] !="")
                {
                    DatosInfo.vigenciaIncial= res[0]["Vigencia Inicial"] !==  null ? formatDate(res[0]["Vigencia Inicial"]) : "";
                }
                if(res[0]["Vigencia Final"] !="")
                {
                    DatosInfo.vigenciaFinal= res[0]["Vigencia Final"] !== null ?  formatDate(res[0]["Vigencia Final"]) : "";
                }

                let objKeys = Object.keys(DatosInfo);
                $.each(objKeys, function (index, data) {
                    let htmlObj = $("#" + data + "");
                    let valor = DatosInfo[data];
                    
                    if (htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero")) {
                        $("#" + data + "").val(valor).toString();
                    }
                    else if (htmlObj.hasClass("hwdbo-calendario")) 
                    {
                        if(valor=="1900-01-01")
                        {
                            $("#" + data + "").val('');
                        }
                        else
                        {
                            $("#" + data + "").jqxDateTimeInput('setDate', valor);
                        }
                    }        
                });

                $("#jqxtabs").jqxTabs('enableAt', 1);
                $("#jqxtabs").jqxTabs('setTitleAt', 1,'Modificar');
                $("#jqxtabs").jqxTabs('select', 1);
                
                 setTimeout(ocultarCargador,3000);
               
            }
            else
            {
                showMsg("Error","Ocurrió un error al guardar: " + res.Msg);
            }
            ocultarUpCargador();
        });    
    },1500); 

    //console.log(DatosInfo);
}

