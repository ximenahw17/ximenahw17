$(document).ready(function () {
    mostrarCargador();
    
    localStorage.clear();
    
    GuardaHash();
    
    setToken();

    let url = new URL(location.href);
    let _IdRef = url.searchParams.get("id");
    if(_IdRef!=null)
    {
        Nuevo();
    }

});

function Nuevo()
{
    $("#jqxtabs").jqxTabs('enableAt', 1); 
    $("#jqxtabs").jqxTabs('setTitleAt',1,'Nuevo'); 
    limpiaCampos();
    $("#jqxtabs").jqxTabs('select',1);
}

function setToken()
{
    let hash = getHSH();
    var ObjDatos=new Object();
    ObjDatos.API="8AB5EF6347BBA9D2BED6252EEA0DD8995BBF09A3F0F36E3CA3BE7ED1B60B6A28";
    ObjDatos.Parameters="";
    ObjDatos.JsonString=JSON.stringify
    (
        {
            Email: "ximena.cerna@harwebdbo.mx",
            Hash: hash
        }
    );
    ObjDatos.Hash=hash;
    ObjDatos.Bearer=getToken();

    $.when(ajaxTokenFijo(ObjDatos)).done(function (response) {
        if(response!="")
        {
            localStorage.setItem('S0hEQk8=', response.access_token);
        }
        ocultarCargador();
    });
}