const net = require("net");
const PORT = 8888;

let nextUserId = 1;
let activeUsers = 0;
let totalUsers = 0;

function processCommand(command) {
    if (command.startsWith("ECHO")) {
        return command.substring(5);
    } else if (command === "TIME") {
        let date = new Date();
        return date.toDateString() + " " + date.toLocaleTimeString();
    } else if (command === "RANDOM") {
        return Math.floor(Math.random() * 100).toString();
    } else if (command === "USERS") {
        return `Active users: ${activeUsers}, Total users: ${totalUsers}`;
    } else if (command == "HELP") {
        return `
            ECHO < text > - Echoes the text back.
            TIME - Returns the current time.
            RANDOM - Returns a random number.
            USERS - Returns the number of active and total users.
            CLOSE - Closes the connection.`;
    } else if (command === "CLOSE") {
        return "CLOSE_CONNECTION";
    } else {
        return "Unknown command";
    }
}

const server = net.createServer((socket) => {
    const userId = nextUserId++;
    activeUsers++;
    totalUsers++;

    console.log(`New client connected[${userId}]: ${socket.remoteAddress}`);

    socket.write(`Server >>> Welcome! Your ID is[${userId}]!\n`);
    socket.write(`[${userId}] >>> `);

    socket.on("data", (data) => {
        const message = data.toString().trim().toUpperCase();
        console.log(`[${userId}] >>> ${message}`);

        const response = processCommand(message, userId);

        if (response === "CLOSE_CONNECTION") {
            socket.write(`Server >>> Connection closing...\n`);
            socket.destroy();
            return;
        }

        socket.write(`Server >>> ${response}\n`);
        socket.write(`[${userId}] >>> `);
    });

    socket.on("close", () => {
        activeUsers--;
        console.log(`Client with ID:[${userId}] disconnected.`);
    });

    socket.on("error", (err) => {
        console.error(`Error with client[${userId}]:`, err.message);
        socket.destroy();
    });
});

server.listen(PORT, () => {
    console.log(`TCP server is running on port ${PORT}`);
});
