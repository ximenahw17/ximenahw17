function iniciarcontrolarchivos() {

    $('.subir').each(function () {
        var objeto = $(this).attr('id');
        var datos = $('#subirArchivo').data('fileupload');
        $.getJSON($('#subirArchivo form').prop('action'), { carpeta: datos.options.formData.carpeta, nombre_archivo: datos.options.formData.nombre_archivo}, function (files) {
            var fu = $('#subirArchivo').data('fileupload');
            fu._adjustMaxNumberOfFiles(-files.length);
            fu._renderDownload(files)
                .appendTo($('#subirArchivo .files'))
                .fadeIn(function () {
                    // Fix for IE7 and lower:
                    $(this).show();
                });
        });
    });
}