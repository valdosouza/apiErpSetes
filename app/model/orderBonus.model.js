const {
    DataTypes
  } = require('sequelize');
  
  module.exports = sequelize => {
    const attributes = {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "id"
      },
      tb_institution_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tb_institution_id"
      },
      terminal: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "0",
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "terminal"
      },
      tb_salesman_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tb_salesman_id"
      },
      number: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "number"
      },
      tb_customer_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "tb_customer_id"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "updated_at"
      }
    };
    const options = {
      tableName: "tb_order_bonus",
      comment: "",
      timestamps: true,
      indexes: [{
        name: "tb_customer_id",
        unique: false,
        type: "BTREE",
        fields: ["tb_customer_id"]
      }, {
        name: "tb_salesman_id",
        unique: false,
        type: "BTREE",
        fields: ["tb_salesman_id"]
      }, {
        name: "tb_institution_id",
        unique: false,
        type: "BTREE",
        fields: ["tb_institution_id"]
      }]
    };
    const OrderBonusModel = sequelize.define("tb_order_bonus_model", attributes, options);
    return OrderBonusModel;
  };