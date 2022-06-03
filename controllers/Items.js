const { Item } = require("../models");

class ItemController {
  static async getAll(req, res, next) {
    try {
      const data = await Item.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const data = await Item.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!data) {
        throw `DataNotFound`;
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  static async add(req, res, next) {
    try {
      const { name, price, stock } = req.body;

      const data = {
        name,
        price,
        stock,
      };

      const response = await Item.create(data);

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const response = await Item.findByPk(+id);
      if (!response) throw "DataNotFound";

      await Item.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: `${response.name} Successfully Deleted` });
    } catch (error) {
      next(error);
    }
  }
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { sales, action } = req.body;
      const response = await Item.findByPk(+id);

      if (!response) throw "DataNotFound";

      let newQty = response.stock;

      let message;

      if (action === "sales") {
        await Item.decrement("stock", {
          by: sales,
          where: {
            id,
          },
        });
        message = `Stock updated from ${response.stock} to ${(newQty -=
          sales)}`;
      } else if (action === "correction") {
        await Item.increment("stock", {
          by: sales,
          where: {
            id,
          },
        });
        message = `Stock corrected from ${response.stock} to ${(newQty +=
          +sales)}`;
      }

      res.status(200).json({
        message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ItemController;
