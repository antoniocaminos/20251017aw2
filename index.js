/* zona de import */
import express from 'express';                 // framework HTTP
import dayjs from 'dayjs';                     // manejo de fechas
import { readFile, writeFile } from 'fs/promises'; // lectura/escritura async de archivos
import path from 'path';
import { log } from 'console';

/* zona de configuracion */
const app = express();                         // inicializa express
const PORT = 3000;                             // puerto por defecto
const now = dayjs().format('YYYY-MM-DD HH:mm:ss'); // fecha/hora de arranque
app.use(express.json());                       // parsear JSON en body

/* zona de data */
// leer archivo JSON (usa top-level await; asegúrate de Node con type: 'module')
const data = await readFile('./data/pesonajes.json', 'utf-8');
const characters = JSON.parse(data);           // array de personajes

/* zona de rutas methods GET */

// GET -> obtener todos los personajes
app.get('/personajes', (req, res) => {
  try {
    res.status(200).json(characters);         // 200 OK con la lista completa
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener personajes', detalle: error.message });
  }
});

// GET ordenado alfabeticamente por nombre
app.get('/personajes/ordenados', (req, res) => {
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
app.get('/personajes/:id', (req, res) => {
  try {
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
    res.status(500).json({ error: 'Error al buscar personaje', detalle: error.message });
  }
});

/* zona de rutas methods PUT */
// PUT -> actualizar personaje (reemplazo completo) 
app.put('/personajes', async (req, res) => {
  try {
    const { id, nombre, edad, genero, raza, clase } = req.body; // datos enviados
    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ error: 'El id debe ser un número' });
    }
    const index = characters.findIndex(p => p.id === idNum);
    if (index !== -1) {
      characters[index] = { id: idNum, nombre, edad, genero, raza, clase }; // reemplazo
      await writeFile('./data/pesonajes.json', JSON.stringify(characters, null, 2)); // persistir
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
app.delete('/personajes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'El id debe ser un número' });
    }
    const index = characters.findIndex(p => p.id === id);
    if (index !== -1) {
      characters.splice(index, 1);
      await writeFile('./data/pesonajes.json', JSON.stringify(characters, null, 2)); // persistir
      return res.status(200).json({ message: 'Personaje eliminado con éxito' }); // 200 OK
    } else {
      return res.status(404).json({ error: 'Personaje no encontrado' }); // 404 Not Found
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar personaje', detalle: error.message });
  }
});

/* zona de ejecucion */
app.listen(PORT, () => {
  console.log('=============================');
  console.log(`Server is alive on ${PORT}`);
  console.log('=============================');
  console.log(`Server started at ${now}`);
  console.log('=============================');
  
  
});

