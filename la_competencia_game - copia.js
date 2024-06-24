// Materia: Iteración Web
// Actividad: Trabajo Práctico 4 (TIFMA)
// Profesor: Ing. Jose A. Fernandez
// Alumnos: Dragomir Raicevich & Rodrigo Murad

const luchadores = document.getElementById('luchadores');
const drop_zone = document.getElementById("drop_zone");
const texto_resultado = document.getElementById("texto_resultado");
const fighter_seleccionado = document.getElementById("fighter_seleccionado");
const nombre_luchador_usuario = document.getElementById("nombre_luchador_usuario");
let nombresluchadores = ['earthak', 'firex', 'waterhit'];
let seleccionado = false;
let energiaFighterUsuario, energiaFighterPC, energiaPivote;
let puntaje_usuario, puntaje_PC;
let ls = window.localStorage;
let anio, mes, dia, tiempo;

// WebSocket #######################################################################################################
window.player = prompt('Ingrese su Nombre');
localStorage.setItem('player', window.player);
console.log("Player: ", window.player);


window.player = localStorage.getItem('player');
if (typeof window.player === 'undefined' ||
    window.player == null ||
    window.player === 'null') {
    window.player = "PLAYER INEXISTENTE";
    localStorage.setItem('player', window.player);
}

var ws = new WebSocket('wss://gamehubmanager.azurewebsites.net/ws');

ws.addEventListener('open', function(event) {
    console.log('Conectado!');
});

ws.addEventListener('message', function(event) {
    console.log('Mensaje recibido: ', event.data);
    var response = JSON.parse(event.data);
    console.log(response);

    rankingGenerate(JSON.parse(response));
});

function rankingGenerate(data) {
    var tableBody = document.getElementById('rankingTableBody');
    tableBody.innerHTML = '';
    data.forEach(function(item, index) {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        console.log(item);

        td1.textContent = index + 1;
        td2.textContent = item.Player;
        td3.textContent = item.Value;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tableBody.appendChild(tr);
    });
};
// Fin WebSocket ###################################################################################################

// TP4 #############################################################################################################
window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    // Beta: Giro hacia Arriba y Abajo
    if (beta < 30 && seleccionado == false) {
        console.log("Waterhit");
        fighter_seleccionado.src = document.getElementById("Waterhit").src;
        nombre_luchador_usuario.innerText = "Waterhit";
        energiaFighterUsuario = 2;
        seleccionado = true;
    } else {
        // Gama: Giro hacia los Costados
        if (gamma < -40 && seleccionado == false) {
            console.log("Firex");
            fighter_seleccionado.src = document.getElementById("Firex").src;
            nombre_luchador_usuario.innerText = "Firex";
            energiaFighterUsuario = 1;
            seleccionado = true;
        } else if (gamma > 40 && seleccionado == false) {
            console.log("Earthak");
            fighter_seleccionado.src = document.getElementById("Earthak").src;
            nombre_luchador_usuario.innerText = "Earthak";
            energiaFighterUsuario = 0;
            seleccionado = true;
        } else {
            fighter_seleccionado.src = "";
            nombre_luchador_usuario.innerText = "";

            document.getElementById("nombre_luchador_PC").innerText = "";
            document.getElementById("fighter_PC").src = "";
            seleccionado = false;
        }
    }

    if (seleccionado == true) {
        /* Eliger un Número entre 0 y 29, luego lo divide entre 10, y al ser un "parseInt", solo reserva la
        parte entera, quedando un número entre 0 y 2. Con ese número, busca el valor en el array "nombresluchadores",
        y lo utiliza para generar toda la info del Luchador de la PC */
        energiaFighterPC = parseInt((Math.random() * 30) / 10);
        nombreFighterPC = nombresluchadores[energiaFighterPC];
        document.getElementById("nombre_luchador_PC").innerText = nombreFighterPC;
        document.getElementById("fighter_PC").src = "img/fighter_" + nombreFighterPC + ".png";

        /* Chequeamos quién ganó, esto lo hacemos restando los valores:
        Le restamos a la Energía del Usuario la Energía de la PC,
        si el valor queda negativo, entonces el Usuario pierde, de lo contrario gana */
        if (energiaFighterUsuario == energiaFighterPC) {
            texto_resultado.style.color = "#333";
            texto_resultado.innerText = "empate";
        } else {
            if (energiaFighterUsuario == 2 && energiaFighterPC == 0 || energiaFighterUsuario == 0 && energiaFighterPC == 2) {
                energiaPivote = energiaFighterUsuario;
                energiaFighterUsuario = energiaFighterPC;
                energiaFighterPC = energiaPivote;
            }
            if (energiaFighterUsuario - energiaFighterPC < 0) {
                texto_resultado.style.color = "#f00";
                texto_resultado.innerText = "Perdiste";
                puntaje_PC++;

            } else {
                texto_resultado.style.color = "#00f";
                texto_resultado.innerText = "Ganaste";
                puntaje_usuario++;
            }
        }

        document.getElementById("puntaje_usuario").innerText = puntaje_usuario;
        document.getElementById("puntaje_PC").innerText = puntaje_PC;

        // Guardamos el Resultado en el localStorage
        ls.setItem("Resultado", texto_resultado.innerText);

        // WebSocket #######################################################################################################
        var data = {
            game: 'La Competencia',
            event: 'posicion',
            player: window.player,
            value: puntaje_usuario - 1
        };
        data.value = data.value + 1;
        ws.send(JSON.stringify(data));
        // Fin WebSocket ###################################################################################################
    }


}


