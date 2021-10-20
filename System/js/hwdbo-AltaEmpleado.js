var fecha = new Date();
var dd = fecha.getDate();
var mm = fecha.getMonth() + 1;
var yy = fecha.getFullYear();
var IdResultadoBusqueda = "";
var arrTabsNuevo = {
    "divDatosGenerales": 0, "divDatosContacto": 1, "divDatosDomicilio": 2, "divDatosAcademicos": 3, "divDatosSalud": 4
};

var DatosEmpleado = {};
var DatosEmpOriginal={};
var cambios=new Array();
var Estatus = 0;
const ke = new KeyboardEvent("keydown", {
    bubbles: true, cancelable: true, keyCode: 13
});

const controlesPago = ['formapago',
'banco',
'ctabancaria',
'clabe'
];

const controlesEscolar=['gradoestudios',
'especialidad',
'cedulaprofesional'
];

const controlesDomicilio=['pais',
'cp',
'entidadfederativa',
'municipio',
'colonia',
'calle',
'noexterior',
'nointerior',
'latitud',
'longitud'
];

const controlesBajas=[
    'fechafinal',
    'contratotemporal',
    'bajaautomatica'
];


$(document).ready(function () {
    $.jqx.theme = "light";   
    let uri = new URL(location.href);
    let _estatus = uri.searchParams.get("estatus");    
    IdResultadoBusqueda = uri.searchParams.get("IdRef");
    Estatus = _estatus;
    //cargar primero el combo que tarda mas para bajar tiempo de espera
    //let _data = JSON.parse(atob(localStorage.getItem(IdResultadoBusqueda)));
    let _data = JSON.parse(atob(sessionStorage.getItem(IdResultadoBusqueda)));
    fillCombo(21, 'id_tabulador', "&_Parameters='" + _data.registropatronal + "','" + _data.puesto + "','" + _data.periodopago + "'");
    fillCombo(19, 'sindicato', '&_Parameters=' + _data.registropatronal);
    CombosTabGenerales();
    armaGridSubcontratantes(_estatus);

    $("#jqxtabs").jqxTabs({ width: '99.5%', height: '100%', position: 'top' });

    $(".hwdbo-boton").jqxButton({ width: '150', height: '30' });

    $(".hwdbo-texto").jqxInput({ width: '99%', height: '30px' });

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Selecione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' });

    $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px',todayString: '', clearString: '' });
    
    $(".hwdbo-calendario").jqxDateTimeInput('setDate', new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));

    $("#fechaingreso").jqxDateTimeInput({ min: new Date(1900, 0, 1), max: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) });
    
    $("#fechaantiguedad").jqxDateTimeInput({ min: new Date(1900, 0, 1), max: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) });
    
    $("#fechanacimiento").jqxDateTimeInput({ min: new Date(1900, 0, 1), max: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) });

    $(".hwdbo-checkBox").jqxCheckBox({ width: '85%', height: 25 });

    ComboNodata().then(r=>{       
        getCombos(_data);                
    });

    switch (_estatus) {
        case "1":
            $("#spanTitulo").text("Alta de empleado");
            break;
        case "2":
            $("#spanTitulo").text("Reingreso");
            break;
        case "3":
            $("#spanTitulo").text("Modificación de datos");
            break;
            //case "4":
            //    $("#spanTitulo").text("Modificación SBC");
            //break;
        case "5":
            $("#spanTitulo").text("Baja de empleado");
            break;
        case "6":
            $("#spanTitulo").text("Alta con otro empleador");
            break;
        default:
                break;
    }
   
    $("#divValidacionCampos").jqxWindow({ height: 300, width: 500, isModal: true, autoOpen: false });
    $("#divAvisos").jqxWindow({
        height: 300,
        width: 200,
        isModal: true,
        autoOpen: false
    }).on('close', function (event) {
        window.location.href = 'MenuMovimientosPersonal.html';
    });
   
    $(".hwdbo-texto, .hwdbo-correo, .hwdbo-numero, .hwdbo-checkBox, .hwdbo-combo").on("change", function (event) {
        let idelem = this.id;
        let htmlObj = $("#" + idelem + "");
        let val = '';
        if(_estatus==3)
        {
            if(event.args.type=="mouse" || event.args.type=="keyboard")
            {
                var obj = new Object();
                obj.campo = idelem.toString();
                obj.valoranterior = DatosEmpOriginal[idelem].toString();
                obj.nuevovalor = $("#" + idelem + "").val().toString();
                Inserta(obj);
            }
        }
        
        if (htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero")) {
            val = htmlObj.val();
        }
        else if (htmlObj.hasClass("hwdbo-checkBox")) 
        {            
            val = htmlObj.jqxCheckBox('val') ? 1 : 0;
            if(_estatus==3)
            {
                if(val!=DatosEmpleado[idelem])
                {
                    var obj1 = new Object();
                    obj1.campo=idelem.toString();
                    obj1.valoranterior=DatosEmpOriginal[idelem].toString();
                    obj1.nuevovalor=val.toString();
                    Inserta(obj1);
                }                               
            }
        }
        else if (htmlObj.hasClass("hwdbo-combo")) {           
            val = htmlObj.val();
            if(val=="")
            {
                val=event.args.item.value;
            }
        }
        else if(htmlObj.hasClass("hwdbo-text-area"))
        {
            val = htmlObj.val();
        }

        DatosEmpleado[idelem] = val;
    });

    $(".hwdbo-calendario").on('change',function(event){
        let idelem = this.id;
        let htmlObj = $("#" + idelem + "");
        let val = '';
        if(_estatus==3 || _estatus==5)
        {
            if(event.args.type=="mouse" || event.args.type=="keyboard")
            {
                var obj = new Object();
                obj.campo=idelem.toString();
                obj.valoranterior=DatosEmpOriginal[idelem].toString();
                obj.nuevovalor=formatFecha(new Date(event.args.newValue)).toString();
                Inserta(obj);
                val = stringtoDate(htmlObj.val());
                DatosEmpleado[idelem] = val;
            }
        }
        else
        {
            val = formatDate(htmlObj.val());
            DatosEmpleado[idelem] = val;
        }
    });

    $(".hwdbo-text-area").on('change',function(event){
        let idelem = this.id;
        let htmlObj = $("#" + idelem + "");
        if(_estatus==3 || _estatus==5)
        {
            var obj = new Object();
            obj.campo=idelem.toString();
            obj.valoranterior=DatosEmpOriginal[idelem].toString();
            obj.nuevovalor=htmlObj.val().toString();
            Inserta(obj);
            DatosEmpleado[idelem] = htmlObj.val().toString();
        }
        else
        {
            DatosEmpleado[idelem] = htmlObj.val().toString();
        }
    });

    $("#contratotemporal").on('change',function(event)
    {
        if(event.args.checked===true){
            $("#DivBaja").show();
            $("#FFin").show();
        }
        else{
            $("#DivBaja").hide();
            $("#FFin").hide();
            $("#bajaautomatica").jqxCheckBox('uncheck');
        }
    });

    $("#bajaautomatica").on('change',function(event){
        const bloqueaControlesBaja = ['fechabaja',
        'tipobaja',
        'observacionesbaja'
        ];
        var objKeys = bloqueaControlesBaja;

        if(event.args.checked===true)
        {
            $.each(objKeys, function (index, data) {
                let htmlObj = $("#" + data + "");
                htmlObj.parent().show();
                htmlObj.addClass("aweb0");
            }); 
            $("#fechabaja").jqxDateTimeInput('setDate', new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
            DatosEmpleado.fechabaja=formatDate($("#fechabaja").val());
            $('._datosBaja').show();
        }
        else
        {
            $.each(objKeys, function (index, data) {
                let htmlObj = $("#" + data + "");
                htmlObj.parent().hide();
                htmlObj.removeClass("aweb0");
            });
            $("#fechabaja").val('');
            $('._datosBaja').hide();
        }
    });

    $('#division').on('change', function (event){
        if(_estatus==1)
        {
            $("#departamento").jqxDropDownList('clear');
            fillCombo(47, 'departamento', "&_Parameters='" + $(this).val() + "'");
            $("#puesto").jqxDropDownList('clear');
        }
        else
        {
            if(event.args.type=="mouse")
            {
                $("#departamento").jqxDropDownList('clear');
                $("#puesto").jqxDropDownList('clear');
                $("#id_tabulador").jqxDropDownList('clear');
                fillCombo(47, 'departamento', "&_Parameters='" + $(this).val() + "'");
            }
        }
    });

    $('#departamento').on('change', function (event){
        if(_estatus==1)
        {
            $("#puesto").jqxDropDownList('clear');
            fillCombo(48, 'puesto', "&_Parameters='" + $(this).val() + "'");
            $("#id_tabulador").jqxDropDownList('clear');
        }
        else
        {
            if(event.args.type=="mouse")
            {
                $("#puesto").jqxDropDownList('clear');
                fillCombo(48, 'puesto', "&_Parameters='" + $(this).val() + "'");
                $("#id_tabulador").jqxDropDownList('clear');
            }
        }
    });

    $('#formapago').on('change', function () {
        const formaPago = $(this).val();
        if (formaPago != 3) {
            $('#banco').removeClass("aweb0").parent().hide();
            $('#ctabancaria').removeClass("aweb0").parent().hide();
            $('#clabe').removeClass("aweb0").parent().hide();
            $('#banco').val(0);
        } else {
            $('#banco').addClass("aweb0").parent().show();
            $('#ctabancaria').addClass("aweb0").parent().show();
            $('#clabe').parent().show();
        }
    });

    $('#patron').on('change', ()=>SetSalarioMensual());
    
    $('#puesto').on('change', ()=>SetSalarioMensual());
    
    $('#periodopago').on('change', ()=>SetSalarioMensual());

    $("#sindicato").on('change',()=>SetSBC());

    $("#nombramiento").on('change',function(event){
        if($(this).val()!="CO")
        {
            $("#divsindicato").show();
            $("#sindicato").addClass("aweb0");
        }
        else
        {
            $("#sindicato").removeClass("aweb0");
            $("#divsindicato").hide();
            $("#sindicato").jqxDropDownList('clearSelection');
            $("#sindicato").val(0);
            DatosEmpleado.sindicato="0";
        }
    });

    empleados();
    
    //Si es baja, mostrar el tab de laborales y mostrar acordeon de datos de baja
    if(_estatus==5)
    {
        $("#collapseOne").removeClass('show');
        $("#collapseBaja").addClass('show');
        $("#fechabaja").jqxDateTimeInput('setDate', new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
        DatosEmpleado.fechabaja=formatDate($("#fechabaja").val());
        setTimeout(function(){ $("#jqxtabs").jqxTabs('select',1); },1000);
    }
    else //si no mostrar tab personales, acordeon generales
    {
        $("#jqxtabs").jqxTabs('select',0);
        $("#collapseOne").addClass('show'); 
        $("#collapseBaja").removeClass('show');
    }

    $("#divContenido").show();
});


