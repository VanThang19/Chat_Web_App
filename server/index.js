const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const fileUploadRoutes = require('./Routes/fileUploadRoutes');
const socketio = require('socket.io');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};
connectDb();

app.use('/user', userRoutes);
app.use('/upload', fileUploadRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);



// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Sử dụng socket.io
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('Có thiết bị mới đã kết nối !');

    socket.on('message', (message) => {
        // Broadcast the message to all clients
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client đã đăng xuất');
    });
});
// ... (các middleware và route khác)

app.use((err, req, res, next) => {
    console.error(err); // In ra lỗi để debug
    res.status(500).json({ message: 'Internal Server Error' });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
