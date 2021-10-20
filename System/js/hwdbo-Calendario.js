var editando = 0;
var campo = "";
var DatosEditar = new Array();
const ke = new KeyboardEvent("keydown", {
    bubbles: true, cancelable: true, keyCode: 13
});
$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";
    
    $("#jqxtabs").jqxTabs({ width: '100%', height: '100%', position: 'top' });

    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' });

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 

    Combos();

    GetGridInicial();

    $("#idtipoperiodo").on('change',function(event){
        var json = new Object();
        json.idtipoperiodo=$(this).val().toString();
        json.idperfilcalendario="0";

        var obj = new Object();
        obj.API="709B7014A1B8F76A66E06AF4116B7BE81587D397C646E5BA8B6BB78755D64937";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(json);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        if(event.args.type=="mouse")
        {
            $("#DivGrid").html('');
        }

        $.when(ajaxTokenFijo(obj)).done(function (res) {
            if(res.length>0)
            {
                var dataAdapter = new $.jqx.dataAdapter(res);

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
                $("#DivGrid").html('');
            }
            ocultarUpCargador();
        }).fail(function(){ 
            $("#idperfilcalendario").jqxDropDownList('clear');
            $("#DivGrid").html('');
        });
    });

    $("#divContenido").show();
               
});

function GetGridInicial() 
{
    var json = new Object();
    json.idtipoperiodo="1";
    json.idperfilcalendario="1";

    var obj = new Object();
    obj.API="709B7014A1B8F76A66E06AF4116B7BE81587D397C646E5BA8B6BB78755D64937";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) 
    {
        if(response.length>0)
        {
            let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
            botones+="<div class=\"d-grid gap-2 d-md-flex\">";
            botones+="<div class=\"col-sm-1 noedit\"><center><button class=\"boton btn btn-outline-dark btn-sm\" data-accion=\"1\"><span class=\"fa fa-plus-square\"></span> Nuevo Perfil</button></center></div>";
            botones+="<div class=\"col-sm-1 noedit\"><center><button id=\"BtnEditar\" class=\"boton btn btn-outline-dark btn-sm\" data-accion=\"2\"><span class=\"fa fa-edit\"></span> Modificar</button></center></div>";
            botones+="<div class=\"col-sm-1 noedit\"><center><button class=\"boton btn btn-outline-dark btn-sm\" data-accion=\"3\"><span class=\"fa fa-file-excel-o\"></span> Exportar</button></center></div>";
            botones+="<div class=\"col-sm-1 offset-1 edit\" style=\"display:none\"><center><button class=\"boton btn btn-outline-dark btn-sm\" data-accion=\"5\"><span class=\"fa fa-save\"></span> Guardar cambios</button></center></div>";
            botones+="<div class=\"col-sm-1 offset-1 edit\" style=\"display:none\"><center><button class=\"boton btn btn-outline-dark btn-sm\" data-accion=\"6\"><span class=\"fa fa-close\"></span> Cancelar</button></center></div>";
            botones+="</div></div>";

            armaGrid("DivGrid","gdPlantilla",botones,response,$("#jqxtabs").height() - $("#divconsulta").height() - 95);
            $("#BtnEditar").jqxButton({ disabled:true});
            setTimeout(function(){$("#idtipoperiodo").val('1');},1);
            setTimeout(function(){$("#idperfilcalendario").val('1');},1000);
        }
        else
        {
            showMsg('Mensaje',response);
        }
                
        setTimeout(ocultarCargador,4500);
    }).fail(function(){
        setTimeout(ocultarCargador,500);
    });
}

async function Combos()
{
   let tipoperiodo = await fillCombo(91, 'idtipoperiodo', '');
   let periodcidsad= await fillCombo(91, 'idperiodicidad', '');
   var json = new Object();
   json.idtipoperiodo="0";
   json.ano="0";

   var obj = new Object();
   obj.API="95FA0AFE90F7FFDAC2D93949FC6A336DE9C5774B320785F61F02FF6E79F32F14";
   obj.Parameters="";
   obj.JsonString=JSON.stringify(json);
   obj.Hash= getHSH();
   obj.Bearer= getToken();

   $.when(ajaxTokenFijo(obj)).done(function (res) {
    if(res.length>0)
    {
        var dataAdapter = new $.jqx.dataAdapter(res);

        $("#idanio").jqxDropDownList({
            source: dataAdapter,
            displayMember: "Descripcion",
            valueMember: "Valor",
            placeHolder:"--Seleccione--"                
        });
    }
    else
    {
        $("#idanio").jqxDropDownList('clear');
    }
    ocultarUpCargador();
}).fail(function(){ 
    $("#idanio").jqxDropDownList('clear');
});
   
}

