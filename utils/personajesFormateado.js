export function formatearPersonaje(personaje) {
    if (!personaje) return null;
    return {
        id: personaje.id,
        nombre: personaje.nombre,
        edad: personaje.edad,
        profesion: personaje.profesion,
        personalidad: personaje.personalidad,
        estado: personaje.vivo ? 'Vivo 😊' : 'Muerto 😒',
        imagen: personaje.img || "mo hay imagen disponible 🤳",
        genero: personaje.genero || "Genero no especificado",
        raza: personaje.raza || "Raza no especificado",
        clase: personaje.clase || "Clase no especificado",
        fraseiconica: personaje.frase || "No hay frase iconica disponible 🗣️",
    };
}
export function mensajeError(id) {
    return {
        error: `Personaje con id ${id} no encontrado 😞`,
        mensaje: `no se encontro el personaje con id:${id}`,
        success: false
    };
}