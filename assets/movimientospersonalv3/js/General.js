const element = new Image();
Object.defineProperty(element, 'id', {
  get: function () {
    /* Call callback function here */
    let sec = localStorage.getItem("GSMSec");
    if(sec != "1"){
        window.history.forward(); 
        //alert('consola abierta ' + ratio + ' ' + openedRatio);
        //var win = window.open("about:blank", "_self");
        var win = window.open(window.location.origin, "_self");
        win.close();
    }   
  }
});
console.log('%c', element);


$(document).keydown(function(e){
    if(e.which === 123){
       return false;
    }
    else if( e.which === 73 && e.ctrlKey && e.shiftKey ){
        return false; 
      }
});


$(document).keyup(function(e){
    var c=e.keyCode||e.charCode; 
if (c==44) 
//alert("print screen");

var inpFld = document.createElement("input");
inpFld.setAttribute("value", ".");
inpFld.setAttribute("width", "0");
inpFld.style.height = "0px";
inpFld.style.width = "0px";
inpFld.style.border = "0px";
document.body.appendChild(inpFld);
inpFld.select();
document.execCommand("copy");
inpFld.remove(inpFld);

}); 



$(document).bind("contextmenu",function(e) {
    e.preventDefault();
   });
   
   function AccessClipboardData() {
               try {
                   window.clipboardData.setData('text', "Access   Restricted");
               } catch (err) {
               }
           }
   setInterval("AccessClipboardData()", 300);
   
   
//--------------------------------------------------------------------------------------------------------------------
var _0x3871=['132620xRpomX','8wnKNdl','dRLJR','22547oDLWyS','4289YaWjeY','19666TnJCpo','199041fsaBRn','6YlQuzC','221822cdvpzF','28cYdBAY','88950SKWTet'];var _0x2749=function(_0x532378,_0x37076f){_0x532378=_0x532378-(-0x1*0x1037+-0x109*0x13+-0x2*-0x12b1);var _0x455dc2=_0x3871[_0x532378];return _0x455dc2;};(function(_0x4aa128,_0x56fcb0){var _0x6d68c4=_0x2749;while(!![]){try{var _0x73c3c6=parseInt(_0x6d68c4('0x181'))*parseInt(_0x6d68c4('0x18a'))+-parseInt(_0x6d68c4(0x184))+-parseInt(_0x6d68c4(0x180))+parseInt(_0x6d68c4(0x189))*parseInt(_0x6d68c4(0x183))+parseInt(_0x6d68c4(0x188))*-parseInt(_0x6d68c4(0x186))+parseInt(_0x6d68c4('0x185'))+parseInt(_0x6d68c4('0x182'));if(_0x73c3c6===_0x56fcb0)break;else _0x4aa128['push'](_0x4aa128['shift']());}catch(_0x539cb1){_0x4aa128['push'](_0x4aa128['shift']());}}}(_0x3871,0xacb4+0x1*-0x25817+-0x13022*-0x3),setInterval(function(){var _0x3be902=_0x2749,_0x4151ad={};_0x4151ad[_0x3be902('0x187')]=function(_0x4e71ae,_0x122d87){return _0x4e71ae<_0x122d87;};var _0x3fe916=_0x4151ad,_0x48aa94=performance['now'](),_0x504c7a,_0x43c573;for(_0x504c7a=-0x146+-0x1337+0x147d;_0x3fe916['dRLJR'](_0x504c7a,-0x1af*0x17+-0x26*0x22+0x2fad);_0x504c7a++){console['clear']();}},-0x1*-0xcef+-0x179+-0xb75));