function formatDate(fecha)
{
    if(fecha.toString().indexOf('/')>0)
    {
        return fecha.split('/')[2]+"-"+fecha.split('/')[1]+"-"+fecha.split('/')[0];
    }
    else
    {
        return "";
    }
}
//let map;

/*function initMap() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;

        //console.log('Your current position is:');
        //console.log('Latitude : ' + crd.latitude);
        //console.log('Longitude: ' + crd.longitude);
        //console.log('More or less ' + crd.accuracy + ' meters.');

        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: crd.latitude, lng: crd.longitude },
            zoom: 15,
        });
    };

    function error(err) {
        //console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

}*/

function armaGridSubcontratantes(_estatus)
{
    $("#DivGridSubcontratante").html('<div id="GridSubcontratante"></div>');
    var botones = "<div class=\"col-md-12\" style=\"margin-top:1%\">";
    botones+="<button class=\"hwdbo-boton\" style=\"margin-bottom:1%\" onclick=\"Agregar();\"><i class=\"fa fa-plus\"></i> Agregar</button>";
    botones+="<button class=\"hwdbo-boton\" style=\"margin-bottom:1%;margin-left:2%\" onclick=\"Eliminar();\"><i class=\"fa fa-close\"></i> Eliminar</button>";
    botones+="</div>";
    let id=39;
    let _data = {
        "API": "0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1",
        "Parameters": "?_Id=" + id + "&_Domain={d}" + '',
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

    let edit = _estatus==5 ? false : true;

    $.ajax(settings).done(function (response) {     
        $("#GridSubcontratante").jqxGrid(
            {
                width: '99.5%',
                autoheight:true,
                showstatusbar: true,
                statusbarheight: 50,
                pagesize: 30,
                pageable: true,
                pagesizeoptions: ['10', '20', '50'],
                columnsresize: true,
                sortable: true,
                editable:edit,
                selectionmode: 'checkbox',
                localization: getLocalization(),
                rendergridrows: function (args) {
                    return args.data;
                },
                renderstatusbar:function(statusbar){
                    if(_estatus!=5)
                    {
                        statusbar.append(botones);
                        $(".hwdbo-boton").jqxButton({ width: '150', height: '30' });
                    }
                },
                columns: [
                    { text: 'Valor', datafield: 'Valor', width: '10%', align: 'center', cellsalign: 'center', editable: false,  },
                    { text: 'Razón social subcontratante', datafield: 'Descripcion', width: '65%', align: 'center', cellsalign: 'left', editable: true, columntype:'combobox', 
                        initeditor: function (row, cellvalue, editor, celltext, pressedChar) {
                            var CCsource =
                            {
                                datatype: 'json',
                                datafields: [{ name: 'Descripcion', type: 'string' }, { name: 'Valor', type: 'string' }],
                                localdata: eval(response)
                            };
                            var CCdataAdapter = new $.jqx.dataAdapter(CCsource);
                            editor.jqxDropDownList({ source: CCdataAdapter, displayMember: 'Descripcion', valueMember: 'Valor', autoOpen:true, placeHolder: '--Seleccione--', popupZIndex: 999999,filterable:true,filterPlaceHolder:'Buscar',width:'73%' });
                            editor.on('bindingComplete', function (event) { editor.focus(); });
                            editor.on('close', function (event) { editor.focus(); setTimeout(function() { document.body.dispatchEvent(ke);},500); });
                            editor.on('open', function (event) { editor.focus(); });
                        },
                        validation: function (cell, value) {
                            if (value == '' || value == undefined) {
                                return { result: false, message: 'Por favor seleccione una razón social, para continuar presione ESC' };
                            }
                            else {
                                return true;
                            }
                        },
                        geteditorvalue: function (row, cellvalue, editor) {
                            var item = editor.jqxDropDownList('getSelectedItem');
                            if (item != null) {
                                GuardaValor(item,row);
                                return item.label;
                            }
                        }
                    
                    },
                    {
                        text: 'Porcentaje', datafield: 'Porcentaje', width: '20%', align: 'center', cellsalign: 'center', editable: true, columntype: 'numberinput', cellsformat:'d2',
                        validation: function (cell, value) {
                            if (Number(value) < 0.00 ) {
                                $(this).jqxGrid('endcelledit', cell.row, "Porcentaje", true);
                                return { result: false, message: "El porcentaje no puede ser negativo, presione ESC" };
                            }
                            else if (Number(value) > 100.00) {
                                $(this).jqxGrid('endcelledit', cell.row, "Porcentaje", true);
                                return { result: false, message: "El porcentaje no puede ser mayor a 100, presione ESC" };
                            }
                            else {
                                return true;
                            }
                        },
                        initeditor: function (row, cellvalue, editor, celltext, pressedChar) {
                            editor.jqxNumberInput({ decimalDigits: 2, digits: 3 });
                        }   
                    },
        
                ],
                ready: function () {
                    setTimeout(function () {
                        $('#GridSubcontratante').jqxGrid('hidecolumn','Valor');
                        //$('#GridSubcontratante').jqxGrid('autoresizecolumns');
                    }, 500);
                }
        });
    });
}

function GuardaValor(item, row) {
    $("#GridSubcontratante").jqxGrid('setcellvalue', row, "Valor", item.value.toString());
}

function Agregar()
{
    let row=[];
    row.push({
        'Valor': '',
        'Descripcion': '',
        'Porcentaje': 0,
    });
    $('#GridSubcontratante').jqxGrid('addrow', null, row);
    $('#GridSubcontratante').jqxGrid('hidecolumn','Valor');
    //$('#GridSubcontratante').jqxGrid('autoresizecolumns');
    document.body.dispatchEvent(ke);
}

function Eliminar()
{
    let rowindexes = $('#GridSubcontratante').jqxGrid('getselectedrowindexes');
    if (rowindexes.length === 0) {
        showMsg('Mensaje','Por favor seleccione un registro para eliminar');
    }
    else
    {
        if (rowindexes.length === 1) {
            $('#GridSubcontratante').jqxGrid('deleterow', rowindexes[0]);
        }
        else {
            $('#GridSubcontratante').jqxGrid('deleterow', rowindexes);
        }
        $('#GridSubcontratante').jqxGrid('clearselection');

        var rows = $('#GridSubcontratante').jqxGrid('getrows');
        var source1 =
        {
            localdata: rows,
            datatype: "array"
        };
        var dataAdapterborrar = new $.jqx.dataAdapter(source1);
        $('#GridSubcontratante').jqxGrid({ source: dataAdapterborrar });
        $('#GridSubcontratante').jqxGrid('hidecolumn','Valor');
        //$('#GridSubcontratante').jqxGrid('autoresizecolumns');
    }
}

function CombosTabGenerales()
{
    fillCombo(23, 'sexo', '');
    fillCombo(80, 'lugarnacimiento', '');
    fillCombo(2, 'estadocivil', '');
    fillCombo(3, 'tiporegimen', '');
    fillCombo(4, 'formapago', '');
    fillCombo(5, 'banco', '');
}

async function getCombos(_data) {

    /*let url = new URL(location.href);
    IdResultadoBusqueda = url.searchParams.get("IdRef");*/

    //let _data = JSON.parse(atob(localStorage.getItem(IdResultadoBusqueda)));

    if (!_data)
        return;

    // const pais = await fillCombo(26, 'pais', '');
    //const salariomensual = await fillCombo(21, 'id_tabulador', "&_Parameters='" + _data.patron + "','" + _data.puesto + "','" + _data.periodopago + "'");
    const entidadfederativa = await fillCombo(36, 'entidadfederativa', '&_Parameters=' + _data.pais);
    const municipio = await fillCombo(37, 'municipio', "&_Parameters='" + _data.pais + "','" + _data.entidadfederativa + "'");
    const colonia = await fillCombo(38, 'colonia', "&_Parameters='" + _data.pais + "','" + _data.entidadfederativa + "','" + _data.municipio + "'");
    // const sexo = await fillCombo(23, 'sexo', '');
    // const lugarNacimiento = await fillCombo(1, 'lugarnacimiento', '');
    // const estadoCivil = await fillCombo(2, 'estadocivil', '');
    // const tipoRegimen = await fillCombo(3, 'tiporegimen', '');
    // const formaPago = await fillCombo(4, 'formapago', '');
    // const bancos = await fillCombo(5, 'banco', '');
    // const tipotelefono = await fillCombo(24, 'tipotelefono1', '');
    // const tipotelefono2 = await fillCombo(24, 'tipotelefono2', '');
    // const parentesco1 = await fillCombo(25, 'parentesco1', '');
    // const parentesco2 = await fillCombo(25, 'parentesco2', '');
    // const tipotelefeono3 = await fillCombo(24, 'tipotelefono3', '');
    // const tipotelefeono4 = await fillCombo(24, 'tipotelefono4', '');

    // const gradoestudios = await fillCombo(27, 'gradoestudios', '');
    // const especialidad = await fillCombo(28, 'especialidad', '');
    // const tiposangre = await fillCombo(29, 'tiposangre', '');

    // const division = await fillCombo(8, 'division', '');
    // const departamento = await fillCombo(7, 'departamento', '');
    // const puesto = await fillCombo(6, 'puesto', '');
    // const patron = await fillCombo(9, 'patron', '');
    const registropatronal = await fillCombo(22, 'registropatronal', '&_Parameters=' + _data.patron, '');
    const localidad = await fillCombo(20, 'localidad', '&_Parameters=' + _data.registropatronal);
    const esquemapago = await fillCombo(32, 'esquemapago', '&_Parameters=' + _data.registropatronal);
    const nombramiento = await fillCombo(33, 'nombramiento', '');
    //const sindicatos = await fillCombo(19, 'sindicato', '&_Parameters=' + _data.registropatronal);
    // const periodopago = await fillCombo(13, 'periodopago', '');
    // const moneda = await fillCombo(34, 'moneda', '');   
    // const tipocontrato = await fillCombo(10, 'tipocontrato', '');
    // const tipojornada = await fillCombo(12, 'tipojornada', '');
    // const paislabora = await fillCombo(26, 'paislabora', '');   
    // const tiposalario = await fillCombo(11, 'tiposalario', '');
    // const tipojornadaimss = await fillCombo(17, 'tipojornadaimss', '');
    // const tipotrabajador = await fillCombo(18, 'tipotrabajador', '');
    // const tipobaja = await fillCombo(14, 'tipobaja', '');
}

async function ComboNodata() {
    //const sexo = await fillCombo(23, 'sexo', '');
    //const lugarNacimiento = await fillCombo(1, 'lugarnacimiento', '');
    //const estadoCivil = await fillCombo(2, 'estadocivil', '');
    //const tipoRegimen = await fillCombo(3, 'tiporegimen', '');
    //const formaPago = await fillCombo(4, 'formapago', '');
    //const bancos = await fillCombo(5, 'banco', '');
    // const entidadfederativa = await fillCombo(36, 'entidadfederativa', '&_Parameters=' + _data.pais);
    // const municipio = await fillCombo(37, 'municipio', "&_Parameters='" + _data.pais + "','" + _data.entidadfederativa + "'");
    // const colonia = await fillCombo(38, 'colonia', "&_Parameters='" + _data.pais + "','" + _data.entidadfederativa + "','" + _data.municipio + "'");    
    
    const tipotelefono = await fillCombo(24, 'tipotelefono1', '');
    const tipotelefono2 = await fillCombo(24, 'tipotelefono2', '');
    const parentesco1 = await fillCombo(25, 'parentesco1', '');
    const parentesco2 = await fillCombo(25, 'parentesco2', '');
    const tipotelefeono3 = await fillCombo(24, 'tipotelefono3', '');
    const tipotelefeono4 = await fillCombo(24, 'tipotelefono4', '');
    const ladatelefono1 = await fillCombo(44,'ladatelefono1','');
    const ladatelefono2 = await fillCombo(44,'ladatelefono2','');
    const ladatelefono3 = await fillCombo(44,'ladatelefono3','');
    const ladatelefono4 = await fillCombo(44,'ladatelefono4','');

    const pais = await fillCombo(26, 'pais', '');
    
    const gradoestudios = await fillCombo(27, 'gradoestudios', '');
    const especialidad = await fillCombo(28, 'especialidad', '');
    const tiposangre = await fillCombo(29, 'tiposangre', '');

    const division = await fillCombo(8, 'division', '');
    const departamento = await fillCombo(7, 'departamento', '');
    const puesto = await fillCombo(6, 'puesto', '');
    const patron = await fillCombo(9, 'patron', '');
    // const registropatronal = await fillCombo(22, 'registropatronal', '&_Parameters=' + _data.patron, '');
    // const localidad = await fillCombo(20, 'localidad', '&_Parameters=' + _data.registropatronal);
    // const esquemapago = await fillCombo(32, 'esquemapago', '&_Parameters=' + _data.registropatronal);
    const nombramiento = await fillCombo(33, 'nombramiento', '');
    
    // const sindicatos = await fillCombo(19, 'sindicato', '&_Parameters=' + _data.registropatronal);
    const periodopago = await fillCombo(13, 'periodopago', '');
    const moneda = await fillCombo(34, 'moneda', '');
    // const salariomensual = await fillCombo(21, 'id_tabulador', "&_Parameters='" + _data.patron + "','" + _data.puesto + "','" + _data.periodopago + "'");

    const tipocontrato = await fillCombo(10, 'tipocontrato', '');
    const tipojornada = await fillCombo(12, 'tipojornada', '');
    const paislabora = await fillCombo(26, 'paislabora', '');
    const tiposalario = await fillCombo(11, 'tiposalario', '');
    const tipojornadaimss = await fillCombo(17, 'tipojornadaimss', '');
    const tipotrabajador = await fillCombo(18, 'tipotrabajador', '');
    const tipobaja = await fillCombo(14, 'tipobaja', '');
}

function empleados() {
    if (obtieneParametroURL()) {       
        //DatosEmpleado = JSON.parse(atob(localStorage.getItem(IdResultadoBusqueda)));
        //DatosEmpOriginal=JSON.parse(atob(localStorage.getItem(IdResultadoBusqueda)));
        DatosEmpleado = JSON.parse(atob(sessionStorage.getItem(IdResultadoBusqueda)));
        DatosEmpOriginal=JSON.parse(atob(sessionStorage.getItem(IdResultadoBusqueda)));
        asignaValores(DatosEmpOriginal);
        if(DatosEmpleado.estatus==3) //Nuevo
        {
            setTimeout(function() {
                let pais=getIdPais();
                let rfcpatronal=getRazonSocial();
                let curp = getCurpNuevo();
                let sexo =curp.substring(10,11).toUpperCase();
                let anio=curp.substring(4,6);
                let mes=curp.substring(6,8);
                let dia = curp.substring(8,10);
                let lugarnac = curp.substring(11,13);
                let idnac=GetValLugarNac(lugarnac);
                //console.log(pais,rfcpatronal,curp,sexo,anio,mes,dia,lugarnac,idnac);
    
                $("#lugarnacimiento").val(idnac);
                $("#curp").val(curp);
                $("#rfc").val(curp.substring(0,10));
                $("#sexo").val(sexo);
                $("#fechanacimiento").val(dia+"/"+mes+"/19"+anio);
                $("#pais").val(pais);
                $("#paislabora").val(pais);
                $("#patron").val(rfcpatronal);
                if(pais==157)
                {
                    $("#moneda").val(1);
                }
                $("#puesto").jqxDropDownList('clear');
                $("#departamento").jqxDropDownList('clear');  
                              
                ocultarCargador();
            },5000);
            desabilitaControles();            
        }
        else
        {
            setTimeout(function() { 
                asignaCombos(JSON.parse(atob(sessionStorage.getItem(IdResultadoBusqueda)))).then(r=>{
                    setTimeout(function(){
                        desabilitaControles(); 
                        setTimeout(ocultarCargador,6000); 
                    }); 
                });    
            },8000);   
        }
    } 
    else 
    {
        showMsg("Error","No se pudo obtener dato de url");
        ocultarCargador();
    }
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
        },
        "data": JSON.stringify(_data),
    };

    $.ajax(settings).done(function (response) {
        try {
            // console.log(divCombo);
            var dataAdapter = new $.jqx.dataAdapter(response);

            $("#" + divCombo + "").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor"
            });
        } catch (error) {

        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        //console.error('ERROR EN LA FUNCION -> ' + divCombo);
        //console.error(XMLHttpRequest);
        //console.error(textStatus);
        //console.error(errorThrown);
    });
}

