//#region -----Varialles globales
//---Contadores para cuando se va agregando nuevos niveles/Subcuenta y Nivel1_Nivel10
let contSubCuenta=0;
let contNuevoNivel=0;
let contCardNivel=3;
let CuentaContableID=1;

//--Arreglo con información sobre los campos 
let campos=[];
let nivelesCreados=[{numNivel:3,nivelPadre:2,nivelHijo:0,titulocard:"IdhN3",eliminoNivel:false,nomCard:"cardNivel3"}];
let generarJson=[];
let genJsonModifica=[];


let dASat=""; //para llenar los datos del campo sat de sucuenta
let gridAction=""; //Se usa para saber si se esta modificando o creando una cuenta contable
let numnNivel;  //lo uso al eliminar el niver...
let reemplazoSpan="";
//---Arreglo almacena los datos de los combos de subcuenta
let nuevoUniqueArray=[];
let uniqueArray=[];
let uArrayUpdate=[];
let Cuentas=[];
let Configuracion=[];
let uniqueArray2=[];

let banderaGuardar=false;
let bandConfigCCGrid=false;
let bandrowmodif=false;


//#endregion

//----------------------------------------------

$(document).ready(function () {
    mostrarCargador();
    $('#IdMCCHtml').hide();
    $.jqx.theme = "light";

    $("#jqxtabs").jqxTabs({ width: '100%', height: '100%', position: 'top', disabled:true }).on('tabclick', function (event) {
        var clickedItem = event.args.item;
        switch (clickedItem) {
            case 0:
                $(this).jqxTabs('setTitleAt',1,'');
                $(this).jqxTabs({ disabled:true});
                $(this).jqxTabs('enableAt', 0);
                //$(this).jqxTabs('enableAt', 1);
                regresarInicio();
                break;
        }
    });

    $("#jqxtabs").jqxTabs('enableAt', 0);
   
    
    controles();
    GetGrid();
    $('.class-link').click((event) => {
        //---Comporbamos que exista un nivel 3 o mayr
      
        let nivelMayorExist=campos.some(function(nivel){ return nivel.NivelCC >= 3});
        

        //---idcuentacontable
        let cuentaContable=$("#IdcuentaContable").val();

        if(nivelMayorExist){
                     if(cuentaContable !=="" && banderaGuardar){
                         
                             window.location.href="MatrizCuentaConcepto.html?id=" + cuentaContable;
                         
                         
                     }
                     if(cuentaContable !=="" && gridAction !=="NuevaCuentaContable"){

                         
                             window.location.href="MatrizCuentaConcepto.html?id=" + cuentaContable;
                         
                         
                     }
                     else if(gridAction==="NuevaCuentaContable" && !banderaGuardar || cuentaContable ===""){
                         showMsgSinTimer('Mensaje','Guarde una cuenta contable antes de ir configuración de conceptos.');
                         }
         }
         else{
             showMsgSinTimer('Mensaje','Debe existir un nivel 3 o mayor para acceder a configuración de conceptos');  
         }

     });
});

function controles(){

    $(".hwdbo-texto").jqxInput({ width: '99%', height: '30px' });

   $(".hwdbo-combo").jqxDropDownList({ width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none',theme:'fresh' });

   // $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px' });

    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' , disabled:true});

}
//#region Inicio  funciones del grid  principal
function GetGrid()
{
    $.when(ajaxCatalogo(85,"")).done(function (response) {
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

    let botones="<div class=\"row\" style=\"margin-top:1%;margin-left:1%\">";
    botones+="<div class=\"col-md-1\"><button id=\"BtnNuevo\"><i class=\"fa fa-plus-circle\"></i> Nuevo</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnConfigCuenta\"><i class=\"fa fa-pencil-square\"></i>Configurar cuenta</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnConfigConceptos\"><i class=\"fa fa-pencil-square\"></i>Configurar conceptos</button></div>";
    botones+="<div class=\"col-md-1 offset-1\"><button id=\"BtnExcel\"><i class=\"fa fa-file-excel-o\"></i> Excel</button></div>";
    botones+="</div>";

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');

    if(_data=="No se encontro información.")
    {
        showMsg('Error',_data);
    }
    else if(_data=="No existe el catálogo. " ){



        $("#gdPlantilla").jqxGrid({
            autoshowfiltericon: true,
            columns: [],
            source: [],
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

            },
            renderstatusbar: function(statusbar){
                statusbar.append(botones);
                $("#BtnConfigCuenta").jqxButton({  width: 110, height: 40}).on('click',function(){ configuraCuenta(); });
                $("#BtnConfigConceptos").jqxButton({  width: 110, height: 40 }).on('click',function(){ configuraConceptos(); });
                $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel(); });
                $("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
            },

        });

    }
    else
    {
        let titulosGrid = Object.keys(_data[0]);
        $.each(titulosGrid, function (index, element) {
            var ancho=index==0?"10%":"18%";
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
    let dataAdapter;

    if(_data !== ""){
        dataAdapter = new $.jqx.dataAdapter(source);
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
                //$("#gdPlantilla").jqxGrid('autoresizecolumns');
               // $("#gdPlantilla").jqxGrid('hidecolumn','Id_CuentaContable');
            },
            renderstatusbar: function(statusbar){
                statusbar.append(botones);
                $("#BtnConfigCuenta").jqxButton({ width: 152, height: 30 }).on('click',function(){ configuraCuenta(); });
                $("#BtnConfigConceptos").jqxButton({ width: 165 , height: 30 }).on('click',function(){ configuraConceptos(); });
                $("#BtnExcel").jqxButton({ width: 100, height: 30 }).on('click',function(){ DescargaExcel(); });
                $("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
            },

        });
    }
    else if(_data.toString().trim().toLowerCase() !== "no existe el catálogo."){
         dataAdapter = [];
        $("#gdPlantilla").jqxGrid({
            autoshowfiltericon: true,
            columns: [],
            source: [],
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
                $("#gdPlantilla").jqxGrid('hidecolumn','Id_CuentaContable');
            },
            renderstatusbar: function(statusbar){
                statusbar.append(botones);
                $("#BtnConfigCuenta").jqxButton({  width: 152, height: 30});
                $("#BtnConfigConceptos").jqxButton({  width: 165, height: 30 });
                $("#BtnExcel").jqxButton({ width: 100, height: 30 });
                $("#BtnNuevo").jqxButton({ width: 100, height: 30 });
                //$("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
            },

        });

   }
   else{
    dataAdapter = [];
        $("#gdPlantilla").jqxGrid({
                autoshowfiltericon: true,
                columns: [],
                source: [],
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
                    $("#gdPlantilla").jqxGrid('hidecolumn','Id_CuentaContable');

                },
                renderstatusbar: function(statusbar){
                    statusbar.append(botones);
                    $("#BtnConfigCuenta").jqxButton({  width: 152, height: 30});
                    $("#BtnConfigConceptos").jqxButton({  width: 165, height: 30 });
                    $("#BtnExcel").jqxButton({ width: 100, height: 30 });
                    $("#BtnNuevo").jqxButton({ width: 100, height: 30 });
                    //$("#BtnNuevo").jqxButton({ width: 100, height: 30 }).on('click',function(){ Nuevo(); });
                },

        });

   }

    ocultarCargador();
}

async function Nuevo(){
    gridAction="NuevaCuentaContable";
    $('#IdMCCHtml').show();
    $('#idfant').hide();
    $("#jqxtabs").jqxTabs('enableAt', 1);
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo');
    limpiaCampos();
  
     $("#IdcuentaContable").val("0");
   
    $("#jqxtabs").jqxTabs('select',1);
    campos.push(
                { IdCuentaContable:1,
                    IdPadreCC:0, 
                    NivelCC:1,
                    SubClave:null,
                    Clave:"clavecuenta",
                    SpanClave:null,
                    Descripcion:"descripcion",
                    Antecedentes:"antecedentes",
                    Clasificacion:"idclasificacion",
                    Grupo:"idgrupo",
                    CuentaSAT:"idcuentasat",
                    estado:2,
                    value:null,
                    padre:0
                }
    );
    mostrarCargador();
    await creaHTMLNuevo();
    await  Combos();
    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' , disabled:false});
    ocultarCargador(); 

   
}
async function configuraCuenta(){
    mostrarCargador();
   
    $('#IdMCCHtml').show();
    $('#idfant').hide();
    let selecc=validaSeleccion();
    if(!selecc){

        showMsg('Mensaje','Seleccione un registro.');
        cuentaContableId="Error";
       
       }
       else{
        gridAction="ModificarCuentaContable";
        $("#jqxtabs").jqxTabs('enableAt', 1);
        $("#jqxtabs").jqxTabs('setTitleAt',1,'configurar cuenta');

        $("#jqxtabs").jqxTabs('select',1);

        let cuentaId=""+ selecc["Id_CuentaContable"];
        $("#IdcuentaContable").val(cuentaId);
        campos.push(
            { IdCuentaContable:1,
                IdPadreCC:0, 
                NivelCC:1,
                SubClave:null,
                Clave:"clavecuenta",
                SpanClave:null,
                Descripcion:"descripcion",
                Antecedentes:"antecedentes",
                Clasificacion:"idclasificacion",
                Grupo:"idgrupo",
                CuentaSAT:"idcuentasat",
                estado:1,
                value:null,
                padre:0
            }
        );
        await getConfiguracion(cuentaId);
        bandConfigCCGrid=true;
        await  Combos();
        
       }


}

function configuraConceptos(){

    let selecc=validaSeleccion();

    if(!selecc){

     showMsg('Mensaje','Seleccione un registro.');
     cuentaContableId="Error";
    }
    else{
     
        window.location.href="MatrizCuentaConcepto.html?id=" + selecc["Id_CuentaContable"];;
        //window.location.href="MatrizCuentaConcepto.html"

    }
}

function validaSeleccion(){
    let selectionIndex=$('#gdPlantilla').jqxGrid('getselectedrowindex');
    let dataRow=$('#gdPlantilla').jqxGrid('getrowdata', selectionIndex);

    if(selectionIndex !== -1){
        return dataRow
    }
    else{
        return false;
    }

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

//#endregion

//#region combos/Eventos de los combos
function Combos()
{
    fillCombo(87, 'idclasificacion', '');
    fillCombo(88, 'idcuentasat', '');
    generaEventoCombo( "idclasificacion","F2B28796A8A83B9108499FF2D7C8473D04ED09C1E7C17643EF89E2AA8611137E", "Id_Clasificacion=","idgrupo");
   

}

function generaEventoCombo(clave,APII,params,combo){
   
    //accion de cuenta nivel sat 2
    $('#' + clave + '').on('select', function (event)
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

                         let API=APII;
                         let parametros=params;
                       
                         armaCombo(value, combo, parametros,API);
                       
                     }
     });
}

