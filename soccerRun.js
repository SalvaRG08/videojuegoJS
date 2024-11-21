// ---------------------- SOCCER RUN GAME ---------------------- //

window.onload = function () {

    const TOPEIZQUIERDA = 0;
    const TOPEDERECHA = 577;
    const TOPEABAJO = 360;
    const TOPECENTRO = 277;

    const NUMEROOBSTACULOS = 15;
    const NUMEROPORTERIAS = 5

    let x = 50;
    let y = 200;
    let canvas;
    let ctx;
    let boton;

    let xIzquierda, xDerecha, yUp, yDown;

    let posicionObstaculo = 0;
    let posicionFutbolista = 0;
    let inicial = 0;

    let miFutbolista;
    let imagenPersonaje;

    let imagenCampo;

    let miDisparo;
    let imagenBalon;
    let imagenFuego;
    let imagenPorteria;

    let todosLosObstaculos = [];
    let bateriaDisparos = [];
    let todasLasPorterias = [];

    // ---------------------- Iniciar variables ---------------------- //

        function iniciarVariables(){
            boton.disabled=true;

            canvas = document.getElementById("miCanvas");

            todosLosObstaculos = [];
            bateriaDisparos = [];
            todasLasPorterias = [];
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
        this.velocidad = 3;
        this.tamañoX = 23;
        this.tamañoY = 40;
        this.vidas = 5;
        this.puntos = 0;
    }

    function Obstaculos(x_2, y_2, velocidad_2) {
        this.x = x_2;
        this.y = y_2;
        this.animacionObstaculo = [
            [0, 77], [25, 77]
        ] 
        this.velocidad = velocidad_2;
        this.haAcabado = false;
        this.tamañoX = 25;
        this.tamañoY = 25;
    }

    function Disparo(x_3, y_3, velocidad_3) {
        this.x = x_3;
        this.y = y_3;
        this.velocidad = velocidad_3;
        this.haAcabado = false;
        this.tamañoX = 15;
        this.tamañoY = 15;
    }

    function Porteria(x_4, y_4){
        this.x = x_4;
        this.y = y_4;
        this.tamañoX = 50;
        this.tamañoY = 50;
    }

    imagenCampo = new Image();
    imagenCampo.src = "assets/sprite/Pitch2.png";
    
	// ---------------------- Codigo futbolista ---------------------- //

    Futbolista.prototype.generaPosicionDerecha = function() {
		this.x = this.x + this.velocidad;
		
		if (this.x > TOPECENTRO) {
			
			this.x = TOPECENTRO;   
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
            miFutbolista.animacionFutbolista[posicionFutbolista][0],
            miFutbolista.animacionFutbolista[posicionFutbolista][1],
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
    
        posicionFutbolista = inicial + (posicionFutbolista + 1) % 2;
    
    }

	// ---------------------- Codigo obstaculos ---------------------- //
    // QUE SEAN PELOTAS DE FUEGO O ALGO ASI

    /* Obstaculos.prototype.pintarObstaculos = function () {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, this.tamañoX, this.tamañoY);
    }; */
    Obstaculos.prototype.pintarObstaculo = function() {
            ctx.drawImage(
                this.imagenFuego, 
                this.animacionObstaculo[posicionObstaculo][0],
                this.animacionObstaculo[posicionObstaculo][1],                          
                this.tamañoX, 
                this.tamañoY,    
                this.x, 
                this.y,                
                this.tamañoX, 
                this.tamañoY
            );
        };

    Obstaculos.prototype.moverObstaculo = function () {
        this.x = this.x - this.velocidad;
        if (this.x <= TOPEIZQUIERDA - 30) this.haAcabado = true;
    };

    function generaDatosObstaculos() {
        for (let i = 0; i < NUMEROOBSTACULOS; i++) {
            let y = Math.random() * TOPEABAJO;
            let velocidad = 0.5 + Math.random() * 2;
            let miObstaculo = new Obstaculos(TOPEDERECHA, y, velocidad);
            todosLosObstaculos.push(miObstaculo);
        }
    }

    function pintarObstaculos(){
        todosLosObstaculos.forEach(obstaculo =>{
            obstaculo.pintarObstaculo();
            obstaculo.moverObstaculo();
        });
    }

    function alternarAnimacionObstaculo(){
        posicionObstaculo = (posicionObstaculo + 1) % 2;
    }

    // ---------------------- Codigo porteria ---------------------- //

    Porteria.prototype.pintarPorteria = function(){
        ctx.drawImage(
            this.imagenPorteria, 
            0, 0,                          
            this.tamañoX, 
            this.tamañoY,    
            this.x, 
            this.y,                
            this.tamañoX, 
            this.tamañoY
        );
    }

    function generaDatosPorterias(){
        for (let i = 0; i < NUMEROPORTERIAS; i++) {
            let y = Math.random() * TOPEABAJO;
            let x = TOPECENTRO + 50 + Math.random() * (TOPEDERECHA - TOPECENTRO);
            let miPorteria = new Porteria(x, y);
            todasLasPorterias.push(miPorteria);
        }
    } 

    function pintarPorterias(){
        todasLasPorterias.forEach(porteria =>{
            porteria.pintarPorteria();
        })
    }

    function regenerarPorterias() {
        // Limpiar las porterías actuales
        todasLasPorterias = [];
    
        // Generar nuevas posiciones para las porterías
        for (let i = 0; i < NUMEROPORTERIAS; i++) {
            let y = Math.random() * TOPEABAJO; 
            let x = TOPECENTRO +50 + Math.random() * (TOPEDERECHA - TOPECENTRO); 
            let miPorteria = new Porteria(x, y);
            todasLasPorterias.push(miPorteria);
        }
    
        console.log("Porterías regeneradas");
    }
    

	// ---------------------- Codigo disparo ---------------------- //

    Disparo.prototype.pintarDisparo = function() {
        ctx.drawImage(
            this.imagenBalon, 
            0, 0,                          
            this.tamañoX, this.tamañoY,    
            this.x, this.y,                
            this.tamañoX, this.tamañoY
        );
    };

    Disparo.prototype.moverDisparo = function () {
        this.x = this.x + this.velocidad;
        if (this.x >= TOPEDERECHA + 40){
            this.haAcabado = true;
            /* disparar = false; // de forma que no hay disparo continuo y se permite el siguiente disparo 
            console.log(disparar)*/
        } 
    };

    function generaDatosDisparo() {
        let y = miFutbolista.y + 25;
        let x = miFutbolista.x + 10;
        let velocidad = 7;
        miDisparo = new Disparo(x, y, velocidad);
        bateriaDisparos.push(miDisparo)
    }
    
    function pintarDisparos() {
        bateriaDisparos.forEach((disparo, i) => {
            disparo.pintarDisparo();
            disparo.moverDisparo();

            if(disparo.haAcabado){
                bateriaDisparos.splice(i, 1)
            }
        });
            
        
    }

    // ---------------------- Colision de personaje ---------------------- //

    function colisionFutbolista() {

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

    // ---------------------- Colision de balon ---------------------- //

    function colisionBalon(){

        bateriaDisparos.forEach((disparo, j) => {
            let bordeIzqB = disparo.x;
            let bordeDerB = disparo.x + disparo.tamañoX;
            let bordeDownB = disparo.y;
            let bordeUpB = disparo.y + disparo.tamañoY;

            for (let i = 0; i < todosLosObstaculos.length; i++) {
                let bordeIzqO = todosLosObstaculos[i].x;
                let bordeDerO = todosLosObstaculos[i].x + todosLosObstaculos[i].tamañoX;
                let bordeDownO = todosLosObstaculos[i].y;
                let bordeUpO = todosLosObstaculos[i].y + todosLosObstaculos[i].tamañoY;
        
                if (
                    bordeDerB > bordeIzqO &&
                    bordeIzqB < bordeDerO &&
                    bordeUpB > bordeDownO &&
                    bordeDownB < bordeUpO
                ) {

                    bateriaDisparos.splice(j,1)
                    todosLosObstaculos.splice(i, 1);

                }
            }
        });
        
    }

    // ---------------------- Game Over ---------------------- //

    function gameOver(){

        if(miFutbolista.vidas == 0){

            clearInterval(idAnimacion)
            clearInterval(idMovimientoObstaculo)
            clearInterval(idMovimientoPersonaje)
            clearInterval(idRegenerarPorterias)
            
           
            boton.disabled=false;
        }

    }
    
    
	// ---------------------- Animación general de objetos ---------------------- //

    function animar() {
        ctx.clearRect(0, 0, 600, 400);
        ctx.drawImage(imagenCampo, 0, 0, 600, 400); 

        /* todosLosObstaculos.forEach((obstaculo) => {
            if (!obstaculo.haAcabado) {
                obstaculo.pintarObstaculos();
                obstaculo.moverObstaculo();
            }
        }); */

        pintarPorterias();
        pintarObstaculos();
        /* moverObstaculo();*/   
        
        pintarDisparos();
        
        colisionFutbolista();
        pintaFutbolista();
        colisionBalon();

        document.getElementById("vidas").innerHTML = "Vidas: " + miFutbolista.vidas;

        gameOver();
    }

	// ---------------------- Captura de teclas ---------------------- //

    document.addEventListener("keydown", activaMovimiento, false);
    document.addEventListener("keyup", desactivaMovimiento, false);
    document.addEventListener("keypress", espacio, false);

    function activaMovimiento(evt) {
        switch (evt.keyCode) {
            case 37: xIzquierda = true; break;
            case 39: xDerecha = true;  break;
            case 38: yUp = true;  break;
            case 40: yDown = true;  break;
        }
    }

    function desactivaMovimiento(evt) {
        switch (evt.keyCode) {
            case 37: xIzquierda = false;  break;
            case 39: xDerecha = false;  break;
            case 38: yUp = false; break;
            case 40: yDown = false;  break;
        }
    }

    function espacio(evt){

		if (evt.keyCode === 32 /* && !disparar */) {

			  /* disparar = true; */ 
              generaDatosDisparo();
              /* console.log(disparar) */
		}
	}

    function comenzar(){
        iniciarVariables();

        ctx = canvas.getContext("2d");

        imagenPersonaje = new Image();
        imagenPersonaje.src = "assets/sprite/Characters.png";
        Futbolista.prototype.imagenPersonaje = imagenPersonaje;

        imagenBalon = new Image();
        imagenBalon.src = "assets/sprite/balon.png";
        Disparo.prototype.imagenBalon = imagenBalon;

        imagenFuego = new Image();
        imagenFuego.src = "assets/sprite/explosion3.png";
        Obstaculos.prototype.imagenFuego = imagenFuego;

        imagenPorteria = new Image();
        imagenPorteria.src = "assets/sprite/porteria.png"
        Porteria.prototype.imagenPorteria = imagenPorteria;

        miFutbolista = new Futbolista(x, y);

        generaDatosPorterias();
        generaDatosObstaculos();

        idAnimacion = setInterval(animar, 1000 / 30);
        idMovimientoObstaculo = setInterval(alternarAnimacionObstaculo, 1000/6 );
        idMovimientoPersonaje = setInterval(alternarAnimacionMovimiento, 1000 / 6);
        idRegenerarPorterias = setInterval(regenerarPorterias, 1000);

    }

    // CÓDIGO PRINCIPAL
	 boton=document.getElementById("nueva");
	 boton.onclick=comenzar;
};


  