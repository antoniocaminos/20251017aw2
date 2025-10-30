import { error } from "console";
import { Router } from "express";
import { readFile,  writeFile } from 'fs/promises';
import { formatearPersonaje, mensajeError } from "../utils/personajesFormateado.js";



const router = Router();

/* logica anterior */
/* zona de data */
// leer archivo JSON (usa top-level await; asegúrate de Node con type: 'module')
const data = await readFile('./data/personajes.json', 'utf-8');
const characters = JSON.parse(data);           // array de personajes

/* zona de rutas methods GET */

// GET -> obtener todos los personajes
router.get('/personajes', (req, res) => {
  try {
    res.status(200).json(characters);         // 200 OK con la lista completa
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener personajes', detalle: error.message });
  }
});

// GET ordenado alfabeticamente por nombre
router.get('/personajes/ordenados', (req, res) => {
  try {
    const ordenados = [...characters].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );
    res.status(200).json(ordenados);          // 200 OK con lista ordenada
  } catch (error) {
    res.status(500).json({ error: 'Error al ordenar personajes', detalle: error.message });
  }
});

// GET -> obtener personaje por ID (usa parseInt + ===)
router.get('/personajes/:id', (req, res) => {
  /* try {
    const id = parseInt(req.params.id, 10);   // convertir string a número
    if (Number.isNaN(id)) {                    
      return res.status(400).json({ error: 'El id debe ser un número entero' }); // 400 Bad Request
    }
    const personaje = characters.find(p => p.id === id);
    if (personaje) {
      return res.status(200).json(personaje); // 200 OK
    } else {
      return res.status(404).json({ error: 'Personaje no encontrado' }); // 404 Not Found
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar personaje', detalle: error.message }); */
    try {
      const id = parseInt(req.params.id, 10);   // convertir string a número
      if (Number.isNaN(id)){
        return res.status(400).json({
          error: 'El id debe ser un número entero#️⃣',
        });
      }
    const personaje = characters.find(p=> p.id === id);//estrictamente igual y equivalente
    if (personaje) {
      const personajeFormateado = formatearPersonaje(personaje);
      return res.status(200).json({
        success: true,
        mensaje: 'Personaje encontrado 👌',
        data: personajeFormateado,
      });
    } else {
      return res.status(404).json(mensajeError(id)); // 404 Not Found
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error al buscar personaje 💣💣',
      detalle:error.message,
    });
  }
});
/* zona de rutas methods PUT */
// PUT -> actualizar personaje (reemplazo completo) 
router.put('/personajes', async (req, res) => {
  try {
    const { id, nombre, edad, genero, raza, clase } = req.body; // datos enviados
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ error: 'El id debe ser un número' });
    }
    const index = characters.findIndex(p => p.id === idNum);
    if (index !== -1) {
      characters[index] = { id: idNum, nombre, edad, genero, raza, clase }; // reemplazo
      await writeFile('./data/personajes.json', JSON.stringify(characters, null, 2)); // persistir
      return res.status(200).json({ message: 'Personaje actualizado', personaje: characters[index] }); // 200 OK
    } else {
      return res.status(404).json({ error: 'Personaje no encontrado' }); // 404 Not Found
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar personaje', detalle: error.message });
  }
});

/* method DELETE */
// DELETE -> eliminar personaje por ID
router.delete('/personajes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'El id debe ser un número' });
    }
    const index = characters.findIndex(p => p.id === id);
    if (index !== -1) {
      characters.splice(index, 1);
      await writeFile('./data/personajes.json', JSON.stringify(characters, null, 2)); // persistir
      return res.status(200).json({ message: 'Personaje eliminado con éxito' }); // 200 OK
    } else {
      return res.status(404).json({ error: 'Personaje no encontrado' }); // 404 Not Found
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar personaje', detalle: error.message });
  }
});

// POST -> crear un nuevo personaje
router.post('/personajes', async (req, res) => {
  try {
    const { id, nombre, edad, genero, raza, clase } = req.body;

    // Validar que venga un id válido
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ error: 'El id debe ser un número' }); // 400 Bad Request
    }

    // Validar que no exista ya un personaje con ese id
    const existe = characters.some(p => p.id === idNum);
    if (existe) {
      return res.status(409).json({ error: 'Ya existe un personaje con ese id' }); // 409 Conflict
    }

    // Validar campos obligatorios
    if (!nombre || !edad || !genero || !raza || !clase) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' }); // 400 Bad Request
    }

    // Crear nuevo personaje
    const nuevoPersonaje = { id: idNum, nombre, edad, genero, raza, clase };
    characters.push(nuevoPersonaje);

    // Guardar en el archivo
    await writeFile('./data/personajes.json', JSON.stringify(characters, null, 2));

    // Responder al cliente
    return res.status(201).json({ 
      message: '🎉 Personaje creado con éxito', 
      personaje: nuevoPersonaje 
    }); // 201 Created
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear personaje', detalle: error.message });
  }
  /* ---------------- 
  {
  "id": ,
  "nombre": "",
  "edad": ,
  "genero": "",
  "raza": "",
  "clase": ""
  }
  ------------------  */

});
/* fin post */
/* zona de ejecucion */

export default router;