// #################################################################################################################
// Comienza el Evento de Drag & Drop
// luchadores.addEventListener('dragstart', e => {
//     // Guardamos Año, Mes, Día, Hora, Minutos, Segundos y Milisegundos en formato ISO en que Comienza el Drag & Drop
//     let recuperador_fecha = new Date();
//     anio = recuperador_fecha.getFullYear();
//     mes = (recuperador_fecha.getMonth() + 1).toString().padStart(2, '0');
//     dia = recuperador_fecha.getDate().toString().padStart(2, '0');
//     tiempo = (recuperador_fecha.getHours()).toString().padStart(2, '0');
//     tiempo += (recuperador_fecha.getMinutes()).toString().padStart(2, '0');
//     tiempo += (recuperador_fecha.getSeconds()).toString().padStart(2, '0');
//     tiempo += (recuperador_fecha.getMilliseconds()).toString().padStart(3, '0');

//     seleccionado = false;
//     fighter_seleccionado.src = "";
//     drop_zone.classList.add("dropZoneStyleActive");
//     drop_zone.style.visibility = "visible";

//     e.dataTransfer.setData('nombreFighterUsuario', e.target.id);
//     energiaFighterUsuario = document.getElementById(e.target.id).dataset.energy;
//     e.dataTransfer.setData('imagenFighterUsuario', e.target.src);

//     document.getElementById("nombre_luchador_PC").innerText = "";
//     document.getElementById("fighter_PC").src = "";
// });




// Si el Luchador es soltado fuera del Círculo Rojo, entonces se oculta nuevamente el Círculo Rojo
// luchadores.addEventListener('dragend', e => {
//     if (seleccionado == false) {
//         drop_zone.style.visibility = "hidden";
//     }
// });




// Previene el comportamiento normal, para que se permita el evento Drag & Drop
// drop_zone.addEventListener("dragover", e => {
//     e.preventDefault();
// });



// El Luchador es soltado dentro del Círculo Rojo
// drop_zone1.addEventListener("drop", e => {
// localStorage
// Guardamos Año, Mes, Día, Hora, Minutos, Segundos y Milisegundos en formato ISO en que Finaliza el Drag & Drop
// ls.setItem("StartDragAndDrop", anio + mes + dia + "T" + tiempo);

