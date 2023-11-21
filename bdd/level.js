// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

const { Pool } = require("pg");

// Utilisez le module 'set' pour obtenir la valeur de DATABASE_URL depuis vos configurations
const s = require("../set");

// Récupérez l'URL de la base de données de la variable s.DATABASE_URL
var dbUrl= 'postgresql://postgres:gIRX1xNokfnbkysQgyAF@containers-us-west-179.railway.app:8058/railway'
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Créez une pool de connexions PostgreSQL
const pool = new Pool(proConfig);




async function ajouterOuMettreAJourUserData(jid) {
    const client = await pool.connect();
    
    try {
      // Vérifiez si le JID existe déjà dans la table 'users_rank'
      const result = await client.query('SELECT * FROM users_rank WHERE jid = $1', [jid]);
      const jidExiste = result.rows.length > 0;
  
      if (jidExiste) {
        // Si le JID existe, mettez à jour XP (+5) et messages (+1)
        await client.query('UPDATE users_rank SET xp = xp + 10, messages = messages + 1 WHERE jid = $1', [jid]);
      } else {
        // Si le JID n'existe pas, ajoutez-le avec XP = 5 et messages = 1
        await client.query('INSERT INTO user_data (jid, xp, messages) VALUES ($1, $2, $3)', [jid, 10, 1]);
      }

    } catch (error) {
      console.error('Erreur lors de la mise à jour des données de l\'utilisateur:', error);
    } finally {
      client.release();
    }
  };

    
  async function getMessagesAndXPByJID(jid) {
    const client = await pool.connect();
    
    try {
      // Sélectionnez le nombre de messages et d'XP pour le JID donné
      const query = 'SELECT messages, xp FROM user_data WHERE jid = $1';
      const result = await client.query(query, [jid]);
  
      if (result.rows.length > 0) {
        // Retournez les valeurs de messages et d'XP
        const { messages, xp } = result.rows[0];
        return { messages, xp };
      } else {
        // Si le JID n'existe pas, renvoyez des valeurs par défaut (0 messages et 0 XP)
        return { messages: 0, xp: 0 };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
      return { messages: 0, xp: 0 }; // En cas d'erreur, renvoyez des valeurs par défaut
    } finally {
      client.release();
    }
  }
  


  module.exports = {
    ajouterOuMettreAJourUserData,
    getMessagesAndXPByJID,
  }
  