function obtieneParametroURL() {
    let url = new URL(location.href);
    IdResultadoBusqueda = url.searchParams.get("IdRef");
    if (IdResultadoBusqueda != null) {
        return true;
    } else {
        return false;
    }
}

async function asignaCombos(_data)
{
    let objKeys = Object.keys(_data);
    $.each(objKeys, function (index, data) {
        let htmlObj = $("#" + data + "");
        let valor = _data[data];       
        if (htmlObj.hasClass("hwdbo-combo")) {           
            let items = $("#" + data + "").jqxDropDownList('getItems');
            if (items != undefined) {
                let i = 0;
                if (items.find(x => x.value == valor)) {
                    i = items.find(x => x.value == valor).index;
                } else {
                    i = -1;
                }                
                setTimeout(function(){
                    $("#" + data + "").val(_data[data].toString());
                },1);               
            }
        }
    });
}

function asignaValores(_data) {
    //console.log(_data);
    let objKeys = Object.keys(_data);

    //Subcontratantes
    let subcontr = _data.subcontratante;
    let errorSub=false;

    if(_data.subcontratante!==undefined && _data.subcontratante.length>0)
    {
        let subs=new Array();
        $.each(_data.subcontratante,function(i,row){
            if(row.Valor!=0)
            {
                row.Porcentaje=Number(row.Porcentaje).toFixed(2);
                if(row.Porcentaje>100.00)
                {
                    errorSub=true;
                    showMsg("Mensaje","El porcentaje del subcontratante es incorrecto, no debe ser mayor de 100.");
                }
                else
                {
                    subs.push(row);
                }
                
            }
        });

        if(subs.length>0)
        {
            let source = {
                datatype: 'json',
                localdata: eval(subcontr)
            };
            let dataAdapter = new $.jqx.dataAdapter(source);
            
            if(_data.estatus!=3)
            {
                setTimeout(function() { $('#GridSubcontratante').jqxGrid({ source: dataAdapter });},9000);
            }
        }
    }

    /*if(errorSub==false)
    {*/
        $.each(objKeys, function (index, data) {
            //console.log(data);
            let htmlObj = $("#" + data + "");
            let valor = _data[data];
            
            if (htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero")) {
                $("#" + data + "").val(valor);
            }
            else if (htmlObj.hasClass("hwdbo-calendario")) {
                $("#" + data + "").jqxDateTimeInput('setDate', valor);
            }
            else if (htmlObj.hasClass("hwdbo-checkBox")) 
            {
                if (valor == 1 || valor || valor == "1") {
                    $("#" + data + "").jqxCheckBox('check');
                }
                else
                {
                    $("#" + data + "").val(false);
                }
            }
            else{
                _data[data]=_data[data];
            }
        });

        if(DatosEmpleado.especialidad==0)
        {
            DatosEmpleado.gradoestudios="0";
        }
        
        getEtiquetas();
        
        if(_data.fechafinal=="1900-01-01")
        {
            $("#fechafinal").val('');
        }
        //console.log(DatosEmpleado);

        var checked = $('#contratotemporal').jqxCheckBox('checked'); 
        if(checked==true)
        {
            $("#bajaautomatica").jqxCheckBox({ disabled: true });
            $("#contratotemporal").jqxCheckBox({ disabled: true });
            $("#fechafinal").jqxDateTimeInput({ disabled:true });
        }
        else
        {
            $("#bajaautomatica").jqxCheckBox({ disabled: false });
            $("#contratotemporal").jqxCheckBox({ disabled: false });
            $("#fechafinal").jqxDateTimeInput({ disabled:false });
        }
    /*}
    else
    {
        showMsg("Mensaje","No es posible cargar la información de este empleado debido a inconsistencias en los porcentajes de subcontratantes");
    }*/
}

