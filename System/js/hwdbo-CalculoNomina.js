var idpagina = $.now();
$.globalEval('var detalle' + idpagina + '="";');
$.globalEval('var interval_lista' + idpagina + ';');

$(document).ready(function () {
    
    mostrarCargador();
    
    $.jqx.theme = "light";
    
    $(".hwdbo-combo").jqxDropDownList({ theme:'fresh', width: '100%', height: '30px', placeHolder: "-- Seleccione --", filterable: true, filterPlaceHolder: "Buscar...", searchMode: "containsignorecase", disabled: false, checkboxes: false, openDelay: 0, animationType: 'none' }); 
    
    $('.class-inicio').click((event) => {
        let sitio=$(event.currentTarget).data('modulo');
        window.location.href = sitio + '.html?siteCode=' + getHSH();
    });

    //OBTENER COMBOS NOMINA
    ComboGrupoEmpresarial("grupoempresarial");

    $("#grupoempresarial").on('change',function(event){
        mostrarCargador();
        $(".ge").jqxDropDownList('clear');
        Combos($(this).val().toString(),"","","","clasificacion");
    });

    $("#clasificacion").on("change",function(event){
        mostrarCargador();
        $(".cl").jqxDropDownList('clear');
        Combos($("#grupoempresarial").val().toString(),$(this).val().toString(),"","","periodicidad");
    });

    $("#periodicidad").on('change',function(event){
        mostrarCargador();
        $(".per").jqxDropDownList('clear');
        Combos($("#grupoempresarial").val().toString(),$("#clasificacion").val().toString(),$(this).val().toString(),"","perfil");
    });

    $("#perfil").on('change',function(event){
        Combos($("#grupoempresarial").val().toString(),$("#clasificacion").val().toString(),$("#periodicidad").val().toString(),$(this).val().toString(),"periodo");
        setTimeout(ocultarCargador,1500);
    });

    //REVISAR PROCESOS EN EJECUCIÓN
    RevisaProcesos();

});

async function RevisaProcesos() //INTERVALO LISTADO TARJETA
{
    var obj = new Object();
    obj.API="2CE1D0D58A8DAFEE9186E7BBEAD813BB08D38E5A8EF17CE0A5A130ECA6724418";
    obj.Parameters="";
    obj.JsonString="";
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res)
        {
            ListaProcesos(res).then(r=>{       
                function listado()
                {
                    RefreshProcesos(res);                
                }
                console.log('Inicia intervalo principal');
                eval('interval_lista' + idpagina + ' = setInterval(listado, 5000);');                
            });
        }
        else
        {
            NuevoCalculo();
        }
        ocultarCargador();
    }).fail(function()
    {
        console.log('Nuevo cálculo');
        NuevoCalculo();
        ocultarCargador();
    });

}

async function ListaProcesos(proc)
{
    $("#divContenedorInterno").html('');

    $.each(proc,function(i,row){
        let idProc=row.Id_ControlProcesoCalculo;
        var json = new Object();
        json.idcontrolprocesocalculo=idProc.toString();

        var obj = new Object();
        obj.API="8DC2A7CC3D68DED65E7DCC1538938CE52D16B989B1ED103661429D82E287FF6E";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(json);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        $.when(ajaxTokenFijo(obj)).done(function (res) {
           PintaTarjeta(res[0],idProc,i);           
        });
    });   
}

async function RefreshProcesos(proc)
{
    let acordeon=$(".accordion-item");
    let numero=0;
    $.each(acordeon,function(i,item){
        numero+=Number($("#Numerito_"+ acordeon[i].id.split('accordeonItem')[1]).text().split('%')[0]);
    });

    let porcentaje=numero/acordeon.length;
    if(porcentaje>=100.00)
    {
        console.log("Parar intervalo principal");
        $.globalEval('clearTimeout(interval_lista' + idpagina + ');');
        $.globalEval('clearInterval(interval_lista' + idpagina + ');');
        return false;
    }
    else
    {
        $.each(proc,function(i,row){
            let idProc=row.Id_ControlProcesoCalculo;
            var json = new Object();
            json.idcontrolprocesocalculo=idProc.toString();

            var obj = new Object();
            obj.API="8DC2A7CC3D68DED65E7DCC1538938CE52D16B989B1ED103661429D82E287FF6E";
            obj.Parameters="";
            obj.JsonString=JSON.stringify(json);
            obj.Hash= getHSH();
            obj.Bearer= getToken();

            $.when(ajaxTokenFijo(obj)).done(function (res) {
                RefrescaTarjeta(res[0],idProc);           
            });
        });
    }
}

