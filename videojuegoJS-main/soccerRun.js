window.onload = function() { 

	const TOPEIZQUIERDA = 0;
	const TOPEDERECHA = 577;
	const TOPEABAJO   = 360;

	const NUMEROOBSTACULOS = 5;
	const TAMAÑOOBSTACULOX= 25;
	const TAMAÑOOBSTACULOY = 25;
	
	let x=100;     
	let y=350;   
	let canvas;  
	let ctx;     
	let id;      
	
	let xIzquierda, xDerecha, yUp, yDown;
	
	let inicial = 0;
	let posicion=0;                                        
	let cambio=0;                                          
		
	let miFutbolista;
	let imagen;

	let todosLosObstaculos = [];
    let miObstaculo;
	
	/* let audioTope; */
	
	function Futbolista (x_, y_) {
	
	  this.x = x_;
	  this.y = y_;
		this.animacionFutbolista = [
			[0, 210], [54, 210],   // Derecha
			[0, 90], [51, 90], // Izquierda
			[0, 195], [32, 195], // Arriba
			[0, 260], [32, 260]  // Abajo
		];
	  this.velocidad = 1.4;
	  this.tamañoX   = 23;
	  this.tamañoY   = 40;	  
	
	}

	function Obstaculos(x_2,y_2, velocidad_2) {
	
		this.x = x_2;
		this.y = y_2;
		this.velocidad = velocidad_2;
		this.haAcabado = false;
		
	}

	Obstaculos.prototype.pintarObstaculos =  function(){
		ctx.fillRect(this.x, 
			this.y, 
			TAMAÑOOBSTACULOX, 
			TAMAÑOOBSTACULOY);
	}

	Obstaculos.prototype.moverObstaculo = function(){

		this.x = this.x - this.velocidad;
		
		if (this.x <= TOPEIZQUIERDA) this.x = TOPEIZQUIERDA;
		this.haAcabado = true;	

	}
	
	function generaDatosObstaculos() {

		for (let i=0; i<NUMEROOBSTACULOS; i++) {
			
			y = Math.random() * TOPEABAJO;
			
			velocidad = 0.5 + Math.random()*2;
			
			miObstaculo = new Obstaculos(TOPEDERECHA, y, velocidad);
			
			todosLosObstaculos.push(miObstaculo); 
		}
		console.table(todosLosObstaculos);
	}

	function todasLosObstaculosHanAcabado() {
	
		let hanAcabado = true;
		
		hanAcabado = todosLosObstaculos.every(hanAcabadoTodos);
	
		return (hanAcabado);
	}

	function generaAnimaciónObstaculos() {
	
		ctx.clearRect(0, 0, 600, 400);
	
		ctx.fillStyle = "#FF0000";
		
		for (let i=0; i<NUMEROOBSTACULOS;i++) {
			  
			   todosLosObstaculos[i].pintarObstaculos();
			   
			   // Compruebo los límites
			   if (todosLosObstaculos[i].x >TOPEIZQUIERDA) { 
						
						todosLosObstaculos[i].moverObstaculo();
			   } else todosLosObstaculos[i].haAcabado = true; //Ha llegado al final, le indico que he acabado
		}
		
		if (todasLosObstaculosHanAcabado()) {
			console.log("cierro animación"); 
			clearInterval(id);
		}

	}
	
	
	/* function reproducirAudio() {

		audioTope.currentTime = 0;
		audioTope.play();
	
	}	*/
	
	Futbolista.prototype.generaPosicionDerecha = function() {

		this.x = this.x + this.velocidad;
		
		if (this.x > TOPEDERECHA) {
			
			this.x = TOPEDERECHA;   
			/* reproducirAudio(); */	
		}		

	}
	

	Futbolista.prototype.generaPosicionIzquierda = function() {
		
		this.x = this.x - this.velocidad;

		if (this.x < 0) {
			
			this.x = 0;	   
			/* reproducirAudio();	*/
		}

	}
	
	Futbolista.prototype.generaPosicionArriba = function() {
		
		this.y = this.y - this.velocidad;

		if (this.y < 0) {
			
			this.y = 0;	
			/* reproducirAudio();	*/
		}
	}	
	
	
	Futbolista.prototype.generaPosicionAbajo = function() {
		
		this.y = this.y + this.velocidad;

		if (this.y > TOPEABAJO) {
			
			this.y = TOPEABAJO;
			/* reproducirAudio(); */	
		}
	}	
	
	
	function pintaFutbolista() {
		
		ctx.clearRect(0, 0, 600, 400);
		
		if (xDerecha) {
			
			miFutbolista.generaPosicionDerecha();	   
		}
		
		if (xIzquierda)  {
			
			miFutbolista.generaPosicionIzquierda();
		}	  
		
		if (yUp)  {
			
			miFutbolista.generaPosicionArriba();
		}
		
		if (yDown)  {
			
			miFutbolista.generaPosicionAbajo();
		}
					  
		ctx.drawImage(miFutbolista.imagen,
					  miFutbolista.animacionFutbolista[posicion][0],   
					  miFutbolista.animacionFutbolista[posicion][1],	
					  miFutbolista.tamañoX, 		 
					  miFutbolista.tamañoY,	     
					  miFutbolista.x,     
					  miFutbolista.y,	 
					  miFutbolista.tamañoX,		 
					  miFutbolista.tamañoY);     
	}
	
	function alternarAnimacionMovimiento() {
		
		if (xDerecha)   inicial = 0;
		if (xIzquierda) inicial = 2;
		/* if (yUp) inicial = 4;
		if (yDown) inicial = 6; */
		
		posicion = inicial + (posicion + 1) % 2;
	}
	
	function activaMovimiento(evt) {

        switch (evt.keyCode) {
		
			case 37: 
			  xIzquierda = true;
			  break;

			case 39:
			  xDerecha = true;
			  break;
		 	
			case 38:
			  yUp = true;
			  break;

			case 40:
			  yDown = true;
			  break;		 
		}
	}

	function desactivaMovimiento(evt){

        switch (evt.keyCode) {

			case 37: 
			  xIzquierda = false;
			  break;

			case 39:
			  xDerecha = false;
			  break;

			case 38:
			  yUp = false;
			  break;

			case 40:
			  yDown = false;
			  break;        		  
        }
	}	
	
	document.addEventListener("keydown", activaMovimiento, false);
	document.addEventListener("keyup", desactivaMovimiento, false);	

	canvas = document.getElementById("miCanvas");

	/* audioTope = document.getElementById("tope"); */

	ctx = canvas.getContext("2d");

	imagen = new Image();
	imagen.src="assets/sprite/Characters.png";
	Futbolista.prototype.imagen = imagen;

	miFutbolista = new Futbolista( x, y);		

	id= setInterval(pintaFutbolista, 1000/50);	
	id = setInterval(alternarAnimacionMovimiento, 1000/5);

	generaDatosObstaculos();
	id = setInterval(generaAnimaciónObstaculos, 1000/30);

}