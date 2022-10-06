
### Escuela Colombiana de Ingeniería
### Arquitecturas de Software - ARSW
## Laboratorio Construción de un cliente 'grueso' con un API REST, HTML5, Javascript y CSS3. Parte II.

### Dependencias:
* [Laboratorio API REST para la gestión de planos.](https://github.com/ARSW-ECI-beta/REST_API-JAVA-BLUEPRINTS_PART2)
* [Laboratorio construción de un cliente ‘grueso’ con un API REST, HTML5, Javascript y CSS3. Parte I](https://github.com/ARSW-ECI-beta/REST_CLIENT-HTML5_JAVASCRIPT_CSS3_GRADLE-BLUEPRINTS_PART1)

### Descripción 
Este laboratorio tiene como fin, actualizar en Front para que se pueda comunicar con los servicios del REST API desarrollado anteriormente
### Parte I

![](img/mock2.png)

1. Agregue al canvas de la página un manejador de eventos que permita capturar los 'clicks' realizados, bien sea a través del mouse, o a través de una pantalla táctil. Para esto, tenga en cuenta [este ejemplo de uso de los eventos de tipo 'PointerEvent'](https://mobiforge.com/design-development/html5-pointer-events-api-combining-touch-mouse-and-pen) (aún no soportado por todos los navegadores) para este fin. Recuerde que a diferencia del ejemplo anterior (donde el código JS está incrustado en la vista), se espera tener la inicialización de los manejadores de eventos correctamente modularizado, tal [como se muestra en este codepen](https://codepen.io/hcadavid/pen/BwWbrw).

	Se crea el siguiente metodo para detectar cualquier evento clic sobre el canvas
	
	```js
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
	```
	
	Además se crea este otro metodo para detectar la ubicació del mouse
	
	```js
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
	```

2. Agregue lo que haga falta en sus módulos para que cuando se capturen nuevos puntos en el canvas abierto (si no se ha seleccionado un canvas NO se debe hacer nada):
	1. Se agregue el punto al final de la secuencia de puntos del canvas actual (sólo en la memoria de la aplicación, AÚN NO EN EL API!).
	2. Se repinte el dibujo.

	```js
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
	```

3. Agregue el botón Save/Update. Respetando la arquitectura de módulos actual del cliente, haga que al oprimirse el botón:
	1. Se haga PUT al API, con el plano actualizado, en su recurso REST correspondiente.	
	3. Se haga GET al recurso /blueprints, para obtener de nuevo todos los planos realizados.
	4. Se calculen nuevamente los puntos totales del usuario.

	Para lo anterior tenga en cuenta:

	* jQuery no tiene funciones para peticiones PUT o DELETE, por lo que es necesario 'configurarlas' manualmente a través de su API para AJAX. Por ejemplo, para hacer una peticion PUT a un recurso /myrecurso:
	
	```javascript
    return $.ajax({
        url: "/mirecurso",
        type: 'PUT',
        data: '{"prop1":1000,"prop2":"papas"}',
        contentType: "application/json"
    });
    
	```
	
	Para éste note que la propiedad 'data' del objeto enviado a $.ajax debe ser un objeto jSON (en formato de texto). Si el dato que quiere enviar es un objeto JavaScript, puede convertirlo a jSON con: 
	
	```javascript
	JSON.stringify(objetojavascript),
	```
	* Como en este caso se tienen tres operaciones basadas en _callbacks_, y que las mismas requieren realizarse en un orden específico, tenga en cuenta cómo usar las promesas de JavaScript [mediante alguno de los ejemplos disponibles](http://codepen.io/hcadavid/pen/jrwdgK).
	
	El siguiente metodo sera quien controle  la funcion al oprimir el boton "save/update" , quien primero enviara a ```saveBlueprint()```  y luego a ```putBlueprints()``` con valores como el author del plano, el nombre del plano, los puntos del plano y la función funcmodify intrinscica para que al finalizar el evento consulte y actualice nuevamente
	```js
	savePlan: function() {
		author = document.getElementById("autor").value;
		saveBlueprint();
		console.log(blueprintAct);
		api.putBlueprints(author,obra,blueprintAct,_funcModify);
	}
	```
	
	Se crea el siguiente metodo en el cual los nuevos puntos que se encuentran almacenados en memoria, se juntan en una sola varibale con los viejos que estan guardados también en memoria en el momento
	
	```js
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
    };
	```
	
	Ahora creamos este metodo javascript para realizar la peticion PUT al API enviando una cadena json que contendra la informacion del plano y que tras terminar ejecuatra el metodo getBlueprintsByAuthor para actualliar nuevamente los datos en pantalla
	
	```js
	putBlueprints:function(autor,obra,blueprintAct,callback){
		$.ajax({
			url: url+"/"+autor+"/"+obra,
			type: 'PUT',
			data: JSON.stringify(blueprintAct),
			contentType: "application/json"
		}).then((responseJSON)=>apiclient.getBlueprintsByAuthor(autor,callback))
	}
	```	

4. Agregue el botón 'Create new blueprint', de manera que cuando se oprima: 
	* Se borre el canvas actual.
	* Se solicite el nombre del nuevo 'blueprint' (usted decide la manera de hacerlo).
	
	Esta opción debe cambiar la manera como funciona la opción 'save/update', pues en este caso, al oprimirse la primera vez debe (igualmente, usando promesas):

	1. Hacer POST al recurso /blueprints, para crear el nuevo plano.
	2. Hacer GET a este mismo recurso, para actualizar el listado de planos y el puntaje del usuario.


	A continuación vemos el metodo que va a dejar en blanco el canvas
	
	```js
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
	```
	
	Ahora a continuación observamos la función que se desplegara al hacer clic en el boton "Create new blueprint" el cual llamara el metodo para borrar el canvas, luego creara la cadeana final en la que se deben almacenar los datos, pone en blanco la memoria temporal del programa, activa la función del canvas de escuchar y ademas deja en blanco el valor del campo en donde se ingresa el nombre del nuevo plano y en caso de que no este visible lo cambia a estado visible
	
	```js
	newblueprint: function(){
		borrar();
		blueprintAct={"author":"","points":[],"name":""}
		memoriaTemporal = null;
		_funcListener();
		document.getElementById("blueprint").style.display ='block';
		document.getElementById("newblueprint").value = "";
	}
	```
	
	Después cambiamos la funcion savePlan y la dejamos del siguiente modo, sin importar si es update o save lo enviara al metodo saveBlueprint, pero dependiendo de la función que se quiera ejecutar enviara a la funcion prara realizar POST o PUT según corresponda y que si el campo del nombre del plano esta activo lo desactive
	
	```js
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
	}
	```
	
	Ahora en el metodo ```saveBlueprint```agregamos una condición en el cualsi se esta agregando un nuevo plano agregue el nombre del nuevo plano y del author a la cadena json
	
	```js
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
	```
	
	Finalmente se implementa el metodo POST que comunicara al API y que al igual que la petición PUT invocara el metodo ```getBlueprintsByAuthor()``` para actualizar los datos en pantalla
	
	```js
	postBlueprints:function(autor,blueprintAct,callback){
		$.ajax({
			url: url,
			type: 'POST',
			data: JSON.stringify(blueprintAct),
			contentType: "application/json"
		}).then((responseJSON)=>apiclient.getBlueprintsByAuthor(autor,callback))
	}
	```
	

5. Agregue el botón 'DELETE', de manera que (también con promesas):
	* Borre el canvas.
	* Haga DELETE del recurso correspondiente.
	* Haga GET de los planos ahora disponibles.

	Implementamos la funcion ```deleteBlueprints()``` que realizara la petición delete
	
	```js
	deleteBlueprints:function(autor,obra,callback){
            $.ajax({
                url: url+"/"+autor+"/"+obra,
                type: 'DELETE',
                contentType: "application/json"
            }).then((responseJSON)=>apiclient.getBlueprintsByAuthor(autor,callback))
        }
	```
	
	Después implementamos la función ```deleteBlueprints()``` la cual se ejecutara al oprimir el boton delete, que primero ejecutara el metodo ```borrar``` para dejar en blanco el canvas y posteriormente invocara la función ```deleteBlueprints()``` el cual ejecutara la petición delete, con el nombre del author y el nombre del plano
	
	```js
	deleteBlueprint: function(){
            borrar();
            api.deleteBlueprints(author,obra,_funcModify);
        }
	```
	
# Despliegue en Heroku

* Oprima el siguiente boton para ir al despliegue en heroku

[![](/img/deploy.PNG)](http://restclienthtml5javascriptcss32.herokuapp.com/)
	

