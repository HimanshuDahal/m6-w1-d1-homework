module.exports = function (app) {
  const inventories = require("../controllers/inventory.controller.js");

  app.post("/api/inventory", inventories.createInventory);
  app.get("/api/inventory/:id", inventories.getInventory);
  app.get("/api/inventories", inventories.inventories);
  app.put("/api/inventory", inventories.updateInventory);
  app.delete("/api/inventory/:id", inventories.deleteInventory);
};
