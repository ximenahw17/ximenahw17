$(document).ready(function () {
    mostrarCargador();
    $.jqx.theme = "light";
    page.initpage();
});

let page = {
    controles: {
        gridConsulta: $('#gridConsulta'),
        gridCuentaContable: $('#gridCuentaContable'),
        gridCuentaPoliza: $('#gridCuentaPoliza'),
    },
    initpage: () => {
        try {
            $("#jqxtabs").jqxTabs({ width: '100%', height: '100%', position: 'top' });
            if ($(".hwdbo-boton").length > 0)
                $(".hwdbo-boton").jqxButton({ width: '150', height: '30' });
            if ($(".hwdbo-texto").length > 0)
                $(".hwdbo-texto").jqxInput({ width: '99%', height: '30px' });
            if ($(".hwdbo-combo").length > 0) {
                $(".hwdbo-combo").jqxDropDownList({ theme: 'fresh', width: '100%', height: '30px', placeHolder: "-- Selecione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' });
                $(".combo-check").jqxDropDownList({ checkboxes: true });
            }
            if ($(".hwdbo-calendario").length > 0) {
                $(".hwdbo-calendario").jqxDateTimeInput({ closeCalendarAfterSelection: true, formatString: "dd/MM/yyyy", animationType: 'fade', culture: 'es-MX', showFooter: true, width: '98%', height: '30px', todayString: '', clearString: '' });
            }
            if ($(".hwdbo-checkBox").length > 0)
                $(".hwdbo-checkBox").jqxCheckBox({ width: '85%', height: 25 });
        } catch {
            //console.log(error);
            showMsgReload('Ops!!!', 'Ocurio un error al iniciar.');
        } finally {
            ajax("0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1", "?_Id=105&_Domain={d}", "").then((response) => {
                //console.log(response)
                page.grids.consulta(response);
            });
            ajax("0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1", "?_Id=106&_Domain={d}", "").then((response) => {
                page.grids.cuentacontable(response);
            });
            page.grids.cuentapoliza();
            page.dropdown();
            tabselect(0);
            $('#conpol_razonactiva').parent().parent().find('.col-3').addClass('disable-div');
            $('#conpol_divactiva').parent().parent().find('.col-3').addClass('disable-div');
            $('#conpol_esquemaactiva').parent().parent().find('.col-3').addClass('disable-div');
            $('#conpol_cencostactiva').parent().parent().find('.col-3').addClass('disable-div');
            ocultarCargador();
        }
    },
    grids: {
        consulta: (data) => {
            page.controles.gridConsulta.jqxGrid({
                autoshowfiltericon: true,
                source: GetAdapter(data),
                selectionmode: 'singlerow',
                showstatusbar: false,
                width: '99.8%',
                height: $(window).height() - 98,
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
                showstatusbar: true,
                statusbarheight: 44,
                renderstatusbar: function (statusbar) {
                    statusbar.append([
                        '<button class="hwdbo-boton" onclick="customclick(1)" style="margin-right: 10px !important;width:210px ;"><i class="fa fa-file"></i> Agregar configuración </button>',
                        '<button class="hwdbo-boton" onclick="customclick(2)" style="margin-right: 10px !important;width:100px ;"><i class="fa fa-pencil"></i> Modificar</button>',
                        '<button class="hwdbo-boton" onclick="customclick(3)" style="margin-right: 10px !important;width:100px ;"><i class="fa fa-download"></i> Excel </button>'
                    ]);
                    statusbar.css('padding', '7px');
                    $(".hwdbo-boton").jqxButton({ height: '30' });
                },
                columns: [
                    { text: 'Clave', datafield: 'Clave' },
                    { text: 'Descripción', datafield: 'Descripción' },
                    { text: 'Tipo de Póliza', datafield: 'Tipo de Póliza' },
                    // { text: 'Id_Aplicacion', datafield: 'Id_Aplicacion', hidden: true },
                    { text: 'Id_Poliza', datafield: 'Id_Poliza', hidden: true },
                ]
            });
        },
        cuentacontable: (data) => {
            page.controles.gridCuentaContable.jqxGrid({
                autoshowfiltericon: true,
                source: GetAdapter(data),
                selectionmode: 'checkbox',
                width: '99.8%',
                height: '200px',
                columnsresize: true,
                columnsautoresize: true,
                scrollmode: 'logical',
                localization: getLocalization(),
                showfilterrow: true,
                filterable: true,
                columns: [
                    { text: 'Id_CuentaContable', datafield: 'Id_CuentaContable', hidden: true },
                    { text: 'Clave Cuenta', datafield: 'Clave Cuenta' },
                    { text: 'Descripción Cuenta', datafield: 'Descripcion Cuenta' },
                ]
            });
        },
        cuentapoliza: (data) => {
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {

                return '<button style="width:50%" onclick="buttonUp(' + row + ');"><i class="fa fa-arrow-up"></i></button><button style="width:50%" onclick="buttonDown(' + row + ');"><i class="fa fa-arrow-down"></i></button>';
            };
            page.controles.gridCuentaPoliza.jqxGrid({
                autoshowfiltericon: true,
                source: GetAdapter(data),
                selectionmode: 'checkbox',
                width: '99.8%',
                height: '200px',
                columnsresize: true,
                columnsautoresize: true,
                scrollmode: 'logical',
                localization: getLocalization(),
                showfilterrow: true,
                editable: true,
                filterable: true,
                columns: [
                    { text: 'Id_CuentaContable', datafield: 'Id_CuentaContable', hidden: true },
                    { text: 'Clave Cuenta', datafield: 'Clave Cuenta' },
                    { text: 'Descripción Cuenta', datafield: 'Descripcion Cuenta' },
                    { text: 'Mov contable', datafield: 'cargoabono' },
                    { text: 'Signo operacion', datafield: 'operador' },
                    { text: 'Orden', datafield: 'orden', cellsrenderer: cellsrenderer, editable: false },
                ]
            });
        }
    },
    dropdown: () => {

        // binddropdownList('ifoPol_tipopoliza',[])




        // ifoPol_tipopoliza
        ajax("0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1", "?_Id=108&_Domain={d}", "").then((response) => {
            binddropdownList("ifoPol_tipopoliza", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });
        // ifoPol_grupocalculo
        ajax("0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1", "?_Id=98&_Domain={d}", "").then((response) => {
            binddropdownList("ifoPol_grupocalculo", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });
        // ifoPol_aplicacion
        ajax("0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1", "?_Id=107&_Domain={d}", "").then((response) => {
            binddropdownList("ifoPol_aplicacion", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });

        // conpol_razonsocial
        ajax("128A42E002FA897F237B6825AD6EBF29714E1A177139F1834DBBA41B9CAED456", "", "null").then((response) => {
            binddropdownList("conpol_razonsocial", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });
        // conpol_razonlocalidad
        ajax("C54512879E5A1135EAD80C66E0CD9713F5EE797989E8F704B44958155F83A1CF", "", "null").then((response) => {
            binddropdownList("conpol_razonlocalidad", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });
        // conpol_razonregistropatronal
        ajax("F70F917E5E5C6BF9566A9887F71D0CBE4F92A2D1D1DB5CD2B2DFA6F1BD64952C", "", "null").then((response) => {
            binddropdownList("conpol_razonregistropatronal", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });

        // conpol_divdivision
        ajax("0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1", "?_Id=8&_Domain={d}", "").then((response) => {
            binddropdownList("conpol_divdivision", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });
        // conpol_divsubdivision
        ajax("0F3BE4C5562D406DAD3B48E79D50E24C2881ACF2731B208077F33CD6CF9BA3CD", "", "null").then((response) => {
            binddropdownList("conpol_divsubdivision", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });
        // conpol_divpusto
        ajax("3E2E864F00CCA353AA802E8151BDE3A58DA0739DEE22D9D5ED1D31762BD8F381", "", "null").then((response) => {
            binddropdownList("conpol_divpusto", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });

        // conpol_esquemaesquemapago
        ajax("0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1", "?_Id=83&_Domain={d}", "").then((response) => {
            binddropdownList("conpol_esquemaesquemapago", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });
        // conpol_cencoscentrocosto
        ajax("0BA2D611581B6A5C715538317DD64BBFC7D87919EE0288A8F466353EF2E557D1", "?_Id=97&_Domain={d}", "").then((response) => {
            binddropdownList("conpol_cencoscentrocosto", response.map(f => { return { value: f.Valor, label: f.Descripcion } }));
        });
    },
    const: {
        mod: false
    }
}

const tabselect = (index) => {
    $("#jqxtabs").jqxTabs({ disabled: true });
    $("#jqxtabs").jqxTabs('enableAt', index);
    $("#jqxtabs").jqxTabs('select', index);
}

const customclick = (opc) => {
    switch (opc) {
        case 2:
            const rowdata = ValidaSeleccion(page.controles.gridConsulta);
            if (rowdata) {
                tabselect(1);
                modify(rowdata);
            }

            break;
        case 3:
            downloadexcel();
            break;
        default:
            tabselect(1);
            break;
    }
}

const modify = async (rowdata) => {
    page.const.mod = true;
    const data = await ajax("9DC76C2438FB75DAD63E300C9C8BD64646943EA0437ED08B286F5314EE88C0C6", `?Id_Poliza=${rowdata.Id_Poliza}&_Domain={d}`, "");

    //console.log(data);

    $('#hdnId_Poliza').val(data.Id_Poliza);
    $('#ifoPol_clave').val(data.Clave);
    $('#ifoPol_descripcion').val(data.Descripcion);
    $('#ifoPol_tipopoliza ').val(data.TipoDePoliza);

    if (data.GrupoDeCalculo)
        data.GrupoDeCalculo.forEach(element => {
            try {
                const uid = $("#ifoPol_grupocalculo").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                $("#ifoPol_grupocalculo").jqxDropDownList('checkIndex', uid);
            } catch {

            }
        });

    if (data.Aplicacion)
        data.Aplicacion.forEach(element => {
            try {
                const uid = $("#ifoPol_aplicacion").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                $("#ifoPol_aplicacion").jqxDropDownList('checkIndex', uid);
            } catch {

            }
        });

    page.grids.cuentapoliza(data.CuentasPoliza.map(f => {
        return {
            Id_CuentaContable: f.Id_CuentaContable,
            'Clave Cuenta': (page.controles.gridCuentaContable.jqxGrid('getrows').filter(c => c.Id_CuentaContable == f.Id_CuentaContable)[0]['Clave Cuenta']),
            'Descripcion Cuenta': (page.controles.gridCuentaContable.jqxGrid('getrows').filter(c => c.Id_CuentaContable == f.Id_CuentaContable)[0]['Descripcion Cuenta']),
            cargoabono: f.MovContable,
            operador: f.SignoOperacion
        };
    }));

    let cuentasContables = page.controles.gridCuentaContable.jqxGrid('getrows');
    data.CuentasPoliza.forEach(a => {
        cuentasContables.forEach((b, c) => {
            if (a.Id_CuentaContable == b.Id_CuentaContable) {
                delete cuentasContables[c];
            }
        });
    });

    page.grids.cuentacontable(cuentasContables.filter(f => f));

    if (data.Detalle)
        data.Detalle.forEach(d => {
            $('[data-label="' + d.Valor + '"]').prop("checked", true)
        });

    if (data.G1) {
        $('#detpol_razonsocial').val(data.G1.PorcentajeDeAplicacion);

        if (data.G1.RazonSocial)
            data.G1.RazonSocial.forEach(element => {
                try {
                    const uid = $("#conpol_razonsocial").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                    $("#conpol_razonsocial").jqxDropDownList('checkIndex', uid);
                } catch {

                }
            });

        if (data.G1.Localidad)
            data.G1.Localidad.forEach(element => {
                try {
                    const uid = $("#conpol_razonlocalidad").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                    $("#conpol_razonlocalidad").jqxDropDownList('checkIndex', uid);
                } catch {

                }
            });

        if (data.G1.RegistroPatronal)
            data.G1.RegistroPatronal.forEach(element => {
                try {
                    const uid = $("#conpol_razonregistropatronal").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                    $("#conpol_razonregistropatronal").jqxDropDownList('checkIndex', uid);
                } catch {

                }
            });
    }

    if (data.G2) {
        $('#conpol_divporcentaje').val(data.G2.PorcentajeDeAplicacion);

        if (data.G2.Division)
            data.G2.Division.forEach(element => {
                try {
                    const uid = $("#conpol_divdivision").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                    $("#conpol_divdivision").jqxDropDownList('checkIndex', uid);
                } catch {

                }
            });

        if (data.G2.Subdivision)
            data.G2.Subdivision.forEach(element => {
                try {
                    const uid = $("#conpol_divsubdivision").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                    $("#conpol_divsubdivision").jqxDropDownList('checkIndex', uid);
                } catch {

                }
            });

        if (data.G2.Puesto)
            data.G2.Puesto.forEach(element => {
                try {
                    const uid = $("#conpol_divpusto").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                    $("#conpol_divpusto").jqxDropDownList('checkIndex', uid);
                } catch {

                }
            });
    }

    if (data.G3) {
        $('#conpol_esquemaporcentaje').val(data.G3.PorcentajeDeAplicacion);

        if (data.G3.EsquemaDePago)
            data.G3.EsquemaDePago.forEach(element => {
                try {
                    const uid = $("#conpol_esquemaesquemapago").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                    $("#conpol_esquemaesquemapago").jqxDropDownList('checkIndex', uid);
                } catch {

                }
            });
    }


    if (data.G4) {
        $('#conpol_cencostporcentaje').val(data.G4.PorcentajeDeAplicacion);

        if (data.G4.CentroDeCosto)
            data.G4.CentroDeCosto.forEach(element => {
                try {
                    const uid = $("#conpol_cencoscentrocosto").jqxDropDownList('source').records.filter(i => i.value === element.Valor)[0]['uid']
                    $("#conpol_cencoscentrocosto").jqxDropDownList('checkIndex', uid);
                } catch {

                }
            });
    }


    $('#conpol_razonactiva').parent().parent().find('.col-3').removeClass('disable-div');
    $('#conpol_divactiva').parent().parent().find('.col-3').removeClass('disable-div');
    $('#conpol_esquemaactiva').parent().parent().find('.col-3').removeClass('disable-div');
    $('#conpol_cencostactiva').parent().parent().find('.col-3').removeClass('disable-div');
}

const downloadexcel = () => {
}

const save = () => {

}

const dataform = () => {
    const data = {
        clave: $('#ifoPol_clave').val().toString(),
        descripcion: $('#ifoPol_descripcion').val().toString(),
        tipoDePoliza: $('#ifoPol_tipopoliza ').val().toString(),
        cuentasPoliza: page.controles.gridCuentaPoliza.jqxGrid('getRows').map(item => {
            return {
                id_CuentaContable: item.Id_CuentaContable.toString(),
                movContable: item.cargoabono.toString(),
                signoOperacion: item.operador.toString()
            }
        }),
        grupodeCalculo: $("#ifoPol_grupocalculo").jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; }),
        aplicacion: $('#ifoPol_aplicacion').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; }),
        detalle: DetallePoliza(),
        g1: {
            // Activo: $('#conpol_razonactiva').is(':checked'),
            porcentajeDeAplicacion: $('#conpol_razonporcentaje').val().toString(),
            razonSocial: $('#conpol_razonsocial').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; }),
            localidad: $('#conpol_razonlocalidad').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; }),
            registroPatronal: $('#conpol_razonregistropatronal').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; })
        },
        g2: {
            // Activo: $('#conpol_divactiva').is(':checked'),
            porcentajeDeAplicacion: $('#conpol_divporcentaje').val().toString(),
            division: $('#conpol_divdivision').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; }),
            subdivision: $('#conpol_divsubdivision').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; }),
            puesto: $('#conpol_divpusto').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; })
        },
        g3: {
            // Activo: $('#conpol_esquemaactiva').is(':checked'),
            porcentajeDeAplicacion: $('#conpol_esquemaporcentaje').val().toString(),
            esquemaDePago: $('#conpol_esquemaesquemapago').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; })
        },
        g4: {
            // Activo: $('#conpol_cencostactiva').is(':checked'),
            porcentajeDeAplicacion: $('#conpol_cencostporcentaje').val().toString(),
            centroDeCosto: $('#conpol_cencoscentrocosto').jqxDropDownList('getCheckedItems').map(f => { return { valor: f.value.toString() }; })
        }
    };
    if (page.const.mod)
        data.id_Poliza = $('#hdnId_Poliza').val()
    //console.log(JSON.stringify(data));
    return data;
}

