/**
* Realiza llamado al servidor, regresando una lista
* @param {String} StrNomFuncion - Nombre de la función a usar
* @param {Object} ObjDatos - Objeto con los parametros que espera la funcion del servidor
*/
function llamadoAjax(StrNomFuncion, ObjDatos) {
    return $.ajax({
        type: "POST",
        url: loc + "/" + StrNomFuncion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        data: JSON.stringify({ StrDatos: JSON.stringify(ObjDatos) }),
        success: OnSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#cargaPagina").hide();
            console.log(XMLHttpRequest.responseText);
            showMsg(0, 'Ocurrio un error al cargar la información.');
        }
    });
    $("#cargaPagina").hide();
}

/**
* Realiza llamado al asincrono al servidor
* @param {String} StrNomFuncion - Nombre de la función a usar
* @param {Object} ObjDatos - Objeto con los parametros que espera la funcion del servidor
*/
async function llamadoAjaxDirectoAsync(StrNomFuncion, ObjDatos) {
    var respuesta = await $.ajax({
        type: "POST",
        url: loc + "/" + StrNomFuncion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        data: JSON.stringify({ StrDatos: JSON.stringify(ObjDatos) }),
    });
    return respuesta.d.Result;
}

/**
* Realiza llamado al servidor, regresando un string 
* @param {String} StrNomFuncion - Nombre de la función a usar
* @param {Object} ObjDatos - Objeto con los parametros que espera la funcion del servidor
*/
function llamadoAjaxDirecto(StrNomFuncion, ObjDatos = "") {
    var respuesta = null;
    $.ajax({
        type: "POST",
        url: loc + "/" + StrNomFuncion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        data: JSON.stringify({ StrDatos: JSON.stringify(ObjDatos) }),
        success: function (response) {
            respuesta = response.d;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.responseText);
            showMsg(0, 'Ocurrio un error al cargar la información.');
        }
    });
    return respuesta;
}

/**
 * Muestra Cargador
 * @param {int} Opcion - Opción 1 .- Mostrar, 0 .- Ocultar
 */
function showLoad(Opcion) {
    switch (Opcion) {
        case 0:
            $("#cargaPagina").hide();
            break;
        case 1:
            $("#cargaPagina").show();
            break;
    }
}

/**
* Muestra mensaje de error y exito en modal, 0 - Error, 1 - Éxito, 2- Información 3- Advertencia.
* @param {int} tipo - Nombre de la función a usar
* @param {string} mensaje - mensaje a mostrar
*/
function showMsg(tipo, mensaje) {
    switch (tipo) {
        //Error
        case 0:
            $("#cargaPagina").hide();
            swal("Error", mensaje, "error");
            break;
        //Exito
        case 1:
            $("#cargaPagina").hide();
            swal("Éxito", mensaje, "success");
            break;
        //Información
        case 2:
            swal("Información", mensaje, "info");
            break;
        //Advertencia
        case 3:
            swal("Adevertencia", mensaje, "warning");
            break;
    }
}

/**
* Arma el Grid
* @param {string} Id_Div - Id del div que es el grid
* @param {string} StrNomFuncion - Nombre del metodo en C#
* @param {Object} Params - Parametros para considerear en el Grid
*/
function GetGrid(Id_Div, StrNomFuncion, Params = "") {
    var ObjDatos = new Object();
    ObjDatos.Id_Div = Id_Div;
    ObjDatos.Parametros = Params;
    ObjDatos = JSON.stringify({ StrDatos: JSON.stringify(ObjDatos) });
    $.ajax({
        type: "POST",
        url: loc + "/" + StrNomFuncion,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: ObjDatos,
        async: false,
        success: function (data) {
            var ObjData = data.d;
            $.globalEval(ObjData.StrLocalData + ObjData.StrSource + ObjData.StrDataAdapter + ObjData.StrGrid);
            $("#cargaPagina").hide();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#cargaPagina").hide();
            console.log(XMLHttpRequest.responseText);
            showMsg(0, 'Ocurrio un error al cargar la información.');
        }
    });
}

/**
* Valida formulario
* @param {object} Objetos - HTML Collection
*/
function ValidaFormulario(ObjHTML) {
    var pasa = true;
    for (var x = 0; x < ObjHTML.length; x++) {
        var Tipo = null;
        var IdObjHTML = null;
        var HTMLItem = null;
        var valor = null;
        HTMLItem = ObjHTML[x];
        Tipo = HTMLItem.tagName;
        IdObjHTML = HTMLItem.id;
        valor = HTMLItem.value;
        switch (Tipo) {
            case "SELECT":
                if (valor == "0" || valor == "@") {
                    pasa = false;
                }
                break;
            case "INPUT":
                if (valor.length == 0) {
                    pasa = false;
                }
                break;
        }
    }

    return pasa;
}

