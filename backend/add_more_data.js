require('dotenv').config();
const mongoose = require('mongoose');

const Genero = require('./models/generoModel');
const Director = require('./models/directorModel');
const Productora = require('./models/productoraModel');
const Tipo = require('./models/tipoModel');
const Media = require('./models/mediaModel');

const generateSerialNumber = async () => {
    const lastMedia = await Media.findOne({ serial: /^PEL-\d+$/ })
        .sort({ serial: -1 })
        .collation({ locale: "en_US", numericOrdering: true });
    let nextNumber = 1;
    if (lastMedia && lastMedia.serial) {
        const match = lastMedia.serial.match(/^PEL-(\d+)$/);
        if (match && match[1]) nextNumber = parseInt(match[1], 10) + 1;
    }
    let serial = `PEL-${String(nextNumber).padStart(4, '0')}`;
    let exists = await Media.findOne({ serial });
    while (exists) {
        nextNumber++;
        serial = `PEL-${String(nextNumber).padStart(4, '0')}`;
        exists = await Media.findOne({ serial });
    }
    return serial;
};

const seedMoreData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('⏳ Conectado a MongoDB. Insertando nuevos datos...');

        // 3 Productoras
        const productoras = await Productora.insertMany([
            { nombre: 'A24', slogan: 'Independent', descripcion: 'Estudio independiente aclamado' },
            { nombre: 'Netflix Originals', slogan: 'See What\'s Next', descripcion: 'Productora exclusiva de streaming' },
            { nombre: 'Disney', slogan: 'The Most Magical Place on Earth', descripcion: 'Gigante del entretenimiento' }
        ]);
        console.log(`✅ 3 Productoras insertadas.`);

        // 4 Directores
        const directores = await Director.insertMany([
            { nombre: 'Denis Villeneuve' },
            { nombre: 'David Fincher' },
            { nombre: 'Matt Duffer' },
            { nombre: 'Peter Jackson' }
        ]);
        console.log(`✅ 4 Directores insertados.`);

        // Traer tipos y generos existentes para amarrarlos
        const tipoPeli = await Tipo.findOne({ nombre: 'Película' });
        const tipoSerie = await Tipo.findOne({ nombre: 'Serie' });
        
        const genCiFi = await Genero.findOne({ nombre: 'Ciencia Ficción' });
        const genDrama = await Genero.findOne({ nombre: 'Drama' });
        const genAccion = await Genero.findOne({ nombre: 'Acción' });

        // 3 Películas
        const peliculas = [
            {
                serial: await generateSerialNumber(),
                titulo: 'Dune: Part One',
                sinopsis: 'Adaptación de la obra de ciencia ficción de Frank Herbert.',
                urlPelicula: 'https://ejemplo.com/dune',
                imagen: 'https://m.media-amazon.com/images/M/MV5BMDQ0NjgyN2YtNWViNS00YjA3LTkxNDktMDZmNTJjMTE5Zjc0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
                anioEstreno: 2021,
                genero: genCiFi._id,
                director: directores[0]._id, // Denis
                productora: productoras[0]._id, // A24 (simulado)
                tipo: tipoPeli._id
            },
            {
                serial: await generateSerialNumber(),
                titulo: 'Fight Club',
                sinopsis: 'Un oficinista y un fabricante de jabón forman un club underground.',
                urlPelicula: 'https://ejemplo.com/fight-club',
                imagen: 'https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00ODNlLTkwNmYtYWQwYGI2OTBiOWQzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
                anioEstreno: 1999,
                genero: genDrama._id,
                director: directores[1]._id, // Fincher
                productora: productoras[2]._id, // Disney (simulado)
                tipo: tipoPeli._id
            },
            {
                serial: await generateSerialNumber(),
                titulo: 'The Lord of the Rings',
                sinopsis: 'Un hobbit de la Comarca y ocho compañeros inician un viaje.',
                urlPelicula: 'https://ejemplo.com/lotr',
                imagen: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhOS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
                anioEstreno: 2001,
                genero: genAccion._id,
                director: directores[3]._id, // Peter Jackson
                productora: productoras[1]._id, // Netflix (simulado)
                tipo: tipoPeli._id
            }
        ];
        
        for (let p of peliculas) {
            await new Media(p).save();
        }
        console.log(`✅ 3 Películas insertadas.`);

        // 3 Series
        const series = [
            {
                serial: await generateSerialNumber(),
                titulo: 'Stranger Things',
                sinopsis: 'Sucesos extraños en Hawkins.',
                urlPelicula: 'https://ejemplo.com/stranger-things',
                imagen: 'https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWEyLWE0NjYtNWFhODc5ODEzYjg1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
                anioEstreno: 2016,
                genero: genCiFi._id,
                director: directores[2]._id, // Matt Duffer
                productora: productoras[1]._id, // Netflix
                tipo: tipoSerie._id
            },
            {
                serial: await generateSerialNumber(),
                titulo: 'Mindhunter',
                sinopsis: 'Dos agentes del FBI entrevistan asesinos en serie.',
                urlPelicula: 'https://ejemplo.com/mindhunter',
                imagen: 'https://m.media-amazon.com/images/M/MV5BNWNmYzQ1ZWUtYTQ3NE00ODIzLTkwOWYtYjk4NTUwZjk3OWJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
                anioEstreno: 2017,
                genero: genDrama._id,
                director: directores[1]._id, // Fincher
                productora: productoras[1]._id, // Netflix
                tipo: tipoSerie._id
            },
            {
                serial: await generateSerialNumber(),
                titulo: 'The Mandalorian',
                sinopsis: 'Un cazarrecompensas solitario atraviesa la galaxia.',
                urlPelicula: 'https://ejemplo.com/mandalorian',
                imagen: 'https://m.media-amazon.com/images/M/MV5BMjA5MTIxNDUtNTE0OS00MDZiLWIyZTAtMGZkNmMyNjI3NDA4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
                anioEstreno: 2019,
                genero: genCiFi._id,
                director: directores[0]._id, // Denis (simulado, es Favreau pero usemos este)
                productora: productoras[2]._id, // Disney
                tipo: tipoSerie._id
            }
        ];

        for (let s of series) {
            await new Media(s).save();
        }
        console.log(`✅ 3 Series insertadas.`);

        console.log(`🎉 ¡Operación completada de manera exitosa!`);
        process.exit(0);
    } catch (err) {
        console.log('XXX ERROR FATAL XXX', err.message, err.stack);
        process.exit(1);
    }
}

seedMoreData();