const DetallePoliza = () => {
    let arr = [];
    $('input:checked').each((index, item) => {
        if ($(item).data('label'))
            arr.push({ valor: $(item).data('label') })
    });
    return arr;
};

const binddropdownList = (selector, source) => {
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#" + selector).jqxDropDownList({
        source: dataAdapter,
        displayMember: "Descripcion",
        valueMember: "Valor",
        placeHolder: "--Seleccione--"
    });
};

$('#concuen_agregar').on('click', () => {
    var rows = page.controles.gridCuentaContable.jqxGrid('getrows');
    var info = page.controles.gridCuentaContable.jqxGrid('getselectedrowindexes').map(index => {
        var data = page.controles.gridCuentaContable.jqxGrid('getrowdata', index);
        delete data.boundindex;
        delete data.uid;
        delete data.uniqueid;
        delete data.visibleindex;
        data.cargoabono = $('#concuen_cargo').val() === 'a' ? 'Abono' : 'Cargo';
        data.operador = $('#concuen_operador').val();
        return data;
    });

    info.forEach(info => {
        rows = rows.filter(r => r.Id_CuentaContable != info.Id_CuentaContable)
    });
    page.controles.gridCuentaPoliza.jqxGrid('getrows').forEach(f => info.push(f));
    page.grids.cuentapoliza(info);
    page.controles.gridCuentaContable.jqxGrid('clearselection');
    page.grids.cuentacontable(rows);
});

