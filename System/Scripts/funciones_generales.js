function mensWarning(mensaje, objetoFocus) {
    $("#dialogWarning").find('.mensaje').html('<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span>' + mensaje);
    $("#dialogWarning").dialog({
        modal: true,
        buttons: {
            Aceptar: function () {
                $(this).dialog("close");
                if (objetoFocus != null)
                    $("#" + objetoFocus).focus();
            }
        }
    });
}

function mensOperacionSatisfactoria(mensaje, objetoFocus) {
    $("#dialogSatisfactorio").find('.mensaje').html('<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>' + mensaje);
    $("#dialogSatisfactorio").dialog({
        modal: true,
        buttons: {
            Aceptar: function () {
                $(this).dialog("close");
                if (objetoFocus != null)
                    $("#" + objetoFocus).focus();
            }
        }
    });
}