function GetValLugarNac(lugar)
{
    var items = $("#lugarnacimiento").jqxDropDownList('getItems');
    var id=0;
    $.each(items,function(i,row){
        if(row.originalItem.CURP==lugar)
        {
            id=row.originalItem.Valor;
            return false;
        }
    });
    return id;
}

function agregaRemueveCondiciones(_data) {
    //Si la forma de pago es cheque, remover cta bancaria
    if (_data.formapago == 2) {
        if ($("#ctabancaria").hasClass("aweb0")) {
            $("#ctabancaria").removeClass("aweb0");
        }
    }
}

function validaCampos(elem) {
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

    if (resultValidacion.length == 0) {
        //habilita los otros tabs
        if (arrTabsNuevo.hasOwnProperty(divId)) {
            let target = arrTabsNuevo[divId];
            if (target == 4) {
                $('#jqxtabs').jqxTabs('select', 1);
            } else {
                $('#divTabsNuevo').jqxTabs('enableAt', target + 1);
                $('#divTabsNuevo').jqxTabs('select', target + 1);
            }
        } 
        /*else {
            let target = arrTabsLaboral[divId];
            $('#divTabsLaborales').jqxTabs('enableAt', target + 1);
            $('#divTabsLaborales').jqxTabs('select', target + 1);
        }*/
    } else {
        armaListaErrores(resultValidacion);
    }
}

