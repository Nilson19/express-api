import http from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { env } from './config/env';

const PORT = env.port;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});


app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);

  socket.on('subscribeToShipment', (shipmentId: number) => {
    socket.join(`shipment-${shipmentId}`);
    console.log(`🔔 Cliente suscrito a shipment-${shipmentId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