function Buscar()
{
    if($("#idtipoperiodo").val()!="")
    {
        if($("#idperfilcalendario").val()!="")
        {
            mostrarCargador();
            var json = new Object();
            json.idtipoperiodo=$("#idtipoperiodo").val().toString();
            json.idperfilcalendario=$("#idperfilcalendario").val().toString();

            var obj = new Object();
            obj.API="709B7014A1B8F76A66E06AF4116B7BE81587D397C646E5BA8B6BB78755D64937";
            obj.Parameters="";
            obj.JsonString=JSON.stringify(json);
            obj.Hash= getHSH();
            obj.Bearer= getToken();

            setTimeout(function() {
                $.when(ajaxTokenFijo(obj)).done(function (response) 
                {
                    if(response.length!=undefined && response.length>0)
                    {
                        let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
                        botones+="<div class=\"d-grid gap-2 d-md-flex\">";
                        botones+="<div class=\"col-sm-1 noedit\"><center><button class=\"boton btn btn-outline-dark btn-sm\" data-accion=\"1\"><span class=\"fa fa-plus-square\"></span> Nuevo Perfil</button></center></div>";
                        botones+="<div class=\"col-sm-1 noedit\"><center><button id=\"BtnEditar\" class=\"boton btn btn-outline-dark btn-sm\" data-accion=\"2\"><span class=\"fa fa-edit\"></span> Modificar</button></center></div>";
                        botones+="<div class=\"col-sm-1 noedit\"><center><button class=\"boton btn btn-outline-dark btn-sm\" data-accion=\"3\"><span class=\"fa fa-file-excel-o\"></span> Exportar</button></center></div>";
                        botones+="<div class=\"col-sm-1 offset-1 edit\" style=\"display:none\"><center><button class=\"boton btn btn-outline-primary btn-sm\" data-accion=\"5\"><span class=\"fa fa-save\"></span> Guardar cambios</button></center></div>";
                        botones+="<div class=\"col-sm-1 offset-1 edit\" style=\"display:none\"><center><button class=\"boton btn btn-outline-primary btn-sm\" data-accion=\"6\"><span class=\"fa fa-close\"></span> Cancelar</button></center></div>";
                        botones+="</div></div>";  
                        
                        armaGrid("DivGrid","gdPlantilla",botones,response,$("#jqxtabs").height() - $("#divconsulta").height() - 95);
                        if($("#idperfilcalendario").val()=="1")
                        {
                            $("#BtnEditar").jqxButton({ disabled:true});
                        }
                        else{
                            $("#BtnEditar").jqxButton({ disabled:false});
                        }
                    }
                    else
                    {
                        showMsgSinTimer('Mensaje',response.msg);
                        $("#DivGrid").html('');
                    }
                    ocultarCargador();
                });    
            },1000);
        }
        else
        {
            showMsg("Mensaje","Por favor seleccione perfil calendario");
        }
    }
    else
    {
        showMsg("Mensaje","Por favor seleccione periodicidad");
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
            switch(index)
            {
                case 5:
                case 6:
                case 7:
                    _columns.push({
                        text: element,
                        datafield: textotodatafield(element),
                        columntype : 'datetimeinput',
                        filtertype: 'date',
                        cellsformat: 'dd/MM/yyyy',
                        width: '12%',
                        cellsalign:'center',
                        align:'center',
                        classname:'negritas',
                        editable:true,
                        validation: function (cell, value) { if ( value == '' || value == null) { return { result: false, message: 'Por favor seleccione una fecha' } } else { return true; } },
                        initeditor: function (row, cellvalue, editor, celltext, pressedChar){
                            editando=row; 
                            campo=textotodatafield(element);
                            editor.jqxDateTimeInput({ formatString: "dd/MM/yyyy" });
                            editor.val(formatDate(cellvalue));
                        }
                    });
                    break;
                case 8:
                    _columns.push({
                        text: element,
                        datafield: textotodatafield(element),
                        columntype: 'combobox',
                        width: '12%',
                        cellsalign:'center',
                        align:'center',
                        editable:true,
                        classname:'negritas',
                        initeditor: function (row, cellvalue, editor, celltext, pressedChar) {
                            var obj = new Object();
                            obj.API="0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1";
                            obj.Parameters="?_Id=90&_Domain={d}";
                            obj.JsonString="";
                            obj.Hash= getHSH();
                            obj.Bearer="";

                            $.when(ajaxTokenFijo(obj)).done(function (res) {
                                //console.log(res);
                                var dataAdapter = new $.jqx.dataAdapter(res);
                                editor.jqxComboBox({ theme:'fresh', source: dataAdapter, displayMember: 'Descripcion', valueMember: 'Valor', searchMode: 'containsignorecase', autoDropDownHeight: false, autoOpen:true, placeHolder: '--Seleccione--', enableBrowserBoundsDetection: false, popupZIndex: 999999 });
                                editor.on('close', function (event) { setTimeout(function() { document.body.dispatchEvent(ke);},500); });
                            });
                        },
                        validation: function (cell, value) {
                            if (value == '' || value == undefined) {
                                return { result: false, message: 'Por favor seleccione una opción, para salir presione ESC' };
                            }
                            else {
                                return true;
                            }
                        },
                        geteditorvalue: function (row, cellvalue, editor) {
                            var item = editor.jqxComboBox('getSelectedItem');
                            if (item != null) {
                                $('#'+ NomDiv).jqxGrid('setcellvalue', row,'Id_Mes',Number(editor.val()));
                                return item.label;
                            }
                        }
                    });
                    break;
                default:
                    _columns.push({
                        text: element,
                        datafield: textotodatafield(element),
                        type: 'string',
                        width: '15%',
                        cellsalign:'center',
                        align:'center',
                        editable:false
                    });
                    break;
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

    let ssb = botones=="" ? false:true;

    let oculta="Id_PeriodoNomina,TotalPeriodos";
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
        editable:edita,
        showstatusbar:ssb, 
        statusbarheight: 64, 
        ready:function(){
            $("#" + NomDiv).jqxGrid('updatebounddata');
            eval(_oculta);
            //$("#" + NomDiv).jqxGrid('autoresizecolumns');
            $('#' + NomDiv).jqxGrid('sortby', 'Id_Mes', 'asc');
        },
        renderstatusbar: function(statusbar){ 
            if(botones!="")
            {
                statusbar.append(botones); 
                $(".boton").on('click',function(){ AccionBoton($(this).data('accion')); });
            }
        },

    });

    $('#' + NomDiv).on('cellbeginedit',function(event){
        editando=event.args.row.boundindex;
        campo=event.args.datafield;
    });

    $('#' + NomDiv).on('cellendedit',function(event){
        let i =event.args.row.boundindex;
        if(event.args.datafield=="Vigenciafinal")
        {
            var value = new Date(args.value);
            const newDate = value.setDate(value.getDate() + 1);
            $("#" + NomDiv).jqxGrid('setcellvalue', i+1, "Vigenciainicial", new Date(newDate));
        }
    });

    //$("#" + NomDiv).on('bindingcomplete',function(){ eval(_oculta); $("#" + NomDiv).jqxGrid('autoresizecolumns','all');});
    //$("#" + NomDiv).on('filter',function(){ eval(_oculta); $("#" + NomDiv).jqxGrid('autoresizecolumns','all');});
    //$("#" + NomDiv).on('sort',function(){ eval(_oculta); $("#" + NomDiv).jqxGrid('autoresizecolumns','all');});
    //$("#" + NomDiv).on('pagechanged',function(){ eval(_oculta); $("#" + NomDiv).jqxGrid('autoresizecolumns','all');});

    ocultarCargador();
}

