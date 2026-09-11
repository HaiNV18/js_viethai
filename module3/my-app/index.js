const http = require("http");

let products = [
    { id: 1, name: "iPhone" }
];

const server = http.createServer((req, res) => {
    if (req.method === "PUT" && req.url.startsWith("/products/")) {
        const id = parseInt(req.url.split("/")[2]);
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const updated = JSON.parse(body);
            products = products.map(p =>
                p.id === id ? { ...p, ...updated } : p
            );
            res.end("Updated");
        });
        return;
    }
    res.end("Use PUT /products/:id");
});

server.listen(3000);
