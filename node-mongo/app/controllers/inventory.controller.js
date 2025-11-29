const mongoose = require("mongoose");
const Inventory = mongoose.model("Inventory");

exports.createInventory = (req, res) => {
  const inventory = new Inventory({
    prodname: req.body.prodname,
    qty: req.body.qty,
    price: req.body.price,
    status: req.body.status,
  });

  inventory
    .save()
    .then((data) => res.status(200).json(data))
    .catch((err) =>
      res.status(500).json({ message: "Fail!", error: err.message })
    );
};

exports.getInventory = (req, res) => {
  Inventory.findById(req.params.id)
    .select("-__v")
    .then((inventory) => res.status(200).json(inventory))
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error retrieving inventory", error: err })
    );
};

exports.inventories = (req, res) => {
  Inventory.find()
    .select("-__v")
    .then((inventoryInfos) => res.status(200).json(inventoryInfos))
    .catch((error) => res.status(500).json({ message: "Error!", error }));
};

exports.updateInventory = (req, res) => {
  Inventory.findByIdAndUpdate(
    req.body._id,
    {
      prodname: req.body.prodname,
      qty: req.body.qty,
      price: req.body.price,
      status: req.body.status,
    },
    { new: false }
  )
    .select("-__v")
    .then((inventory) => res.status(200).json(inventory))
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error updating inventory", error: err.message })
    );
};

exports.deleteInventory = (req, res) => {
  Inventory.findByIdAndRemove(req.params.id)
    .select("-__v -_id")
    .then((inventory) => res.status(200).json({}))
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error deleting inventory", error: err.message })
    );
};