const ajax = async (api, parameters, jsonstring) => {
    let _data = {
        "API": api,
        "Parameters": parameters,
        "JsonString": jsonstring,
        "Hash": getHSH(),
        "Bearer": getToken()
    }

    //console.log(JSON.stringify(_data));

    return await $.ajax({
        url: "https://apigateway.wcloudservices.mx/api/APIGateway?code=B9usae0g4N7ruKeEMVdtQP4p/cabLOgx/I7Oa3aEd4KoOEawKsWS1Q==",
        method: "POST",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        headers: {
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYW54ZWEiLCJpYXQiOjE2MDc1NTYzNjYsImV4cCI6MTYzOTA5MjM2NiwiYXVkIjoiUGFueGVhIiwic3ViIjoiUGFueGVhIiwiR2l2ZW5OYW1lIjoiUGFueGVhIiwiU3VybmFtZSI6IlBhbnhlYSIsIkVtYWlsIjoiUGFueGVhIiwiUm9sZSI6WyJNYW5hZ2VyIiwiVEkiXX0.ttpq3pXWroWTyILdOHj92Sr9IEhpcQHgAE8KwHpK_9I",
            "Content-Type": "application/json",
        },
        data: JSON.stringify(_data),
        error: function (error) {
            //console.log("error")
            //console.log(error)
        },
        success: function (data) {
            //console.log("data")
            //console.log(data)
        }
    });
};

