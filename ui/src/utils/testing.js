import { createServer, Model } from "miragejs";

export const makeServer = () => {
  return createServer({
    environment: "test",
    models: {
      post: Model,
    },
    routes() {
      this.namespace = "api";

      this.get("/posts", (schema) => {
        return { posts: schema.posts.all().models };
      });

      this.post("/posts", (schema, request) => {
        const data = JSON.parse(request.requestBody);
        const post = schema.posts.create({
          ...data,
          uuid: `something${Math.random()}`,
        });
        return { post };
      });
    },
  });
};
