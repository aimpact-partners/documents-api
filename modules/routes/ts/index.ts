import { UploaderDocuments } from "./routes/uploader";
import { list } from "./routes/list";

export /*bundle*/
function routes(app) {
  app.get("/", (req, res) => res.send("AImpact Documents http server"));
  app.get("/documents/:project/:container", list);
  new UploaderDocuments(app);
}