function AccionBoton(id)
{
    switch(id)
    {
        case 1: //Nuevo
            Nuevo();
            break;
        case 2: //Editar
            $.confirm({
                title: "Modificar calendario",
                content: "Se habilitará la tabla en modo edición",
                icon: 'fa fa-info-circle',
                type:'blue',
                typeAnimated:true,
                columnClass: 'medium',
                buttons: {
                    Aceptar: function () {
                        $("#gdPlantilla").jqxGrid({ editable: true, theme:'fresh'});
                        $("#gdPlantilla").on('cellendedit',function(event){
                            var obj = event.args.row;
                            Inserta(obj);
                        });
                        $(".noedit").hide();
                        $(".edit").show();
                        $(".boton").jqxButton({theme:'bootstrap', width:'145'});
                    },
                    Cancelar:function(){}
                }
            });
            break;
        case 3: //Exportar
            DescargaExcel();
            break;
        case 4://Crear nuevo
            GuardarNuevo();
            break;
        case 5://Guardar cambios
            Guardar();
            break;
        case 6: //Cancela edit
            Buscar();
            break;
        default:
            break;
    }
}

function Nuevo()
{
    $("#idanio").jqxDropDownList('clearSelection',true);
    $("#idperiodicidad").jqxDropDownList('clearSelection',true);
    //$('#myModal2').modal('show');
    $("#offcanvasExample").offcanvas('show');
}

