window.onload = function () {

    const TOPEIZQUIERDA = 0;
    const TOPEDERECHA = 577;
    const TOPEABAJO = 360;

    const NUMEROOBSTACULOS = 5;
    const TAMAÑOOBSTACULOX = 25;
    const TAMAÑOOBSTACULOY = 25;

    let x = 100;
    let y = 350;
    let canvas;
    let ctx;

    let xIzquierda, xDerecha, yUp, yDown;

    let posicion = 0;
    let inicial = 0;

    let miFutbolista;
    let imagenPersonaje;
    let imagenCampo;

    let todosLosObstaculos = [];

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
        this.velocidad = 1.4;
        this.tamañoX = 23;
        this.tamañoY = 40;
    }

    function Obstaculos(x_2, y_2, velocidad_2) {
        this.x = x_2;
        this.y = y_2;
        this.velocidad = velocidad_2;
        this.haAcabado = false;
    }

    imagenCampo = new Image();
    imagenCampo.src = "assets/sprite/Pitch.png";
    
	// ---------------------- Codigo futbolista ---------------------- //

    Futbolista.prototype.generaPosicionDerecha = function () {
        this.x = Math.min(this.x + this.velocidad, TOPEDERECHA);
    };

    Futbolista.prototype.generaPosicionIzquierda = function () {
        this.x = Math.max(this.x - this.velocidad, TOPEIZQUIERDA);
    };

    Futbolista.prototype.generaPosicionArriba = function () {
        this.y = Math.max(this.y - this.velocidad, TOPEIZQUIERDA);
    };

    Futbolista.prototype.generaPosicionAbajo = function () {
        this.y = Math.min(this.y + this.velocidad, TOPEABAJO);
    };

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
    
        console.log(inicial);
    }

	// ---------------------- Codigo obstaculos ---------------------- //

    Obstaculos.prototype.pintarObstaculos = function () {
        ctx.fillRect(this.x, this.y, TAMAÑOOBSTACULOX, TAMAÑOOBSTACULOY);
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

        pintaFutbolista();
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

    canvas = document.getElementById("miCanvas");
    ctx = canvas.getContext("2d");

    imagenPersonaje = new Image();
    imagenPersonaje.src = "assets/sprite/Characters.png";
    Futbolista.prototype.imagenPersonaje = imagenPersonaje;

    miFutbolista = new Futbolista(x, y);

    generaDatosObstaculos();

    setInterval(animar, 1000 / 30);

    setInterval(alternarAnimacionMovimiento, 1000 / 6);
};


  