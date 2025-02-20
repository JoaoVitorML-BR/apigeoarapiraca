import { app } from '../index';

export default function Server() {
    app.listen(3000, () => {
        console.log(`Servidor rodando na rota: http://localhost:${3000}`);
    });
}