/**
 * Llena Select, recibe una var tipo Object con la estructura Valor y Descripción.
 * @param {string} IdCombo - Id del Combo a llenar.
 * @param {object} response - Datos del combo (Valor y Descripción).
 */
function LlenaCombo(IdCombo, response) {
    $("#" + IdCombo + "").find('option')
        .remove()
        .end()
        .append($('<option value="0"> -- Selecione -- </option>'))
        .val('0');
    for (var i = 0; i < response.length; i++) {
        var valor = response[i].Valor;
        var descripcion = response[i].Descripcion;
        $("#" + IdCombo + "").append($("<option value=" + valor + ">" + descripcion + "</option>"));
    }
}

/**
 * Llena jqxDropDownList, recibe una var tipo Object con la estructura Valor y Descripción.
 * @param {string} IdCombo - Id del jqxDropDownList a llenar.
 * @param {object} response - Datos del combo (Valor y Descripción).
 */
function LlenajqxDropDownList(IdCombo, response) {
    $("#" + IdCombo + "").jqxDropDownList('clear');
    //$("#" + IdCombo + "").jqxDropDownList('addItem', { label: '-- Seleccione --', value: '0' });
    for (var x = 0; x < response.length; x++) {
        $("#" + IdCombo + "").jqxDropDownList('addItem', { label: response[x].Descripcion, value: response[x].Valor });
    }
}

/**
 * Limpia el formulario dentro de un Div
 * @param {string} IdDiv - Id del Div contenedor del formulario
 */
function clearAllInputs(selector) {
    $(selector).find(':input').each(function () {
        if (this.type == 'submit') {
            //do nothing
        }
        else if (this.type == 'checkbox' || this.type == 'radio') {
            this.checked = false;
        }
        else if (this.type == 'file') {
            var control = $(this);
            control.replaceWith(control = control.clone(true));
        } else if (this.type == 'select') {
            $(this).val('0');
        }
        else {
            $(this).val('');
        }
    });

    $(selector).find(':textarea').each(function () {
        $(this).val('');
    });
}

/**
 * Convierte Date to String
 * @param {any} inputFormat - Fecha en formato ISO.
 * @param {char} separator - Separador para el formato de fecha. Por default -
 */
function DatetoString(inputFormat, separator = '-') {
    if (inputFormat.length > 0) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join(separator);
    } else {
        return "";
    }
}

/**
 * Muestra dialog de JQuery 
 * @param {string} IdDialog - Id del div que es dialog.
 * @param {object} mensaje - Mensaje a mostrar.
 * @param {string} Titulo - Titulo del dialog.
 * @param {int} Tipo - 0 - Error, 1 - Éxito, 2 - Información 3 - Advertencia.
 */
function ShowJQMsg(IdDialog, mensaje, Titulo, Tipo) {
    var icono;
    switch (Tipo) {
        //Error
        case 0:
            icono = '<i class="fa fa-times-rectangle" style="font-size: 20px"></i>';
            break;
        //Éxito
        case 1:
            icono = '<i class="fa fa-check-circle" style="font-size: 20px"></i>';
            break;
        //Información
        case 2:
            icono = '<i class="fa fa-exclamation-circle" style="font-size: 20px"></i>';
            break;
        //Advertencia
        case 3:
            icono = '<i class="fa fa-warning" style="font-size: 20px"></i>';
            break;
    }
    $("#" + IdDialog + "").find('span').remove();
    $("#" + IdDialog + "").append('<span style="font-size: 14px">' + mensaje + '</span>');
    $("#" + IdDialog + "").dialog({
        modal: true,
        title: icono + '&nbsp&nbsp' + Titulo,
        resizable: false,
        draggable: false,
        width: 400,
        create: function (event, ui) {
            $("body").css({ overflow: 'hidden' })
        },
        beforeClose: function (event, ui) {
            $("body").css({ overflow: 'inherit' })
        },
        buttons: {
            Aceptar: function () {
                $(this).dialog("close");
            }
        },
        my: "center"
    });

    $("#" + IdDialog + "").dialog("open");
}

/**
 * Muestra dialog JQuery de decisión. 
 * @param {string} IdDialog - Id del div que es dialog.
 * @param {string} Pregunta - Mensaje para preguntar.
 * @param {string} MensajeExito - Mensaje de éxito.
 * @param {string} Titulo - Titulo del dialog.
 * @param {string} FuncionSi - Función a ejecutar en caso de SI.
 * @param {string} FuncionNo - Función a ejecutar en caso de NO.
 * @param {object} dataSI - Datos para SI.
 * @param {object} dataNO - Datos para NO.
 */