function armaCombo(id, divCombo, params,APII){

    let parametros;

    if(divCombo ==="idgrupo"){
        parametros="" + "?" + params + id;

    }else{
        parametros="" + "?" + params + id + "&nivel=2";
    }
    let _data = {
        "API": APII,
        "Parameters": parametros,
        "JsonString": "",
        "Hash": getHSH(),
        "Bearer":getToken()
    }

    $.when(ajaxCatalogoSnId(_data)).done(function (response) {
        try {
            //console.log(divCombo,response);
            
            var dataAdapter = new $.jqx.dataAdapter(response);
            dASat=new $.jqx.dataAdapter(response);
            $("#" + divCombo + "").jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"
            });
            ocultarCargador();
        } catch (error) {
            ocultarCargador();
        }
        
    });
}
//#endregion

//#region Funciones que crean Html al agregar un nuevo   row al nivel o al agregar un nuevo nivel
async function nuevoSubcuentas(){
   
   
    await subAddRwCreaHTLM();   
    CuentaContableID++;

}

function subAddRwCreaHTLM(){
    contSubCuenta++;
    let numFila="" +contSubCuenta+ "";
    let claveNivel="clavecuentasubcuenta" +contSubCuenta +  "";
    $('#contenedorDatSubcuentas').append(''+
    '<div id="DivFilaSbC'+numFila+'" '+'class="form-row" style="margin-top:2%;">' +
        '<div class="col-md-2">' +
            '<span class="obligado">* </span>' +
            '<label for="clavecuentasubcuenta'+contSubCuenta+'">Clave subcuenta:</label>' +

            '<div class="input-group">'+
            '<span id="sclubcuenta'+contSubCuenta+'" class="input-group-text" style="height: 32px;" ></span>' +
                '<input type="text"' +
                    'class="form-control aweb0"' +
                    'id="clavecuentasubcuenta'+contSubCuenta+'"' +
                    'style="height: 32px;"' +
                    'onblur="generarClave('+ 3 +',this)" />' +
                    
            '</div>' +
        '</div>' +
        '<div class="col-md-3">' +
            '<span class="obligado">* </span>' +
            '<label for="descripcionsubcuenta'+contSubCuenta+'">Descripción:</label>' +
            '<input type="text"' +
                    'class="form-control form-control-sm hwdbo-texto aweb0"' +
                    'id="descripcionsubcuenta'+contSubCuenta+'"' +
                    '' +
                    'onblur="generarComboCD('+ 3 +',this,clavecuentasubcuenta'+contSubCuenta+')" />' +
                
        '</div>' +
        '<div class="col-md-2">' +
            '<label for="antecedentessubcuenta'+contSubCuenta+'">Antecedentes:</label>' +
            '<input type="text"' +
                    'class="form-control form-control-sm hwdbo-texto"' +
                    'id="antecedentessubcuenta'+contSubCuenta+'"' +
                    ' />' +
        '</div>' +
        '<div class="col-md-2">' +
            '<span class="obligado">* </span>' +
            '<label for="cuentasatsubcuenta'+contSubCuenta+'">Cuenta SAT:</label>' +
            '<div id="cuentasatsubcuenta'+contSubCuenta +'" class="hwdbo-combo aweb0"></div>' +
        '</div>' +

        '<div class="col-md-2" style="margin-top: 1.89%;">' +
            '<table>' +
                '<tr>' +
                '<td>' +
                        '<center>' +
                            '<a class="card dinamic bajaspanel editar " style="height:35px" onclick="eliminarRow('+ numFila +',2,'+claveNivel+')"><i class="fa fa-trash bajasico" style="margin:6px;font-size:14px"><label style="cursor:pointer;" class="etiqueta">Eliminar</label></i> </a>' +
                        '</center>' +
                    '</td>' +
                '</tr>' +
            '</table>' +

        '</div>' +

    '</div>' 
    );
    campos.push(
        { IdCuentaContable:CuentaContableID,
            IdPadreCC:1, 
            NivelCC:2,
            SubClave:null,
            Clave:"clavecuentasubcuenta"+contSubCuenta+"",
            SpanClave:"sclubcuenta"+contSubCuenta+"",
            Descripcion:"descripcionsubcuenta"+contSubCuenta+"",
            Antecedentes:"antecedentessubcuenta"+contSubCuenta+"",
            Clasificacion:"idclasificacion",
            Grupo:"idgrupo",
            CuentaSAT:"cuentasatsubcuenta"+contSubCuenta+"",
            estado:2,
            value: parseInt("2" + contSubCuenta),
            padre:1},
    );
    controles();
    if($('#clavecuenta').val() !=""){
        let valor=$('#clavecuenta').val();
        $('#sclubcuenta'+contSubCuenta+'').html(valor);
    }
    if(dASat !=undefined){

        $("#" + "cuentasatsubcuenta"+contSubCuenta + "").jqxDropDownList({
            source: dASat,
            displayMember: "Descripcion",
            valueMember: "Valor",
            placeHolder:"--Seleccione--"
        });
    }else{
        let combo= "cuentasatsubcuenta" + contSubCuenta;
        generaEventoCombo( "idcuentasat","96847492679576B465C1FAA131E57EFDCB2E6E59502D041A0479A369E7091B04", "Id_CuentaTributaria=",combo);
    }

}


async function nuevoNivel(numNiv){
   
   
    await nivelAddRwCreaHTLM(numNiv);
    CuentaContableID++;
   
}

function nivelAddRwCreaHTLM(numNiv){
    contNuevoNivel++;
    let numnNivel=numNiv;
    let pruebanivel=numnNivel + 1;
    let numFila="" + numnNivel + contNuevoNivel+ "";
    let claveNivel="clavenivelNivel" +numnNivel + contNuevoNivel+ "";

    $('#contenedorNivel'+numnNivel+'').append(
        '<div id="IdDivFila'+numFila+'"' + 'class="form-row" style="margin-top:1%;">' +
            '<div class="col-md-3">' +
                '<span class="obligado">* </span>' +
                '<label for="subcuentaNivel'+numnNivel + contNuevoNivel+'">Subcuenta:</label>' +

                '<div id="subcuentaNivel'+numnNivel+ contNuevoNivel+'" class="hwdbo-combo aweb0"></div>' +
            '</div>' +
            '<div class="col-md-2">' +
                '<span class="obligado">* </span>' +
                '<label for="clavenivelNivel'+numnNivel+contNuevoNivel+'">Clave nivel '+numnNivel +':</label>' +
                '<div class="input-group">'+
                    '<span id="SpclaveniNivel'+numnNivel+contNuevoNivel+'" class="input-group-text" style="height: 32px;" ></span>'+
                    '<input type="text"' +
                            'class="form-control aweb0"' +
                            'id="clavenivelNivel'+numnNivel+contNuevoNivel+'"' +
                            'style="height: 32px;"' +
                            'onblur="generarClave('+ pruebanivel +',this)" />' +
                        
                '</div>'+
            '</div>' +
            '<div class="col-md-2">' +
            '<span class="obligado">* </span>' +
                '<label for="descripcionNivel'+ numnNivel + contNuevoNivel + '">Descripción:</label>' +
                '<input type="text"' +
                        'class="form-control form-control-sm hwdbo-texto aweb0"' +
                        'id="descripcionNivel'+numnNivel + contNuevoNivel + '"' +
                        
                        ' onblur="generarComboCD('+pruebanivel+',this,clavenivelNivel'+numnNivel+contNuevoNivel+',false)" />' +
                        
            '</div>' +
            '<div class="col-md-2">' +

                '<label for="anteNivel' + numnNivel + contNuevoNivel + '">Antecedente:</label>' +

                '<input type="text"' +
                        'class="form-control form-control-sm  hwdbo-texto"' +
                        'id="anteNivel'+ numnNivel + contNuevoNivel + '"' +
                        ' />' +
            '</div>' +

            '<div   class="col-md-2" style="margin-top: 1.89%;">' +
                '<table >' +
                    '<tr>' +
                        '<td>' +
                            '<center>' +
                                '<a class="card dinamic bajaspanel editar " style="height:35px" onclick="eliminarRow('+ numFila +',1,'+claveNivel+')"><i class="fa fa-trash bajasico" style="margin:6px;font-size:14px"><label style="cursor:pointer;" class="etiqueta">Eliminar</label></i> </a>' +
                            '</center>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '</div>' +
        '</div>'

    );
    controles();
    campos.push(
                { IdCuentaContable:CuentaContableID,
                    IdPadreCC:numnNivel - 1, 
                    NivelCC:numnNivel,
                    SubClave:"subcuentaNivel"+numnNivel+contNuevoNivel+"", 
                    Clave:"clavenivelNivel"+numnNivel+contNuevoNivel+"",
                    SpanClave:"SpclaveniNivel"+numnNivel+contNuevoNivel+"",
                    Descripcion:"descripcionNivel"+numnNivel+contNuevoNivel+"",
                    Antecedentes:"anteNivel"+numnNivel+contNuevoNivel+"",
                    Clasificacion:"idclasificacion",
                    Grupo:"idgrupo",
                    CuentaSAT:"idclasificacionsubcuenta"
                    ,estado:2,
                    value: parseInt(numnNivel+""+contNuevoNivel ),
                    padre:null},
    );

    if(uniqueArray.length>0){

        let filtrado=uniqueArray.filter(function(arreg) {

            return arreg.nivel === numnNivel;

        });

         var clave="subcuentaNivel" + numnNivel + contNuevoNivel + "";
        //var descripcion="clavenivelNivel" + numnNivel + contNuevoNivel + "";
        var descripcion="SpclaveniNivel" + numnNivel + contNuevoNivel + "";
                var dataSource={datatype:"json",datafields:[{ name: 'text', type: 'string' }, { name: 'value', type: 'string' }],localdata:filtrado};
                var dataAdapter=new $.jqx.dataAdapter(dataSource);
                setTimeout(() =>{
                $('#subcuentaNivel' + numnNivel + contNuevoNivel +   '').jqxDropDownList({source: dataAdapter,displayMember: 'text', valueMember: 'value' ,searchMode:'containsignorecase'});


                },1);


                //armaCombosNiveles(arreglo,numnNivel);


    }
    let id="subcuentaNivel"+numnNivel+contNuevoNivel+"";
    let spaan="SpclaveniNivel"+numnNivel+contNuevoNivel+"";
    eventoComboSubCuenta(id,spaan);
}

