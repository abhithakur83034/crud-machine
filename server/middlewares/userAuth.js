require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");
const secretKey = process.env.JWT_SECRET;

const userAuth = {
  requireAuth: async (req, res, next) => {
    try {
      const auth = req.headers["authorization"];
      if (!auth) {
        return res
          .status(401)
          .json({ code: "401", status: false, message: "Invalid User!" });
      }
      // get token in auth headers
      const token = auth.split(" ")[1];

      // decode the token
      const decode = jwt.verify(token, secretKey);

      // find user using decoded id
      const user = await UserModel.findOne({ _id: decode.id });

      if (!user) {
        return res
          .status(401)
          .json({ code: "401", status: false, message: "Invalid User!" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({
        code: "500",
        message: "Internal Server Error",
        status: false,
        data: [],
        error: error,
      });
    }
  },

  checkRole: (requiredRole) => {
    return async (req, res, next) => {
      try {
        const auth = req.headers["authorization"];
        if (!auth) {
          return res
            .status(401)
            .json({ code: "401", status: false, message: "Invalid User!" });
        }
        // get token in auth headers
        const token = auth.split(" ")[1];

        // decode the token
        const decode = jwt.verify(token, secretKey);

        if (decode.role !== requiredRole) {
          return res
            .status(403)
            .json({ message: "You do not have permission to access." });
        }

        // find user using decoded id
        const user = await UserModel.findOne({ _id: decode.id });

        if (!user) {
          return res
            .status(404)
            .json({ code: "404", status: false, message: "User Not Found!" });
        }
        req.user = user;
        next();
      } catch (error) {
        res.status(500).json({
          code: "500",
          message: "Internal Server Error",
          status: false,
          data: [],
          error: error,
        });
      }
    };
  },
};

module.exports = userAuth;