
'use strict';

const Hapi = require('@hapi/hapi');
const fs = require('fs');


const productsJson = fs.readFileSync(__dirname + '/products.json');
const products = JSON.parse(productsJson);
const arr = Object.values(products);
const primes = arr[0].concat(arr[1]);
const prime2 = primes.concat(arr[2]);
const idMapping = prime2.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});
let root;


prime2.forEach(el => {
  // Handle the root element
  if (el.parent_id === null) {
    root = el;
    return;
  }
  // Use our mapping to locate the parent element in our data array
  const parentEl = prime2[idMapping[el.parent_id]];
  // Add our current el to its parent's `children` array
  parentEl.children = [...(parentEl.children || []), el];
});



console.log(root);
const myJSON = JSON.stringify(root);
console.log(myJSON);







const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/health',
        handler: (request, h) => {
            return {
                statusCode: 200,
                message: 'OK'
            };
        },
    });
    
    server.route({
        method: 'GET',
        path: '/products',
        handler: (require, h) => {


            return products;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();