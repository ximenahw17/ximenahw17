let ExcelRows=new Array();
let TipoMov='';

$(document).ready(function () {
    mostrarCargador();
    
    $.jqx.theme = "light";

    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 

    fillCombo(129, 'tipomov', '');

    CargaDatosPendientes();

    $("#formFileSm").on('change',function(){
        let arch = $(this).prop('files')[0];
        var reader = new FileReader();
        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
            reader.onload = function (e) {
                GetTableFromExcel(e.target.result);
            };
            reader.readAsBinaryString(arch);
        } else {
            //For IE Browser.
            reader.onload = function (e) {
                var data = "";
                var bytes = new Uint8Array(e.target.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                    data += String.fromCharCode(bytes[i]);
                }
                GetTableFromExcel(data);
            };
            reader.readAsArrayBuffer(arch);
        }

    });

    $("#btnradio1").on('click',function(event){
        $("#formFileSm").prop('accept','.json');
        TipoMov=1;
    });

    $("#btnradio2").on('click',function(event){
        $("#formFileSm").prop('accept','.xlsx,.xls');
        TipoMov=2;
    });

});

function CargaDatosPendientes() {
    $.when(ajaxCatalogo(128,"")).done(function (response) {
        if(response != "No existe el Proceso. ")
        {
            if(response=="")
            {
                $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
                $("#BtnEjecutarCarga").attr('disabled','disabled');
                $("#BtnLimpiaPantalla").attr('disabled','disabled');
                $("#BtnExcel").attr('disabled','disabled');
                $("#BtnEliminarRegistro").attr('disabled','disabled');

                $("#gdPlantilla").jqxGrid({
                    autoshowfiltericon: true,
                    columns: [],
                    source: [],
                    selectionmode: 'singlerow',
                    showstatusbar: false,
                    width: '100%',
                    height:$("#divContenedorInterno").height() - 150,
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
                        $("#gdPlantilla").jqxGrid('autoresizecolumns');
                    }           
                });
            }
            else
            {
                $("#BtnEjecutarCarga").removeAttr('disabled');
                $("#BtnLimpiaPantalla").removeAttr('disabled');
                $("#BtnExcel").removeAttr('disabled');
                $("#BtnEliminarRegistro").removeAttr('disabled');
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

function armaGrid(_data) {

    let _columns = [];
    let _jsonData = [];

    if(_data=="No hay movimientos para mostrar. ")
    {
        showMsg('Error',_data);
    }
    else
    {
        let titulosGrid = Object.keys(_data[0]);    
        $.each(titulosGrid, function (index, element) {
            _columns.push({
                text: element,
                datafield: textotodatafield(element),
                type: 'string',
                width: '8.5%',
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

    let source = {
        datatype: 'json',
        localdata: _jsonData
    };

    let dataAdapter = new $.jqx.dataAdapter(source);

    $("#DivGrid").html('<div id=\"gdPlantilla\"></div>');
    $("#gdPlantilla").jqxGrid({
        columns: _columns,
        source: dataAdapter,
        selectionmode: 'checkbox',
        width: '100%',
        height: $("#divContenedorInterno").height() - 150,
        columnsresize: true,
        columnsautoresize: true,
        scrollmode: 'logical',
        localization: getLocalization(),
        showfilterrow: true,
        autoshowfiltericon: true,
        filterable: true,
        pageable: true,
        pagesizeoptions: ['50', '100', '150', '200', '250', '300'],
        pagesize: 50,
        sortable: true,
        ready:function(){
            $("#gdPlantilla").jqxGrid('updatebounddata');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_Movimiento');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_CargaMasiva');
            $("#gdPlantilla").jqxGrid('hidecolumn','Id_TipoIndicadorCargasMasivas');
            $("#gdPlantilla").jqxGrid('autoresizecolumn','TipoCarga');
            $("#gdPlantilla").jqxGrid('autoresizecolumn','TipoConcepto');
        },
    });

    ocultarCargador();

}

function getIds(IdGrid, col = '') {
    var rowIndex = $("#" + IdGrid + "").jqxGrid('getselectedrowindexes');
    var Ids = [];

    //Dejar al último cambio de puesto
    $.each(rowIndex, function (index, data) {
        let datarow = $("#" + IdGrid + "").jqxGrid('getrowdata', data);
        if(datarow.Id_TipoMovimientoIP!=7)
        {
            let newarray=new Object();
            newarray.Id_Movimiento = datarow.Id_Movimiento;
            newarray.Id_TipoMovimientoIncidencias=datarow.Id_TipoMovimientoIncidencias
            Ids.push(newarray);
        }
    });

    $.each(rowIndex, function (index, data) {
        let datarow = $("#" + IdGrid + "").jqxGrid('getrowdata', data);
        if(datarow.Id_TipoMovimientoIP==7)
        {
            let newarray=new Object();
            newarray.Id_Movimiento = datarow.Id_Movimiento;
            newarray.Id_TipoMovimientoIncidencias=datarow.Id_TipoMovimientoIncidencias
            Ids.push(newarray);
        }
    });

    return Ids;
}

function DescargaExcel() {
	mostrarCargador();
	setTimeout(() => {
		const rows = $("#gdPlantilla").jqxGrid('getRows');
		if (rows!=undefined && rows.length > 0) {
			WriteExcel(rows, 'CargaMasiva');
		}
		ocultarCargador();
	}, 1000);
}

function CargaMasiva()
{
    $("#tipomov").jqxDropDownList('selectIndex', 2 );
    $("#tipomov").jqxDropDownList({ disabled: true });
    $("#offcanvasCargaMasiva").offcanvas('show');
}

function DescargaPlantilla()
{
    var link = document.createElement("a");
    link.download = "PlantillaCargaMasiva.xlsx";
    link.href = "../assets/plantillas/PlantillaCargaMasiva.xlsx";
    link.click();
}

function GetTableFromExcel(data) {
    if($("#btnradio1").prop('checked')==true)
    {
        let Objson = JSON.parse(data);
        ExcelRows=Objson;
    }
    else
    {
        //Read the Excel File data in binary
        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        //get the name of First Sheet.
        var Sheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);
        console.log(excelRows);

        if(excelRows.length==0)
        {
            showMsg("Mensaje","No existen registros en el archivo");
            ExcelRows=[];
        }
        else
        {
            ExcelRows=excelRows;
        }
    }
}

function DoSubirArchivo()
{
    //revisar porque no lo hace, mientras siempre es 3
    let idtipo=$("#tipomov").jqxDropDownList('getSelectedItem'); 
    let arch = $("#formFileSm").prop('files')[0];
    let _json=new Array();
    if(arch==undefined)
    {
        showMsg("Mensaje","Por favor seleccione un archivo");
    }
    else
    {
        if(idtipo==undefined || idtipo==null)
        {
            showMsg("Mensaje","Por favor seleccione un identificador");
        }
        else
        {
            mostrarUpCargador();
            if(TipoMov==1)
            {
                var obj = new Object();
                obj.API="F2B11ED85FF1CB773B6D9D07EC759D7D8D6445C1D64CE4834FDBB41F6CAD6DB1";
                obj.Parameters="";
                obj.JsonString=JSON.stringify(ExcelRows);
                obj.Hash= getHSH();
                obj.Bearer= getToken();

                $.when(ajaxTokenFijo(obj)).done(function (response) {
                    console.log(response);
                    if(response.length>0)
                    {
                        let Correctos=0;
                        let Incorrectos=0;
                        $.each(response,function(i,row){
                            if(row.Mensaje=="Successfull")
                            {
                                Correctos=Correctos+1;
                            }
                            else
                            {
                                Incorrectos=Incorrectos+1;
                            }
                        });

              
                        $.confirm({
                            title: "Resultados",
                            content: "<p>Se cargaron " + Correctos + " registros correctamente</p><p>"+Incorrectos+" registros incorrectos</p>",
                            icon: 'fa fa-list',
                            type:'blue',
                            width: '100%',
                            typeAnimated:true,
                            columnClass: 'medium',
                            useBootstrap: false,
                            buttons: {
                                aceptar: function () {
                                    window.location.reload(1);
                                }
                            }
                        });
                    }
                    else
                    {
                        showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
                    }
        
                    setTimeout(ocultarUpCargador,1000);
                }).fail(function(){
                    ocultarUpCargador();
                    showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
                });
            }
            else
            {
                $.each(ExcelRows,function(i,row){
                    var obj = new Object();
                    obj.identificador= row.Identificador.toString();
                    obj.tipocarga= row.TipoCarga;
                    obj.tipoincidencia= row.TipoIncidencia.toString();
                    obj.tipoconcepto= row.TipoConcepto;
                    obj.concepto= row.Concepto;
                    obj.fechakardex= formatFecha(ExcelDateToJSDate(row.FechaKardex));
                    obj.cantidad= row.Cantidad.toString();
                    obj.periodocalculo= row.PeriodoCalculo.toString();
                    obj.horasextras= row.HorasExtra.toString();
                    obj.afectacion= row.Afectacion.toString();
                    obj.numeropagos= row.NumeroPagos.toString();
                    obj.frecuencia= row.Frecuencia.toString();
                    obj.idtipoindicadorcargasmasivas="3";

                    _json.push(obj);
                });

                console.log(_json);
                var obj = new Object();
                obj.API="8A1BE0525CB2D1D58372DAE81A57508B31DB7B880EE163D9752E766E12C7621A";
                obj.Parameters="";
                obj.JsonString=JSON.stringify(_json);
                obj.Hash= getHSH();
                obj.Bearer= getToken();

                $.when(ajaxTokenFijo(obj)).done(function (response) {
                    console.log(response);
                    if(response.length>0)
                    {
                        let Corr=0;
                        let NoCorr=0;
                        let tablaNo="<table class=\"table table-sm table-bordered table-striped\"><thead><th>Movimiento</th><th>Mensaje</th></thead><tbody>";
                        let IdsMovNo="";
                        $.each(response,function(i,row){
                            if(row.Result==1)
                            {
                                Corr=Corr+1;
                            }
                            else
                            {
                                IdsMovNo+="<tr><td style=\"width:44%\">" + row.identificador + "</td><td>" + row.MsgError + "</td></tr>";
                                NoCorr=NoCorr+1;
                            }
                        });

                        tablaNo+=IdsMovNo;
                        tablaNo+="</tbody></table>";
                
                        $.confirm({
                            title: "Resultados",
                            content: "<h4>Correctos: "+Corr+"</h4>" + "<br /><h4>Incorrectos: "+NoCorr+"</h4>" + tablaNo,
                            icon: 'fa fa-list',
                            type:'blue',
                            width: '100%',
                            typeAnimated:true,
                            columnClass: 'medium',
                            useBootstrap: false,
                            buttons: {
                                aceptar: function () {
                                    window.location.reload(1);
                                }
                            }
                        });
                    }
                    else
                    {
                        showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
                    }
        
                    setTimeout(ocultarUpCargador,1000);
                }).fail(function(){
                    ocultarUpCargador();
                    showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
                });
            }

        }
    }
}

function ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

function EliminarRegistro()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        $.confirm({
            title: "Mensaje",
            content: "¿Está seguro de eliminar los registros?",
            icon: 'fa fa-info-circle',
            type:'blue',
            width: '100%',
            typeAnimated:true,
            columnClass: 'medium',
            useBootstrap: false,
            buttons: {
                aceptar: function () {
                    _eliminar(rows,1);
                },
                cancelar: function(){
    
                }
            }
        });
    }
}

function LimpiarPantalla()
{
    $.confirm({
        title: "Mensaje",
        content: "Se limpiarán todos los registros mostrados, ¿Desea continuar?",
        icon: 'fa fa-info-circle',
        type:'blue',
        typeAnimated:true,
        columnClass: 'medium',
        useBootstrap: false,
        buttons: {
            aceptar: function () {
                var rows = $('#gdPlantilla').jqxGrid('getrows');
                _eliminar(rows,2);
            },
            cancelar: function(){

            }
        }
    });
}

function _eliminar(rows,tipo)
{
    mostrarUpCargador();
    let movs=new Array();
    console.log(rows);
    if(tipo==1)
    {
        $.each(rows,function(i,row){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
            let obj=new Object();
            obj.idmovimiento=data.Id_Movimiento.toString();
            movs.push(obj);
        });
    }
    else
    {
        $.each(rows,function(i,row){
            let obj=new Object();
            obj.idmovimiento=row.Id_Movimiento.toString();
            movs.push(obj);
        });
    }

    var obj = new Object();
    obj.API="64D55BE98D8C7E83795070CA20A648EBB4FDA0A61C14CAA08EC7B66BCA1A69DD";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(movs);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (response) {
        if(response.length>0)
        {
            let Corr=0;
            let NoCorr=0;
            $.each(response,function(i,reg){
                if(reg.Result==1)
                {
                    Corr=Corr+1;
                }
                else
                {
                    NoCorr=NoCorr+1;
                }
            });
            $.confirm({
                title: "Eliminar registros",
                content: Corr+" registros eliminados correctamente",
                icon: 'fa fa-check nuevoingresoico',
                type:'green',
                typeAnimated:true,
                columnClass: 'medium',
                useBootstrap: false,
                buttons: {
                    aceptar: function () {
                        window.location.reload(1);
                    }
                }
            });
        }
        else
        {
            showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
        }

        setTimeout(ocultarUpCargador,1000);
    }).fail(function(){
        ocultarUpCargador();
        showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
    });

}

function EjecutarCarga()
{
    var rows = $('#gdPlantilla').jqxGrid('getselectedrowindexes');
    if(rows.length===0)
    {
        showMsg("Mensaje","Por favor seleccione uno o varios registros");
    }
    else
    {
        mostrarUpCargador();
        let movs=new Array();
        $.each(rows,function(i,row){
            var data = $('#gdPlantilla').jqxGrid('getrowdata', rows[i]);
            let obj=new Object();
            obj.usuarioauth="usuario@harwebdbo.mx";
            obj.idmovimiento=data.Id_Movimiento.toString();
            movs.push(obj);
        });

        var obj = new Object();
        obj.API="DF50505C1846C045DC2B20C654AA26C2DD3FCFB3020BB1B245F8799C1E190DF0";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(movs);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (response) {
            if(response.length>0)
            {
                let msj="";
                $.each(response,function(i,row){
                    if(row.Result==2)
                    {
                        msj+="<tr><td>"+row.MsgError+"</tr></td>";
                    }
                })

                if(msj=="")
                {
                    $.confirm({
                        title: "Carga registros",
                        content: response.length + " registros cargados correctamente",
                        icon: 'fa fa-check nuevoingresoico',
                        type:'green',
                        typeAnimated:true,
                        columnClass: 'medium',
                        useBootstrap: false,
                        buttons: {
                            aceptar: function () {
                                window.location.reload(1);
                            }
                        }
                    });
                }
                else
                {
                    var tabla="<table class=\"table table-sm table-striped\" style=\"width:100%;font-size:small\"><th><tr>Errores:</tr></th>" + msj + "</table>"
                    showMsgSinTimer("Mensaje",tabla);
                }
            }
            else
            {
                showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
            }
    
            setTimeout(ocultarUpCargador,1000);
        }).fail(function(){
            ocultarUpCargador();
            showMsg('Mensaje','Ocurrio un error al obtener la respuesta');
        });

    }
}