const { Transaction, sequelize } = require("../models");
const axios = require("axios");
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
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  static async add(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { CompanyId, ItemId, price, sales } = req.body;
      const { access_token } = req.headers;
      const payload = {
        CompanyId,
        ItemId,
        price,
        sales,
      };

      const response = await Transaction.create(payload, { transaction: t });

      const { data } = await axios({
        method: "patch",
        url: `http://localhost:4001/items/${ItemId}`,
        data: {
          sales,
          action: "sales",
        },
        headers: {
          access_token,
        },
      });

      res.status(201).json({ response, data });
      await t.commit();
    } catch (err) {
      await t.rollback();
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
      res.status(200).json({
        message: `Transaction Id ${response.id} Successfully Deleted`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async update(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { CompanyId, ItemId, price, sales } = req.body;
      let action;
      let updatedSales;
      const response = await Transaction.findByPk(+id);

      if (!response) throw "DataNotFound";

      await Transaction.update(
        { CompanyId, ItemId, price, sales },
        {
          where: {
            id,
          },
        }
      );

      if (response.sales > sales) {
        action = "correction";
        updatedSales = response.sales - sales;
      } else if (response.sales < sales) {
        action = "sales";
        updatedSales = sales - response.sales;
      }

      const { data } = await axios({
        method: "patch",
        url: `http://localhost:4001/items/${ItemId}`,
        data: {
          sales,
          action,
        },
        headers: {
          access_token,
        },
      });

      res.status(200).json({
        before: response,
        after: { id: response.id },
      });
      await t.commit();
    } catch (error) {
      await t.rollback();

      next(error);
    }
  }
}

module.exports = TransactionController;
