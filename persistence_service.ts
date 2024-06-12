/* Importing express framework */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

const port = 5002;

import { UserDAO, UserDAOPG } from "./models/dao";

/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: false}));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 

/* Service route creation . */
app.get('/persist', persistence_handler);
/* Server execution */
app.listen(port, listenHandler);

/* Request handlers: */
/* Persistence Service Handler */
async function persistence_handler(req:any, res:any){ 
    console.log("Persistence service request received"); //Only for debug
    let natureza: string = req.query.natureza;
    let descricao: string = req.query.descricao;
    let provedor: string = req.query.provedor
    let user_dao: UserDAO = new UserDAOPG();
    await user_dao.insert_ticket(natureza, descricao, provedor);
    res.end("Data successfully inserted");     
}

function listenHandler(){
    console.log(`Listening port ${port}!`);
}