//Muestra HTML de tarjeta de cálculo
async function PintaTarjeta(proc,idproc,idacordeon)
{
    var card='<div class="accordion" id="accordion'+idacordeon+'" style="border-radius:1.5em;">';
    card+="<div class=\"accordion-item\" id=\"accordeonItem"+idproc+"\" style=\"margin-bottom:1%;border-radius:1.5em\">";
    card+="<h2 class=\"accordion-header\" id=\"heading"+idproc+"\" style=\"margin-top:-0.1%\">";
    card+="<button id=\"Btnheading"+idproc+"\" onclick=\"PintaDetalles(this,"+idproc+");\" style=\"height:125px;border-radius:1.5em;\" class=\"accordion-button collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse"+idproc+"\" aria-expanded=\"true\" aria-controls=\"collapse"+idproc+"\">";
    card+="<div class=\"row\" style=\"width:100%;margin-top:1%;\">";
    card+="<div class=\"col-sm-1\">";
    let src1="";
    if(proc.Estatus=="Terminado")
    {
        src1="../assets/images/iconos_web/engranes2.png";
    }
    else
    {
        src1="../assets/images/iconos_web/engranes2.gif";
    }
    card+="<img id=\"ImagenEngrane_"+idproc+"\" src=\""+src1+"\" style=\"width:140px;margin-right:2.5%;margin-top:-10%\" />";
    card+="</div>";
    card+="<div class=\"col-sm-2\" style=\"font-size:small;margin-left:4.5%\">";
    card+="<dl>";                                           
    card+="<dt>Descripción:</dt>";
    card+="<dd id=\"Descripcion_"+idproc+"\">"+proc.Descripcion+"</dd>";
    card+="<dt>Estatus:</dt>";
    card+="<dd id=\"Estatus_"+idproc+"\">"+proc.Estatus+"</dd>";
    card+="</dl>";
    card+="<div class=\"progress\" style=\"width:455%;position:absolute\">";
    card+="<div id=\"Barra_"+idproc+"\" class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\""+proc.Avance+"\" aria-valuemin=\"0\" aria-valuemax=\""+proc.Avance+"\" style=\"width:"+proc.Avance+"%\"><label style=\"color:#fff\" id=\"Numerito_"+idproc+"\">"+proc.Avance+"%</label></div>";
    card+="</div>";
    card+="</div>";
    card+="<div class=\"col-sm-3\" style=\"font-size:small;\">";
    card+="<dl>";                                          
    card+="<dt>Perfil calendario:</dt>";
    card+="<dd id=\"Perfil_"+idproc+"\">"+proc.NombrePerfil+"</dd>";
    card+="<dt>Periodo:</dt>";
    card+="<dd id=\"Periodo_"+idproc+"\">"+proc.Periodo+"</dd>";
    card+="</dl>";
    card+="</div>";
    card+="<div class=\"col-sm-2\" style=\"font-size:small;\">";
    card+="<dl>";                                          
    card+="<dt>Inicio cálculo:</dt>";
    card+="<dd id=\"FechaIni_"+idproc+"\">"+proc.Fecha_Inicio+"</dd>";
    card+="<dt>Fin cálculo:</dt>";
    card+="<dd id=\"FechaFin_"+idproc+"\">"+proc.Fecha_Fin+"</dd>";
    card+="</dl>";
    card+="</div>";
    card+="<div class=\"col-sm-2\">";
    card+="<h2><span style=\"font-size:large;margin-top:5%\" class=\"badge rounded-pill bg-primary\">Proceso "+idproc+"</span></h2>";
    card+="</div>";
    card+="<div class=\"col-sm-1\">";
    let src="";
    if(proc.Estatus=="Terminado")
    {
        src="../assets/images/iconos_web/checked2.gif";
    }
    else
    {
        src="";
    }
    card+="<img id=\"Imagen_"+idproc+"\" src=\""+src+"\" style=\"width: 60px;margin-top:10%;margin-right:50%\">";
    card+="</div>";
    card+="</div>";
    card+="</button>";
    card+="</h2>";
    card+="<div id=\"collapse"+idproc+"\" class=\"accordion-collapse collapse\" aria-labelledby=\"heading"+idproc+"\" data-bs-parent=\"#accordion"+idacordeon+"\">";
    card+="<div class=\"accordion-body\" style=\"overflow-y: auto;\">";
    card+="<div id=\"DivDetalleCard_"+idproc+"\">";
    card+="</div>";
    card+="</div>";
    card+="</div>";
    card+="</div>";
    card+="</div>";

    $("#divContenedorInterno").append(card);
}

