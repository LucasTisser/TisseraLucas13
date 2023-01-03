import "../config/db.js";
import { UsuariosModel } from "../modules/usuarios.modules.js";
import logger from "../loggers/Log4jsLogger.js";

export class UsuariosDao {

    async registerUser(user) {
        // Registrar un usuario en la base de mongo
        try {
          const createdUser = user 
            return await UsuariosModel.create(createdUser);
          } catch (err) {
            logger.error(err);
            return false;
          }
    }

    async findUser(user) {
        try {
          // Busca un usuario por su user, devuelve el usuario completo
            const findedUser = await UsuariosModel.findOne({
              username: user,
            });
            return findedUser;
          } catch (err) {
            logger.error(err);
            return false;
          }
    }

    async logUser(user, password) {
        try {
            // Busca un usuario por su user y contraseña, devuelve el usuario completo
            const logUser = await UsuariosModel.findOne({
                username: user,
                password: password
            })
            return logUser
        } catch (err) {
            logger.error(err)
            return false
        }
    }

    async updateCount(user, counter) {
      // Recibir el usuario
      // buscar en la base de mongo
      // Tomar al contador y reemplazar el valor por el counter que recibe
      // devolver el counter
    }

}