function validaCamposGuardar(elem) {
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
        //manda guardar todo si es válido
        mostrarUpCargador();
        setTimeout(function(){ postDataEmpleado(); },2000);
    } 
    else {
        armaListaErrores(resultValidacion);
    }
}

function armaListaErrores(items) {
    //lstValidaciones
    $("#lstValidaciones").empty();
    let mensaje="";
    let ul = document.createElement('ul');
    document.getElementById('lstValidaciones').appendChild(ul);

    items.forEach(function (item) {
        let li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML += item;
        mensaje+=item+"<br/>"
    });
    $.confirm({
        title: 'Validación',
        icon: 'fa fa-warning',
        content: mensaje,
        type:'red',
        typeAnimated:true,
        columnClass: 'medium',
        buttons: {
            Aceptar: function () {
            }
        }
    });
    //$("#divValidacionCampos").jqxWindow("open");
}

function postDataEmpleado() {
    
    DatosEmpleado.tipomovimiento = Estatus;
    if (Estatus=="3") {
        //Por si primero cambia pero luego vuelve al valor original, se quita el registro del json de cambios
        DepuraCambios();
        DatosEmpleado.cambios=cambios;
    }
    else
    {
        DatosEmpleado.cambios=DatosEmpOriginal.cambios;
    }

    let rowsSubCont = $('#GridSubcontratante').jqxGrid('getrows');
    let arrSubCont=new Array();
    let sumaPorcentaje=0.00;
    let ok = false;
    let mensaje="";
    if(rowsSubCont.length>0)
    {
        $.each(rowsSubCont, function (i, row) {
            if(row["Descripcion"]=="")
            {
                ok=true; 
                mensaje="Por favor seleccione una razón social";
            }

            if(Number(row["Porcentaje"])==0.00)
            {
                ok=true;
                mensaje="El porcentaje no debe ser 0";
            }
            sumaPorcentaje = sumaPorcentaje + Number(row["Porcentaje"])
            let cont = new Object();
            cont.Valor=row["Valor"].toString();
            cont.Descripcion=row["Descripcion"].toString();
            cont.Porcentaje=row["Porcentaje"].toString();
            arrSubCont.push(cont);
        });

        if(sumaPorcentaje!=100.00)
        {
            ok=true;
            mensaje="La suma de los porcentajes debe ser 100";
        }

        DatosEmpleado.subcontratante = arrSubCont;
        //Si hubo cambios, guardar valor original y nuevo en el array de cambios
        if(DatosEmpOriginal.subcontratante.length!=DatosEmpleado.subcontratante.length) //Se agrego o quito subcontratante
        {
            var obj1 = new Object();
            obj1.campo = "subcontratante";
            obj1.valoranterior = JSON.stringify(stringifySubContratante(DatosEmpOriginal.subcontratante));
            obj1.nuevovalor = JSON.stringify(DatosEmpleado.subcontratante);
            Inserta(obj1);
        }
        else //revisar si solo cambiaron porcentajes o razon social pero mismo numero de subcontratantes
        {
            let inserta=false;
            $.each(DatosEmpOriginal.subcontratante,function(i,row){
                if(row.Valor!=DatosEmpleado.subcontratante[i].Valor)
                {
                    inserta=true;
                    return;
                }
                if(Number(row.Porcentaje)!=Number(DatosEmpleado.subcontratante[i].Porcentaje))
                {
                    inserta=true;
                    return;
                }
            });

            if(inserta==true)
            {
                var obj2 = new Object();
                obj2.campo = "subcontratante";
                obj2.valoranterior = JSON.stringify(stringifySubContratante(DatosEmpOriginal.subcontratante));
                obj2.nuevovalor = JSON.stringify(DatosEmpleado.subcontratante);
                Inserta(obj2);
            }
        }
    }
    else
    {
        DatosEmpleado.subcontratante=[];
    }

    //Envio de JS
    if(ok==false)
    {
        //console.log(cambios);
        //console.log(JSON.stringify(DatosEmpleado));

        //Conversión de datos a enteros
        DatosEmpleado.noempleado=Number(DatosEmpleado.noempleado);
        DatosEmpleado.pais=Number(DatosEmpleado.pais);
        DatosEmpleado.lugarnacimiento=Number(DatosEmpleado.lugarnacimiento);
        DatosEmpleado.estadocivil=Number(DatosEmpleado.estadocivil);
        DatosEmpleado.tiporegimen=Number(DatosEmpleado.tiporegimen);
        DatosEmpleado.formapago=Number(DatosEmpleado.formapago);
        DatosEmpleado.especialidad=Number(DatosEmpleado.especialidad);
        DatosEmpleado.patron=Number(DatosEmpleado.patron);
        DatosEmpleado.registropatronal=Number(DatosEmpleado.registropatronal);
        DatosEmpleado.localidad=Number(DatosEmpleado.localidad);
        DatosEmpleado.esquemapago=Number(DatosEmpleado.esquemapago);
        DatosEmpleado.sindicato=Number(DatosEmpleado.sindicato);
        DatosEmpleado.periodopago=Number(DatosEmpleado.periodopago);
        DatosEmpleado.moneda=Number(DatosEmpleado.moneda);
        DatosEmpleado.salariomensual=Number(DatosEmpleado.salariomensual);
        DatosEmpleado.salariodiario=Number(DatosEmpleado.salariodiario);
        DatosEmpleado.OtroSueldo=Number(DatosEmpleado.OtroSueldo);
        DatosEmpleado.paislabora=Number(DatosEmpleado.paislabora);
        DatosEmpleado.salariobasecotizacion=Number(DatosEmpleado.salariobasecotizacion);
        DatosEmpleado.tiposalario=Number(DatosEmpleado.tiposalario);
        DatosEmpleado.tipojornadaimss=Number(DatosEmpleado.tipojornadaimss);
        DatosEmpleado.tipotrabajador=Number(DatosEmpleado.tipotrabajador);
        DatosEmpleado.tipomovimiento=Number(DatosEmpleado.tipomovimiento);

        $.each(DatosEmpleado.subcontratante,function(i,row){
            row.Valor=Number(row.Valor);
        });

        console.log(DatosEmpleado);

        var settings = {
            "url": "https://harwebdboapigw.azurewebsites.net/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
                "Content-Type": "application/json",
            },
            "data": JSON.stringify({
                "API": "67AF62FB54F3BF6DC2458B88CE0C4EEC9214FED6B3078ECD1C1EBEF124790794",
                "Parameters": "",
                "JsonString": JSON.stringify(DatosEmpleado),
                "Hash": getHSH(),
                "Bearer": getToken()
            }),
        };

        //console.log(settings);

        $.ajax(settings).done(function (response) {
            //console.log(response);
            if(response=='"Successfull"')
            {
                $.confirm({
                    title: 'Éxito',
                    type:'green',
                    icon: 'fa fa-check',
                    typeAnimated:true,
                    content: 'Registro guardado con éxito.',
                    buttons: {
                        Aceptar: function () {
                            window.location.href = 'MenuMovimientosPersonal.html?siteCode='+getHSH();
                        },
                    }
                });
            }
            else{
                showMsg("Error","Ocurrió un error al guardar: " + response);
            }

            ocultarUpCargador();
        });
    }
    else
    {
        showMsg('Error',mensaje);
    }
    ocultarUpCargador();

}

