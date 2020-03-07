var wkhtmltopdf = require('wkhtmltopdf');
const metricsPlugin = require('fastify-metrics');

const app = require('fastify')({
    logger: true
});

app.register(metricsPlugin, {
    endpoint: '/metrics'
});

const generatePdf = (content, options, reply) => {
    [
      'output', 'ignore', 'debug', 'debugStdOut'
    ].forEach(function (tag) {
        if (options[tag]) {
            delete options[tag];
        }
    });

    wkhtmltopdf(content, options, function (error, stream) {
        if (error) {
            reply.send(error);
            return;
        }

        reply
          .headers({
              'Content-Type': 'application/pdf'
          })
          .send(stream);
    });
};

app.post('/pdf/html', async (request, reply) => {
    if(!request.body.html){
        reply.code(500).send({error:'no html property'});
    }
    generatePdf(request.body.html, request.body.options || {}, reply);
});

app.post('/pdf/url', async (request, reply) => {
    if(!request.body.url){
        reply.code(500).send({error:'no url property'});
    }
    generatePdf(request.body.url, request.body.options || {}, reply);
});

app.get('/', async (request, reply) => {
    reply.send({})
});

app.get('/healtz', async (request, reply) => {
    reply.send({})
});

app.listen(process.env.PORT || 3000, process.env.ADDRESS || '0.0.0.0', (err, address) => {
    if (err) throw err;
    app.log.info(`Server listening on ${address}`)
});
