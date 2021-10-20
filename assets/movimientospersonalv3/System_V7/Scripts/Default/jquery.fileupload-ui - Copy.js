

(function ($) {
    'use strict';
    var delete_all = 'false';
    // The UI version extends the basic fileupload widget and adds
    // a complete user interface based on the given upload/download
    // templates.
    $.widget('blueimpUI.fileupload', $.blueimp.fileupload, {
        
        options: {
            replaceFileInput: false,

            // By default, files added to the widget are uploaded as soon
            // as the user clicks on the start buttons. To enable automatic
            // uploads, set the following option to true:
            autoUpload: true,
            // The following option limits the number of files that are
            // allowed to be uploaded using this widget:
            maxNumberOfFiles: 5,
            // The maximum allowed file size:
            maxFileSize: undefined,
            // The minimum allowed file size:
            minFileSize: 1,
            // The regular expression for allowed file types, matches
            // against either file type or file name:
            acceptFileTypes:  /.+$/i,
            // The file upload template that is given as first argument to the
            // jQuery.tmpl method to render the file uploads:
            uploadTemplate: $('#template-upload'),
            // The file download template, that is given as first argument to the
            // jQuery.tmpl method to render the file downloads:
            downloadTemplate: $('#template-download'),
            // The expected data type of the upload response, sets the dataType
            // option of the $.ajax upload requests:
            dataType: 'json',
            
            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop or add API call).
            // See the basic file upload widget for more information:
            add: function (e, data) {
                var that = $(this).data('fileupload');
                that._adjustMaxNumberOfFiles(-data.files.length);
                data.isAdjusted = true;
                data.isValidated = that._validate(data.files);
                data.context = that._renderUpload(data.files)
                    .appendTo($(this).find('.files')).fadeIn(function () {
                        // Fix for IE7 and lower:
                        $(this).show();
                    }).data('data', data);
                if ((that.options.autoUpload || data.autoUpload) &&
                        data.isValidated) {
                    data.jqXHR = data.submit();
                }
            },
            // Callback for the start of each file upload request:
            send: function (e, data) {
                if (!data.isValidated) {
                    var that = $(this).data('fileupload');
                    if (!data.isAdjusted) {
                        that._adjustMaxNumberOfFiles(-data.files.length);
                    }
                    if (!that._validate(data.files)) {
                        return false;
                    }
                }
                if (data.context && data.dataType &&
                        data.dataType.substr(0, 6) === 'iframe') {
                    // Iframe Transport does not support progress events.
                    // In lack of an indeterminate progress bar, we set
                    // the progress to 100%, showing the full animated bar:
                    data.context.find('.ui-progressbar').progressbar(
                        'value',
                        parseInt(100, 10)
                    );
                }
            },
            // Callback for successful uploads:
            done: function (e, data) {
                var that = $(this).data('fileupload');
                if (data.context) {
                    data.context.each(function (index) {
                        var file = ($.isArray(data.result) &&
                                data.result[index]) || {error: 'emptyResult'};
                        if (file.error) {
                            that._adjustMaxNumberOfFiles(1);
                        }
                        
                        $(this).fadeOut(function () {
                            that._renderDownload([file])
                                .css('display', 'none')
                                .replaceAll(this)
                                .fadeIn(function () {
                                    // Fix for IE7 and lower:
                                    $(this).show();
                                });
                        });
                        
                    });
                } else {
                    that._renderDownload(data.result)
                        .css('display', 'none')
                        .appendTo($(this).find('.files'))
                        .fadeIn(function () {
                            // Fix for IE7 and lower:
                            $(this).show();
                        });
                }
                
            },
            // Callback for failed (abort or error) uploads:
            fail: function (e, data) {
                var that = $(this).data('fileupload');
                that._adjustMaxNumberOfFiles(data.files.length);
                if (data.context) {
                    data.context.each(function (index) {
                        $(this).fadeOut(function () {
                            if (data.errorThrown !== 'abort') {
                                var file = data.files[index];
                                file.error = file.error || data.errorThrown
                                    || true;
                                that._renderDownload([file])
                                    .css('display', 'none')
                                    .replaceAll(this)
                                    .fadeIn(function () {
                                        // Fix for IE7 and lower:
                                        $(this).show();
                                    });
                            } else {
                                data.context.remove();
                            }
                        });
                    });
                } else if (data.errorThrown !== 'abort') {
                    that._adjustMaxNumberOfFiles(-data.files.length);
                    data.context = that._renderUpload(data.files)
                        .css('display', 'none')
                        .appendTo($(this).find('.files'))
                        .fadeIn(function () {
                            // Fix for IE7 and lower:
                            $(this).show();
                        }).data('data', data);
                }
            },
            // Callback for upload progress events:
            progress: function (e, data) {
                if (data.context) {
                    data.context.find('.ui-progressbar').progressbar(
                        'value',
                        parseInt(data.loaded / data.total * 100, 10)
                    );
                }
            },
            // Callback for global upload progress events:
            progressall: function (e, data) {
                $(this).find('.fileupload-progressbar').progressbar(
                    'value',
                    parseInt(data.loaded / data.total * 100, 10)
                );
            },
            // Callback for uploads start, equivalent to the global ajaxStart event:
            start: function () {
                $(this).find('.fileupload-progressbar')
                    .progressbar('value', 0).fadeIn();
            },
            // Callback for uploads stop, equivalent to the global ajaxStop event:
            stop: function () {
                $(this).find('.fileupload-progressbar').fadeOut();
            },
            // Callback for file deletion:
            destroy: function (e, data) {
                var that = $(this).data('fileupload');
                if (data.url) {
                    $.ajax(data)
                        .success(function () {
                            that._adjustMaxNumberOfFiles(1);
                            $(this).fadeOut(function () {
                                $(this).remove();
                            });
                        });
                } else {
                    data.context.fadeOut(function () {
                        $(this).remove();
                    });
                }
            }
        },

        _createObjectURL: function (file) {
            var undef = 'undefined',
                urlAPI = (typeof window.createObjectURL !== undef && window) ||
                    (typeof URL !== undef && URL) ||
                    (typeof webkitURL !== undef && webkitURL);
            return urlAPI ? urlAPI.createObjectURL(file) : false;
        },
        
        _revokeObjectURL: function (url) {
            var undef = 'undefined',
                urlAPI = (typeof window.revokeObjectURL !== undef && window) ||
                    (typeof URL !== undef && URL) ||
                    (typeof webkitURL !== undef && webkitURL);
            return urlAPI ? urlAPI.revokeObjectURL(url) : false;
        },

        // Loads a given File object via FileReader interface,
        // invokes the callback with a data url:
        _loadFile: function (file, callback) {
            if (typeof FileReader !== 'undefined' &&
                    FileReader.prototype.readAsDataURL) {
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    callback(e.target.result);
                };
                fileReader.readAsDataURL(file);
                return true;
            }
            return false;
        },

        // Link handler, that allows to download files
        // by drag & drop of the links to the desktop:
        _enableDragToDesktop: function () {
            var link = $(this),
                url = link.prop('href'),
                name = decodeURIComponent(url.split('/').pop())
                    .replace(/:/g, '-'),
                type = 'application/octet-stream';
            link.bind('dragstart', function (e) {
                try {
                    e.originalEvent.dataTransfer.setData(
                        'DownloadURL',
                        [type, name, url].join(':')
                    );
                } catch (err) {}
            });
        },

        _adjustMaxNumberOfFiles: function (operand) {
            if (typeof this.options.maxNumberOfFiles === 'number') {
                this.options.maxNumberOfFiles += operand;
                if (this.options.maxNumberOfFiles < 1) {
                    this._disableFileInputButton();
                } else {
                    this._enableFileInputButton();
                }
            }
        },

        _formatFileSize: function (file) {
            if (typeof file.size !== 'number') {
                return '';
            }
            if (file.size >= 1000000000) {
                return (file.size / 1000000000).toFixed(2) + ' GB';
            }
            if (file.size >= 1000000) {
                return (file.size / 1000000).toFixed(2) + ' MB';
            }
            return (file.size / 1000).toFixed(2) + ' KB';
        },

        _hasError: function (file) {
            if (file.error) {
                return file.error;
            }
            // The number of added files is subtracted from
            // maxNumberOfFiles before validation, so we check if
            // maxNumberOfFiles is below 0 (instead of below 1):
            if (this.options.maxNumberOfFiles < 0) {
                return 'maxNumberOfFiles';
            }
            // Files are accepted if either the file type or the file name
            // matches against the acceptFileTypes regular expression, as
            // only browsers with support for the File API report the type:
            if (!(this.options.acceptFileTypes.test(file.type) ||
                    this.options.acceptFileTypes.test(file.name))) {
                return 'acceptFileTypes';
            }
            if (this.options.maxFileSize &&
                    file.size > this.options.maxFileSize) {
                return 'maxFileSize';
            }
            if (typeof file.size === 'number' &&
                    file.size < this.options.minFileSize) {
                return 'minFileSize';
            }
            return null;
        },

        _validate: function (files) {
            $('#cargaArchivo')[0].reset();
            var that = this,
                valid;
            $.each(files, function (index, file) {
                file.error = that._hasError(file);
                valid = !file.error;
            });
            return valid;
        },

        _uploadTemplateHelper: function (file) {
            file.sizef = this._formatFileSize(file);
            return file;
        },

        _renderUploadTemplate: function (files) {
            var that = this;
            return $.tmpl(
                this.options.uploadTemplate,
                $.map(files, function (file) {
                    return that._uploadTemplateHelper(file);
                })
            );
        },

        _renderUpload: function (files) {
            var that = this,
                options = this.options,
                tmpl = this._renderUploadTemplate(files);
            if (!(tmpl instanceof $)) {
                return $();
            }

            tmpl.css('display', 'none');
            // .slice(1).remove().end().first() removes all but the first
            // element and selects only the first for the jQuery collection:
            tmpl.find('.progress div').slice(1).remove().end().first()
                .progressbar();
            tmpl.find('.start button').slice(
                this.options.autoUpload ? 0 : 1
            ).remove().end().first()
                .button({
                    text: false,
                    icons: {primary: 'ui-icon-circle-arrow-e'}
                });
            tmpl.find('.cancel button').slice(1).remove().end().first()
                .button({
                    text: false,
                    icons: {primary: 'ui-icon-cancel'}
                });
            return tmpl;
        },

        _downloadTemplateHelper: function (file) {
            file.sizef = this._formatFileSize(file);
            if(this.options.maxNumberOfFiles==0)
                $("#agregarFile").button("option", "disabled", true);
            return file;
        },

        _renderDownloadTemplate: function (files) {
            var that = this;
            return $.tmpl(
                this.options.downloadTemplate,
                $.map(files, function (file) {
                    return that._downloadTemplateHelper(file);
                })
            );

        },
        
        _renderDownload: function (files) {

            
            var tmpl = this._renderDownloadTemplate(files);
            if (!(tmpl instanceof $)) {
                return $();
            }
            tmpl.css('display', 'none');
            tmpl.find('.delete button').button({
                text: true
            });
            tmpl.find('.cargar button').button({
                text: true
            });
            tmpl.find('a').each(this._enableDragToDesktop);

            return tmpl;
        },
        
        _startHandler: function (e) {
            e.preventDefault();
            var tmpl = $(this).closest('.template-upload'),
                data = tmpl.data('data');

            data.formData = [];

            var error = false;
            data.context.find("input, textarea").each(function (i, item) {
                if ($(item).val() == '') {
                    data.context.find(".error_required").html(errors.error_required_data);
                    error = true;
                    return;
                }
                data.formData.push({ name: $(item).attr('name'), value: $(item).val() });
            });
            if (error)
                return false;

            if (data && data.submit && !data.jqXHR) {
                data.jqXHR = data.submit();
                $(this).fadeOut();
            }
        },
        
        _cancelHandler: function (e) {
            e.preventDefault();
            var tmpl = $(this).closest('.template-upload'),
                data = tmpl.data('data') || {};
            if (!data.jqXHR) {
                data.errorThrown = 'abort';
                e.data.fileupload._trigger('fail', e, data);
            } else {
                data.jqXHR.abort();
            }
        },
        
        _deleteHandler: function (e) {
            var button = $(this);

            if (delete_all == 'false') {
                $("#dialogWarningArchivo").dialog({
                    modal: true,
                    buttons: {
                        Aceptar: function () {
                            $(this).dialog("close");
                            e.data.fileupload._trigger('destroy', e, {
                                context: button.closest('.template-download'),
                                url: button.attr('data-url'),
                                type: button.attr('data-type'),
                                dataType: e.data.fileupload.options.dataType,
                                data: { 'carpeta': e.data.fileupload.options.formData.carpeta }
                            });
                        },
                        Cancelar: function () {
                            $(this).dialog("close");
                        }
                    }
                });

            }
            else {
                e.preventDefault();
                var button = $(this);
                e.data.fileupload._trigger('destroy', e, {
                    context: button.closest('.template-download'),
                    url: button.attr('data-url'),
                    type: button.attr('data-type'),
                    dataType: e.data.fileupload.options.dataType,
                    data: { 'carpeta': e.data.fileupload.options.formData.carpeta }
                });
            }
                
            
        },

        _cargarHandler: function (e) {
            var button = $(this);
            var datos_validar;
            datos_validar = new Object();
            datos_validar.path = window.location.hostname;
            datos_validar.carpeta = button.data('c');
            datos_validar.archivoc = button.data('a');
            datos_validar = JSON.stringify(datos_validar);
            $.ajax({
                type: "POST",
                url: "catalogo.aspx/procesarArchivo",
                data: datos_validar,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                success: function (msg) {
                    if (msg.d == "") {
                        alert("no hay errores")
                    }
                    else {
                        $('#tablaErrores').html(msg.d);

                        $("#dialogValidaciones").dialog({
                            modal: true,
                            height: 500,
                            width: 700,
                            title: "Errores detectados en la carga de información",
                            buttons: {
                                Ok: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }
            });



            //if (delete_all == 'false') {
            //    $("#dialogWarningArchivo").dialog({
            //        modal: true,
            //        buttons: {
            //            Aceptar: function () {
            //                $(this).dialog("close");
            //                e.data.fileupload._trigger('destroy', e, {
            //                    context: button.closest('.template-download'),
            //                    url: button.attr('data-url'),
            //                    type: button.attr('data-type'),
            //                    dataType: e.data.fileupload.options.dataType,
            //                    data: { 'carpeta': e.data.fileupload.options.formData.carpeta }
            //                });
            //            },
            //            Cancelar: function () {
            //                $(this).dialog("close");
            //            }
            //        }
            //    });

            //}
        },
        
        _initEventHandlers: function () {
            $.blueimp.fileupload.prototype._initEventHandlers.call(this);
            var filesList = this.element.find('.files'),
                eventData = {fileupload: this};
            filesList.find('.start button')
                .live(
                    'click.' + this.options.namespace,
                    eventData,
                    this._startHandler
                );
            filesList.find('.cancel button')
                .live(
                    'click.' + this.options.namespace,
                    eventData,
                    this._cancelHandler
                );
            filesList.find('.delete button')
                .live(
                    'click.' + this.options.namespace,
                    eventData,
                    this._deleteHandler
                );
            filesList.find('.cargar button')
                .live(
                    'click.' + this.options.namespace,
                    eventData,
                    this._cargarHandler
                );
        },
        
        _destroyEventHandlers: function () {
            var filesList = this.element.find('.files');
            filesList.find('.start button')
                .die('click.' + this.options.namespace);
            filesList.find('.cancel button')
                .die('click.' + this.options.namespace);
            filesList.find('.delete button')
                .die('click.' + this.options.namespace);
            $.blueimp.fileupload.prototype._destroyEventHandlers.call(this);
        },

        _initFileUploadButtonBar: function () {
            var fileUploadButtonBar = this.element.find('.fileupload-buttonbar'),
                filesList = this.element.find('.files'),
                ns = this.options.namespace;
            fileUploadButtonBar
                .addClass('ui-widget-header ui-corner-top');
            this.element.find('.fileinput-button').each(function () {
                var fileInput = $(this).find('input:file').detach();
                $(this).button()
                    .append(fileInput);
            });
            fileUploadButtonBar.find('.start')
                .button({icons: {primary: 'ui-icon-circle-arrow-e'}})
                .bind('click.' + ns, function (e) {
                    e.preventDefault();
                    filesList.find('.start button').click();
                });
            fileUploadButtonBar.find('.cancel')
                .button({icons: {primary: 'ui-icon-cancel'}})
                .bind('click.' + ns, function (e) {
                    e.preventDefault();
                    filesList.find('.cancel button').click();
                });
            fileUploadButtonBar.find('.descargar')
                .button()
                .bind('click.' + ns, function (e) {
                    e.preventDefault();
                    if ($("#catalogoImportar").val() != null) {
                        ajaxDownload($("#catalogoImportar").text(), '', $("#catalogoImportar").val(), 'excelvacio');
                    }
                });
            fileUploadButtonBar.find('.delete')
                .button({disabled: true})
                .bind('click.' + ns, function (e) {

                    var rowCount = $('.files tr').length;
                    var rowCountArchivos = $('.files tr .delete').length;
                    var rowCountCancel = $('.files tr .cancel').length;

                    if (rowCount > 0) {
                        e.preventDefault();
                        if (rowCountCancel > 0) {
                            e.preventDefault();
                            filesList.find('.cancel button').click();
                        }

                        if (rowCountArchivos>0){
                            $("#dialogWarningAll").dialog({
                                modal: true,
                                buttons: {
                                    Aceptar: function () {
                                        $(this).dialog("close");
                                        delete_all = 'true';
                                        filesList.find('.delete button').click();
                                        delete_all = 'false';
                                    },
                                    Cancelar: function () {
                                        $(this).dialog("close");
                                    }
                                }
                            });
                        }

                    }
                });
        },
        
        _destroyFileUploadButtonBar: function () {
            this.element.find('.fileupload-buttonbar')
                .removeClass('ui-widget-header ui-corner-top');
            this.element.find('.fileinput-button').each(function () {
                var fileInput = $(this).find('input:file').detach();
                $(this).button('destroy')
                    .append(fileInput);
            });
            this.element.find('.fileupload-buttonbar button')
                .unbind('click.' + this.options.namespace)
                .button('destroy');
        },

        _enableFileInputButton: function () {
            this.element.find('.fileinput-button input:file:disabled')
                .each(function () {
                    var fileInput = $(this),
                        button = fileInput.parent();
                    fileInput.detach().prop('disabled', false);
                    button.button('enable').append(fileInput);
                });
            $("#deleteAll").button("option", "disabled", true);
        },

        _disableFileInputButton: function () {
            this.element.find('.fileinput-button input:file:enabled')
                .each(function () {
                    var fileInput = $(this),
                        button = fileInput.parent();
                    fileInput.detach().prop('disabled', true);
                    button.button('disable').append(fileInput);
                });
            $("#deleteAll").button("option", "disabled", false);
        },

        _initTemplates: function () {
            // Handle cases where the templates are defined
            // after the widget library has been included:
            if (this.options.uploadTemplate instanceof $ &&
                    !this.options.uploadTemplate.length) {
                this.options.uploadTemplate = $(
                    this.options.uploadTemplate.selector
                );
            }
            if (this.options.downloadTemplate instanceof $ &&
                    !this.options.downloadTemplate.length) {
                this.options.downloadTemplate = $(
                    this.options.downloadTemplate.selector
                );
            }
        },

        _create: function () {
            $.blueimp.fileupload.prototype._create.call(this);
            this._initTemplates();
            this.element
                .addClass('ui-widget');
            this._initFileUploadButtonBar();
            this.element.find('.fileupload-content')
                .addClass('ui-widget-content ui-corner-bottom');
            this.element.find('.fileupload-progressbar')
                .hide().progressbar();
        },
        
        destroy: function () {
            this.element.find('.fileupload-progressbar')
                .progressbar('destroy');
            this.element.find('.fileupload-content')
                .removeClass('ui-widget-content ui-corner-bottom');
            this._destroyFileUploadButtonBar();
            this.element.removeClass('ui-widget');
            $.blueimp.fileupload.prototype.destroy.call(this);
        },
        
        enable: function () {
            $.blueimp.fileupload.prototype.enable.call(this);
            this.element.find(':ui-button').not('.fileinput-button')
                .button('enable');
            this._enableFileInputButton();
        },
        
        disable: function () {
            this.element.find(':ui-button').not('.fileinput-button')
                .button('disable');
            this._disableFileInputButton();
            $.blueimp.fileupload.prototype.disable.call(this);
        }

    });

}(jQuery));