function TabLaborales(elem)
{
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

    //Si todo ok cambia a la tab de datos laborales
    if (resultValidacion.length == 0) {
        $('#jqxtabs').jqxTabs('select', 1);
    } else {
        armaListaErrores(resultValidacion);
    }    
}

function desabilitaControles() {
    let url = new URL(location.href);
    const estatus = url.searchParams.get("estatus");
    let objKeys;

    const bloqueaControles = ['division',
        'rfc',
        'curp',    
        'departamento',
        'noempleado',
        'puesto',
        'patron',
        'registropatronal',
        'nombramiento',
        'esquemapago',
        'sindicato',
        'periodopago',
        'id_tabulador',
        'salariodiario',
        'fechaantiguedad',
        'fechaingreso',
        'salariobasecotizacion',
        'tiposalario',
        'tipojornadaimss',
        'tipotrabajador'
        /*'contratotemporal',*/
        /*'bajaautomatica'*/]

    const bloqueaControlesBaja = ['fechabaja',
        'tipobaja',
        'observacionesbaja'
    ];

    if (estatus == 3)
    {
        objKeys = bloqueaControles;
    }

    if(estatus==5)
    {
        objKeys=null;
        let texto =$('.hwdbo-texto');
        let correo =$('.hwdbo-correo');
        let numero=$('.hwdbo-numero');
        let chk = $('.hwdbo-checkBox');
        let cal = $('.hwdbo-calendario');
        let cbo = $('.hwdbo-combo');

        for(var obj of texto)
        {
            $("#" + obj.id + "").jqxInput({ disabled: true });
        }
        for(var obj of numero)
        {
            $("#" + obj.id + "").jqxInput({ disabled: true });
        }
        for(var obj of correo)
        {
            $("#" + obj.id + "").jqxInput({ disabled: true,  width: '99%', height: '30px' });
        }
        for(var obj of chk)
        {
            $("#" + obj.id + "").jqxCheckBox({ disabled: true });
        }
        for(var obj of cal)
        {
            $("#" + obj.id + "").jqxDateTimeInput({ disabled: true });
        }
        for(var obj of cbo)
        {
            $("#" + obj.id + "").jqxDropDownList({ disabled: true });
        }
    }


    $.each(objKeys, function (index, data) {
        //console.log(data);
        let htmlObj = $("#" + data + "");

        if (htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero")) {
            $("#" + data + "").jqxInput({ disabled: true });
        }
        else if (htmlObj.hasClass("hwdbo-checkBox")) {
            $("#" + data + "").jqxCheckBox({ disabled: true });
        }
        else if (htmlObj.hasClass("hwdbo-calendario")) {
            $("#" + data + "").jqxDateTimeInput({ disabled: true });
        }
        else if (htmlObj.hasClass("hwdbo-combo")) {
            $("#" + data + "").jqxDropDownList({ disabled: true });
        }
        else if (htmlObj.hasClass("hwdbo-text-area")) {
            $("#" + data + "").attr('disabled', true);
        }
    });

    if (estatus != 5) {
        objKeys = bloqueaControlesBaja;
        $.each(objKeys, function (index, data) {
            //console.log(data);
            let htmlObj = $("#" + data + "");
            htmlObj.parent().hide();
            htmlObj.removeClass("aweb0");
        });
        $('._datosBaja').hide();
    }
    else
    {
        objKeys = bloqueaControlesBaja;
        $.each(objKeys, function (index, data) {
            let htmlObj = $("#" + data + "");
            if (htmlObj.hasClass("hwdbo-calendario")) {
                $("#" + data + "").jqxDateTimeInput({ disabled:false });
            }
            else if(htmlObj.hasClass("hwdbo-texto") || htmlObj.hasClass("hwdbo-correo") || htmlObj.hasClass("hwdbo-numero"))
            {
                $("#" + data + "").jqxInput({ disabled: false,  width: '99%', height: '30px' });
            }
            else if(htmlObj.hasClass("hwdbo-combo"))
            {
                $("#" + data + "").jqxDropDownList({ disabled: false });
            }

            htmlObj.parent().show();
            htmlObj.addClass("aweb0");
        }); 
        $("#fechabaja").jqxDateTimeInput('setDate', new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
        DatosEmpleado.fechabaja=formatDate($("#fechabaja").val());
        $('._datosBaja').show();
    }

    $("#OtroSueldo").jqxInput({ disabled: true });

    let IdPais = getIdPais();
    if(IdPais!='157')
    {
        $('.mex').hide();
        $("#rfc").removeClass('aweb0');
        $("#tiposalario").removeClass('aweb0');
        $("#tipojornadaimss").removeClass('aweb0');
        $("#tipotrabajador").removeClass('aweb0');
        $("#tiposalario").jqxDropDownList('selectIndex', 0 );
        $("#tiposalario").val(0);
        $("#tipojornadaimss").jqxDropDownList('selectIndex', 0 );
        $("#tipojornadaimss").val(0);
        $("#tipotrabajador").jqxDropDownList('selectIndex', 0 );
        $("#tipotrabajador").val(0);
        
    }
    else
    {
        $('.mex').show();
        $("#rfc").addClass('aweb0');
        $("#tiposalario").addClass('aweb0');
        $("#tipojornadaimss").addClass('aweb0');
        $("#tipotrabajador").addClass('aweb0');
        $("#tiposalario").val(0);
        $("#tipojornadaimss").val(0);
        $("#tipotrabajador").val(0);
    }

    $("#noempleado").attr('disabled','disabled');
}

function getEtiquetas()
{
    let IdPais = getIdPais();
    $.when(ajaxCatalogo(46,'&_Parameters=\'curp\',\''+IdPais+'\'')).done(function (response) {
        $("#lblcurp").text(response[0].Etiqueta);
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        $("#lblcurp").text("CURP");
    });
}

function Inserta(obj)
{
    if(cambios.length==0)
    {
        cambios.push(obj);
    }
    else
    {
        var replace=false;
        $.each(cambios,function(i,row){
            if(row.campo==obj.campo)
            {
                cambios[i]=obj;
                replace=true;
            }
        });
        if(replace==false)
            cambios.push(obj);
    }
}

function DepuraCambios()
{
    var NuevoCambios=new Array();
    $.each(cambios,function(i,row){
        if(row.valoranterior!=row.nuevovalor)
        {
            NuevoCambios.push(row);
        }
    });
    cambios=NuevoCambios;

    //Revisa datos bancarios
    let banco=false;
    $.each(cambios,function(index,row){
        if($.inArray(row.campo,controlesPago)!==-1)
        {
            banco=true;
        }
    });
    //Revisa datos académicos
    let academ=false;
    $.each(cambios,function(index,row){
        if($.inArray(row.campo,controlesEscolar)!==-1)
        {
            academ=true;
        }
    });
    //Revisar datos domicilio
    let domic = false;
    $.each(cambios,function(index,row){
        if($.inArray(row.campo,controlesDomicilio)!==-1)
        {
            domic=true;
        }
    });
    //Revisar datos baja
    let baja=false;
    $.each(cambios,function(index,row){
        if($.inArray(row.campo,controlesBajas)!==-1)
        {
            baja=true;
        }
    });

    if(banco==true)
    {
        AgregaCambios(1);
    }
    if(academ==true)
    {
        AgregaCambios(2);
    }
    if(domic==true)
    {
        AgregaCambios(3);
    }
    if(baja==true)
    {
        AgregaCambios(4);
    }
}

function stringifySubContratante(subcontratante)
{
    let arrSubCont=new Array();
    $.each(subcontratante,function(i,row){
        let cont = new Object();
        cont.Valor=row["Valor"].toString();
        cont.Descripcion=row["Descripcion"].toString();
        cont.Porcentaje=row["Porcentaje"].toString();
        arrSubCont.push(cont);
    });
    return arrSubCont;
}

function AgregaCambios(tipo)
{
    var ctrl=[];
    switch(tipo)
    {
        case 1: //bancarios
        ctrl=controlesPago;
        break;
        case 2: //academicos
        ctrl=controlesEscolar;        
        break;
        case 3://domicilio
        ctrl=controlesDomicilio;
        break;
        case 4://bajas
        ctrl=controlesBajas;
        default:
            break;
    }

    $.each(ctrl,function(i,row){
        let esta=false;
        $.each(cambios,function(j,campo){
            if(row==campo.campo)
            {
                esta=true;
            }
        });
        if(esta==false)
        {
            var obj=new Object();
            obj.campo=row;
            obj.valoranterior=DatosEmpOriginal[row].toString();
            obj.nuevovalor = DatosEmpOriginal[row].toString();
            Inserta(obj);
        }
    });
}

$('#pais').on('change', async () => {
    const pais = await fillCombo(36, 'entidadfederativa', '&_Parameters=' + $('#pais').val());
});
$('#entidadfederativa').on('change', async () => {
    const municipio = await fillCombo(37, 'municipio', "&_Parameters='" + $('#pais').val() + "','" + $('#entidadfederativa').val() + "'");
});
$('#municipio').on('change', async () => {
    const colonia = await fillCombo(38, 'colonia', "&_Parameters='" + $('#pais').val() + "','" + $('#entidadfederativa').val() + "','" + $('#municipio').val() + "'");
});

$('#id_tabulador').on('change', function () {
    const val = $(this).val();
    if (val == 0) {
        $("#OtroSueldo").jqxInput({ disabled: false });
        $("#salariodiario").val(0);
        DatosEmpleado.salariomensual=0.00;
    } 
    else 
    {
        $("#OtroSueldo").jqxInput({ disabled: true });
        $("#OtroSueldo").val(0);
        var item = $(this).jqxDropDownList('getSelectedItem');
        var div = Number((item.label.replace('$', '').replace(',', ''))) / 30;
        div = div.toFixed(4);
        $("#salariodiario").val(div);
        var sd4=Number(item.label.replace('$', '').replace(',', '').toString());
        sd4=sd4.toFixed(4);
        DatosEmpleado.salariomensual=sd4;
        SetSBC();
    }
});

$("#OtroSueldo").on('change', function () {
    const val = $(this).val();
    if (val && val > 0) {
        let sd = Number(val)/30;
        sd=sd.toFixed(4);
        $("#salariodiario").val(sd);
        SetSBC();
    }
    DatosEmpleado.OtroSueldo=val;
});

$('#patron').on('change', function () {
    const myVal = $(this).val();
    fillCombo(22, 'registropatronal', '&_Parameters=' + myVal, '');
    fillCombo(20, 'localidad', '&_Parameters=' + myVal);
    fillCombo(32, 'esquemapago', '&_Parameters=' + myVal);
    fillCombo(19, 'sindicato', '&_Parameters=' + myVal);
    if(Estatus==1 || Estatus==2)
    {
        setTimeout(function(){
            $("#registropatronal").jqxDropDownList({selectedIndex:0});
            $("#localidad").jqxDropDownList({selectedIndex:0});
            $("#esquemapago").jqxDropDownList({selectedIndex:0});
            $("#sindicato").jqxDropDownList({selectedIndex:0});
        },1000);
    }
    else
    {
        setTimeout(function(){
            $("#localidad").val(DatosEmpOriginal["localidad"]);
            $("#esquemapago").val(DatosEmpOriginal["esquemapago"]);
            $("#sindicato").val(DatosEmpOriginal["sindicato"]);
            DatosEmpleado.localidad=$("#localidad").val();
            DatosEmpleado.esquemapago=$("#esquemapago").val();
            DatosEmpleado.sindicato=$("#sindicato").val();
        },1500);       
    }
});

/*$('#registropatronal').on('change', function () {
    const myVal = $(this).val();
    fillCombo(20, 'localidad', '&_Parameters=' + myVal);
    fillCombo(32, 'esquemapago', '&_Parameters=' + myVal);
    fillCombo(19, 'sindicato', '&_Parameters=' + myVal);
    setTimeout(function(){
        $("#localidad").jqxDropDownList({selectedIndex:0});
        $("#esquemapago").jqxDropDownList({selectedIndex:0});
        $("#sindicato").jqxDropDownList({selectedIndex:0});
    },1500);
});*/

function SetSalarioMensual() {
    const patron = $('#registropatronal').val();
    const puesto = $('#puesto').val();
    const periodopago = $('#periodopago').val();
    if (patron && puesto && periodopago)
    {
        if(Estatus==1)
        {
            $("#id_tabulador").jqxDropDownList('clear');
        }
        fillCombo(21, 'id_tabulador', "&_Parameters='" + patron + "','" + puesto + "','" + periodopago + "'");
    }
}

function SetSBC()
{
    const sindicato=$("#sindicato").val();    
    var item = $("#id_tabulador").jqxDropDownList('getSelectedItem');
    if(item!=null)
    {
        const sueldo = item.label.replace('$', '').replace(',', '');
        var obj1 = new Object();
        obj1.idsindicato = sindicato;
        obj1.sueldo = sueldo;

        var obj = new Object();
        obj.API="07D9A3081CF76A73B145D38A418B95AFB197F87AA145E494427951FCE932606E";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(obj1);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        if(sindicato&&sueldo)
        {
            if(sueldo==0)
            {
                let otrosueldo=$("#OtroSueldo").val();
                obj1.sueldo=otrosueldo;
                obj.JsonString=JSON.stringify(obj1);
            }

            $.when(ajaxTokenFijo(obj)).done(function (response) {
                if(response)
                {
                    $("#salariobasecotizacion").val(response.monto);
                }
                else
                {
                    showMsg('Mensaje',response);
                }
                ocultarCargador();
            });
        }
    }

}