function editaHsCard(contCardNivel,encabezado,nombreCard){


    nivelesCreados.push({numNivel:contCardNivel,nivelPadre:contCardNivel -1,nivelHijo:null,titulocard:encabezado,eliminoNivel:false,nomCard:nombreCard});

    $.each(nivelesCreados,function(key,value){

        const nivelPadre=nivelesCreados.some(np =>{ return np.nivelPadre === contCardNivel - 1});
        if(nivelPadre){
            value.nivelHijo=contCardNivel + 1;
        }
        const nivelHijo=nivelesCreados.some(nh =>{return nh.nivelHijo === contCardNivel + 1});
    });
}
function obtieneColorAleatorio() {
    var letras = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 16)];
    }
    return color;

}
async function nuevoCardNivel(){

   
   
    if(contCardNivel <=10){

       await cardAddCreaHTLM();
       CuentaContableID++;
      

    }
    //Deshabilita botón después de que llega al número máximo de hijos permitidos
    if(contCardNivel ===10) {
        $('#idnuevonivel').jqxButton({ disabled:true });
    }
  
   
   
}
function eventoComboSubCuenta(clave,descripcion){
    $('#' + clave + '').on('change', function (event)
    {
        
        var args = event.args;
        if (args) {

        var item = args.item;
       
        var label = item.label;
        var value = item.value;

      
       var h=$('#'+ descripcion +'').html().toString().replace(value,"");
     
     
   
      var spanValour=label.toString().split('-')[0].toUpperCase();
      $('#'+ descripcion +'').text('');
        $('#'+ descripcion +'').text(spanValour);
        
            for(let objCampo of campos){
                if(objCampo.SubClave == clave){
                  
                    let filtrocampo=campos.filter(function(arreg) {
    
                        return arreg.value ==value;
    
                    });
                    filtrocampo.forEach(element => {
                        objCampo.padre=element.IdCuentaContable;
                    });
                }
            }
        
        
    }
    });
}
function cardAddCreaHTLM(){
    let prueba=contCardNivel + 2;
    contCardNivel++;
    
    let hijocombo=contCardNivel + 1;
    //crea el HTML del nivel
    let encabezado="IdhN"+contCardNivel;
    let nombreCard="cardNivel"+contCardNivel;
    editaHsCard(contCardNivel,encabezado,nombreCard);
    $('#idnuevonivel').jqxButton({ disabled:false });
    $('#nuevosCard').append(
        '<div id="cardNivel'+contCardNivel+'" class="card">' +
        '<div class="card-header" id="headingNivel'+contCardNivel+'">' +
            '<h2  class="mb-0">' +
                '<button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseNivel'+contCardNivel+'" aria-expanded="true" aria-controls="collapseNivel'+contCardNivel+'">' +
                    '<h5 id="IdhN'+contCardNivel+'" style="color:'+obtieneColorAleatorio()+';font-weight:600;">Nivel '+contCardNivel+'</h5>' +
                '</button>' +
            '</h2>' +
        '</div>' +
        '<div id="collapseNivel'+contCardNivel+'" class="collapse show" aria-labelledby="headingNivel'+contCardNivel+'" data-parent="#accordionTabsAgregar">' +
            '<div id="divDatosNivel'+contCardNivel+'" style="margin: 1%;" class="hwdbo-section">' +
                '<div style="margin-top:3px;margin-left:5%">' +
                '<table cellpadding="4">' +
                '<tr></tr>' +

                '<tr>' +
                    '<td style="cursor:pointer;"><a class="card dinamic nuevoingresopanel " style="height:35px" onclick="nuevoNivel('+contCardNivel+')"><i class="fa fa-plus-square nuevoingresoico" style="margin:8px;font-size:14px"><label style="cursor:pointer;" class="etiqueta">Nuevo</label></i> </a></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td><a class="card dinamic bajaspanel editar " style="height:35px" onclick="eliminarNivel('+contCardNivel+',)"><i class="fa fa-trash bajasico" style="margin:8px;font-size:14px"><label style="cursor:pointer;" class="etiqueta">Eliminar</label></i> </a></td></td>' +
                '</tr>' +

            '</table>' +
                '</div>' +
                '<div id="contenedorNivel'+contCardNivel+'" class="container bajar" style="margin:1%;">' +
                    '<div id="IdDivFila123'+contCardNivel+'" class="form-row" style="margin-top:1%;">' +
                        '<div class="col-md-3">' +
                            '<span class="obligado">*</span>' +
                            '<label for="subcuenta'+contCardNivel+'">Subcuenta:</label>' +

                            '<div id="subcuenta'+contCardNivel+'" class="hwdbo-combo aweb0"></div>' +
                        '</div>' +
                        '<div class="col-md-2">' +
                            '<span class="obligado">*</span>' +
                            '<label for="clavenivel'+contCardNivel+'">Clave nivel '+contCardNivel+':</label>' +
                            '<div class="input-group">'+
                                '<span id="Spclavenivel'+contCardNivel+'" class="input-group-text" style="height: 32px;" ></span>'+
                                '<input type="text"' +
                                        'class="form-control aweb0"' +
                                        'id="clavenivel'+contCardNivel+'"' +
                                        'style="height: 32px;"' +
                                        '  onblur="generarClave('+hijocombo+',this)"  />' +
                                    
                            '</div>'+
                        '</div>' +
                        '<div class="col-md-2">' +
                            '<label for="descripcionnivel'+contCardNivel+'">Descripción:</label>' +
                            '<input type="text"' +
                                    'class="form-control form-control-sm hwdbo-texto aweb0"' +
                                    'id="descripcionnivel'+contCardNivel+'"' +
                                    ' onblur="generarComboCD('+hijocombo+',this,clavenivel'+ contCardNivel + ',true)" />' +
                                    
                        '</div>' +
                        '<div class="col-md-2">' +

                            '<label for="antenivel'+contCardNivel+'">Antecedente:</label>' +

                            '<input type="text"' +
                                    'class="form-control form-control-sm  hwdbo-texto"' +
                                    'id="antenivel'+contCardNivel+'"' +
                                    ' />' +
                        '</div>' +

                        '<div   class="col-md-2" style="margin-top: 1.89%;">' +
                            '<table >' +
                                '<tr>' +
                                    '<td>' +
                                        '<center>' +
                                            '<a class="card dinamic bajaspanel editar " style="height:35px" onclick="eliminarRow(123'+ contCardNivel +',1,clavenivel'+contCardNivel+')"><i class="fa fa-trash bajasico" style="margin:6px;font-size:14px"><label style="cursor:pointer;" class="etiqueta">Eliminar</label></i> </a>' +
                                        '</center>' +
                                    '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +
                    
                   
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>'
    );
    controles();
    campos.push( { 
                     IdCuentaContable:CuentaContableID,
                     IdPadreCC:contCardNivel - 1,
                     NivelCC:contCardNivel,SubClave:"subcuenta" + contCardNivel+"", 
                     Clave:"clavenivel"+contCardNivel+"",
                     SpanClave:"Spclavenivel" + contCardNivel+"",
                     Descripcion:"descripcionnivel"+contCardNivel+"",
                     Antecedentes:"antenivel" + contCardNivel + "",
                     Clasificacion:"idclasificacion",
                     Grupo:"idgrupo",
                     CuentaSAT:"idclasificacionsubcuenta",
                     estado:2,
                     value:parseInt( contCardNivel + "1"),
                     padre:null
                 }
    ); 
    
    if(uniqueArray.length>0){


     let filtrado=uniqueArray.filter(function(arreg) {

         return arreg.nivel === prueba-1;

     });
     
     var dataSource={datatype:"json",datafields:[{ name: 'text', type: 'string' }, { name: 'value', type: 'string' }],localdata:filtrado};
     var dataAdapter=new $.jqx.dataAdapter(dataSource);
     setTimeout(() =>{
         $('#subcuenta' + contCardNivel + '').jqxDropDownList({source: dataAdapter,displayMember: 'text', valueMember: 'value' ,searchMode:'containsignorecase'});
         $('#subcuentaa' + contCardNivel  +   '').jqxDropDownList({source: dataAdapter,displayMember: 'text', valueMember: 'value' ,searchMode:'containsignorecase'});
     },500);
      
  
    }
    let id="subcuenta" + contCardNivel+"";
    let spaan="Spclavenivel" + contCardNivel+"";
    eventoComboSubCuenta(id,spaan);
}
//#endregion

