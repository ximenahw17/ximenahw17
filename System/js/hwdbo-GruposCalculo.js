var DatosEditar = new Array();

$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";
    
    $("#jqxtabs").jqxTabs({ width: '100%', height: '100%', position: 'top' });

    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' });

    $(".hwdbo-texto").jqxInput({ width: '99%', height: '40px' });

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 

    $("#nombregrupoinfo").jqxInput({ disabled:true });

    Combos();
   
    $("#ididtipoperiodo").on('change',function(event){
        var params = new Object();
        params.idgrupoempresarial="pc";
        params.idtipoperiodo=$(this).val().toString();

        var obj = new Object();
        obj.API="AD9A9F170777BEF2698E46DCF0585073C62643555D214B8FF3AE4F97CFFAA556";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(params);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (res) {
            if(res.length>0)
            {
                var dataAdapter = new $.jqx.dataAdapter(res);
                $("#idrazonsocial").jqxDropDownList('clear');
                $("#idperfilcalendario").jqxDropDownList('clear');
                $("#idperfilcalendario").jqxDropDownList({
                    source: dataAdapter,
                    displayMember: "Descripcion",
                    valueMember: "Valor",
                    placeHolder:"--Seleccione--"                
                });
            }
            else
            {
                $("#idperfilcalendario").jqxDropDownList('clear');
            }
        }).fail(function(){ 
            $("#idperfilcalendario").jqxDropDownList('clear');
        });
    });

    $("#idperfilcalendario").on('change',function(event){
        var params = new Object();
        params.idgrupoempresarial="rs";
        params.idtipoperiodo=$("#ididtipoperiodo").val().toString();

        var obj = new Object();
        obj.API="AD9A9F170777BEF2698E46DCF0585073C62643555D214B8FF3AE4F97CFFAA556";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(params);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (res) {
            if(res.length>0)
            {
                var dataAdapter = new $.jqx.dataAdapter(res);
                $("#idrazonsocial").jqxDropDownList('clear');
                $("#idrazonsocial").jqxDropDownList({
                    source: dataAdapter,
                    displayMember: "Descripcion",
                    valueMember: "Valor",
                    placeHolder:"--Seleccione--",
                    checkboxes:true                
                });
            }
            else
            {
                $("#idrazonsocial").jqxDropDownList('clear');
            }
        }).fail(function(){ 
            $("#idrazonsocial").jqxDropDownList('clear');
        });
    });

    $("#idgrupoempresarial").on('change',function(event){
        $("#DivGrid").html('');
    });
              
});

function Combos()
{
    fillCombo(91, 'ididtipoperiodo', '');
    var json = new Object();
    json.idgrupoempresarial="cge";
    json.idtipoperiodo="cge";

    var obj = new Object();
    obj.API="AD9A9F170777BEF2698E46DCF0585073C62643555D214B8FF3AE4F97CFFAA556";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res.length>0)
        {
            var dataAdapter = new $.jqx.dataAdapter(res);
    
            $("#idgrupoempresarial").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });
        }
        else
        {
            $("#idgrupoempresarial").jqxDropDownList('clear');
        }
    }).fail(function(){ 
        $("#idgrupoempresarial").jqxDropDownList('clear');
    });

    setTimeout(ocultarCargador,1500);
}

function ComboGrupo()
{
    var json = new Object();
    json.idgrupoempresarial="cge";
    json.idtipoperiodo="cge";

    var obj = new Object();
    obj.API="AD9A9F170777BEF2698E46DCF0585073C62643555D214B8FF3AE4F97CFFAA556";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res.length>0)
        {
            var dataAdapter = new $.jqx.dataAdapter(res);
    
            $("#idgrupoempresarial").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });
        }
        else
        {
            $("#idgrupoempresarial").jqxDropDownList('clear');
        }
    }).fail(function(){ 
        $("#idgrupoempresarial").jqxDropDownList('clear');
    });
}

function Nuevo()
{
    $("#nombregrupo").val('');
    $("#offcanvasExample").offcanvas('toggle');
    $("#offcanvasRazon").offcanvas('hide');
}

