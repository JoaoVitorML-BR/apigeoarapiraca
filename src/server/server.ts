import {app} from '../index';

export default function Server() {
    app.listen(1952, () => {
        console.log("Servidor rodando na rota: http://localhost:1952");
    });
}