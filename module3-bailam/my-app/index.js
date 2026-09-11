const http = require("http");

let products = [
    { id: 1, name: "iPhone", category: "phone", price: 2000000 }
];

const server = http.createServer((req, res) => {

    if (req.url === "/") {
        res.end("Home");
    } else if (req.method === "GET" && req.url === "/products") {
        res.end(
            JSON.stringify({
                name: "iPhone",
                price: 1000,
            })
        );
    } else if (req.method === "POST" && req.url === "/products") {

        let body = " ";
        req.on("data", chunk => body += chunk) // giống localstorage, cộng dồn
        req.on("end", () => {

            try {
                const newProduct = JSON.parse(body);
                newProduct.id = products.length + 1; // cộng dồn ID
                products.push(newProduct);

                res.writeHead(201, {"Content-type": "application/json"});
                res.end(JSON.stringify(newProduct));
            } catch (err) {
                res.writeHead(400, {"Content-type": "application/json"});
                res.end(JSON.stringify({"err": "Invalid JSON"}));
            }
        })

        return;
        res.end("Use POST /products");
    } else if (req.method === "PUT" && req.url.startsWith("/products/")) {

        // http://localhost:3000/products/1
        const id = parseInt(req.url.split("/")[2]) // Sau khi split: ["http://localhost:3000","products", "1"]

        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const before = products[0];
            console.log(before)

            const updated = JSON.parse(body);
            products = products.map(p =>
                p.id === id ? { ...p, ...updated } : p
            );

            const after = JSON.parse(body);
            console.log(after)
            res.end(JSON.stringify(before));
        });
        return;
        res.end("Use PUT /products/:id");

    }  else if (req.method === "PATCH" && req.url.startsWith("/products/")) {

        // http://localhost:3000/products/1
        const id = parseInt(req.url.split("/")[2]) // Sau khi split: ["http://localhost:3000","products", "1"]

        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const updated = JSON.parse(body);
            const product = products.find(p => p.id === id);
            Object.assign(product, updated); // Thay đổi một phần
            res.end(JSON.stringify(product));
        });
        return;
        res.end("Use PATCH /products/:id");
    } else if (req.method === "DELETE" && req.url.startsWith("/products/")) {

        // http://localhost:3000/products/1
        const id = parseInt(req.url.split("/")[2]) // Sau khi split: ["http://localhost:3000","products", "1"]
        const exists = products.some(p => p.id === id);
        if (!exists) {
            res.writeHead(404);
            return res.end("Not found");
        }
        product = products.filter(p => p.id !== id);
        res.writeHead(204);
        res.end();
        return;

        res.end("Use DELETE /products/:id");
    }
});

server.listen(3000);
