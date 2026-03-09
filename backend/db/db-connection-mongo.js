const mongoose = require('mongoose');

const getConnection = async () => {
    try {
        const url = process.env.MONGO_URI;
        await mongoose.connect(url);
        console.log('🆗 Conexión a MongoDB Atlas establecida');
    } catch (error) {
        console.error('🚧🚧🚧 Error al conectar a MongoDB:🚧🚧🚧', error);
    }
}

module.exports ={
    getConnection,
}