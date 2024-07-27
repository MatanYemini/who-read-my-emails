// server.js
const fastify = require("fastify")({ logger: { enabled: true } });
const emailRoutes = require("./routes/emails");
const trackingRoutes = require("./routes/tracking");

fastify.register(require("@fastify/cors"));

fastify.register(require("@fastify/mongodb"), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  url: process.env.MONGODB_URI || "mongodb://localhost/email_tracking",
});

fastify.register(emailRoutes, { prefix: "/api/emails" });
fastify.register(trackingRoutes, { prefix: "/api/tracking" });

const start = async () => {
  try {
    await fastify.listen({ port: 5000, host: "0.0.0.0" });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
