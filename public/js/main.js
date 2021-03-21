const intervalo = 50;
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

let papel = document.querySelector('canvas');
let contexto = papel.getContext('2d');
let dondevoy;
let controles = { direccion: { x: 1, y: 0 }, vivora: [{ x: 0, y: 0 }] };

let looper = () => {
    console.log('looper');
    const sq = controles.vivora[0];
    let dx = controles.direccion.x;
    let dy = controles.direccion.y;
    sq.x += dx;
    sq.y += dy;
    requestAnimationFrame(dibujar);
    setTimeout(looper, intervalo);
};

document.onkeydown = (e) => {
    if(direccion.hasOwnProperty(e.key)){
        haciaDonde(e.key);
    }
};

haciaDonde = (dir) => {
    const [x, y] = direccion[dir];
    if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
        controles.direccion.x = x;
        controles.direccion.y = y;
    }
}

let dibujar = () => {
    if (screen.width <= 480) {
        contexto.clearRect(0, 0, 350, 350);
    } else {
        contexto.clearRect(0, 0, 500, 500);
    }
    contexto.fillStyle = 'black';
    const sq = controles.vivora[0];
    contexto.fillRect(sq.x*10, sq.y*10, 10, 10);
};

window.onload = () => {
    looper();
};