function NuevoPerfil()
{
    if($("#idanio").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione año");
    }
    else
    {
        if($("#idperiodicidad").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione periodicidad");
        }
        else
        {
            mostrarCargador();


            var json = new Object();
            json.idtipoperiodo=$("#idperiodicidad").val().toString();
            json.ano=$("#idanio").val().toString();

            var obj = new Object();
            obj.API="95FA0AFE90F7FFDAC2D93949FC6A336DE9C5774B320785F61F02FF6E79F32F14";
            obj.Parameters="";
            obj.JsonString=JSON.stringify(json);
            obj.Hash= getHSH();
            obj.Bearer= getToken();

            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response.length>0)
                {
                    let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
                    botones+="<div class=\"col-md-1\"><center><button class=\"boton\" data-accion=\"4\"><i class=\"fa fa-save\"></i> Guardar</button></center></div>";
                    botones+="</div>";
                    armaGrid("DivGrid3","gdPlantilla3",botones,response,$("#jqxtabs").height()- $("#divnombre").height() - 137,true);
                    //$('#myModal2').modal('hide');
                    $("#offcanvasExample").offcanvas('hide');
                    $("#jqxtabs").jqxTabs('enableAt', 1);
                    var item = $("#idperiodicidad").jqxDropDownList('getSelectedItem');
                    var item1 = $("#idanio").jqxDropDownList('getSelectedItem');
                    $("#jqxtabs").jqxTabs('setTitleAt', 1,'Nuevo Perfil: ' + item.label.split('-')[1] + " "+ item1.label);
                    $("#periodosel").html("<i class='fa fa-info-circle fa-lg'></i> Nuevo periodo: <b>" + item.label.split('-')[1] + " " + item1.label+"</b>");
                }
                else
                {
                    showMsg('Mensaje',response);
                }
        
                $("#jqxtabs").jqxTabs('select', 1);
                setTimeout(ocultarCargador,1000);
            }).fail(function(){
                ocultarCargador();
                showMsg('Mensaje','No se pudo obtener la tabla');
            });
        }
    }
}

