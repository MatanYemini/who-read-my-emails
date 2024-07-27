async function routes(fastify, options) {
  fastify.get("/api/tracking/pixel/:trackingId", async (request, reply) => {
    try {
      const { trackingId } = request.params;
      const email = await fastify.mongo.db
        .collection("emails")
        .findOne({ "recipients.trackingId": trackingId });

      if (!email) {
        return reply.code(404).send();
      }

      const recipient = email.recipients.find(
        (r) => r.trackingId === trackingId
      );
      recipient.opens.push({
        timestamp: new Date(),
        userAgent: request.headers["user-agent"],
        ip: request.ip,
      });

      await fastify.mongo.db
        .collection("emails")
        .updateOne(
          { _id: email._id, "recipients.trackingId": trackingId },
          { $set: { "recipients.$": recipient } }
        );

      reply
        .code(200)
        .header("Content-Type", "image/gif")
        .header("Content-Length", "43")
        .send(
          Buffer.from(
            "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            "base64"
          )
        );
    } catch (error) {
      fastify.log.error("Tracking error:", error);
      reply.code(500).send();
    }
  });
}

module.exports = routes;
