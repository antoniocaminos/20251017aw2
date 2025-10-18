/* zona de import */
import express from 'express';                 // framework HTTP
import dayjs from 'dayjs';                     // manejo de fechas
import { readFile, writeFile } from 'fs/promises'; // lectura/escritura async de archivos
import path from 'path';
import { log } from 'console';
import personajesRoutes from './routes/personajes.routes.js'; // rutas de personajes

/* zona de configuracion */
const app = express();                         // inicializa express
const PORT = 3000;                             // puerto por defecto
const now = dayjs().format('YYYY-MM-DD HH:mm:ss'); // fecha/hora de arranque
app.use(express.json());                       // parsear JSON en body

app.use('/', personajesRoutes);            // usar rutas de personajes

app.listen(PORT, () => {
  console.log('=============================');
  console.log(`Server is alive on ${PORT}`);
  console.log('=============================');
  console.log(`Server started at ${now}`);
  console.log('=============================');  
});

