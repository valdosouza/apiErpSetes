const {
    DataTypes
  } = require('sequelize');
  
  module.exports = sequelize => {
    const attributes = {
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
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "terminal"
      },
      tb_cashier_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tb_cashier_id"
      },
      tb_payment_types_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tb_payment_types_id"
      },
      kind: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "kind"
      },
      tag_value: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tag_value"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "updated_at"
      }
    };
    const options = {
      tableName: "tb_cashier_items",
      comment: "",
      timestamps : true    
    };
    const CashierItemsModel = sequelize.define("tb_cashier_items_model", attributes, options);
    return CashierItemsModel;
  };