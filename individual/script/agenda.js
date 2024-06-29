const tipos = [
    { id: "tipodesayuno", nombre: "Desayuno" },
    { id: "tipoalmuerzo", nombre: "Almuerzo" },
    { id: "tipomerienda", nombre: "Merienda" },
    { id: "tipocena", nombre: "Cena" }
];

document.addEventListener("DOMContentLoaded", function() {
    let combos = JSON.parse(localStorage.getItem("combos")) || [];
    let editindice = -1;

    function renderizarCombos() {
        document.getElementById("listaCombo").innerHTML = "";
        renderizarFiltro();
        combos.forEach(function(combo, indice) {
            let nuevoCombo = crearComboElemento(combo, indice);
            document.getElementById("listaCombo").appendChild(nuevoCombo);
        });

        actualizarResumenCombos();
    }

    function crearComboElemento(combo, indice) {
        let nuevoCombo = document.createElement("div");
        nuevoCombo.classList.add("combo");
        nuevoCombo.innerHTML = `
            <h3>${combo.nombre}</h3>
            <p><strong>Tipo de comida:</strong> ${combo.tipoComida}</p>
            <p><strong>Descripción de la comida:</strong> ${combo.descripcionComida}</p>
            <p><strong>Calorías de la comida:</strong> ${combo.caloriasComida}</p>
            <p><strong>Calorías a quemar:</strong> ${combo.caloriasQuemar}</p>
            <p><strong>Nombre del ejercicio:</strong> ${combo.nombreEjercicio}</p>
            <p><strong>Descripción del ejercicio:</strong> ${combo.descripcionEjercicio}</p>
        `;

        actualizarConsejos(combo, nuevoCombo);

        let buttonGroup = document.createElement("div");
        buttonGroup.classList.add("btn-group");
        buttonGroup.setAttribute("role", "group");

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("eliminar-btn", "btn", "btn-danger");
        botonEliminar.setAttribute('data-indice', indice);
        buttonGroup.appendChild(botonEliminar);

        let botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.classList.add("editar-btn", "btn", "btn-primary");
        botonEditar.setAttribute('data-indice', indice);
        buttonGroup.appendChild(botonEditar);

        nuevoCombo.appendChild(buttonGroup);

        return nuevoCombo;
    }

    function actualizarConsejos(combo, nuevoCombo) {
        nuevoCombo.querySelectorAll("p.consejo").forEach(consejo => {
            consejo.remove();
        });

        if (combo.tipoComida === "Desayuno" && combo.nombre === "Hamburguesa") {
            let easteregg = document.createElement("p");
            easteregg.textContent = "¡Hamburguesa! Huh, ¿como desayuno? Eso es...raro.";
            easteregg.classList.add("consejo");
            nuevoCombo.appendChild(easteregg);
        }

        if (combo.caloriasComida < combo.caloriasQuemar) {
            let error = document.createElement("p");
            error.textContent = "¿Más calorías a quemar que calorías de comida? Como que algo no anda bien...";
            error.classList.add("consejo");
            nuevoCombo.appendChild(error);
        }

        if (combo.caloriasComida > 500 && combo.caloriasQuemar < 200) {
            let advertencia = document.createElement("p");
            advertencia.textContent = "Recomiendo hacer un poco más de ejercicio, o cambiar la dieta";
            advertencia.classList.add("consejo");
            nuevoCombo.appendChild(advertencia);
        }

        if (combo.tipoComida === "Almuerzo" && parseInt(combo.caloriasComida) > 300 && parseInt(combo.caloriasComida) < 500) {
            let consejo = document.createElement("p");
            consejo.textContent = "¡Este almuerzo es perfecto! Recuerda acompañarlo siempre con verduras.";
            consejo.classList.add("consejo");
            nuevoCombo.appendChild(consejo);
        } else if (parseInt(combo.caloriasComida) < 300) {
            let consejo = document.createElement("p");
            consejo.textContent = "¡Recomiendo comer un poco más!";
            consejo.classList.add("consejo");
            nuevoCombo.appendChild(consejo);
        }

        if (combo.tipoComida === "Merienda" && parseInt(combo.caloriasComida) > 50 && parseInt(combo.caloriasComida) < 250) {
            let consejo = document.createElement("p");
            consejo.textContent = "¡Lo ideal para una merienda!";
            consejo.classList.add("consejo");
            nuevoCombo.appendChild(consejo);
        } else if (combo.tipoComida === "Merienda" && parseInt(combo.caloriasComida) < 100) {
            let consejo = document.createElement("p");
            consejo.textContent = "¡No está mal para una merienda!";
            consejo.classList.add("consejo");
            nuevoCombo.appendChild(consejo);
        } else if (combo.tipoComida === "Merienda") {
            let consejo = document.createElement("p");
            consejo.textContent = "Es demasiado. Prueba bajar las cantidades.";
            consejo.classList.add("consejo");
            nuevoCombo.appendChild(consejo);
        }

        if (combo.tipoComida === "Cena" && parseInt(combo.caloriasComida) > 50 && parseInt(combo.caloriasComida) < 300) {
            let consejo = document.createElement("p");
            consejo.textContent = "¡Perfecto! Lo ideal en la cena es comer lo menos posible por temas de digestión.";
            consejo.classList.add("consejo");
            nuevoCombo.appendChild(consejo);
        } else if (parseInt(combo.caloriasComida) === 50) {
            let consejo = document.createElement("p");
            consejo.textContent = "¡No está mal! Recomiendo que si comes poco, comas proteína. Ej: Huevo";
            consejo.classList.add("consejo");
            nuevoCombo.appendChild(consejo);
        }
    }

    function renderizarFiltro() {
        document.getElementById("filtroComida").innerHTML = "";
        let selectFiltro = document.createElement("select");
        let defaultOption = document.createElement("option");
        defaultOption.text = "Filtrar por tipo de comida";
        selectFiltro.add(defaultOption);
        tipos.forEach(function(tipo) {
            let option = document.createElement("option");
            option.value = tipo.nombre;
            option.text = tipo.nombre;
            selectFiltro.add(option);
        });

        selectFiltro.addEventListener("change", function() {
            let valorFiltro = this.value;
            if (valorFiltro === "Filtrar por tipo de comida") {
                renderizarCombos();
            } else {
                let combosFiltrados = combos.filter(combo => combo.tipoComida === valorFiltro);
                renderizarCombosFiltrados(combosFiltrados);
            }
        });

        document.getElementById("filtroComida").appendChild(selectFiltro);
    }

    function renderizarCombosFiltrados(combosFiltrados) {
        document.getElementById("listaCombo").innerHTML = "";
        combosFiltrados.forEach(function(combo, indice) {
            let nuevoCombo = crearComboElemento(combo, indice);
            document.getElementById("listaCombo").appendChild(nuevoCombo);
        });

        actualizarResumenCombos(combosFiltrados);
    }

    function agregarCombo(event) {
        event.preventDefault();

        let nombreCombo = document.getElementById("comboNombre").value;
        let tipoComida = document.getElementById("tipos").value;
        let descripcionComida = document.getElementById("descripción").value;
        let caloriasComida = document.getElementById("calorías").value;
        let caloriasQuemar = document.getElementById("caloriasQuemar").value;
        let nombreEjercicio = document.getElementById("nombreEjercicio").value;
        let descripcionEjercicio = document.getElementById("descripciónEjercicio").value;

        if (editindice === -1) {
            combos.push({
                nombre: nombreCombo,
                tipoComida: tipoComida,
                descripcionComida: descripcionComida,
                caloriasComida: caloriasComida,
                nombreEjercicio: nombreEjercicio,
                descripcionEjercicio: descripcionEjercicio,
                caloriasQuemar: caloriasQuemar
            });
        } else {
            combos[editindice] = {
                nombre: nombreCombo,
                tipoComida: tipoComida,
                descripcionComida: descripcionComida,
                caloriasComida: caloriasComida,
                nombreEjercicio: nombreEjercicio,
                descripcionEjercicio: descripcionEjercicio,
                caloriasQuemar: caloriasQuemar
            };
            editindice = -1;
        }

        localStorage.setItem("combos", JSON.stringify(combos));
        renderizarCombos();
        document.getElementById("Combo").reset();
        document.getElementById("guardarBoton").textContent = "Guardar";
    }

    function eliminarCombo(event) {
        let indice = event.target.getAttribute('data-indice');
        if (confirm("¿Seguro? No podrás recuperar lo perdido luego. :( ")) {
            combos.splice(indice, 1);
            localStorage.setItem("combos", JSON.stringify(combos));
            renderizarCombos();
        }
    }

    function editarCombo(event) {
        var indice = event.target.getAttribute('data-indice');
        let combo = combos[indice];
        document.getElementById("comboNombre").value = combo.nombre;
        document.getElementById("tipos").value = combo.tipoComida;
        document.getElementById("descripción").value = combo.descripcionComida;
        document.getElementById("calorías").value = combo.caloriasComida;
        document.getElementById("caloriasQuemar").value = combo.caloriasQuemar;
        document.getElementById("nombreEjercicio").value = combo.nombreEjercicio;
        document.getElementById("descripciónEjercicio").value = combo.descripcionEjercicio;

        let nuevoCombo = document.createElement("div");
        nuevoCombo.classList.add("combo");
        actualizarConsejos(combo, nuevoCombo);

        document.getElementById("guardarBoton").textContent = "Guardar";
        editindice = indice;
    }

    function actualizarResumenCombos(combosMostrar = combos) {
        document.getElementById("totalCombos").textContent = combosMostrar.length;
        let tiposContador = {};
        tipos.forEach(tipo => {
            tiposContador[tipo.nombre] = 0;
        });
        combosMostrar.forEach(combo => {
            tiposContador[combo.tipoComida]++;
        });

        let resumenTiposHTML = "";
        tipos.forEach(tipo => {
            resumenTiposHTML += `<p><strong>${tipo.nombre}:</strong> ${tiposContador[tipo.nombre]}</p>`;
        });
        document.getElementById("resumenTipos").innerHTML = resumenTiposHTML;
    }

    document.getElementById("listaCombo").addEventListener("click", function(event) {
        if (event.target.classList.contains("eliminar-btn")) {
            eliminarCombo(event);
        } else if (event.target.classList.contains("editar-btn")) {
            editarCombo(event);
        }
    });

    document.getElementById("Combo").addEventListener("submit", agregarCombo);

    renderizarCombos();
});
