$(document).ready(function () {
	$.jqx.theme = "arctic";
	ConsultasModificacionesPendientes();
});

function ConsultasAltasPendientes() {

	$("#gdEmpleados").jqxGrid({
		autoshowfiltericon: true,
		columns: [
			{ text: 'Captura', datafield: 'Id_CapturaMovimientosIP', hidden: true },
			{ text: 'RFC', datafield: 'RFC', type: 'string', width: 200 },
			{ text: 'Apellido paterno', datafield: 'ApellidoPaterno', type: 'string', width: 250 },
			{ text: 'Apellido materno', datafield: 'ApellidoMaterno', type: 'string', width: 250 },
			{ text: 'Nombre', datafield: 'Nombre', type: 'string', width: 250 },
			{ text: 'CURP', datafield: 'CURP', type: 'string', width: 200 },
			{ text: 'NSS', datafield: 'NSS', type: 'string', width: 150 },
			{ text: 'Usuario Captura', datafield: 'UsuarioCaptura', type: 'string', width: 150 },
			{ text: 'Descripción', datafield: 'Descripcion_MovimientoIP', type: 'string', width: 250 }
		],
		selectionmode: 'checkbox',
		showstatusbar: true,
		statusbarheight: 55,
		renderstatusbar: function (statusbar) {
			{
				statusbar.append($("<div id = 'divControlesPendientes'>"
					+ "<button type='button' class='hwdbo-boton' onclick='Autorizar();' style='cursor: pointer; margin-top: 3px; margin-left: 5px; height:28px; max-height:28px;'><span style='position: relative;'><i class='fa fa-check fa-lg' style='padding-right:5px;'></i>Autorizar</span></button>"
					+ "<button type='button' class='hwdbo-boton' onclick='Rechazar();' style='cursor: pointer; margin-top: 3px; margin-left: 5px; height:28px; max-height:28px;'><span style='position: relative;'><i class='fa fa-close fa-lg' style='padding-right:5px;'></i>Rechazar</span></button>"				
					+ "</div>"));
					$(".hwdbo-boton").jqxButton({ width: '150', height: '30' });
			};
		},
		width: '99.5%',
		height: '99.8%',
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
		showaggregates: false,

	});


	let _data = {
		"Id_CapturaMovimientosIP": 123,
		"RFC": "WAKAWAKA12345",
		"ApellidoPaterno": "WAKA",
		"ApellidoMaterno": "WAKA",
		"Nombre": "Eduviges",
		"CURP": "WAKAWAKA12345",
		"NSS": 12235250,
		"UsuarioCaptura": "correo@correo.com",
		"Descripcion_MovimientoIP": "Modificación de datos de empleado."
	}

	//let data = JSON.parse(llamadoAjaxDirecto("getDataGrid", ObjData));
	//if (!data.Error) {
		let source = {
			datatype: 'json',
			localdata: _data
		};

		let dataAdapter = new $.jqx.dataAdapter(source);

		_o.gridConsultaPendientes.jqxGrid({ source: dataAdapter });
		_o.gridConsultaPendientes.jqxGrid('updatebounddata');
		//_o.gridConsultaPendientes.jqxGrid('clearselection');

		//_o.gridConsulta
		//	.jqxGrid({
		//		source: dataAdapter
		//	});
		//_o.gridConsulta
		//	.jqxGrid('updatebounddata');
		//_o.gridConsulta
		//	.jqxGrid('refresh');
	//} else {
	//	console.error(data.Mensaje);
	//	ShowJQMsg('dialogWindow', 'Ocurrió un error al cargar la información.', 'Error', 0);
	//}

	//_o.gridConsulta.on("celldoubleclick", function (event) {
	//	_toCrud(1);
	//});
}