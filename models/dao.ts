import mysql from 'mysql2/promise';
import { Client } from 'pg';

interface UserDAO{
    insert_ticket(natureza: string, descricao: string, provedor: string ):any;
}

class UserDAOPG implements UserDAO{
    //Configuração do Banco
    dbConfig:Object = {
        user: 'postgres',
        host: 'localhost',
        database: 'p3',
        password: 'root',
        port: 5432,
    };

    async insert_ticket(natureza: string, descricao: string, provedor: string) {
        const client = new Client(this.dbConfig);
        let data={'natureza': natureza, 'descricao': descricao, 'provedor':provedor}
        console.log(data); //debug
        await client.connect();
        console.log('Conexão com o banco realizado com sucesso');
        //query de inserção
        const insertQuery = 'INSERT INTO ticket(natureza, descricao, provedor) VALUES ($1, $2, $3)';
            client.query(insertQuery, [data.natureza, data.descricao, data.provedor])
                .then(result => {
                    console.log('Dados inseridos com sucesso');
                })
                .catch(error => {
                    console.error('Erro na execução da query', error);
                })
                .finally(() => {
                    console.log("Conexão com o banco finalizada");
                    client.end();
                })
    }
}


class UserDAOMARIA implements UserDAO{
    dbConfig:Object = {
        user: 'root',
        host: 'localhost',
        database: 'p3',
        password: 'root',
        port: 3306,
    };

    async insert_ticket(natureza: string, descricao: string, provedor: string) {
        const connection = await mysql.createConnection(this.dbConfig);
        let data = { 'natureza': natureza, 'descricao': descricao, 'provedor': provedor };
        console.log(data); // debug

        try {
            console.log('Conexão com o banco realizada com sucesso');
            // query de inserção
            const insertQuery = 'INSERT INTO ticket(natureza, descricao, provedor) VALUES (?, ?, ?)';
            await connection.execute(insertQuery, [data.natureza, data.descricao, data.provedor]);
            console.log('Dados inseridos com sucesso');
        } catch (error) {
            console.error('Erro na execução da query', error);
        } finally {
            console.log("Conexão com o banco finalizada");
            await connection.end();
        }
    }
}


export{
    UserDAO, UserDAOPG, UserDAOMARIA
}