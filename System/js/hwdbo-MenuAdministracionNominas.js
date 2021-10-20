$(document).ready(function () {
    ocultarCargador();
    
    //sessionStorage.clear();
    
    //GuardaHash();
    
    //setToken();

    $('.class-inicio').click((event) => {
        window.location.href = '../MovimientosPersonalV3.1/MenuPrincipal.html?siteCode=' + getHSH();
    });

});

function Cancelar()
{
    mostrarUpCargador();
    setTimeout(function(){
        $.when(ajaxCatalogo(171,"&_Parameters=0")).done(function (response) {
            console.log(response);
            if(response)
            {
                if(response=="1")
                {
                    showMsg('Mensaje','Cálculos cancelados correctamente');
                }
            }
            ocultarUpCargador();
        }).fail(function(){
            ocultarUpCargador();
            showMsg('Mensaje','Ocurrió un error al cancelar cálculo');
        });
    },2000);
}