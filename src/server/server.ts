import { app } from '../index';

export default function Server() {
    app.listen(process.env.PORT_SEVER, process.env.HOST_LOCAL, () => {
        console.log(`Servidor rodando na rota: http://localhost:${process.env.PORT_SEVER}`);
    });
}