//Muestra HTML de detalle por tarjeta - INTERVALO DETALLE
async function PintaDetalles(elem,idproc)
{
    if($("#" + elem.id).hasClass('collapsed')==false)
    {
        //INICIAR INTERVALO DE DETALLE
        console.log("Iniciar intervalo "+ idproc);
        mostrarCargador();
        $.globalEval('var intervalDetalle' + idproc +'_'+ idpagina + ';');
        function detalles()
        {
            RefrescaDetalles(idproc);
        }
        eval('intervalDetalle' + idproc + '_' + idpagina + ' = setInterval(detalles, 8000);');
        
        var json = new Object();
        json.idcontrolprocesocalculo=idproc.toString();

        var obj = new Object();
        obj.API="42126BEEC27EFFFFFACFE3C2C9566AD953FABC34613CE7774444152301F20B31";
        obj.Parameters="";
        obj.JsonString=JSON.stringify(json);
        obj.Hash= getHSH();
        obj.Bearer= getToken();

        var card="<div class=\"container\" style=\"height:30%\">";

        $.when(ajaxTokenFijo(obj)).done(function (res) {
            $.each(res,function(i,row){
                card+="<div class=\"card cardCalculo\">";  
                card+="<div class=\"card-body\">";               
                card+="<div class=\"col-sm-1\" style=\"text-align:center;\">";
                card+="<button style=\"margin-right:25%\" class=\"btn btn-primary btn-sm\">"+row.Orden+"</button>";
                if(row.Estatus=="Terminado")
                {
                    card+="<img src=\"../assets/images/iconos_web/engranes1.png\" style=\"width: 65%;margin-right:-55%;margin-top:-10%\">";
                }
                else
                {
                    card+="<img src=\"../assets/images/iconos_web/engranes1.gif\" style=\"width: 65%;margin-right:-55%;margin-top:-10%\">";
                }
                card+="</div>";
                card+="<div class=\"col-sm-8\" style=\"margin-left:3%;width:72.8%\"><h6 class=\"card-title\"> "+row.Descripcion+"</h6>";
                card+="<div class=\"progress\" style=\"position:relative\">";
                card+="<div id=\"Barra_"+row.Orden+"_"+idproc+"\" class=\"progress-bar progress-bar-striped bg-primary progress-bar-animated\" role=\"progressbar\" aria-valuenow=\""+row.AvanceProceso+"\" aria-valuemin=\"0\" aria-valuemax=\""+row.AvanceProceso+"\" style=\"width: "+row.AvanceProceso+"%\"><label style=\"color:#fff\" id=\"Numerito_"+row.Orden+"_"+idproc+"\">"+row.AvanceProceso+"%</label></div>";
                card+="</div>";
                card+="</div>";
                card+="<div class=\"col-sm-1\" style=\"text-align:center\">";
                if(row.Estatus=="Terminado")
                {
                    card+="<img id=\"palomita_"+row.Orden+"_"+idproc+"\" src=\"../assets/images/iconos_web/checked2.gif\" style=\"width: 33%;margin-left:66%;margin-top:-4%\">";
                }
                else
                {
                    card+="<img id=\"palomita_"+row.Orden+"_"+idproc+"\" src=\"\" style=\"width: 33%;margin-left:80%;margin-top:4%\">";
                }
                card+="</div>";
                card+="</div>";
                card+="</div>";
                
            });
            card+="</div>";
            $("#DivDetalleCard_"+idproc).html(card);
            ocultarCargador();
        }).fail(function(){
            console.log("Ocurrió un error al obtener detalle de cálculo");
            card+="</div>";
            $("#DivDetalleCard_"+idproc).html(card);
            ocultarCargador();
        }); 
    }
    else
    {
        //QUITAR INTERVALO DE DETALLE
        console.log("Quitar intervalo " + idproc);
        $.globalEval('clearTimeout(intervalDetalle' + idproc + '_' + idpagina + ');');
        $.globalEval('clearInterval(intervalDetalle' + idproc + '_' + idpagina + ');');
    }  
}

