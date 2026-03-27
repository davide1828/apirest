require('dotenv').config();
const mongoose = require('mongoose');

const Genero = require('./models/generoModel');
const Director = require('./models/directorModel');
const Productora = require('./models/productoraModel');
const Tipo = require('./models/tipoModel');
const Media = require('./models/mediaModel');

const seedCollections = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('⏳ Conectado a Atlas. Vaciando colecciones para poblar datos limpios unificados...');
        await Genero.deleteMany({});
        await Director.deleteMany({});
        await Productora.deleteMany({});
        await Tipo.deleteMany({});
        await Media.deleteMany({});

        // 1. Tipos
        const tipos = await Tipo.insertMany([
            { nombre: 'Película', descripcion: 'Audiovisual formato estándar película' },
            { nombre: 'Serie', descripcion: 'Contenido episódico' },
            { nombre: 'Documental', descripcion: 'Informativos y biográficos' }
        ]);

        // 2. Géneros
        const generos = await Genero.insertMany([
            { nombre: 'Acción', descripcion: 'Mucha explosión' },
            { nombre: 'Comedia', descripcion: 'Risadas aseguradas' },
            { nombre: 'Drama', descripcion: 'Tramas profundas' },
            { nombre: 'Ciencia Ficción', descripcion: 'Tecnología especulativa' },
            { nombre: 'Terror', descripcion: 'Miedo extremo' }
        ]);

        // 3. Directores (Total 7)
        const directores = await Director.insertMany([
            { nombre: 'Christopher Nolan' },
            { nombre: 'Quentin Tarantino' },
            { nombre: 'Steven Spielberg' },
            { nombre: 'Denis Villeneuve' },
            { nombre: 'David Fincher' },
            { nombre: 'Matt Duffer' },
            { nombre: 'Peter Jackson' }
        ]);

        // 4. Productoras (Total 6)
        const productoras = await Productora.insertMany([
            { nombre: 'Warner Bros', slogan: 'We tell stories' },
            { nombre: 'Universal Pictures', slogan: 'Universal Studios' },
            { nombre: 'Paramount', slogan: 'Mountain' },
            { nombre: 'A24', slogan: 'Independent Films' },
            { nombre: 'Netflix Originals', slogan: 'See What\'s Next' },
            { nombre: 'Disney', slogan: 'Magical' }
        ]);

        // Generador secuencial ligero
        let globalSerialCounter = 1;
        const getSerial = () => `PEL-${String(globalSerialCounter++).padStart(4, '0')}`;

        // 5. Medias (7 registros completos)
        const mediasToInsert = [
            {
                serial: getSerial(),
                titulo: 'El Origen (Inception)',
                sinopsis: 'Película sobre robo de ideas dentro de los sueños.',
                urlPelicula: 'https://ejemplo.com/inception',
                imagen: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
                anioEstreno: 2010,
                genero: generos.find(g => g.nombre === 'Ciencia Ficción')._id,
                director: directores.find(d => d.nombre === 'Christopher Nolan')._id,
                productora: productoras.find(p => p.nombre === 'Warner Bros')._id,
                tipo: tipos.find(t => t.nombre === 'Película')._id
            },
            {
                serial: getSerial(),
                titulo: 'Dune: Part One',
                sinopsis: 'Paul Atreides viaja al planeta más peligroso del universo.',
                urlPelicula: 'https://ejemplo.com/dune',
                imagen: 'https://cdn.unotv.com/images/2024/02/dune-1-093641.jpg',
                anioEstreno: 2021,
                genero: generos.find(g => g.nombre === 'Ciencia Ficción')._id,
                director: directores.find(d => d.nombre === 'Denis Villeneuve')._id,
                productora: productoras.find(p => p.nombre === 'Warner Bros')._id,
                tipo: tipos.find(t => t.nombre === 'Película')._id
            },
            {
                serial: getSerial(),
                titulo: 'Se7en (Seven)',
                sinopsis: 'Dos detectives persiguen a un asesino serial retorcido.',
                urlPelicula: 'https://ejemplo.com/seven',
                imagen: 'https://upload.wikimedia.org/wikipedia/en/6/68/Seven_%28movie%29_poster.jpg',
                anioEstreno: 1995,
                genero: generos.find(g => g.nombre === 'Drama')._id,
                director: directores.find(d => d.nombre === 'David Fincher')._id,
                productora: productoras.find(p => p.nombre === 'A24')._id,
                tipo: tipos.find(t => t.nombre === 'Película')._id
            },
            {
                serial: getSerial(),
                titulo: 'The Lord of the Rings: The Fellowship of the Ring',
                sinopsis: 'Un hobbit y ocho acompañantes comienzan el viaje al Monte del Destino.',
                urlPelicula: 'https://ejemplo.com/lotr',
                imagen: 'https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/fb9f961f-6302-4776-91d7-f1b7a69fb61d/58b8bd07-dcf7-11f0-8a08-0afffe07dfc1?host=wbd-images.prod-vod.h264.io&partner=beamcom',
                anioEstreno: 2001,
                genero: generos.find(g => g.nombre === 'Acción')._id,
                director: directores.find(d => d.nombre === 'Peter Jackson')._id,
                productora: productoras.find(p => p.nombre === 'Universal Pictures')._id,
                tipo: tipos.find(t => t.nombre === 'Película')._id
            },
            {
                serial: getSerial(),
                titulo: 'Stranger Things',
                sinopsis: 'Un niño desaparece, y un pueblo destapa un misterio de experimentos secretos.',
                urlPelicula: 'https://ejemplo.com/stranger-things',
                imagen: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png',
                anioEstreno: 2016,
                genero: generos.find(g => g.nombre === 'Ciencia Ficción')._id,
                director: directores.find(d => d.nombre === 'Matt Duffer')._id,
                productora: productoras.find(p => p.nombre === 'Netflix Originals')._id,
                tipo: tipos.find(t => t.nombre === 'Serie')._id
            },
            {
                serial: getSerial(),
                titulo: 'Mindhunter',
                sinopsis: 'Dos agentes del FBI revolucionan la perfilación criminal.',
                urlPelicula: 'https://ejemplo.com/mindhunter',
                imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBQ2J7UDcUxWToWx0jxDVsvloFIsYM6Hpv9Q&s',
                anioEstreno: 2017,
                genero: generos.find(g => g.nombre === 'Drama')._id,
                director: directores.find(d => d.nombre === 'David Fincher')._id,
                productora: productoras.find(p => p.nombre === 'Netflix Originals')._id,
                tipo: tipos.find(t => t.nombre === 'Serie')._id
            },
            {
                serial: getSerial(),
                titulo: 'The Mandalorian',
                sinopsis: 'Los viajes de un cazarrecompensas en los bordes lejanos de la galaxia.',
                urlPelicula: 'https://ejemplo.com/mandalorian',
                imagen: 'https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/ea78b4f8-f180-41e5-9aac-9e99c96fb4ac/compose?aspectRatio=1.78&format=webp&width=1200',
                anioEstreno: 2019,
                genero: generos.find(g => g.nombre === 'Ciencia Ficción')._id,
                director: directores.find(d => d.nombre === 'Denis Villeneuve')._id, // Usamos uno existente
                productora: productoras.find(p => p.nombre === 'Disney')._id,
                tipo: tipos.find(t => t.nombre === 'Serie')._id
            }
        ];

        await Media.insertMany(mediasToInsert);

        console.log(`✅ ¡Éxito! 7 Medios Audiovisuales, 6 productoras, y 7 directores registrados correctamente y enlazados.`);
        process.exit(0);

    } catch (err) {
        console.error('XXX ERROR FATAL XXX', err.message);
        process.exit(1);
    }
};

seedCollections();
