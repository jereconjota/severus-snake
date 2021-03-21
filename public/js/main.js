const anchoTablero = 500;
const intervalo = 100;
//inicializamos un objeto con las direcciones que va a tomar la vivorita al apretar una tecla o boton
const direccion = {
    A: [-1, 0],
    D: [1, 0],
    S: [0, 1],
    W: [0, -1],
    a: [-1, 0],
    d: [1, 0],
    s: [0, 1],
    w: [0, -1],
    ArrowDown: [0, 1],
    ArrowUp: [0, -1],
    ArrowRight: [1, 0],
    ArrowLeft: [-1, 0],
};
document.getElementById('up').addEventListener('click', () => haciaDonde('ArrowUp'));
document.getElementById('down').addEventListener('click', () => haciaDonde('ArrowDown'));
document.getElementById('right').addEventListener('click', () => haciaDonde('ArrowRight'));
document.getElementById('left').addEventListener('click', () => haciaDonde('ArrowLeft'));
//tablero de la vivorita y el contexto en el q se va a manejar
let papel = document.querySelector('canvas');
let contexto = papel.getContext('2d');

let dondevoy;
//Main para controlar el juego
let controles = {
    direccion: { x: 1, y: 0 },
    vivora: [{ x: 0, y: 0 }],
    presa: { x: 10, y: 30 },
    jugando: false,
    crecimiento: 0,
};

//funcion recursiva que se va a ejecutar cada un intervalo determinado
let looper = () => {
    let cola = {};
    Object.assign(cola, controles.vivora[controles.vivora.length - 1]);

    let dx = controles.direccion.x; //obtengo movimiento horizontal
    let dy = controles.direccion.y; //obtengo movimiento vertical
    let atrapada = controles.vivora[0].x === controles.presa.x && controles.vivora[0].y === controles.presa.y;

    let tamaño = controles.vivora.length - 1;
    for (let index = tamaño; index > -1; index--) {
        const sq = controles.vivora[index]; //cabeza inicial de la vivorita
        if (index === 0) {
            sq.x += dx;
            sq.y += dy;
        } else {
            sq.x = controles.vivora[index - 1].x;
            sq.y = controles.vivora[index - 1].y;
        }
    }

    if (atrapada) {
        controles.crecimiento += 1;
        dibujarPresa();
    }
    if (controles.crecimiento > 0) {
        controles.vivora.push(cola);
        controles.crecimiento -= 1;
    }
    requestAnimationFrame(dibujar); //redibujamos el tablero con el nuevo movimiento
    setTimeout(looper, intervalo);
};

//capturamos tecla presionada
document.onkeydown = (e) => {
    if (direccion.hasOwnProperty(e.key)) {
        haciaDonde(e.key);
    }
};
//dirigimos la vivorita a donde corresponda segun la tecla tocada
haciaDonde = (dir) => {
    const [x, y] = direccion[dir];
    if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
        controles.direccion.x = x;
        controles.direccion.y = y;
    }
};

//dibujamos la vivorita en el tablero
let dibujar = () => {
    if (screen.width <= 480) {
        contexto.clearRect(0, 0, 350, 350);
    } else {
        contexto.clearRect(0, 0, 500, 500);
    }
    for (let index = 0; index < controles.vivora.length; index++) {
        const { x, y } = controles.vivora[index];
        dibujarElemento('black', x, y);
    }
    const presa = controles.presa;
    dibujarElemento('purple', presa.x, presa.y);
};

let dibujarElemento = (color, x, y) => {
    contexto.fillStyle = color;
    contexto.fillRect(x * 10, y * 10, 10, 10);
};

//posicion inicial aleatoria de la vivorita
let aparicionRandom = () => {
    let dir = Object.values(direccion); //Convertimos el objeto a array para obeter un atributo random dentro de el
    return {
        x: parseInt((Math.random() * anchoTablero) / 10),
        y: parseInt((Math.random() * anchoTablero) / 10),
        d: dir[parseInt(Math.random() * 11)],
    };
};

let dibujarPresa = () => {
    let posicionPresa = aparicionRandom();
    let presa = controles.presa;
    presa.x = posicionPresa.x;
    presa.y = posicionPresa.y;
};

window.onload = () => {
    //posicion random de la vivorita cuando comienza el juego
    posicionVivora = aparicionRandom();
    let inicio = controles.vivora[0];
    // inicio.x = posicionVivora.x;
    // inicio.y = posicionVivora.y;
    inicio.x = 25;
    inicio.y = 25;
    controles.direccion.x = posicionVivora.d[0];
    controles.direccion.y = posicionVivora.d[1];

    // console.log(controles.direccion.x, controles.direccion.y, '/', inicio.x, inicio.y);
    // requestAnimationFrame(dibujar)

    //posicion random de la presa cuando comienza el juego
    dibujarPresa();
    controles.jugando = true;
    looper();
};