async function RefrescaTarjeta(proc,idproc)
{
    $("#Descripcion_"+idproc).text(proc.Descripcion);
    $("#Estatus_"+idproc).text(proc.Estatus);
    $("#FechaIni_"+idproc).text(proc.Fecha_Inicio);
    $("#Perfil_"+idproc).text(proc.NombrePerfil);
    $("#Periodo_"+idproc).text(proc.Periodo);
    $("#FechaFin_"+idproc).text(proc.Fecha_Fin);
    let srcimagen1="../assets/images/iconos_web/checked2.gif";
    let srcimagen3="../assets/images/iconos_web/engranes2.gif";
    let srcimagen4="../assets/images/iconos_web/engranes2.png";
    if(proc.Estatus=="Terminado")
    {
        $("#Imagen_"+idproc).prop('src',srcimagen1);
        $("#ImagenEngrane_"+idproc).prop('src',srcimagen4);       
    }
    else
    {
        $("#Imagen_"+idproc).prop('src','');
        $("#ImagenEngrane_"+idproc).prop('src',srcimagen3);
    }
    $("#Barra_"+idproc).prop('aria-valuenow',proc.Avance);
    $("#Barra_"+idproc).prop('aria-valuemax',proc.Avance);
    $("#Barra_"+idproc).css('width',proc.Avance+'%');
    $("#Numerito_"+idproc).text(proc.Avance+'%');  
}

async function RefrescaDetalles(idproc)
{
    var json = new Object();
    json.idcontrolprocesocalculo=idproc.toString();

    var obj = new Object();
    obj.API="42126BEEC27EFFFFFACFE3C2C9566AD953FABC34613CE7774444152301F20B31";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        $.each(res,function(i,row)
        {
            if(row.Estatus=="Terminado")
            {
                $("#palomita_"+row.Orden+"_"+idproc).prop('src','../assets/images/iconos_web/checked2.gif');
            }
            else
            {
                $("#palomita_"+row.Orden+"_"+idproc).prop('src','');
            }
            $("#Barra_"+row.Orden+"_"+idproc).prop('aria-valuenow',row.AvanceProceso);
            $("#Barra_"+row.Orden+"_"+idproc).prop('aria-valuemax',row.AvanceProceso);
            $("#Barra_"+row.Orden+"_"+idproc).css('width',row.AvanceProceso+'%');
            $("#Numerito_"+row.Orden+"_"+idproc).text(row.AvanceProceso+'%');
        });
    });
}

//Muestra el offcanvas con los combos para enviar a cálculo
function NuevoCalculo()
{
    $("#grupoempresarial").jqxDropDownList('clearSelection');
    $("#clasificacion").jqxDropDownList('clear');
    $(".ge").jqxDropDownList('clear');
    $("#offcanvasCalculo").offcanvas('show');
}

