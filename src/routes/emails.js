// routes/emails.js
const emailService = require("../services/emails");

async function routes(fastify, options) {
  fastify.post("/api/emails/send", async (request, reply) => {
    try {
      const { recipients, subject, body } = request.body;
      const emailId = await emailService.sendEmail(
        fastify,
        recipients,
        subject,
        body
      );
      reply.send({ success: true, emailId });
    } catch (error) {
      fastify.log.error("Failed to send email:", error);
      reply.code(500).send({ error: "Failed to send email" });
    }
  });

  fastify.get("/api/emails/:id", async (request, reply) => {
    try {
      const email = await fastify.mongo.db.collection("emails").findOne({
        _id: new fastify.mongo.ObjectId(request.params.id),
      });

      if (!email) {
        return reply.code(404).send({ error: "Email not found" });
      }

      reply.send(email);
    } catch (error) {
      fastify.log.error("Failed to retrieve email:", error);
      reply.code(500).send({ error: "Failed to retrieve email" });
    }
  });
}

module.exports = routes;
