const anchoTablero = 500;
let intervalo = 120;
let points = 0;
let presas = 0;
let username = 'anonymous';
const player = document.getElementById('name');
const score = document.getElementById('score');
const record = document.getElementById('record');
const play = document.getElementById('play');
const playagain = document.getElementById('playagain');
const close = document.getElementById('close');

let modal = new bootstrap.Modal(document.getElementById('modal'), {
    keyboard: false,
});
let ingreso = new bootstrap.Modal(document.getElementById('ingreso'), {
    keyboard: false,
});
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
    if (controles.jugando) {
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
    }
    if (atrapada) {
        controles.crecimiento += 2;
        dibujarPresa();
        points = points + 100;
        score.innerHTML = points;
        presas++;
        if (presas % 3 == 0) {
            intervalo = intervalo - 15;
        }
    }
    if (controles.crecimiento > 0) {
        controles.vivora.push(cola);
        controles.crecimiento -= 1;
    }
    points++;
    score.innerHTML = points;

    if (detectarChoque()) {
        controles.jungando = false;
        modal.show();
        console.log('Game Over', username, points);
        document.getElementById('points').innerHTML = points;
        saveScore(points, username);
        controlesEnCero();
        dibujar();
        cancelAnimationFrame(af);
    } else {
        af = requestAnimationFrame(dibujar); //redibujamos el tablero con el nuevo movimiento
        setTimeout(looper, intervalo);
    }
};

let detectarChoque = () => {
    const head = controles.vivora[0];
    if (head.x < 0 || head.x >= anchoTablero / 10 || head.y >= anchoTablero / 10 || head.y < 0) {
        return true;
    }
    for (let index = 1; index < controles.vivora.length; index++) {
        const sq = controles.vivora[index];
        if (sq.x === head.x && sq.y === head.y) {
            return true;
        }
    }
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
    // if (screen.width <= 480) {
    //     contexto.clearRect(0, 0, 350, 350);
    // } else {
    contexto.clearRect(0, 0, 500, 500);
    // }
    for (let index = 0; index < controles.vivora.length; index++) {
        const { x, y } = controles.vivora[index];
        dibujarElemento('black', x, y);
    }
    const presa = controles.presa;
    dibujarElemento('purple', presa.x, presa.y);
};
//dibuja el canvas
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
//dibuja a la presa en un lugar random
let dibujarPresa = () => {
    let posicionPresa = aparicionRandom();
    let presa = controles.presa;
    presa.x = posicionPresa.x;
    presa.y = posicionPresa.y;
};
//reinicia el juego
let reiniciar = () => {
    controlesEnCero();
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
    points = 0;
    presas = 0;
    intervalo = 120;
};

let controlesEnCero = () => {
    controles = {
        direccion: { x: 1, y: 0 },
        vivora: [{ x: 0, y: 0 }],
        presa: { x: 0, y: 0 },
        jugando: false,
        crecimiento: 0,
    };
};

window.onload = () => {
    obtenerRecord();
    ingreso.show();
};

let obtenerRecord = () => {
    var query = firebase.firestore().collection('scores').orderBy('score', 'desc').limit(1);
    query.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(function (change) {
            record.innerHTML = `${change.doc.data().name} ${change.doc.data().score}`;
        });
    });
};

play.addEventListener('click', () => {
    console.log(document.getElementById('username').value);
    username = document.getElementById('username').value;
    if (username != '') {
        player.innerHTML = username;
    } else {
        player.innerHTML = 'anonymous';
    }
    ingreso.hide();
    reiniciar();
    looper();
});
playagain.addEventListener('click', () => {
    if (points > document.getElementById('record').score) {
        obtenerRecord();
    }
    modal.hide();
    reiniciar();
    looper();
});

function saveScore(score, player) {
    console.log(`player ${player}`)
    return firebase
        .firestore()
        .collection('scores')
        .add({
            name: player,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .catch(function (error) {
            console.error('Error writing new score to database', error);
        });
}

document.getElementById('ingreso').addEventListener('shown.bs.modal', function () {
    document.getElementById('username').focus();
});

document.getElementById('username').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        username = document.getElementById('username').value;
        play.click();
    }
});
