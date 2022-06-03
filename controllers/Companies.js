const { Company } = require("../models");

class CompanyController {
  static async getAll(req, res, next) {
    try {
      const data = await Company.findAll({
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
      const data = await Company.findByPk(id, {
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
    try {
      const { name, location } = req.body;

      const data = {
        name,
        location,
      };

      const response = await Company.create(data);

      res.status(201).json({ response });
    } catch (err) {
      next(err);
    }
  }
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const response = await Company.findByPk(+id);
      if (!response) throw "DataNotFound";

      await Company.destroy({
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
      const { name, location } = req.body;

      const response = await Company.findByPk(+id);

      if (!response) throw "DataNotFound";

      await Company.update(
        { name, location },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        before: response,
        after: { id: response.id, name, location },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompanyController;
