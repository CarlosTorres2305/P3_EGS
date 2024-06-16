import { SingletonLogger } from "./models/logService";
const express = require('express');

const logger = SingletonLogger.getInstance();

/* component to read body requests from forms */
const bodyParser = require('body-parser');

/* module to generate requests to service gateway */
var axios = require('axios');
import { AxiosResponse, AxiosError } from "axios";

const app = express();
const port = 5003;


/* Template engine configuration */
app.set('view engine', 'ejs');
app.set('views', './views'); //This reference is from the execution point

/* Configuration to read post request parameters */
app.use(bodyParser.urlencoded({extended: false}));


/* Static files directory configuration .*/
app.use(express.static('src/public'));




app.post('/persist', persist_insert_ticket);
//app.get('/', root_client_handler);
app.get('/persist_form', persist_client_handler);
app.listen(port, listenHandler);

/* Function to return text persistence interface */
function persist_client_handler(req:any,res:any){
    res.render('index.ejs');
    logger.info('Página de Abertura de chamados aberta'); 
}

async function persist_insert_ticket(req:any,res:any){
    let natureza = req.body.natureza;
    let descricao = req.body.descricao;
    let provedor = req.body.provedor;
    console.log(natureza);
    console.log(descricao);
    console.log(provedor);
    let url = 'http://localhost:5000/persistence?natureza='+natureza+'&descricao='+descricao+'&provedor='+provedor;
    axios.get(url)
            .then((response: AxiosResponse) => {
                res.render('response.ejs', {service_response: response.data});
                logger.info(`service response: ${JSON.stringify(response.data)}`);
                // Handle successful response
                console.log('Response status:', response.status);
                logger.info(`Response status: ${JSON.stringify(response.status)}`);
                console.log('Response data:', response.data);
                logger.info(`Response data: ${response.data}`);
            })
            .catch((error: AxiosError) => {
                // Handle error
                if (error.response) {
                // Server responded with some error status code
                console.error('Response data:', error.response.data);
                logger.critical(`Response data: ${error.response.data}`);
                console.error('Response status:', error.response.status);
                logger.critical(`Response status: ${JSON.stringify(error.response.status)}`);
                console.error('Response headers:', error.response.headers);
                console.error(`Response headers: ${error.response.headers}`);
                } else if (error.request) {
                // no response was sent
                console.error('Request:', error.request);
                logger.error(`Request ${error.request}`);
                } else {
                // Some processing error
                console.error('Error:', error.message);
                logger.error(`Error: ${error.message}`);
                }
            });   
    
}

/* Tratador para inicializar a aplicação (escutar as requisições)*/
function listenHandler(){
    console.log(`Escutando na porta ${port}!`);
    logger.info(`Cliente_app iniciado, Rodando na porta ${port}`);
}

export{}