function ComboGrupoEmpresarial(nomcombo)
{
    var json = new Object();
    json.idgrupoempresarial="";
    json.idtipoperiodo="";
    json.combo="ge";

    var obj = new Object();
    obj.API="D224731C77DD6C795164F99E05E2548D1A83ED2607E29D6B92643D15FA72CEAB";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res.length>0)
        {
            var dataAdapter = new $.jqx.dataAdapter(res);

            $("#"+nomcombo).jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });
        }
        else
        {
            $("#"+nomcombo).jqxDropDownList('clear');
        }
    }).fail(function(){ 
        $("#" + nomcombo).jqxDropDownList('clear');
    });
}

async function Combos(grupo,clasficacion,perfilcal,perfilproc,nomcombo)
{
    var json = new Object();
    json.idgrupoempresarial=grupo;
    json.idclasificacionnomina=clasficacion;
    json.idperfilcalendario=perfilcal;
    json.idperfilprocesos=perfilproc;

    var obj = new Object();
    obj.API="A165B9DBBE5A283A6FE4FD378149C4A3741C9E27B080BA0450F7F6138EC66CB4";
    obj.Parameters="";
    obj.JsonString=JSON.stringify(json);
    obj.Hash= getHSH();
    obj.Bearer= getToken();

    $.when(ajaxTokenFijo(obj)).done(function (res) {
        if(res.length>0)
        {
            var dataAdapter = new $.jqx.dataAdapter(res);

            $("#"+nomcombo).jqxDropDownList({
                source: dataAdapter,
                displayMember: "Descripcion",
                valueMember: "Valor",
                placeHolder:"--Seleccione--"                
            });
            setTimeout(function() { 
                $("#" + nomcombo + "").jqxDropDownList('selectItem', res[0].Valor);
                $("#" + nomcombo + "").trigger('change');
            },500);
        }
        else
        {
            $("#"+nomcombo).jqxDropDownList('clear');
        }
    }).fail(function(){ 
        $("#" + nomcombo).jqxDropDownList('clear');
        ocultarCargador();
    });
}

function Enviar()
{
    if($("#grupoempresarial").val()=="")
    {
        showMsg("Mensaje","Por favor seleccione grupo empresarial");
    }
    else
    {
        if($("#clasificacion").val()=="")
        {
            showMsg("Mensaje","Por favor seleccione clasificación nómina");
        }
        else
        {
            if($("#periodicidad").val()=="")
            {
                showMsg("Mensaje","Por favor seleccione perfil calendario");
            }
            else
            {
                if($("#perfil").val()=="")
                {
                    showMsg("Mensaje","Por favor seleccione perfil cálculo");
                }
                else
                {
                    if($("#periodo").val()=="")
                    {
                        showMsg("Mensaje","Por favor seleccione periodo nómina");
                    }
                    else
                    {
                        //CREAR PROCESO DE CÁLCULO
                        let k =$("#periodo").jqxDropDownList('getSelectedItem'); 

                        var json = new Object();
                        json.idgrupocalculo=k.originalItem.Id_GrupoCalculo.toString();
                        json.usuario="usuario@harwebdbo.mx";
                        json.idperfilproceso=$("#perfil").val().toString();
                        json.idcontrolnomina=k.originalItem.Valor.toString();

                        var obj = new Object();
                        obj.API="834231C325B5EE5F5DE7E9E4C1BA3139D34AE2114233E6DA3FBF1EBF0A036471";
                        obj.Parameters="";
                        obj.JsonString=JSON.stringify(json);
                        obj.Hash= getHSH();
                        obj.Bearer= getToken();

                        $.when(ajaxTokenFijo(obj)).done(function (res) {
                            if(res.length>0)
                            {
                                $("#offcanvasCalculo").offcanvas('hide');
                                RevisaProcesos();
                            }
                            else
                            {
                                showMsg("Mensaje","Ocurrió un error al enviar cálculo");
                            }
                        }).fail(function(){ 
                            showMsg("Error","Ocurrió un error al crear proceso de cálculo");
                        });
                    }
                }
            }
        }
    }
}