// let recuperador_fecha = new Date();
// anio = recuperador_fecha.getFullYear();
// mes = (recuperador_fecha.getMonth() + 1).toString().padStart(2, '0');
// dia = recuperador_fecha.getDate().toString().padStart(2, '0');
// tiempo = (recuperador_fecha.getHours()).toString().padStart(2, '0');
// tiempo += (recuperador_fecha.getMinutes()).toString().padStart(2, '0');
// tiempo += (recuperador_fecha.getSeconds()).toString().padStart(2, '0');
// tiempo += (recuperador_fecha.getMilliseconds()).toString().padStart(3, '0');
// ls.setItem("EndDragAndDrop", anio + mes + dia + "T" + tiempo);

// seleccionado = true;
// drop_zone.classList.remove("dropZoneStyleActive");
// nombre_luchador_usuario.innerText = e.dataTransfer.getData('nombreFighterUsuario');
// fighter_seleccionado.src = e.dataTransfer.getData('imagenFighterUsuario');

// /* Eliger un Número entre 0 y 29, luego lo divide entre 10, y al ser un "parseInt", solo reserva la
// parte entera, quedando un número entre 0 y 2. Con ese número, busca el valor en el array "nombresluchadores",
// y lo utiliza para generar toda la info del Luchador de la PC */
// energiaFighterPC = parseInt((Math.random() * 30) / 10);
// nombreFighterPC = nombresluchadores[energiaFighterPC];
// document.getElementById("nombre_luchador_PC").innerText = nombreFighterPC;
// document.getElementById("fighter_PC").src = "img/fighter_" + nombreFighterPC + ".png";

// /* Chequeamos quién ganó, esto lo hacemos restando los valores:
// Le restamos a la Energía del Usuario la Energía de la PC,
// si el valor queda negativo, entonces el Usuario pierde, de lo contrario gana */
// if (energiaFighterUsuario == energiaFighterPC) {
//     texto_resultado.style.color = "#333";
//     texto_resultado.innerText = "empate";
// } else {
//     if (energiaFighterUsuario == 2 && energiaFighterPC == 0 || energiaFighterUsuario == 0 && energiaFighterPC == 2) {
//         energiaPivote = energiaFighterUsuario;
//         energiaFighterUsuario = energiaFighterPC;
//         energiaFighterPC = energiaPivote;
//     }
//     if (energiaFighterUsuario - energiaFighterPC < 0) {
//         texto_resultado.style.color = "#f00";
//         texto_resultado.innerText = "Perdiste";
//         puntaje_PC++;

//     } else {
//         texto_resultado.style.color = "#00f";
//         texto_resultado.innerText = "Ganaste";
//         puntaje_usuario++;
//     }
// }

// document.getElementById("puntaje_usuario").innerText = puntaje_usuario;
// document.getElementById("puntaje_PC").innerText = puntaje_PC;

// ls.setItem("Resultado", texto_resultado.innerText);

// // WebSocket #######################################################################################################
// var data = {
//     game: 'La Competencia',
//     event: 'posicion',
//     player: window.player,
//     value: puntaje_usuario - 1
// };
// data.value = data.value + 1;
// ws.send(JSON.stringify(data));
// // Fin WebSocket ###################################################################################################
// });

// Reiniciamos todos los Valores
function replay() {
    seleccionado = false;
    puntaje_usuario = 0;
    puntaje_PC = 0;
    document.getElementById("nombre_luchador_usuario").innerText = "READY";
    document.getElementById("puntaje_usuario").innerText = "0";
    document.getElementById("nombre_luchador_PC").innerText = "READY";
    document.getElementById("puntaje_PC").innerText = "0";
    texto_resultado.innerText = "";
    fighter_seleccionado.src = "";
    document.getElementById("fighter_PC").src = "";
}