const buttonUp = (index) => {
    let dataCuentasPolizas = page.controles.gridCuentaPoliza.jqxGrid('getRows');
    const newIndex = index === 0 ? dataCuentasPolizas.length - 1 : index - 1;
    const movItem = dataCuentasPolizas[index];
    const prevItem = dataCuentasPolizas[newIndex];
    if (index === 0) {
        for (let i = 0; i < dataCuentasPolizas.length; i++)
            dataCuentasPolizas[i] = dataCuentasPolizas[i + 1];

        dataCuentasPolizas[newIndex] = movItem;
    } else
        dataCuentasPolizas[index] = prevItem;
    dataCuentasPolizas[newIndex] = movItem;
    page.grids.cuentapoliza(dataCuentasPolizas);
};

const buttonDown = (index) => {
    let dataCuentasPolizas = page.controles.gridCuentaPoliza.jqxGrid('getRows');

    const newIndex = index === dataCuentasPolizas.length - 1 ? 0 : index + 1;
    const movItem = dataCuentasPolizas[index];
    const prevItem = dataCuentasPolizas[newIndex];

    if (index === dataCuentasPolizas.length - 1) {
        for (let i = dataCuentasPolizas.length - 1; i >= 0; i--)
            dataCuentasPolizas[i] = dataCuentasPolizas[i - 1];
    } else
        dataCuentasPolizas[index] = prevItem;

    dataCuentasPolizas[newIndex] = movItem;
    page.grids.cuentapoliza(dataCuentasPolizas);
};

