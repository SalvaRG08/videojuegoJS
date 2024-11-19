// ---------------------- SOCCER RUN GAME ---------------------- //

window.onload = function () {

    const TOPEIZQUIERDA = 0;
    const TOPEDERECHA = 577;
    const TOPEABAJO = 360;

    const NUMEROOBSTACULOS = 5;

    let x = 50;
    let y = 200;
    let canvas;
    let ctx;
    let boton;

    let xIzquierda, xDerecha, yUp, yDown;

    let posicion = 0;
    let inicial = 0;

    let miFutbolista;
    let imagenPersonaje;
    let imagenCampo;

    let todosLosObstaculos = [];

    // ---------------------- Iniciar variables ---------------------- //

        function iniciarVariables(){
            boton.disabled=true;

            canvas = document.getElementById("miCanvas");

            todosLosObstaculos = [];
        }
	// ---------------------- Objetos ---------------------- //

    function Futbolista(x_, y_) {
        this.x = x_;
        this.y = y_;
        this.animacionFutbolista = [
            [0, 210], [54, 210],
            [0, 90], [51, 90],
            [30, 210], [30, 210],
            [27, 90], [27, 90],
        ];
        this.velocidad = 2;
        this.tamañoX = 23;
        this.tamañoY = 40;
        this.vidas = 2;
    }

    function Obstaculos(x_2, y_2, velocidad_2) {
        this.x = x_2;
        this.y = y_2;
        this.velocidad = velocidad_2;
        this.haAcabado = false;
        this.tamañoX = 25;
        this.tamañoY = 25;
    }

    imagenCampo = new Image();
    imagenCampo.src = "assets/sprite/Pitch2.png";
    
	// ---------------------- Codigo futbolista ---------------------- //

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

        if (xDerecha) miFutbolista.generaPosicionDerecha();
        if (xIzquierda) miFutbolista.generaPosicionIzquierda();
        if (yUp) miFutbolista.generaPosicionArriba();
        if (yDown) miFutbolista.generaPosicionAbajo();

        ctx.drawImage(
            miFutbolista.imagenPersonaje,
            miFutbolista.animacionFutbolista[posicion][0],
            miFutbolista.animacionFutbolista[posicion][1],
            miFutbolista.tamañoX,
            miFutbolista.tamañoY,
            miFutbolista.x,
            miFutbolista.y,
            miFutbolista.tamañoX,
            miFutbolista.tamañoY
        );
    }

    function alternarAnimacionMovimiento() {
        if (xDerecha) {
            inicial = 0;
        } else if (xIzquierda) {
            inicial = 2;
        } else if (yUp || yDown) {
            inicial = (inicial == 4) ? 0 : (inicial == 6) ? 2 : inicial;
        } else if (!xDerecha && !xIzquierda && !yUp && !yDown) {
            inicial = (inicial == 0) ? 4 : (inicial == 2) ? 6 : inicial;
        }
    
        posicion = inicial + (posicion + 1) % 2;
    
    }

	// ---------------------- Codigo obstaculos ---------------------- //

    Obstaculos.prototype.pintarObstaculos = function () {
        ctx.fillRect(this.x, this.y, this.tamañoX, this.tamañoY);
    };

    Obstaculos.prototype.moverObstaculo = function () {
        this.x = this.x - this.velocidad;
        if (this.x <= TOPEIZQUIERDA) this.haAcabado = true;
    };

    function generaDatosObstaculos() {
        for (let i = 0; i < NUMEROOBSTACULOS; i++) {
            let y = Math.random() * TOPEABAJO;
            let velocidad = 0.5 + Math.random() * 2;
            let miObstaculo = new Obstaculos(TOPEDERECHA, y, velocidad);
            todosLosObstaculos.push(miObstaculo);
        }
    }

    // ---------------------- Colision de personaje ---------------------- //

    function colisionFubolista() {

        let bordeIzqF = miFutbolista.x;
        let bordeDerF = miFutbolista.x + miFutbolista.tamañoX;
        let bordeDownF = miFutbolista.y;
        let bordeUpF = miFutbolista.y + miFutbolista.tamañoY;
    
        for (let i = 0; i < todosLosObstaculos.length; i++) {
            let bordeIzqO = todosLosObstaculos[i].x;
            let bordeDerO = todosLosObstaculos[i].x + todosLosObstaculos[i].tamañoX;
            let bordeDownO = todosLosObstaculos[i].y;
            let bordeUpO = todosLosObstaculos[i].y + todosLosObstaculos[i].tamañoY;
    
            if (
                bordeDerF > bordeIzqO &&
                bordeIzqF < bordeDerO &&
                bordeUpF > bordeDownO &&
                bordeDownF < bordeUpO
            ) {
                
                todosLosObstaculos.splice(i, 1);
                i--;
    
                miFutbolista.vidas -= 1;
                console.log("Vidas restantes: " + miFutbolista.vidas);
    
            }
        }
    }

    function gameOver(){

        if(miFutbolista.vidas == 0){

            clearInterval(idAnimacion)
            clearInterval(idMovimientoPersonaje)
            boton.disabled=false;
        }

    }
    
    
	// ---------------------- Animación general de objetos ---------------------- //

    function animar() {
        ctx.clearRect(0, 0, 600, 400);
        ctx.drawImage(imagenCampo, 0, 0, 600, 400); 

        ctx.fillStyle = "#FF0000";
        todosLosObstaculos.forEach((obstaculo) => {
            if (!obstaculo.haAcabado) {
                obstaculo.pintarObstaculos();
                obstaculo.moverObstaculo();
            }
        });

        colisionFubolista();
        pintaFutbolista();
        gameOver();
    }

	// ---------------------- Captura de teclas ---------------------- //

    document.addEventListener("keydown", activaMovimiento, false);
    document.addEventListener("keyup", desactivaMovimiento, false);

    function activaMovimiento(evt) {
        switch (evt.keyCode) {
            case 37: xIzquierda = true; break;
            case 39: xDerecha = true; break;
            case 38: yUp = true; break;
            case 40: yDown = true; break;
        }
    }

    function desactivaMovimiento(evt) {
        switch (evt.keyCode) {
            case 37: xIzquierda = false; break;
            case 39: xDerecha = false; break;
            case 38: yUp = false; break;
            case 40: yDown = false; break;
        }
    }

    function comenzar(){
        iniciarVariables();

        ctx = canvas.getContext("2d");

        imagenPersonaje = new Image();
        imagenPersonaje.src = "assets/sprite/Characters.png";
        Futbolista.prototype.imagenPersonaje = imagenPersonaje;

        miFutbolista = new Futbolista(x, y);

        generaDatosObstaculos();

        idAnimacion = setInterval(animar, 1000 / 30);

        idMovimientoPersonaje = setInterval(alternarAnimacionMovimiento, 1000 / 6);
    }

    // CÓDIGO PRINCIPAL
	 boton=document.getElementById("nueva");
	 boton.onclick=comenzar;
};


  