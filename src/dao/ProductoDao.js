import "../config/db.js";
import { ProductosModel } from "../modules/productos.modules.js";
import logger from "../loggers/Log4jsLogger.js";

export class ProductoDao {
  ID_FIELD = "_id";

  static async exists(id) {
    try {
      return await ProductosModel.findById(id);
    } catch (err) {
      logger.error(err);
    }
  }

  async getAll() {
    try {
      return await ProductosModel.find();
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  async getProductById(objectId) {
    try {
      const product = await ProductosModel.findOne({
        [this.ID_FIELD]: objectId,
      });
      return product;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  async createProduct(object) {
    try {
      return await ProductosModel.create(object);
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  async updateProductById(id, object) {
    try {
      await ProductosModel.findByIdAndUpdate(
        {
          [this.ID_FIELD]: id,
        },
        object,
        {
          runValidators: true,
        }
      );
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  async deleteProductById(id) {
    try {
      return await ProductosModel.findByIdAndDelete({ [this.ID_FIELD]: id });
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
}
