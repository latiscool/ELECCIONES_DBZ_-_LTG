const pg = require('pg');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'elecciones',
  password: 'postgresql',
  port: 5432,
});

const guardarCandidato = async (datos) => {
  //Objetc.values valores del objeto los guarda en un arreglo
  const values = Object.values(datos);
  const query = {
    text: 'INSERT INTO candidatos (nombre,foto,color,votos) VALUES ($1,$2,$3,0) RETURNING *;',
    values,
  };
  try {
    const result = await pool.query(query);

    return result;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};

const getCandidatos = async () => {
  const query = {
    text: 'SELECT * FROM candidatos;',
  };
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};

const editCandidato = async (datos) => {
  const values = Object.values(datos);
  const query = {
    text: 'UPDATE candidatos SET nombre = $1, foto = $2 WHERE id = $3 RETURNING *;',
    values,
  };
  try {
    const res = await pool.query(query);
    return res;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};
const eliminarCandidato = async (id) => {
  const query = {
    text: `DELETE FROM candidatos WHERE id= ${id};`,
  };
  try {
    const resul = await pool.query(query);
    return resul.rows;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};

const registrarVoto = async (voto) => {
  //Objetc.values valores del objeto los guarda en un arreglo
  const values = Object.values(voto);
  //Inserta los votos en la tabla "Resultado de las votaciones"
  const regVotoTablaResultado = {
    text: 'INSERT INTO historial (estado,votos,ganador) VALUES ($1, $2, $3) RETURNING *;',
    values,
  };
  //Actualizado el voto de la CARD del HTML
  const regVotoCandidato = {
    text: 'UPDATE candidatos SET votos= votos + $1 WHERE nombre = $2 RETURNING *;',
    //el parametro $1, corresponde de manera formateada al valor que se definio en el input
    values: [Number(values[1]), values[2]],
  };
  try {
    await pool.query('BEGIN');
    await pool.query(regVotoTablaResultado);
    await pool.query(regVotoCandidato);
    await pool.query('COMMIT');
    return true;
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
};

const getHistorial = async () => {
  const query = {
    rowMode: 'array',
    text: 'SELECT * FROM historial;',
  };
  try {
    const res = await pool.query(query);
    //Un arreglos de arreglos
    return res.rows;
  } catch (error) {
    console.log('Error: ', error);
    return error;
  }
};

module.exports = {
  guardarCandidato,
  getCandidatos,
  editCandidato,
  eliminarCandidato,
  registrarVoto,
  getHistorial,
};