//#region Eventos generan el combo y el campo de la clave descripción
    //#region Genera el el evento del combo, con el campo descripcion
    function generarComboCD(nivelhijo,e,campClav,bandera){
        let Nuevoarre=[];
        let ClavCAmpo="";
        if (campClav === "clavecuenta") {
            ClavCAmpo=campClav;
        } else {
            ClavCAmpo=campClav.id.toString();   
        }
         
       
         let SV;
         let cV;
         let descripcion;
         let valor;
        
         
         campos.forEach((campo,index) =>{
             
                 if(e.id ==campo.Descripcion){
                     if((campo.NivelCC) === nivelhijo-1) {
     
                         if((campo.NivelCC) === 2){
                             
                             if (gridAction=="NuevaCuentaContable") {
                                 campo.padre=1;
                             } else {
                                 let filtro= campos.filter(function(campo){
                                     return campo.NivelCC===1;
                                 });
                                 let idcuentac=null
                                 filtro.forEach(element => {
                                     idcuentac=element.IdCuentaContable;
                                 });
                                 campo.padre=idcuentac;
                             } 
                         }
     
     
                         if(campo.SpanClave !== null){
                             valor= $('#'+campo.SpanClave+'').html() + $('#' + campo.Clave + '').val();
                             SV=$('#'+campo.SpanClave+'').html();
                             cV=$('#' + campo.Clave + '').val();
                         }
                         else{
                             valor=  $('#' + campo.Clave + '').val() + "";
                             SV="";
                             cV=$('#' + campo.Clave + '').val();
                         }
     
                         descripcion=  "" + valor + "-" + e.value;
     
     
                         if( $('#' + campo.Descripcion + '').val() !="" &&  $('#' + campo.Descripcion + '').val() !=null ){
                             const  existe=nuevoUniqueArray.some(clavedes =>{ return clavedes.campoDes === campo.Descripcion });
                             if (existe) {
                                nuevoUniqueArray.forEach((desElement) =>{
                                     if ( desElement.campoDes ===campo.Descripcion) {
                                         desElement.claveValor =cV,
                                         desElement.nivel=nivelhijo,
                                         desElement.campoClave=ClavCAmpo,
                                         desElement.spanvalor=SV,
                                         desElement.text=descripcion.toString().toUpperCase(),
                                         desElement.value=campo.value,
                                         desElement.padre=nivelhijo - 1,
                                         desElement.campoDes=campo.Descripcion
                                     }
                                 });
                             } else {
                                nuevoUniqueArray.push({ claveValor:cV,
                                     nivel: nivelhijo,
                                     campoClave:ClavCAmpo,
                                     spanvalor: SV,
                                     text:  descripcion.toString().toUpperCase(),
                                     value: campo.value,
                                     padre: nivelhijo - 1,
                                     campoDes:campo.Descripcion},);
         
                             }
                             
     
                         }
                     }
     
                 }
             
     
         });
         uniqueArray = removeDuplicates(nuevoUniqueArray, "value"); 
         armaCombosNiveles(uniqueArray,nivelhijo);
         
    
    }
    function removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};
    
        for(var i in originalArray) {
           lookupObject[originalArray[i][prop]] = originalArray[i];
        }
    
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
         return newArray;
    }
    
    function armaCombosNiveles(infoCombo,nivelPadre){

        let filtrado=infoCombo.filter(function(arreg) {

            return arreg.nivel === nivelPadre;

        });

        campos.forEach((c,index) =>{
            if( c.SubClave !=null && c.NivelCC == nivelPadre){
            //if( c.SubClave !=null ){
                var dataSource={datatype:"json",datafields:[{ name: 'text', type: 'string' }, { name: 'value', type: 'string' }],localdata:filtrado};
                var dataAdapter=new $.jqx.dataAdapter(dataSource);
            
            try {
                if($('#' + c.SubClave  +   '').length > 0){
                    setTimeout(() =>{
                        $('#' + c.SubClave  +   '').jqxDropDownList({source: dataAdapter,displayMember: 'text', valueMember: 'value' ,searchMode:'containsignorecase'});
            
                    },1);
                }
            
            } catch (error) {
                
            }
            

            }
        });

    }

    //#endregion
    //#region  evento del campo de la clave
    function generarClave(nivelSubCuentahijo,e){


            var valor1=e.value;
            let desc=0;
            campos.forEach((campo,index) =>{

                if( nivelSubCuentahijo <=  campo.NivelCC && campo.NivelCC < 3 ){
                    $('#'+campo.SpanClave+'').text('');
                    $('#'+campo.SpanClave+'').text(e.value.toString().toUpperCase());
                    if( gridAction==="NuevaCuentaContable"){
                        if (uniqueArray.length > 0) {
                            uniqueArray.forEach(changer => {
                                let newDescription= $('#'+campo.SpanClave+'').text().toUpperCase() + changer.claveValor.toString().toUpperCase() +'-' + changer.text.toString().split('-')[1]
                                changer.text =newDescription;
                            
                                
                                let nivelhijo=changer.nivel;
                                valorclav=changer.claveValor.toString().toUpperCase();
                                spanvlu=$('#'+campo.SpanClave+'').text().toUpperCase();
                                changer.claveValor =valorclav;
                                changer.spanvalor =spanvlu;
                            //armaCombosNiveles(uniqueArray,nivelhijo);
                            });
                        }
                       
        
                        

                    }
                // campo.IdPadreCC=e.value;

                }

            });
            if(uniqueArray.length > 0){
                let nuevoValor="";
                let description="";
                let valeur="";


                let campokey="";
                Cuentas=[...uniqueArray];

                Cuentas.forEach((valorUA,index) => {
                    if(e.id === valorUA.campoClave){
                        nuevoValor=e.value;
                        description=$('#' + valorUA.campoDes).val();
                        valeur=valorUA.value;
                        campokey=$('#' + valorUA.campoClave).val();
                    }

                });
                if(description !=""  && campokey !="" ){
                    //cambia los span con nuevo valor
                    BuscarNodo(valeur, nuevoValor, "");
                    // console.log("Arreglo antes de cambiar la descripción:  ");
                    // console.log(uniqueArray);
                    //--cambiamos la descripción
                setTimeout(()=>{
                    let valorclav;
                    let spanvlu="";
                    uniqueArray.forEach(changer => {
                        let newDescription;
                        if(changer.spanvalor !=undefined ){
                            newDescription=changer.spanvalor.toString().toUpperCase() + changer.claveValor.toString().toUpperCase() +'-' + changer.text.toString().split('-')[1]
                            changer.text =newDescription;
                            spanvlu=changer.spanvalor.toString().toUpperCase();
                        }
                         
                    
                        
                        let nivelhijo=changer.nivel;
                        valorclav=changer.claveValor.toString().toUpperCase();
                       
                        changer.claveValor =valorclav;
                        changer.spanvalor =spanvlu;
                

                    });
                },500);
                // console.log("Arreglo descpués de cambiar la descripción:  ");
                // console.log(uniqueArray);
                }

                uniqueArray = removeDuplicates(nuevoUniqueArray, "value");
                //console.log(uniqueArray);
                //let nivelSubCuentahijo=nivelSubCuentahijo + 1;
                armaCombosNiveles(uniqueArray,nivelSubCuentahijo);
                
            }
          
            
    }

    function BuscarNodo(value, ClaveNueva, DescripcionNueva) {
        var i = uniqueArray.findIndex((elemento) => elemento.value === value);
        if (ClaveNueva !== "") {
            uniqueArray[i].text = uniqueArray[i].text.replace(uniqueArray[i].spanvalor + uniqueArray[i].claveValor, uniqueArray[i].spanvalor + ClaveNueva);
            uniqueArray[i].claveValor = ClaveNueva;
            var NivelCiclo = uniqueArray[i].nivel + 1;
            // console.log("Clave nueva: " + ClaveNueva +  " text: " +  uniqueArray[i].text + " claveValor: " +  uniqueArray[i].claveValor + " "
            // + NivelCiclo );

            BuscarHijos(value, uniqueArray[i].spanvalor + ClaveNueva, NivelCiclo);
            return;
        }
        if (DescripcionNueva !== "") { uniqueArray[i].text = uniqueArray[i].spanvalor + uniqueArray[i].claveValor + '-' + DescripcionNueva; }

    }
    function BuscarHijos(value, ClaveNueva,NivelCiclo) {
        var Hijos = uniqueArray.filter((elemento) => elemento.padre === value && elemento.nivel === NivelCiclo);
        if (Hijos.length > 0) {

            for (var i = 0; i < Hijos.length; i++) {
                if (Hijos[i].nivel == NivelCiclo) {
                    Clavehijo = ClaveNueva + Hijos[i].claveValor;

                    var x = uniqueArray.findIndex((elemento) => elemento.claveValor === Hijos[i].claveValor && elemento.nivel === Hijos[i].nivel && elemento.spanvalor === Hijos[i].spanvalor && elemento.text === Hijos[i].text && elemento.value == Hijos[i].value && elemento.padre === Hijos[i].padre);
                    if (x != -1) {
                        let h=uniqueArray[x].text;
                        //console.log("antes del replace " + h);

                        uniqueArray[x].text = uniqueArray[x].text.replace(uniqueArray[x].spanvalor + uniqueArray[x].claveValor, ClaveNueva + uniqueArray[x].claveValor)

                        uniqueArray[x].spanvalor = ClaveNueva;

                        // console.log("Clave nueva: " + ClaveNueva +  " text: " +  uniqueArray[x].text + " claveValor: " +  uniqueArray[x].claveValor + " "
                        // + NivelCiclo );
                
                        BuscarHijos(uniqueArray[x].value, Clavehijo, NivelCiclo + 1)

                    }
                    else return;
                }
                else return;
            } return;

        } else return;
    }

    //#endregion

//#endregion
//---------Funciones al agregar un nuevo concepto
async function creaHTMLNuevo(){
   await nuevoSubcuentas();
   await nuevoNivel(3);
}
 
//#region   funiones que Eliminan Niveles

