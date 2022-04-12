const http = require('http');
const fs = require('fs');
const url = require('url'); //para capturar la query string en DELETE
const PORT = 3000;
const host = 'localhost';
const {
  guardarCandidato,
  getCandidatos,
  editCandidato,
  eliminarCandidato,
  registrarVoto,
  getHistorial,
} = require('./query');

const requestListener = async (req, res) => {
  //RUTA RAIZ SERVER
  if (req.url == '/' && req.method === 'GET') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end();
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  }
  //RUTA POST - GUARDAR CANDIDATOS //Se Visualza solo BD
  if (req.url == '/candidato' && req.method == 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body = chunk.toString();
    });
    req.on('end', async () => {
      // const datos = Object.values(JSON.parse(body));
      const candidato = JSON.parse(body);
      try {
        const respuesta = await guardarCandidato(candidato);
        res.statusCode = 201;
        res.end(JSON.stringify(respuesta));
      } catch (error) {
        res.statusCode = 500;
        res.end('Ha oucrrido un error: ' + error);
      }
    });
  }

  //RUTA GET - VISUALIZAR CANDIDATOS EN HTML
  if (req.url == '/candidatos' && req.method === 'GET') {
    try {
      const candidatos = await getCandidatos();
      res.statusCode = 201;
      res.end(JSON.stringify(candidatos));
    } catch (error) {
      res.statusCode = 500;
      res.end('Ha oucrrido un error: ' + error);
    }
  }

  //RUTA PUT - EDITAR CANDIDATOS EN EL MODAL
  if (req.url == '/candidato' && req.method === 'PUT') {
    let body = '';
    req.on('data', (chunk) => {
      body = chunk.toString();
    });
    req.on('end', async () => {
      const candidato = JSON.parse(body);
      try {
        const respuesta = await editCandidato(candidato);
        res.statusCode = 200;
        res.end(JSON.stringify(respuesta));
      } catch (error) {
        res.statusCode = 500;
        res.end('Ha oucrrido un error: ' + error);
      }
    });
  }

  //RUTA DELETE EN CARD HTML
  //starWith o includes porque tambien va una query string
  if (req.url.startsWith('/candidato?id') && req.method == 'DELETE') {
    try {
      let { id } = url.parse(req.url, true).query;
      await eliminarCandidato(id);
      res.statusCode = 201;
      res.end('Candidato Eliminado');
    } catch (error) {
      res.statusCode = 500;
      res.end('Ha oucrrido un error: ' + error);
    }
  }

  //RUTA POST - REGISTRO VOTOS en CARD HTML
  if (req.url == '/votos' && req.method == 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body = chunk.toString();
    });
    req.on('end', async () => {
      // const datos = Object.values(JSON.parse(body));
      const voto = JSON.parse(body);
      try {
        const respuesta = await registrarVoto(voto);
        res.statusCode = 201;
        res.end(JSON.stringify(respuesta));
      } catch (error) {
        res.statusCode = 500;
        res.end('Ha oucrrido un error: ' + error);
      }
    });
  }

  //RUTA GET - VER VOTOS EN HTML (HISTORIAL VOTOS en TABLA RESULTADO DE LAS VOTACIONES)

  if (req.url == '/historial' && req.method === 'GET') {
    try {
      const historial = await getHistorial();
      res.end(JSON.stringify(historial));
    } catch (error) {
      res.statusCode = 500;
      res.end('Ha oucrrido un error: ' + error);
    }
  }
};

//ARMANDO SERVER

const server = http.createServer(requestListener);

//LEVANTANDO SERVER

server.listen(PORT, host, () => {
  console.log('Servidor se esta ejcutando');
});
