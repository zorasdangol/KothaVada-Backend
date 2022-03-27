import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('Kotha_Vada_DB', 'kothaVadaUser', 'kothavada123', {
    dialect: 'postgres',
    host: 'localhost', 
});

export default sequelize;