function AgregarRS()
{
    var item = $("#idgrupoempresarial").jqxDropDownList('getSelectedItem').label;
    $("#nombregrupoinfo").val(item);
    $("#ididtipoperiodo").jqxDropDownList('clearSelection');
    $("#idperfilcalendario").jqxDropDownList('clear');
    $("#idrazonsocial").jqxDropDownList('clear');
    $("#offcanvasExample").offcanvas('hide');
    $("#offcanvasRazon").offcanvas('show');
}

function GuardarRS()
{
    if($("#ididtipoperiodo").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione periodicidad");
    }
    else
    {
        if($("#idperfilcalendario").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione perfil calendario");
        }
        else
        {
            var items = $("#idrazonsocial").jqxDropDownList('getCheckedItems');
            if(items.length==0)
            {
                showMsg("Mensaje","Por favor seleccione una o varias razones sociales");
            }
            else
            {
                mostrarUpCargador();
                let _jsonFinal =new Array();
                $.each(items,function(i,item){
                    var json = new Object();
                    json.idgrupoempresarial=$("#idgrupoempresarial").val().toString();
                    json.ididtipoperiodo=$("#ididtipoperiodo").val().toString();
                    json.idperfilcalendario=$("#idperfilcalendario").val().toString();
                    json.idrazonsocial=item.value.toString();

                    _jsonFinal.push(json);
                });

                var obj = new Object();
                obj.API="2D5101A23EB0BBF51F632A8BA223B7D78683B57D88225445328EA2CC06D0380F";
                obj.Parameters="";
                obj.JsonString=JSON.stringify(_jsonFinal);
                obj.Hash= getHSH();
                obj.Bearer= getToken();

                setTimeout(function(){
                    $.when(ajaxTokenFijo(obj)).done(function (res) 
                    {
                        console.log(res);   
                        if(res.error=="0")
                        {
                            $("#offcanvasRazon").offcanvas('hide');
                            $.confirm({
                                title: "Mensaje",
                                content: "Razón social agregada correctamente",
                                icon: 'fa fa-check nuevoingresoico',
                                type:'green',
                                typeAnimated:true,
                                columnClass: 'medium',
                                buttons: {
                                    aceptar: function () {                                       
                                        Buscar();
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
                        showMsg("Mensaje","Ocurrió un error");
                        ocultarUpCargador();
                    });  
                },1500);

            }
        }
    }
}

function NuevoGrupo()
{
    if($("#nombregrupo").val()!="")
    {
        var obj1=new Object();
        obj1.descripciongrupoempresarial = $("#nombregrupo").val();

        mostrarUpCargador();
        var obj = new Object();
        obj.API="303EA4959BED1413DAE5E6D78108B4D4CFA492D593F4373D51FD3E817FF95875";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(obj1);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        setTimeout(function(){
            $.when(ajaxTokenFijo(obj)).done(function (res) 
            {   
                if(res.error=="0")
                {
                    $.confirm({
                        title: "Mensaje",
                        content: "Grupo agregado correctamente",
                        icon: 'fa fa-check nuevoingresoico',
                        type:'green',
                        typeAnimated:true,
                        columnClass: 'medium',
                        buttons: {
                            Aceptar: function () {
                                $("#offcanvasExample").offcanvas('hide');
                                ComboGrupo();
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
                showMsg("Mensaje","Ocurrió un error");
                ocultarUpCargador();
            });  
        },1500);

    }
    else{
        showMsg("Mensaje","Por favor ingrese el nombre del grupo");
    }
}

function Buscar()
{
    if($("#idgrupoempresarial").val()!="")
    {
        var obj1 = new Object();
        obj1.idgrupoempresarial = $("#idgrupoempresarial").val().toString();
        obj1.idtipoperiodo="0"; 

        mostrarCargador();
        var obj = new Object();
        obj.API="AD9A9F170777BEF2698E46DCF0585073C62643555D214B8FF3AE4F97CFFAA556";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(obj1);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        setTimeout(function(){
            $.when(ajaxTokenFijo(obj)).done(function (res) 
            {   
                if(res.length>0)
                {
                    let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
                    botones+="<div class=\"col-1\"><center><button class=\"botonlargo\" data-accion=\"1\"><i class=\"fa fa-plus-square\"></i> Agregar razón social</button></center></div>";
                    botones+="<div class=\"col-1 offset-1\"><center><button id=\"BtnEditar\" class=\"boton\" data-accion=\"2\"><i class=\"fa fa-check\"></i> Activar</button></center></div>";
                    botones+="<div class=\"col-1 offset-1\"><center><button class=\"boton\" data-accion=\"3\"><i class=\"fa fa-close\"></i> Inactivar</button></center></div>";
                    botones+="</div>";                        
                    armaGrid("DivGrid","gdPlantilla",botones,res,$("#jqxtabs").height() - $("#divconsulta").height() - 95);
                }
                else
                {
                    showMsg('Mensaje',res);
                }                               
                ocultarCargador();
            }).fail(function(){
                let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
                botones+="<div class=\"col-1\"><center><button class=\"botonlargo\" data-accion=\"1\"><i class=\"fa fa-plus-square\"></i> Agregar razón social</button></center></div>";
                botones+="<div class=\"col-1 offset-1\"><center><button id=\"BtnEditar\" class=\"boton\" data-accion=\"2\"><i class=\"fa fa-check\"></i> Activar</button></center></div>";
                botones+="<div class=\"col-1 offset-1\"><center><button class=\"boton\" data-accion=\"3\"><i class=\"fa fa-close\"></i> Inactivar</button></center></div>";
                botones+="</div>";

                let NomDiv="gdPlantilla";
                let NomGrid="DivGrid";
                let text=["Id_RelGrupoCalculoRazonSocialPais","Periodicidades","Perfil calendario","Razón social","Estatus"];
                let _columns = [];
                $.each(text, function (index, element) {
                    let ancho = index==3 ?"40%":"20%";
                    _columns.push({
                        text: element,
                        datafield: textotodatafield(element),
                        type: 'string',
                        width: ancho,
                        cellsalign:'center',
                        align:'center'
                    });
                });

                let oculta="Id_RelGrupoCalculoRazonSocialPais";
                let _oculta="";
                if(oculta!="")
                {
                    $.each(oculta.split(','),function(i,row){
                        _oculta+="$('#"+NomDiv+"').jqxGrid('hidecolumn','"+row+"');" + "\n"
                    });
                }
            
                $("#" + NomGrid).html('<div id=\"'+NomDiv+'\" style=\"margin-left:-0.5%\"></div>');
                $("#" + NomDiv).jqxGrid({
                    autoshowfiltericon: true,
                    columns: _columns,
                    source: [],
                    selectionmode: 'singlerow',
                    showstatusbar: false,
                    width: '103%',
                    height: $("#jqxtabs").height() - $("#divconsulta").height() - 95,
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
                        $("#" + NomDiv).jqxGrid('updatebounddata');
                        eval(_oculta);
                        //$("#" + NomDiv).jqxGrid('autoresizecolumns');
                    },
                    renderstatusbar: function(statusbar){ 
                        if(botones!="")
                        {
                            statusbar.append(botones); 
                            $(".boton").jqxButton({ theme:'fresh', width: 130, height: 32 }).on('click',function(){ AccionBoton($(this).data('accion')); });
                            $(".botonlargo").jqxButton({ theme:'fresh', width: 165, height: 32 }).on('click',function(){ AccionBoton($(this).data('accion')); });
                        }
                    },
            
                });
                ocultarCargador();
            });  
        },1500);
    }
    else{
        showMsg("Mensaje","Por favor seleccione un grupo empresarial");
    }
}

function armaGrid(NomGrid,NomDiv,botones,_data,altura,edita=false) {
    
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
            let ancho = index==3 ?"40%":"20%";
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

    let oculta="Id_RelGrupoCalculoRazonSocialPais";
    let _oculta="";
    if(oculta!="")
    {
        $.each(oculta.split(','),function(i,row){
            _oculta+="$('#"+NomDiv+"').jqxGrid('hidecolumn','"+row+"');" + "\n"
        });
    }

    $("#" + NomGrid).html('<div id=\"'+NomDiv+'\" style=\"margin-left:-0.5%\"></div>');
    $("#" + NomDiv).jqxGrid({
        autoshowfiltericon: true,
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'singlerow',
        showstatusbar: false,
        width: '103%',
        height: altura,
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
            $("#" + NomDiv).jqxGrid('updatebounddata');
            eval(_oculta);
            //$("#" + NomDiv).jqxGrid('autoresizecolumns');
        },
        renderstatusbar: function(statusbar){ 
            if(botones!="")
            {
                statusbar.append(botones); 
                $(".boton").jqxButton({ theme:'fresh', width: 130, height: 32 }).on('click',function(){ AccionBoton($(this).data('accion')); });
                $(".botonlargo").jqxButton({ theme:'fresh', width: 165, height: 32 }).on('click',function(){ AccionBoton($(this).data('accion')); });
            }
        },

    });

    $("#" + NomDiv).on('bindingcomplete',function(){ eval(_oculta); $("#" + NomDiv).jqxGrid('autoresizecolumns','all');});
    $("#" + NomDiv).on('filter',function(){ eval(_oculta); $("#" + NomDiv).jqxGrid('autoresizecolumns','all');});
    $("#" + NomDiv).on('sort',function(){ eval(_oculta); $("#" + NomDiv).jqxGrid('autoresizecolumns','all');});
    $("#" + NomDiv).on('pagechanged',function(){ eval(_oculta); $("#" + NomDiv).jqxGrid('autoresizecolumns','all');});

    ocultarCargador();
}

function AccionBoton(id)
{
    switch(id)
    {
        case 1://Agregar razon social
            AgregarRS();
            break;
        case 2: //Inactivar/Activar
        case 3:
            var rowindex = $('#gdPlantilla').jqxGrid('getselectedrowindex');
            
            if(rowindex>=0)
            {
                var data = $('#gdPlantilla').jqxGrid('getrowdatabyid', rowindex);
                var params = new Object();
                params.idrelgrupocalculorazonsocialpais = data.Id_RelGrupoCalculoRazonSocialPais.toString();
                params.activarinactiva = id==2 ? "1":"0";

                if(id==2 && data.Estatus=="Activo")
                {
                    showMsg("Mensaje","Este registro ya se encuentra activo");
                }
                else if(id==3 && data.Estatus=="Inactivo")
                {
                    showMsg("Mensaje","Este registro ya se encuentra inactivo");
                }
                else
                {
                    mostrarCargador();
                    var obj = new Object();
                    obj.API="03A4DEF9C9DA9AE30B967D849B216C6F68C498A7E7995560DE7E7067A54DFCC2";
                    obj.Parameters="";
                    obj.JsonString=JSON.stringify(params);
                    obj.Hash= getHSH();
                    obj.Bearer= getToken();

                    setTimeout(function(){
                        $.when(ajaxTokenFijo(obj)).done(function (res) 
                        {   
                            if(res.error=="0")
                            {
                                $.confirm({
                                    title: "Mensaje",
                                    content: "Registro actualizado correctamente",
                                    icon: 'fa fa-check nuevoingresoico',
                                    type:'green',
                                    typeAnimated:true,
                                    columnClass: 'medium',
                                    buttons: {
                                        aceptar: function () {
                                            Buscar();
                                        }
                                    }
                                });
                            }
                            else
                            {
                                showMsg('Mensaje',res.msg);
                            }                              
                            ocultarCargador();
                        }).fail(function(){
                            showMsg("Mensaje","Ocurrió un error");
                            ocultarCargador();
                        });  
                    },1500);
                }
            }
            else{
                showMsg("Mensaje","Por favor seleccione un registro");
            }
            break;
        default:
            break;
            
    }
}