async function eliminarNivel(IdNivel){
    mostrarCargador();
    //--Valida si existe niveles superiores al que intentamos eliminar
    let existe=nivelesCreados.some(nivel =>{
        return nivel.numNivel > IdNivel;
    });
    let filtrarows="";
    // let filtrarows=uniqueArray.filter(function(flttrcampr){
    //     return flttrcampr.nivel !=IdNivel + 1;
    // });
    if(existe){
        let msj=`Para eliminar el nivel ${IdNivel}, primero elimine el último nivel que ingresó `;
        showMsgSinTimer('Mensaje',msj);
        ocultarCargador();
    }
    else{
       
        let nivel=document.querySelector('#contenedorNivel'+numnNivel+'');

    //---Elimina los campos que se agregaron al arreglo cuando se creo el nivel  en la etapa de agregar nuevo registro
    let cuetaCamposExist=0;
    campos.forEach(element => {
        if(element.NivelCC === IdNivel){
            cuetaCamposExist++;
        }
    });
    //---Cuenta cuantos rows existen el arreglo coampos con ese nivel para poder restarlos al contador
    if(gridAction==="NuevaCuentaContable"){
      
       await deleteACamposLevel(filtrarows,IdNivel);


        
    }
    //---Edita el estarus del campo si se elimina en la etapa de modificación
    if(gridAction==="ModificarCuentaContable"){
      await deleteUpdateCamposLevel(filtrarows,IdNivel);
    }

    await deleteLevelHTML(IdNivel,cuetaCamposExist);
    ocultarCargador();
    }
}

function deleteACamposLevel(filtrarows,IdNivel){
    let eliminaCampo=campos.filter(function(nuevoarreglo){

        return nuevoarreglo.NivelCC   != IdNivel;
    });
    campos.length=0;
    campos=[...eliminaCampo];

    uniqueArray=[];
    uniqueArray=[...filtrarows];
    //--se recorre del arreglo de los combos para armar los combos con la funcion armaCombosNiveles
    for (const iterator of uniqueArray) {
        armaCombosNiveles(uniqueArray,iterator.nivel);
    }
}
function deleteUpdateCamposLevel(filtrarows,IdNivel){
    let camposEliminados=camposUpdate.filter(function(cDelete){

        return cDelete.NivelCC   == IdNivel && cDelete.estado != 2;;
    });

   
    let camposNoEliminados=camposUpdate.filter(function(wOutDelete){

        return wOutDelete.NivelCC   != IdNivel;
    });

    $.each(camposEliminados , function(index,eliminados){
        eliminados.estado=0;
    } );

    $.each(camposNoEliminados , function(index,noEliminados){
       
        if( noEliminados.estado==0){
            noEliminados.estado=0;
        } else if(noEliminados.estado == 2){
            noEliminados.estado=2;
        }
        else{
            noEliminados.estado=1;
        }
    } );
    camposUpdate.length=0;
    camposUpdate=[...camposNoEliminados,...camposEliminados];
     uniqueArray=[];
    uniqueArray=[...filtrarows];
    //--se recorre del arreglo de los combos para armar los combos con la funcion armaCombosNiveles
    for (const iterator of uniqueArray) {
        armaCombosNiveles(uniqueArray,iterator.nivel);
        }
        
}
function deleteLevelHTML(IdNivel,cuetaCamposExist){
    let nombreCard="cardNivel" + IdNivel;
    numnNivel--;
    contNuevoNivel--;
    contCardNivel--;
    const eliminarNivel=document.querySelector( '#cardNivel' + IdNivel);
    eliminarNivel.remove();

    let indiceFiltro=nivelesCreados.filter(function(NCreado){
        return NCreado.nomCard !==nombreCard;
    });  
    nivelesCreados=[...indiceFiltro];

    CuentaContableID=CuentaContableID-cuetaCamposExist;
   /// console.log(cuetaCamposExist);
}

//#endregion

//#region   funiones que Eliminan Rows

 async function eliminarRow(IdDIv,num,Clave){
    mostrarCargador();
    // 1 row Nivel n , 2 row subcuenta
    if(gridAction==="NuevaCuentaContable"){

       await deleteACamposRow(Clave,num);

    }
    
    if(gridAction==="ModificarCuentaContable"){
      
        await deleteUpdateCamposRow(Clave,num);
              
    }
    await deleteRowHTML(IdDIv,num); 
    ocultarCargador();    
}
function deleteACamposRow(Clave,num){
    CuentaContableID=0;
    let ClavCAmpo="";
      //----Elimina elemento del arreglo uniquedArrray  cuando se agregar un nuevo registor 
    ClavCAmpo=Clave.id.toString();
   
    
    ///----Elimina elemento del arreglo campo
    let eliminaCampo;
    eliminaCampo=campos.filter(function(nuevoarreglo){
        return nuevoarreglo.Clave   != Clave.id;
    });
     for(let prueba of eliminaCampo){

        CuentaContableID++
        let p = CuentaContableID;
            prueba.IdCuentaContable=CuentaContableID;


    }
    campos.length=0;
    campos=[...eliminaCampo];

    //--recorre el areglo de los combos, limpia y copia los datos del filtrado
    let UAfiltre=uniqueArray.filter(function(arreg) {

        return arreg.campoClave.toString() != ClavCAmpo;

    });
    uniqueArray=[];
    uniqueArray=[...UAfiltre];
    //--se recorre del arreglo de los combos para armar los combos con la funcion armaCombosNiveles
    for (const iterator of uniqueArray) {
        armaCombosNiveles(uniqueArray,iterator.nivel);
    }

}
function deleteUpdateCamposRow(Clave,num){
    let camposEliminadosM;
    let camposNoEliminadosM;
    let UAfiltre;
    let ClavCAmpo="";
    CuentaContableID--;
    //---Edita el estarus del campo si se elimina en la etapa de modificación
    camposEliminadosM=campos.filter(function(cDelete){

            return cDelete.Clave   == Clave.id && cDelete.estado != 2;
    });
    camposNoEliminadosM=campos.filter(function(wOutDelete){

            return wOutDelete.Clave   != Clave.id;
    });
       
   
    $.each(camposEliminadosM , function(index,eliminados){
        if(eliminados.estado == 2){
            eliminados.estado=2;
        }else{
            eliminados.estado=0;
        }
       
    } );

    $.each(camposNoEliminadosM , function(index,noEliminados){
        if(noEliminados.estado == 0){
            noEliminados.estado=0;
        }
        else if(noEliminados.estado == 2){
            noEliminados.estado=2;
        }
        else{
            noEliminados.estado=1;
        }

    } );
    campos.length=0;
    campos=[...camposNoEliminadosM,...camposEliminadosM];
       
    
    //--recorre el areglo de los combos, limpia y copia los datos del filtrado
     //--filtro para arreglo, no se han eliminado 
    UAfiltre=uniqueArray.filter(function(arreg) {

        return arreg.campoClave.toString() != Clave.id;

    });                
    uniqueArray=[];
    uniqueArray=[...UAfiltre];
    //--se recorre del arreglo de los combos para armar los combos con la funcion armaCombosNiveles
    for (const iterator of uniqueArray) {
        armaCombosNiveles(uniqueArray,iterator.nivel);
    } 
        
}
function deleteRowHTML(IdDIv,num){
    let eliminarNivel;
  
   
    if(num ===1){
        eliminarNivel=document.querySelector('#IdDivFila' + IdDIv);
        
        contNuevoNivel--;

    }else{
        contSubCuenta--;
        eliminarNivel=document.querySelector('#DivFilaSbC' + IdDIv);
    

    }
    eliminarNivel.remove();
}

//#endregion


//#region Guardar/Modificar CuentasContables

function generarjson(){
    generarJson.length=0;
  
    configuraCuenta
    let clasificacion=0;
    let grupo;
    let cuentaSatNivel1;
    let cuentaSatNivel2;
    let cuentasat;
    let  sPAN="";
    let claveCContable="";
    let campoCuentaSatN2="";
    campos.forEach((campo,index) =>{
        // ---Obtiene valor de campo calsificación, grupo, cuenta Sat(tributaria) nivel 1, nivel 2  y los demás niveles
        if(campo.NivelCC ===1){
            cuentasat="";
             clasificacion=$('#'+ campo.Clasificacion + '').val();
             grupo=$('#'+ campo.Grupo + '').val();
             cuentaSatNivel1=$('#'+ campo.CuentaSAT + '').val();
             cuentasat=cuentaSatNivel1;
             campo.padre=0;
        }
        else if(campo.NivelCC === 2 ){
            cuentasat="";
                cuentaSatNivel2=$('#'+ campo.CuentaSAT + '').val();
                cuentasat=cuentaSatNivel2;
               
                
        }else{

            //Otiene la calve sat y el Id configuración 

            let arreglosat=[];
            campos.forEach(elementoSAT =>{
                if(elementoSAT.NivelCC == 2){
                    arreglosat.push({IdCC: elementoSAT.IdCuentaContable,etiquetaSat:elementoSAT.CuentaSAT});
                }
            });
            let valorcuenta="";
            arreglosat.forEach(valor => {
                if(valor.IdCC == campo.padre){
                    cuentasat="";
                    valorcuenta=$('#'+ valor.etiquetaSat + '').val();
                    cuentasat=valorcuenta;
                }
            });

        }
      // ---Obtiene valor de la etiqueta span de cada row
        if($('#' + campo.SpanClave +'').text() === null){
            sPAN="";
        }
        else{
            sPAN=$('#' + campo.SpanClave +'').text();
        }
        claveCContable= sPAN + "" + $('#' + campo.Clave +'').val();
     


        //--Cambia el valor del campo.estado dependiendo de la acción a relizar
            generarJson.push(
                {
                    clave_CuentaContable:claveCContable.toUpperCase()
                    ,descripcion_CuentaContable:$('#' +campo.Descripcion+ '').val().toUpperCase()
                    ,id_GrupoCuentaContable:grupo
                    ,id_ClasificacionCuentaContable:clasificacion
                    ,claveAntecedente:$('#' +campo.Antecedentes+ '').val().toUpperCase()
                    ,id_CuentaTributaria:cuentasat
                    ,id_CuentaContablePadre:campo.padre
                    ,nivelCuentaContable:parseInt(campo.NivelCC)
                    //,estatus:campo.estado //campo númerico
                    ,estatus:2 //campo númerico
                    ,id_CuentaContable:parseInt(campo.IdCuentaContable)

                }
            );
       
    });

    return  generarJson;
}

