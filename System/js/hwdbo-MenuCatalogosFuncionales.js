$(document).ready(function () {
    mostrarCargador();
    
    //sessionStorage.clear();
    
    //GuardaHash();
    
    //setToken();

    let url = new URL(location.href);
    let _IdRef = url.searchParams.get("id");
    if(_IdRef!=null)
    {
        Nuevo();
    }

    $('.class-inicio').click((event) => {
        window.location.href = '../MovimientosPersonalV3.1/MenuPrincipal.html?siteCode=' + getHSH();
    });

});

function Nuevo()
{
    $("#jqxtabs").jqxTabs('enableAt', 1); 
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo'); 
    limpiaCampos();
    $("#jqxtabs").jqxTabs('select',1);
}