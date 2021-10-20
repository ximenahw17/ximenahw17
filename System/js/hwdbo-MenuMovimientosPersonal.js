var resultCurp=null;
var Id_MPv3 = '';
$(document).ready(function () {
    sessionStorage.clear();
    
    GuardaHash();

    setToken();

    $.jqx.theme = "light";

    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $("#SelRazonSocial").jqxDropDownList({ theme:'fresh', width:"100%", height:"27px", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", openDelay: 0, animationType: 'none' });

    fillCombo(40, 'SelRazonSocial', '');

    $("#SelRazonSocial").on('change',function(event){
        event.preventDefault();
        let IdPais=event.args.item.originalItem.Id_Pais;
        sessionStorage.setItem('SWRQYWlz',btoa(IdPais));
        sessionStorage.setItem('SWRfUmF6b25Tb2NpYWw=',btoa($(this).val()));
        $.when(ajaxCatalogo(46,'&_Parameters=\'curp\',\''+IdPais+'\'')).done(function (response) {
            $("#txtCUP").attr('placeholder',"Ingrese "+ response[0].Etiqueta+"...");
            $("#DivBusqueda").show();
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status===200)
            {
                $("#txtCUP").attr('placeholder',"Ingrese CURP...");
                $("#DivBusqueda").show();
            }
            else
            {
                showMsg('Error',errorThrown);
                $("#DivBusqueda").hide();
            }
        });
         
    });
    
    $('#jqxBtnBuscar').on('click', function () {
        if($("#txtCUP").val()!="")
        {
            mostrarCargador();
            buscaCURP();
        }
        else{
            showMsg('Mensaje','Por favor ingrese el CURP');
        }
    });

    $("#cardAltaEmpleado").hide();
    $("#cardModificaEmpleado").hide();
    $("#cardBajaEmpleado").hide();
    $("#cardReingresoEmpleado").hide();
    $("#cardAltaRazonSocial").hide();

    $(".card-option").on('click', function () {
        let _estatus = this.dataset.estatus;
        mostrarCargador();
        setTimeout(function(){ changeLocation("AltaEmpleado.html?estatus=" + _estatus + "&IdRef=" + Id_MPv3); },2000);
    });

});

function GuardaHash() {
    let url = new URL(location.href);
    let _IdRef = url.searchParams.get("siteCode");
    sessionStorage.setItem('aGFzaA==', _IdRef);
}

function NuevoIngreso()
{   
    $("#SelRazonSocial").jqxDropDownList('clearSelection');
    $("#txtCUP").val('');
    $("#DivBusqueda").hide();
    $("#DivInfo").hide();
    $("#offcanvasNuevoIngreso").offcanvas('show');
}

function validaCURP(elem) {
    let val = elem.value;
    let pais=atob(sessionStorage.getItem('SWRQYWlz'));
    console.log(pais);
    if(pais==157)
    {
        if (val.length == 18) {
            $("#jqxBtnBuscar").prop('disabled','');
        } else {
            $("#jqxBtnBuscar").prop('disabled','disabled');
        }
    }
    else
    {
        if (val.length > 5) {
            $("#jqxBtnBuscar").prop('disabled','');
        } else {
            $("#jqxBtnBuscar").prop('disabled','disabled');
        }
    }
}

function buscaCURP() 
{
    mostrarCargador();
    var obj1=new Object();
    obj1.CURP = $("#txtCUP").val();

    var obj = new Object();
    obj.API="A9BF89AA4713E434BD2872368786FF4B2191909791694F8FE23398473D0000D5";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(obj1);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    setTimeout(function()
    {
        $.when(ajaxTokenFijo(obj)).done(function (response) {
            if(response.length>1)
            {
                //Depurar subcontratantes
                $.each(response,function(i,row)
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
                });

                resultCurp=response;
                armaGrid(response);
                $("#DivInfo").show();
                $("#DivTarjetas").show();
                ocultarCargador();
    
            }
            else if(response.length==1)
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
                sessionStorage.setItem(response[0].Id_MPv3, btoa(JSON.stringify(response[0])));
                Id_MPv3 = response[0].Id_MPv3;
                
                resultCurp=response;
                armaGrid(response);
                $("#DivInfo").show();

                $('#gdPlantilla').jqxGrid('selectrow', 0);
                $("#DivTarjetas").show();

                //Activo
                if (response[0].estatus == "1") {
                    $("#cardAltaEmpleado").hide();
                    $("#cardModificaEmpleado").show();
                    $("#cardBajaEmpleado").show();
                    $("#cardReingresoEmpleado").hide();
                    $("#cardAltaRazonSocial").show();
                }
                //Inactivo
                else if (response[0].estatus == "2") {
                    $("#cardAltaEmpleado").hide();
                    $("#cardModificaEmpleado").hide();
                    $("#cardBajaEmpleado").hide();
                    $("#cardReingresoEmpleado").show();
                    $("#cardAltaRazonSocial").hide();
                }
                //No existe
                else if (response[0].estatus == "3") 
                {
                    $("#cardAltaEmpleado").show();
                    sessionStorage.setItem('Q1VSUA==',btoa($("#txtCUP").val()))
                    $("#cardModificaEmpleado").hide();
                    $("#cardBajaEmpleado").hide();
                    $("#cardReingresoEmpleado").hide();
                    $("#cardAltaRazonSocial").hide();
                }
                ocultarCargador();
            }
            else
            {
                $("#DivInfo").hide();
                $("#DivTarjetas").hide();
                ocultarCargador();
                showMsg("Mensaje","Ocurrió un error al obtener el CURP");
            }
        }).fail(function(){
            $("#DivInfo").hide();
            $("#DivTarjetas").hide();
            ocultarCargador();
            showMsg("Mensaje","Ocurrió un error al obtener el CURP");
        });
    },1500);
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
        let titulosGrid = ["noempleado","id_ocupacion","apellidopaterno","apellidomaterno","nombre","curp","nss","rfc","fechanacimiento","estatus"];
        let titulosGrid2 = ["No. Empleado","ID","Apellido Paterno","Apellido Materno","Nombre","CURP","NSS","RFC","Fecha Nacimiento","Estatus"];
        $.each(titulosGrid, function (index, element) {
            let ancho=index==0||index==1?"7.7%":"12.05%";
            _columns.push({
                text: titulosGrid2[index],
                datafield: textotodatafield(element),
                type: 'string',
                width: ancho,
                cellsalign:'center',
                align:'center'
            });
        });
   
        $.each(_data, function (index, data) {
            let newjson = new Object();
            newjson.noempleado=_data[index]["noempleado"];
            newjson.apellidopaterno=_data[index]["apellidopaterno"];
            newjson.apellidomaterno=_data[index]["apellidomaterno"];
            newjson.nombre=_data[index]["nombre"];
            newjson.curp=_data[index]["curp"];
            newjson.nss=_data[index]["nss"];
            newjson.rfc=_data[index]["rfc"];
            newjson.fechanacimiento=_data[index]["fechanacimiento"];
            newjson.id_ocupacion=_data[index]["id_ocupacion"];
            newjson.estatus=_data[index]["estatus"];
            _jsonData.push(newjson);
        });
    }

    let source = { datatype: 'json', localdata: JSON.stringify(_jsonData) };

    let dataAdapter = new $.jqx.dataAdapter(source);

    $("#DivInfo").html('<div id=\"gdPlantilla\"></div>');

    $("#gdPlantilla").jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'singlerow',
        showstatusbar: false,
        width: '99%',
        autoheight:true,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        sortable: true, 
        ready:function(){
            $("#gdPlantilla").jqxGrid('updatebounddata');
            $("#gdPlantilla").jqxGrid('hidecolumn','estatus');
            //$("#gdPlantilla").jqxGrid('autoresizecolumns');
        }

    }).on('rowdoubleclick',function(event){
        var args = event.args;
        console.log(args);
        var data = args.row.bounddata;
        $("#DivTarjetas").show();
        sessionStorage.setItem(resultCurp[args.row.boundindex].Id_MPv3, btoa(JSON.stringify(resultCurp[args.row.boundindex])));
        Id_MPv3 = resultCurp[args.row.boundindex].Id_MPv3;
        //Activo
        if (data.estatus == "1") {
            $("#cardAltaEmpleado").hide();
            $("#cardModificaEmpleado").show();
            $("#cardBajaEmpleado").show();
            $("#cardReingresoEmpleado").hide();
            $("#cardAltaRazonSocial").show();
        }
        //Inactivo
        else if (data.estatus == "2") {
            $("#cardAltaEmpleado").hide();
            $("#cardModificaEmpleado").hide();
            $("#cardBajaEmpleado").hide();
            $("#cardReingresoEmpleado").show();
            $("#cardAltaRazonSocial").hide();
        }
        //No existe
        else if (data.estatus == "3") 
        {
            $("#cardAltaEmpleado").show();
            sessionStorage.setItem('Q1VSUA==',btoa($("#txtCUP").val()))
            $("#cardModificaEmpleado").hide();
            $("#cardBajaEmpleado").hide();
            $("#cardReingresoEmpleado").hide();
            $("#cardAltaRazonSocial").hide();
        }

    });

    /*$('#gdPlantilla').on('bindingcomplete',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('filter',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('sort',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});
    $('#gdPlantilla').on('pagechanged',function(){ $('#gdPlantilla').jqxGrid('autoresizecolumns','all');});*/

}