function generarjsonMod(){
    genJsonModifica.length=0;

  
    let clasificacion=0;
    let grupo;
    let cuentaSatNivel1;
    let cuentaSatNivel2;
    let cuentasat="";
    let  sPAN="";
    let nivelCuenta=null;

  
    let claveCContable="";
    let descripcion="";
    let antecedente="";
    
    campos.forEach((campo,index) =>{
        
        // ---Obtiene valor de campo calsificación, grupo, cuenta Sat(tributaria) nivel 1, nivel 2  y los demás niveles
        if(campo.NivelCC ===1){
             clasificacion=$('#'+ campo.Clasificacion + '').val();
             grupo=$('#'+ campo.Grupo + '').val();
             cuentaSatNivel1=$('#'+ campo.CuentaSAT + '').val();
             cuentasat=cuentaSatNivel1;
             
             campo.padre=0;
         }
        else if(campo.NivelCC === 2 ){
                cuentaSatNivel2=$('#'+ campo.CuentaSAT + '').val();
                cuentasat=cuentaSatNivel2;
        }else{
                //Otiene la calve sat y el Id configuración 

            let arreglosat=[];
            campos.forEach(elementoSAT =>{
                if(elementoSAT.NivelCC == 2){
                    arreglosat.push({IdCC: elementoSAT.IdCuentaContable,etiquetaSat:elementoSAT.CuentaSAT});
                }
            });
            let valorcuenta="";
            arreglosat.forEach(valor => {
                if(valor.IdCC == campo.padre){
                    cuentasat="";
                    valorcuenta=$('#'+ valor.etiquetaSat + '').val();
                    cuentasat=valorcuenta;
                }
            });


        }
         // ---Obtiene valor de la etiqueta span de cada row
        if($('#' + campo.SpanClave +'').text() === null  || $('#' + campo.SpanClave +'').text() ===""){
            sPAN="";
        }
        else{
            sPAN=$('#' + campo.SpanClave +'').text();
        }
        if(campo.estado !==0){
            claveCContable= sPAN + "" + $('#' + campo.Clave +'').val();
            claveCContable=claveCContable.toUpperCase();
        }

       
        descripcion=$('#' +campo.Descripcion+ '').val();
        antecedente=$('#' +campo.Antecedentes+ '').val();
        nivelCuenta=parseInt(campo.NivelCC);
        //--Cambia el valor del campo.estado dependiendo de la acción a relizar
        
        if(campo.estado !=0 && campo.estado !=2){

            campo.estado=1
        }
        if(campo.estado ===0){
            claveCContable="";
            descripcion=""; 
             grupo="";
            clasificacion=0;
            antecedente="";
            cuentasat="";
            nivelCuenta=0;

        }
          
                genJsonModifica.push(
                    {
                        clave_CuentaContable:claveCContable
                        ,descripcion_CuentaContable:descripcion
                        ,id_GrupoCuentaContable:grupo
                        ,id_ClasificacionCuentaContable:clasificacion
                        ,claveAntecedente:antecedente
                        ,id_CuentaTributaria:cuentasat
                        ,id_CuentaContablePadre:campo.padre
                        ,nivelCuentaContable:nivelCuenta
                        ,estatus:campo.estado //campo númerico
                        ,id_CuentaContable:parseInt(campo.IdCuentaContable)
    
                    }
                );
     });

    return  genJsonModifica;
}
 function GuardarCuentaContable(elem){
    mostrarCargador();
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
    var jsonguarda;
    if (gridAction==="NuevaCuentaContable") {
        jsonguarda=generarjson();
    } else {
        jsonguarda=generarjsonMod();    
    }
    //console.log(JSON.stringify(jsonguarda));
    var p="";
    if (resultValidacion.length == 0) {
        var apino = $("#IdcuentaContable").val() ==="0" ? "40E62C294016772658D7E6E22F7610B84DD516D457052B32F5FEC06DCAFE9E1B" : "FE5411E4EFEBEB5AE1DCF5DC8E1910720D747C2BA66E85559BA8CE0DAC199A11";
        var obj = new Object();
        obj.API=apino;
        obj.Parameters="";
        
        obj.JsonString=JSON.stringify(jsonguarda);
        obj.Hash= getHSH();
        obj.Bearer= getToken();
        setTimeout(function(){
            $.when(ajaxTokenFijo(obj)).done( function (res) {
            if(res)
            {
                if(res[0].Exito)
                {

                    //---bandera guarda... y almacena la id cuenta contable
                    banderaGuardar=true;
                    bandConfigCCGrid=false;
                    if($("#IdcuentaContable").val() ==="0"){
                        $("#IdcuentaContable").val(res[0]["Id_CuentaContable"]);
                       
                    }else{

                        $("#IdcuentaContable").val(res[0]["Id_CuentaContable"]);
                    }  

                   
                    let cuentaId=$("#IdcuentaContable").val();
                   
                   
                    gridAction ="ModificarCuentaContable";
                    if ( gridAction =="ModificarCuentaContable") {
                         limpiarHTMLCC();
                       
                        $("#jqxtabs").jqxTabs('setTitleAt',1,'Modificar');
                       
                    }
                   
                        $.confirm({
                        title: 'Éxito',
                        type:'green',
                        icon: 'fa fa-check nuevoingresoico',
                        typeAnimated:true,
                        content: 'Registro guardado con éxito.',
                        buttons: {
                            Aceptar: function () {
                                mostrarCargador();
                               
                                getConfiguracion(cuentaId);
                                
                            },
                        }
                    });
                   // console.log(res[0]["Id_CuentaContable"]);
                  
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

            ocultarCargador();
        });  },1500);
    }
    else
    {
        armaListaErrores(resultValidacion);
        ocultarCargador();
    }
}
//#endregion

function limpiarHTMLCC(){
    dASat="";
    let selecSubcuenta=document.querySelector("#cardSubcuenta").querySelector("#contenedorDatSubcuentas");
    selecSubcuenta.innerHTML='';
    let Nivel3=document.querySelector("#cardNivel3").querySelector("#contenedorNivel3");
    Nivel3.innerHTML='';

    let Nivel4=document.querySelector("#cardNivel4");
    if (Nivel4 !== null) {
        Nivel4=document.querySelector("#cardNivel4").querySelector("#contenedorNivel4");
        Nivel4.innerHTML='';
    }

    let Nivel5=document.querySelector("#cardNivel5");
    if (Nivel5 !== null) {
        Nivel5=document.querySelector("#cardNivel5").querySelector("#contenedorNivel5");
        Nivel5.innerHTML='';
    }

    let Nivel6=document.querySelector("#cardNivel6");
    if (Nivel6 !== null) {
        Nivel6=document.querySelector("#cardNivel6").querySelector("#contenedorNivel6");
        Nivel6.innerHTML='';
    }

    let Nivel7=document.querySelector("#cardNivel7");
    if (Nivel7 !== null) {
        Nivel7=document.querySelector("#cardNivel7").querySelector("#contenedorNivel7");
        Nivel7.innerHTML='';
    }

    let Nivel8=document.querySelector("#cardNivel8");
    if (Nivel8 !== null) {
        Nivel8=document.querySelector("#cardNivel8").querySelector("#contenedorNivel8");
        Nivel8.innerHTML='';
    }
    let Nivel9=document.querySelector("#cardNivel9");
    if (Nivel9 !== null) {
        Nivel9=document.querySelector("#cardNivel9").querySelector("#contenedorNivel9");
        Nivel9.innerHTML='';
    }
    let Nivel10=document.querySelector("#cardNivel10");
    if (Nivel10 !== null) {
        Nivel10=document.querySelector("#cardNivel10").querySelector("#contenedorNivel10");
        Nivel10.innerHTML='';
    }

    campos=[];
    campos.push(
       { IdCuentaContable:1,
           IdPadreCC:0, 
           NivelCC:1,
           SubClave:null,
           Clave:"clavecuenta",
           SpanClave:null,
           Descripcion:"descripcion",
           Antecedentes:"antecedentes",
           Clasificacion:"idclasificacion",
           Grupo:"idgrupo",
           CuentaSAT:"idcuentasat",
           estado:1,
           value:null,
           padre:0
       }
   );

   contSubCuenta=0;
   contNuevoNivel=0;
   contCardNivel=3;
   CuentaContableID=1;

       reemplazoSpan="";
      //---Arreglo almacena los datos de los combos de subcuenta
       nuevoUniqueArray=[];
       uniqueArray=[];
       uArrayUpdate=[];
       Cuentas=[];
       Configuracion=[];
       uniqueArray2=[];
}

//#region consultar datos/CreaHTMLModifica
function getConfiguracion(IdPadre){
   
    var apino = "83E1E3C42CD1729D1D249DF1BEC7DAF986998EEED963DD904D38C3295B321C52";

    var parametro="?Id_CuentaContable=" + IdPadre;
    var obj = new Object();
    obj.API=apino;
    obj.Parameters=parametro;
    
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();
    setTimeout(function(){
        $.when(ajaxTokenFijo(obj)).done(function (res) {

            if(res.length > 0)
            {

                //console.log(res);
                Configuracion=[];
                Configuracion=[...res];

               
                

                    MapeaDatos(res);

                //     mostrarCargador();
                  setTimeout(()=>{
                    
                    $(".hwdbo-boton").jqxButton({ width: '130', height: '30' , disabled:false});
                    
                  },1000);
              
                // ocultarCargador();
               var d=res;

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


       
    });  },1500);


}
async function MapeaDatos(obj)
{
    mostrarCargador();
    uniqueArray=[];
    let existeCampo=false;
//---------Nivel 1
    let fltrNivel1=obj.filter(datos1 => {return datos1.NivelCuentaContable == 1});
    let spanN2="";
    let clavesaatn1="";
    try {
        for(let nivl1 of fltrNivel1){
      
            // controlCombo();
             spanN2=nivl1.Clave_CuentaContable;
             $('#clavecuenta').val(nivl1.Clave_CuentaContable);
             $('#descripcion').val(nivl1.Descripcion_CuentaContable);
             $('#antecedentes').val(nivl1.ClaveAntecedente);
             //---combos
             $("#idclasificacion").jqxDropDownList('selectItem', nivl1.Id_ClasificacionCuentaContable );
             $("#idcuentasat").jqxDropDownList('selectItem', nivl1.Id_CuentaTributaria);
             clavesaatn1=nivl1.Id_CuentaTributaria;
             setTimeout(async ()=>{
                 ocultarCargador();
                 $("#idgrupo").jqxDropDownList('selectItem', nivl1.Id_GrupoCuentaContable );
                 mostrarCargador();
                
             },2500);
             //---generando combo
              objetoHTML=null;
              objetoHTML=document.getElementById('descripcion');
              let cuentaContableId;
              let padreId;
              campos.forEach((prueba)=>{ 
                 var descvalue=$('#' + prueba.Descripcion ).val();
                 if(nivl1.NivelCuentaContable === prueba.NivelCC && nivl1.Descripcion_CuentaContable == descvalue){
                     prueba.IdCuentaContable=nivl1.Id_CuentaContable;
                     prueba.padre=0;
                     prueba.value=nivl1.Id_CuentaContable;
                     prueba.estado=1;
                     cuentaContableId=nivl1.Id_CuentaContable;
                     padreId=nivl1.Id_CuentaContablePadre;
                   
                 }
             });
             controles();
           await  getcmbsConfig(2,objetoHTML,'clavecuenta',false,cuentaContableId,padreId,'',''); 
           
         }
     
         await level2_10(obj,clavesaatn1,spanN2);
     
    } catch (error) {
        console.log(error);
    }
 
    ocultarCargador();

}
async function level2_10(obj,clavesaatn1,spanN2){
//console.log(obj);


    await nivel2(obj,clavesaatn1,spanN2);
    await nivel3(obj,clavesaatn1,spanN2);
    await nivel4(obj,clavesaatn1,spanN2);
    await nivel5(obj,clavesaatn1,spanN2);
    await nivel6(obj,clavesaatn1,spanN2);
    await nivel7(obj,clavesaatn1,spanN2);
    await nivel8(obj,clavesaatn1,spanN2);
    await nivel9(obj,clavesaatn1,spanN2);
    await nivel10(obj,clavesaatn1,spanN2);


    for (const iterator of uniqueArray) {
        armaCsNlsConfig(uniqueArray,iterator.nivel);
    }


}
async function nivel2(obj,clavesaatn1,spanN2){
    let fltrNivel2=obj.filter(datos2 => {return datos2.NivelCuentaContable == 2;});
    fltrNivel2.forEach(async (element,index) => {
     
         await nuevoSubcuentas();
      });
     await cargaInfoModificar(obj,2,clavesaatn1,spanN2);
}
async function nivel3(obj,clavesaatn1,spanN2){
    let fltrNivel3=obj.filter(datos3 => {return datos3.NivelCuentaContable == 3;});
    fltrNivel3.forEach(async (element,index) => {
    
        await nuevoNivel(3);
     });
     await cargaInfoModificar(obj,3,clavesaatn1,spanN2);
}
async function nivel4(obj,clavesaatn1,spanN2){
    let fltrNivel4=obj.filter(datos3 => {return datos3.NivelCuentaContable == 4;});
    if (fltrNivel4.length >0) {
        let existnivel=document.querySelector("cardNivel4");
        if(existnivel===null){
            nuevoCardNivel();
        }
    
        fltrNivel4.forEach(async (element,index) => {
    
            await nuevoNivel(4);
         });
         await cargaInfoModificar(obj,4,clavesaatn1,spanN2);
    }
}
async function nivel5(obj,clavesaatn1,spanN2){
    let fltrNivel5=obj.filter(datos3 => {return datos3.NivelCuentaContable == 5;});
    if (fltrNivel5.length >0) {
        let existnivel=document.querySelector("cardNivel5");
        if(existnivel===null){
            nuevoCardNivel();
        }
    
        fltrNivel5.forEach(async (element,index) => {
    
            await nuevoNivel(5);
         });
         await cargaInfoModificar(obj,5,clavesaatn1,spanN2);
    }
}
async function nivel6(obj,clavesaatn1,spanN2){
    let fltrNivel6=obj.filter(datos3 => {return datos3.NivelCuentaContable == 6;});
    if (fltrNivel6.length >0) {
        let existnivel=document.querySelector("cardNivel4");
        if(existnivel===null){
            nuevoCardNivel();
        }
    
        fltrNivel6.forEach(async (element,index) => {
    
            await nuevoNivel(6);
         });
         await cargaInfoModificar(obj,6,clavesaatn1,spanN2);
    }
}
async function nivel7(obj,clavesaatn1,spanN2){
    let fltrNivel7=obj.filter(datos3 => {return datos3.NivelCuentaContable == 7;});
    if (fltrNivel7.length >0) {
        let existnivel=document.querySelector("cardNivel7");
        if(existnivel===null){
            nuevoCardNivel();
        }
    
        fltrNivel7.forEach(async (element,index) => {
    
            await nuevoNivel(7);
         });
         await cargaInfoModificar(obj,7,clavesaatn1,spanN2);
    }
}
async function nivel8(obj,clavesaatn1,spanN2){
    let fltrNivel8=obj.filter(datos3 => {return datos3.NivelCuentaContable == 8;});
    if (fltrNivel8.length >0) {
        let existnivel=document.querySelector("cardNivel8");
        if(existnivel===null){
            nuevoCardNivel();
        }
        fltrNivel8.forEach(async (element,index) => {
    
            await nuevoNivel(8);
         });
         await cargaInfoModificar(obj,8,clavesaatn1,spanN2);
    }
}
async function nivel9(obj,clavesaatn1,spanN2){
    let fltrNivel9=obj.filter(datos3 => {return datos3.NivelCuentaContable == 9;});
    if (fltrNivel9.length >0) {
        let existnivel=document.querySelector("cardNivel9");
        if(existnivel===null){
            nuevoCardNivel();
        }
        fltrNivel9.forEach(async (element,index) => {
    
            await nuevoNivel(9);
         });
         await cargaInfoModificar(obj,9,clavesaatn1,spanN2);
    }
}
async function nivel10(obj,clavesaatn1,spanN2){
    let fltrNivel10=obj.filter(datos3 => {return datos3.NivelCuentaContable == 10;});
    if (fltrNivel10.length >0) {
        let existnivel=document.querySelector("cardNivel10");
        if(existnivel===null){
            nuevoCardNivel();
        }
        fltrNivel10.forEach(async (element,index) => {
    
            await nuevoNivel(10);
         });
         await cargaInfoModificar(obj,10,clavesaatn1,spanN2);
    }
}

function cargaInfoModificar(obj,numNivel,clavesaatn1,spanN2){

    if (numNivel===2) {
        let fltrNivel2=obj.filter(datos2 => {return datos2.NivelCuentaContable == numNivel;});
        fltrNivel2.forEach(async (element,indexFiltro) => {
            let campoArreglofiltr=campos.filter(campoDat => {
                return campoDat.NivelCC== numNivel;
            });
            if (campoArreglofiltr.length > 0) {
                campoArreglofiltr.forEach((elementcampo,indexCampo) => {
                    if (indexFiltro === indexCampo) {
                        
                    
                        let clave=elementcampo.Clave;
                        let description=elementcampo.Descripcion;
                        let antec=elementcampo.Antecedentes;
                        let subcuenta=elementcampo.SubClave;
                        let span=elementcampo.SpanClave;
                        let CuentaTributaria=elementcampo.CuentaSAT;
                        $('#' + span).text(spanN2);
                        let clave1=element.Clave_CuentaContable.replace(spanN2,'');
                        $('#' + clave).val(clave1);
                        $('#' + description).val(element.Descripcion_CuentaContable);
                        $('#' + antec).val(element.ClaveAntecedente);
                        generaEventoCombo( "idcuentasat","96847492679576B465C1FAA131E57EFDCB2E6E59502D041A0479A369E7091B04", "Id_CuentaTributaria=",element.Id_CuentaTributaria);
                        armaCombo(clavesaatn1, CuentaTributaria, "Id_CuentaTributaria=","96847492679576B465C1FAA131E57EFDCB2E6E59502D041A0479A369E7091B04");
                        //---combos
                     
                        setTimeout(async ()=>{
                        
                            $('#' + CuentaTributaria).jqxDropDownList('selectItem', element.Id_CuentaTributaria );
                            // ocultarCargador();
                        },4300);
                        //---Llena uniquedArray
                        objetoHTML=null;
                        objetoHTML=document.getElementById('' + description+ '');
                
                        let cuentaContableId;
                        let padreId;
                        campos.forEach((prueba)=>{ 
                            var descvalue=$('#' + prueba.Descripcion ).val();
                            if(element.NivelCuentaContable === prueba.NivelCC && element.Descripcion_CuentaContable == descvalue ){
                                prueba.IdCuentaContable=element.Id_CuentaContable;
                                prueba.padre=element.Id_CuentaContablePadre;
                                prueba.value=element.Id_CuentaContable;
                                prueba.estado=1;
                                cuentaContableId=element.Id_CuentaContable;
                                padreId=element.Id_CuentaContablePadre;
                            
                            }
                        });
                    
                        getcmbsConfig(3,objetoHTML,clave,false,cuentaContableId,padreId,'',''); 
                    }
                });

            }
        });
    }
    else{
        let fltrNivel=obj.filter(datos2 => {return datos2.NivelCuentaContable == numNivel;});
        fltrNivel.forEach(async (element,indexFiltro) => {
            let campofltr=campos.filter(campoDat => {
                return campoDat.NivelCC== numNivel;
            });
            if (campofltr.length > 0) {
                campofltr.forEach((elementcampo,indexCampo) => {
                    if (indexFiltro === indexCampo) {
                        let clave=elementcampo.Clave;
                            let description=elementcampo.Descripcion;
                            let antec=elementcampo.Antecedentes;
                            let subcuenta=elementcampo.SubClave;
                            let span=elementcampo.SpanClave;
        
                            $('#' + clave).val(element.Clave_CuentaContable);
                            $('#' + description).val(element.Descripcion_CuentaContable);
                            $('#' + antec).val(element.ClaveAntecedente);
                        
                            //---Llena uniquedArray
                            objetoHTML=null;
                            objetoHTML=document.getElementById('' + description+ '');
                        
                            let cuentaContableId;
                            let padreId;
                            campos.forEach((prueba)=>{ 
                                var descvalue=$('#' + prueba.Descripcion ).val();
                                if(element.NivelCuentaContable === prueba.NivelCC && element.Descripcion_CuentaContable == descvalue ){
                                    prueba.IdCuentaContable=element.Id_CuentaContable;
                                    prueba.padre=element.Id_CuentaContablePadre;
                                    prueba.value=element.Id_CuentaContable;
                                    prueba.estado=1;
                                    cuentaContableId=element.Id_CuentaContable;
                                    padreId=element.Id_CuentaContablePadre;
                                
                                }
                            });
                            let hijo=numNivel + 1;
                            getcmbsConfig(hijo,objetoHTML,clave,false,cuentaContableId,padreId,span,subcuenta); 
                            
                    }
                });
            }
        });
    }
        
}

function editaObjArrayCampo(element){
    
    let cuentaContableId;
    let padreId;
    campos.forEach((prueba)=>{ 
        var descvalue=$('#' + prueba.Descripcion ).val();
        if(element.NivelCuentaContable === prueba.NivelCC && element.Descripcion_CuentaContable == descvalue ){
            prueba.IdCuentaContable=element.Id_CuentaContable;
            prueba.padre=element.Id_CuentaContablePadre;
            prueba.value=element.Id_CuentaContable;
            prueba.estado=1;
            cuentaContableId=element.Id_CuentaContable;
            padreId=element.Id_CuentaContablePadre;
        
        }
    });
    return "" + cuentaContableId + "," + padreId;
}

//editar clave-de padre  a padre
function ObtenerUniqueArray() {
    var NivelMaximo = 0;
    for (x = 0; x < Configuracion.length; x++) {
        NivelMaximo = (NivelMaximo > Configuracion[x].NivelCuentaContable) ? NivelMaximo : Configuracion[x].NivelCuentaContable;

    };
    /*console.log("Nivel m�ximo" + NivelMaximo.toString());*/
    var i = 0;
    i = Configuracion.findIndex((elemento) => elemento.NivelCuentaContable === 1);
    var combo = new Object();
    combo.claveValor = Configuracion[i].Clave_CuentaContable;
    combo.nivel = 2;
    //combo.campoClave ="";
    combo.spanvalor = "";
    combo.text = Configuracion[i].Clave_CuentaContable + "-" + Configuracion[i].Descripcion_CuentaContable;
    combo.value = 1;
    combo.padre = 0;
    //combo.campoDes ="";
    uniqueArray2 = new Array();
    uniqueArray2.push(combo);
    ObtenerHijos(Configuracion[i].Clave_CuentaContable, 2, 1, Configuracion[i].Id_CuentaContable, NivelMaximo);

}

function ObtenerHijos(ClaveNivAnterior, Nivel, Value, Padre, NivelMayor) {
    if (NivelMayor >= Nivel) {
        var Hijo = Configuracion.filter((elemento) => elemento.Id_CuentaContablePadre === Padre && elemento.NivelCuentaContable === Nivel);

        if (Hijo.length > 0) {

            for (var i = 0; i < Hijo.length; i++) {
                var combo = new Object();
                combo.claveValor = Hijo[i].Clave_CuentaContable.substring(ClaveNivAnterior.length, Hijo[i].Clave_CuentaContable.length);
                combo.nivel = Nivel + 1;
                //combo.campoClave ="";
                combo.spanvalor = ClaveNivAnterior;
                combo.text = Hijo[i].Clave_CuentaContable + "-" + Hijo[i].Descripcion_CuentaContable;
                combo.value = Nivel.toString() + i.toString();
                combo.padre = parseInt(Value);
                //combo.campoDes ="";
                uniqueArray2.push(combo);
                ObtenerHijos(Hijo[i].Clave_CuentaContable, Nivel + 1, Nivel.toString() + i.toString(), Hijo[i].Id_CuentaContable, NivelMayor);
            }

        }
        else return;
    } else return;



}

async function getcmbsConfig(nivelhijo,e,campClav,bandera,cuentaContableId,padreId,spanetq,subcuenetq){
   
    let Nuevoarre=[];
    let ClavCAmpo="";
        ClavCAmpo=campClav;
            
     campos.forEach((campo,index) =>{

      
           let SV;
           let cV;
           let descripcion;
           let valor;
           let numPadre;
           let claveanterior;
            if(e.id ==campo.Descripcion){
                if((campo.NivelCC) === nivelhijo-1) {
                  
                        numPadre= nivelhijo - 1;
                    
                     if(campo.SpanClave !== null){
                        valor= $('#'+campo.SpanClave+'').html() + $('#' + campo.Clave + '').val().toUpperCase();
                        SV=$('#'+campo.SpanClave+'').html().toUpperCase();
                        cV=$('#' + campo.Clave + '').val().toUpperCase();
                       
                    }
                    else{
                        valor=  $('#' + campo.Clave + '').val().toUpperCase() + "";
                        SV="";
                        cV=$('#' + campo.Clave + '').val().toUpperCase();
                    }

                    descripcion=  "" + valor + "-" + e.value;

              
                    if( $('#' + campo.Descripcion + '').val() !="" &&  $('#' + campo.Descripcion + '').val() !=null ){

                        const  existe=nuevoUniqueArray.some(clavedes =>{ return clavedes.campoDes === campo.Descripcion });
                        if (existe) {
                            nuevoUniqueArray.forEach((desElement) =>{
                                if ( desElement.campoDes ===campo.Descripcion) {
                                    desElement.claveValor =cV,
                                    desElement.nivel=nivelhijo,
                                    desElement.campoClave=ClavCAmpo,
                                    desElement.spanvalor=SV,
                                    desElement.text=descripcion.toString().toUpperCase(),
                                    desElement.value=campo.value,
                                    desElement.padre=nivelhijo - 1,
                                    desElement.campoDes=campo.Descripcion
                                }
                            });
                        }
                        else{
                            nuevoUniqueArray.push({ claveValor:cV.toUpperCase(),
                                nivel: nivelhijo,
                                campoClave:ClavCAmpo,
                                spanvalor: claveanterior,
                                text:descripcion.toString().toUpperCase(),
                                value: cuentaContableId,
                                padre: padreId == null ? 0 : padreId,
                                campoDes:campo.Descripcion},
                                );
                            }
                         }
                }

            }
         });

      uniqueArray = removeDuplicates(nuevoUniqueArray, "value");

      armaCsNlsConfig(uniqueArray,nivelhijo);
     
   
    
    //asignar la clave anterior 
    setTimeout(async ()=>{
        campos.forEach((campo,index) =>{
            let claveanterior;
            uniqueArray.forEach(uniArrayEmt => {
                if (  (campo.NivelCC) !== 1) {
                    if(padreId === uniArrayEmt.value){
                        claveanterior=uniArrayEmt.claveValor.toUpperCase();
                    }
                }
            
            });
            if(spanetq !=''){
                $('#' + spanetq + '').text('');
            
                setTimeout(()=>{ $('#' + spanetq + '').text(claveanterior); 
                
                },500);
            
            }
        });
          //asigna el valor al combo
    if(subcuenetq !=''){
     
        setTimeout(()=>{
           
            $('#' + subcuenetq + '').jqxDropDownList('selectItem', padreId ); 
            if( $('#' + subcuenetq + '').val() !==""){
              
             
                reemplazoSpan=  $('#' + subcuenetq + '').jqxDropDownList('getSelectedItem').label.split('-')[0]; 
                let clave=$('#'+ campClav).val().replace(reemplazoSpan,'');
                $('#'+ campClav).val(clave);
                let nivelactual=nivelhijo-1;
               
            }
           
         },3500);
    }
     },1000);
}
async  function armaCsNlsConfig(infoCombo,nivelPadre){

    let filtrado=infoCombo.filter(function(arreg) {

        return arreg.nivel === nivelPadre;

    });

    campos.forEach((c,index) =>{
        if( c.SubClave !=null && c.NivelCC == nivelPadre){
        //if( c.SubClave !=null ){
            var dataSource={datatype:"json",datafields:[{ name: 'text', type: 'string' }, { name: 'value', type: 'string' }],localdata:filtrado};
            var dataAdapter=new $.jqx.dataAdapter(dataSource);
            setTimeout(async() =>{
            $('#' + c.SubClave  +   '').jqxDropDownList({source: dataAdapter,displayMember: 'text', valueMember: 'value' ,searchMode:'containsignorecase'});

        },2000);

        }
    });
}
function EliminaRepetidosClave(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

//#endregion



//-- Final Obtener confuguración armado de  los campos
function regresarInicio(){
    window.location.reload(1)
}
  
