import {app} from '../index';

export default function Server() {
    const PORT = 1952;
    const HOST = '0.0.0.0';
    app.listen(PORT, HOST, () => {
        console.log("Servidor rodando na rota: http://localhost:1952");
    });
}