function showMsjQueston(IdDialog, Pregunta, MensajeExito, Titulo = '', FuncionSi, FuncionNo = '', dataSI = '', dataNO = '') {
    var mensaje = '<span><i class="fa fa-warning" style="font-size: 20px"></i>&nbsp&nbsp' + Pregunta + '</span>';
    console.log(FuncionSi);
    $("#" + IdDialog + "").find('span').remove();
    $("#" + IdDialog + "").append(mensaje);
    $("#" + IdDialog + "").dialog({
        modal: true,
        draggable: false,
        width: 400,
        resizable: false,
        create: function (event, ui) {
            $("body").css({ overflow: 'hidden' })
        },
        beforeClose: function (event, ui) {
            $("body").css({ overflow: 'inherit' })
        },
        buttons: {
            Aceptar: function () {
                try {
                    $(this).dialog("close");
                    setTimeout(function () {
                        showLoad(1);
                        //función a ejecutar
                        //window[FuncionSi](dataSI);
                        eval(FuncionSi(dataSI));
                    }, 100);
                    //setTimeout(function () {

                    //    showLoad(0);
                    //    ShowJQMsg('dialogWindow', MensajeExito, 'Éxito', 1);
                    //},1000);
                }
                catch (error) {
                    console.error(error);
                    ShowJQMsg('dialogWindow', 'Ocurrió un problema al procesar la información', 'Error', 0);
                }
            },
            Cancelar: function () {
                if (FuncionNo != "") {
                    try {
                        //función a ejecutar
                        FuncionNo();
                        $(this).dialog("close");
                    }
                    catch (error) {
                        console.error(error);
                        ShowJQMsg('dialogWindow', 'Ocurrió un problema al procesar la información', 'Error', 0);
                    }

                } else {
                    $(this).dialog("close");
                }
            }
        },
        my: "center"
    });
}

/**
 * Muestra dialog de JQuery de confirmación. Nota: REFRESCA LA PAGINA.
 * @param {string} IdDialog - Id del div que es dialog.
 * @param {object} mensaje - Mensaje a mostrar.

 */
function showMsjConfirm(IdDialog, mensaje) {
    var icono = '<i class="fa fa-check-circle" style="font-size: 20px"></i>';

    $("#" + IdDialog + "").find('span').remove();
    $("#" + IdDialog + "").append('<span style="font-size: 14px">' + mensaje + '</span>');

    $("#" + IdDialog + "").dialog({
        modal: true,
        title: icono + '&nbsp&nbsp Éxito',
        resizable: false,
        draggable: false,
        width: 400,
        create: function (event, ui) {
            $("body").css({ overflow: 'hidden' })
        },
        closeOnEscape: false,
        open: function (event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        beforeClose: function (event, ui) {
            $("body").css({ overflow: 'inherit' })
        },
        buttons: {
            Aceptar: function () {
                $(this).dialog("close");
                location.reload();
            }
        },
        my: "center"
    });

    $("#" + IdDialog + "").dialog("open");
}

/**
 * Agrega el nombre a la lagina.
 * @param {string} id - Id del titluo.
 * @param {string} title - Titulo a mostrar.

 */
function setTitle(id, title) {
    $('#' + id).text(title)
}

/**
 * Muestra dialog JQuery de decisión.
 * @param {string} IdDialog - Id del div que es dialog.
 * @param {string} Pregunta - Mensaje para preguntar.
 * @param {string} MensajeExito - Mensaje de éxito.
 * @param {string} Titulo - Titulo del dialog.
 * @param {string} FuncionSi - Función a ejecutar en caso de SI.
 * @param {string} FuncionNo - Función a ejecutar en caso de NO.
 */
function showMsjQuestonHB(IdDialog, Pregunta, FuncionSi, FuncionNo) {
    var mensaje = '<span><i class="fa fa-warning" style="font-size: 20px"></i>&nbsp&nbsp' + Pregunta + '</span>';
    $('#' + IdDialog).find('span').remove();
    $('#' + IdDialog).append(mensaje);
    $('#' + IdDialog).dialog({
        modal: true,
        draggable: false,
        width: 400,
        resizable: false,
        create: function (event, ui) {
            $("body").css({ overflow: 'hidden' })
        },
        beforeClose: function (event, ui) {
            $("body").css({ overflow: 'inherit' })
        },
        buttons: {
            Aceptar: FuncionSi,
            Cancelar: FuncionNo ? FuncionNo : () => { $('#' + IdDialog).dialog("close"); }
        },
        my: "center"
    });

    $('#' + IdDialog).parent().find('button').click(() => { $('#' + IdDialog).dialog("close"); })
}