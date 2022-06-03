const { Transaction, sequelize } = require("../models");

class TransactionController {
  static async getAll(req, res, next) {
    try {
      const data = await Transaction.findAll({
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
      const data = await Transaction.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!data) {
        throw `DataNotFound`;
      } else {
        res.status(200).json({ data });
      }
    } catch (error) {
      next(error);
    }
  }

  static async add(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { CompanyId, ItemId, price, sales } = req.body;

      const data = {
        CompanyId,
        ItemId,
        price,
        sales,
      };

      const response = await Transaction.create(data);

      res.status(201).json({ response });
    } catch (err) {
      next(err);
    }
  }
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const response = await Transaction.findByPk(+id);
      if (!response) throw "DataNotFound";

      await Transaction.destroy({
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

      const response = await Transaction.findByPk(+id);

      if (!response) throw "DataNotFound";

      let newQty = response.stock;

      let message;

      if (action === "sales") {
        await Transaction.decrement("stock", {
          by: sales,
          where: {
            id,
          },
        });
        message = `Stock updated from ${response.stock} to ${(newQty -=
          sales)}`;
      } else if (action === "correction") {
        await Transaction.increment("stock", {
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

module.exports = TransactionController;
