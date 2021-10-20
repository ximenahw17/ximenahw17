$(document).ready(function () {
    // create jqxMenu
    $("#jqxMenu").jqxMenu({ width: '100%', height: '32px', autoSizeMainItems: true });
    $("#jqxMenu").css('visibility', 'visible');

    $('#jqxMenu').on('itemclick', function (event) {
        // get the clicked LI element.
        var target = event.args.textContent;

        showPage(target);

    });
});


function showPage(namePage) {
    let toPage = namePage.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(' ', '') + '.html';
    $("#pageContent").load(toPage);
    //var $iframe = $('#iframePage');
    //$iframe.attr('src', toPage);
  
}