import { Request, ApplicationService } from "@sap/cds";

class CatalogService extends ApplicationService {
  public hello(req: Request) {
    return `Hello, ${req.data.to}`;
  }
}

module.exports = CatalogService;