$('#BtnGuardar').click(() => {
    mostrarUpCargador();
    setTimeout(() => {
        const data = dataform();
        if (page.const.mod)
            ajax("9A58A67ED6B5A9B5FF48E3F56F7C476AD685C8773449541268FF5DE996B3F863", "", JSON.stringify(data)).then(response => {
                var r = response[0];
                //console.log(r);
                ocultarUpCargador();
                if (r.Exito)
                    showMsgReload("Proceso terminado", r.MSJ);
                else
                    showMsg("Proceso terminado", r.MSJ);
            });
        else
            ajax("812AFC604990D2EA38720870F35D923ED4523ED99B6CEB83190B726D1C8CBE7F", "", JSON.stringify(data)).then(response => {
                var r = response[0];
                //console.log(r);
                ocultarUpCargador();
                if (r.Exito)
                    showMsgReload("Proceso terminado", r.MSJ);
            });
    }, 1000);
})

function ValidaSeleccion(grid, multiSeleccion = false) {
    const seleccionados = grid.jqxGrid('selectedrowindexes');
    if (seleccionados) {
        const contador = seleccionados.length;

        if (multiSeleccion && contador == 0) {
            showMsg("Información", "Debe seleccionar por lo menos un registro.");
            return null;
        }
        if (!multiSeleccion && contador == 0) {
            showMsg('Información', 'Debe seleccionar un registro.');
            return null;
        }
        else if (!multiSeleccion && contador > 1) {
            showMsg('Información', 'Debe seleccionar solo un registro.');
            return null;
        }

        if (multiSeleccion) {
            let datos = new Array();
            seleccionados.forEach((item) => {
                const dataRow = grid.jqxGrid('getrowdata', item);
                datos.push(dataRow);
            });
            return datos;
        } else {
            const dataRow = grid.jqxGrid('getrowdata', seleccionados[0]);
            return dataRow
        }
    }
}

$('#conpol_razonactiva').on('change', () => {
    if ($('#conpol_razonactiva').is(':checked'))
        $('#conpol_razonactiva').parent().parent().find('.col-3').removeClass('disable-div')
    else
        $('#conpol_razonactiva').parent().parent().find('.col-3').addClass('disable-div')
})

$('#conpol_divactiva').on('change', () => {
    if ($('#conpol_divactiva').is(':checked'))
        $('#conpol_divactiva').parent().parent().find('.col-3').removeClass('disable-div')
    else
        $('#conpol_divactiva').parent().parent().find('.col-3').addClass('disable-div')
})

$('#conpol_esquemaactiva').on('change', () => {
    if ($('#conpol_esquemaactiva').is(':checked'))
        $('#conpol_esquemaactiva').parent().parent().find('.col-3').removeClass('disable-div')
    else
        $('#conpol_esquemaactiva').parent().parent().find('.col-3').addClass('disable-div')
})

$('#conpol_cencostactiva').on('change', () => {
    if ($('#conpol_cencostactiva').is(':checked'))
        $('#conpol_cencostactiva').parent().parent().find('.col-3').removeClass('disable-div')
    else
        $('#conpol_cencostactiva').parent().parent().find('.col-3').addClass('disable-div')
})