function GuardarNuevo()
{
    if($("#nombreperfil").val()=="")
    {
        showMsg("Mensaje","Por favor ingrese un nombre de perfil");
    }
    else
    {
        mostrarUpCargador();
        $("#gdPlantilla3").jqxGrid('endcelledit', editando, campo, false);

        var DatosFinal=new Array();
        var DatosInfo=$("#gdPlantilla3").jqxGrid('getrows');
        //Armar json final
        $.each(DatosInfo,function(i,row){
            var json=new Object();
            json.perfilcalendario=$("#nombreperfil").val();
            json.idperiodonomina=row.Id_PeriodoNomina.toString();
            json.vigenciainicial=formatDate(row.Vigenciainicial.toString());
            json.vigenciafinal=formatDate(row.Vigenciafinal.toString());
            json.fechapago=formatDate(row.Fechadepago.toString());
            json.idmes=row.Id_Mes.toString();
            DatosFinal.push(json);
        });

        //console.log(DatosFinal);
        if(DatosFinal.length>0)
        {
            var obj = new Object();
            obj.API="E98E181935943E56C19F55052D539240B5C0D897BDC75609A980EC47A611D2B0";
            obj.Parameters="";
            obj.JsonString=JSON.stringify(DatosFinal);
            obj.Hash= getHSH();
            obj.Bearer= getToken();
    
            setTimeout(function(){
                $.when(ajaxTokenFijo(obj)).done(function (res) 
                {
                    //console.log(res);
                    if(res)
                    {
                        if(res.error=="0")
                        {
                            $.confirm({
                                title: 'Éxito',
                                type:'green',
                                icon: 'fa fa-check nuevoingresoico',
                                typeAnimated:true,
                                content: 'Calendario guardado con éxito.',
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
                                content: res.msg,
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
                }).fail(function(){
                    showMsg("Mensaje","Ocurrió un error al guardar el calendario");
                    ocultarUpCargador();
                });  
            },1500);
        }
        else
        {
            ocultarUpCargador();
            showMsg("Mensaje","No hay cambios para guardar");
        }
    }
}

function Guardar()
{
    $("#gdPlantilla").jqxGrid('endcelledit', editando, campo, false);

    var DatosFinal=new Array();

    //Armar json final
    $.each(DatosEditar,function(i,row){
        var json=new Object();
        json.idperfilcalendario=$("#idperfilcalendario").val().toString();
        json.idperiodonomina=row.Id_PeriodoNomina.toString();
        json.vigenciainicial=formatDate(row.Vigenciainicial.toString());
        json.vigenciafinal=formatDate(row.Vigenciafinal.toString());
        json.fechapago=formatDate(row.Fechadepago.toString());
        json.idmes=row.Id_Mes.toString();
        DatosFinal.push(json);
    });

    console.log(DatosFinal);
    if(DatosFinal.length>0)
    {
        mostrarUpCargador();
        var obj = new Object();
        obj.API="5E4D608A9E4634E305B509B8D46860790A12F5E508B68AA81677628AC0F21EFA";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(DatosFinal);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        setTimeout(function(){
            $.when(ajaxTokenFijo(obj)).done(function (res) 
            {
                //console.log(res);               
                if(res.length>0)
                {
                    let mensajes="";
                    var item = $("#idperfilcalendario").jqxDropDownList('getSelectedItem');
                    $.each(res,function(i,row){
                        if(row.Result!=1)
                        {
                            mensajes+="<p>"+row.MsgError+"</p>"
                        }
                    });

                    if(mensajes=="")
                    {
                        $.confirm({
                            title: 'Éxito',
                            type:'green',
                            icon: 'fa fa-check nuevoingresoico',
                            typeAnimated:true,
                            content: 'Calendario ' +item.label+ ' guardado con éxito.',
                            buttons: {
                                Aceptar: function () {
                                    //let url = new URL(location.href).toString();
                                    //changeLocation(url.split('?')[0]);
                                    Buscar();
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
                            content: mensajes,
                            buttons: {
                                Aceptar: function () {
                                    let url = new URL(location.href).toString();
                                    changeLocation(url.split('?')[0]);
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
            }).fail(function(){
                showMsg("Mensaje","Ocurrió un error al guardar el calendario");
                ocultarUpCargador();
            });  
        },1500);
    }
    else
    {
        ocultarUpCargador();
        showMsg("Mensaje","No hay cambios para guardar");
    }
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows.length > 0) {
			WriteExcel(rows, 'PerfilCalendario');
		}
		ocultarCargador();
	}, 1000);
}

function Inserta(obj)
{
    if(DatosEditar.length==0)
    {
        DatosEditar.push(obj);
    }
    else
    {
        var replace=false;
        $.each(DatosEditar,function(i,row){
            if(row.Id_PeriodoNomina==obj.Id_PeriodoNomina)
            {
                DatosEditar[i]=obj;
                replace=true;
            }
        });
        if(replace==false)
            DatosEditar.push(obj);
    }
}