app= (function (){
    var obra="";
    var author="";
    var api = apiclient;
    var valorTotal = null;
    var blueprintAct = null;
    var arreglo = [];
    var lastxlist=null;
    var lastylist=null;
    var _funcModify = function (variable) {
        if(variable != null){
            arreglo = variable.map(function(blueprint){
                return {key:blueprint.name, value:blueprint.points.length}
            })
            $("#tabla tbody").empty();
            arreglo.map(function(blueprint){
                var temporal = '<tr><td id="nombreActor">'+blueprint.key+'</td><td id="puntos">'+blueprint.value+'</td><td class="open" type="button" id="open" onclick="app.drawPlan(\''+blueprint.key+'\'),app.funListener()">Open</td></tr>';

                $("#tabla tbody").append(temporal);
            })

             valorTotal = arreglo.reduce(function(valorAnterior, valorActual, indice, vector){
                return valorAnterior + valorActual.value;
             },0);
            document.getElementById("autorLabel").innerHTML = author;
            document.getElementById("puntosLabel").innerHTML = valorTotal;
        }
    };
    var _funcDraw = function (vari) {
        if (vari) {
            blueprintAct = vari;
            var lastx = null;
            var lasty = null;
            var actx = null;
            var acty = null;
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 450, 450);
            ctx.beginPath();
            ctx.fillStyle = "white";
            console.log(myCanvas.width)
            ctx.fillRect(0, 0, myCanvas.width , myCanvas.height);
            ctx.beginPath();
            vari.points.map(function (prue){
                if (lastx == null) {
                    lastx = prue.x;
                    lasty = prue.y;
                } else {
                    actx = prue.x;
                    acty = prue.y;
                    ctx.moveTo(lastx, lasty);
                    ctx.lineTo(actx, acty);
                    ctx.stroke();
                    lastx = actx;
                    lasty = acty;
                }
            });
            lastxlist = lastx;
            lastylist = lasty;
        }

    }
    var holi = 0;
    var memoriaTemporal = null;
    var _funcListener = function () {
        var actx = null;
        var acty = null;
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        memoriaTemporal = [];
        if( holi == 1 ){
            c.removeEventListener("click", fun, false);
            holi =0;
        }
        holi=holi+1;
        c.addEventListener("click", fun = function (evt) {
            mousePos = getMousePos(c, evt);
            var pareja = [mousePos.x,mousePos.y];
            memoriaTemporal.push(pareja);
            if (lastxlist == null) {
                lastxlist = mousePos.x;
                lastylist = mousePos.y;
            } else {
                actx = mousePos.x;
                acty = mousePos.y;
                ctx.moveTo(lastxlist, lastylist);
                ctx.lineTo(actx, acty);
                ctx.stroke();
                lastxlist = actx;
                lastylist = acty;
            }
        }, false);
    };
    var saveBlueprint = function () {
        var arregloS = [];
        console.log('a');
        blueprintAct.points.map(function (value) {
            arregloS.push(value);
            console.log('b');
        });
        memoriaTemporal.map( function (valor) {
            var x1=valor[0];
            var y1=valor[1];
            console.log(x1,y1);
            arregloS.push({x:x1,y:y1});

        });
        blueprintAct.points = arregloS;
        if(document.getElementById("blueprint").style.display=='block'){
            blueprintAct.author=document.getElementById("autor").value;
            blueprintAct.name=document.getElementById("newblueprint").value;
        }
    };

    var responseAll = null;
    var insertBlueprint=(function () {
    })
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return{
             x: evt.clientX - rect.left,
             y: evt.clientY - rect.top
        };
    }

    function borrar(){
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 450, 450);
        ctx.beginPath();
        ctx.fillStyle = "white";
        console.log(myCanvas.width)
        ctx.fillRect(0, 0, myCanvas.width , myCanvas.height);
        ctx.beginPath();
        lastxlist=null;
        lastylist=null;
    }

    return {
        plansAuthor: function () {
            author = document.getElementById("autor").value;
            api.getBlueprintsByAuthor(author,_funcModify);
            borrar();
            document.getElementById("blueprint").style.display='none';
        },
        drawPlan: function(name) {
            obra = name;
            api.getBlueprintsByNameAndAuthor(author,obra,_funcDraw);
            document.getElementById("blueprint").style.display='none';
        },
        savePlan: function() {
            author = document.getElementById("autor").value;
            saveBlueprint();
            console.log(blueprintAct);
            if(document.getElementById("blueprint").style.display=='none'){
                api.putBlueprints(author,obra,blueprintAct,_funcModify);
            }
            else{
                api.postBlueprints(author,blueprintAct,_funcModify);
            }
            document.getElementById("blueprint").style.display ='none';
        },
        newblueprint: function(){
            borrar();
            blueprintAct={"author":"","points":[],"name":""}
            memoriaTemporal = null;
            _funcListener();
            document.getElementById("blueprint").style.display ='block';
            document.getElementById("newblueprint").value = "";
        },
        deleteBlueprint: function(){
            borrar();
            api.deleteBlueprints(author,obra,_funcModify);
        },
        funListener: _funcListener
    };
})();
window.onload = function(){
    document.body.style.zoom = "100%";
    var myCanvas = document.getElementById("myCanvas");
    var ctx = myCanvas.getContext("2d");
    ctx.fillStyle = "white";
    console.log(myCanvas.width)
    ctx.fillRect(0, 0, myCanvas.width , myCanvas.height);
};