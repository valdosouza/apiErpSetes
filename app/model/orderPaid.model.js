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
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "terminal"
      },
      tb_payment_types_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tb_payment_types_id"
      },
      dt_expiration: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "dt_expiration"
      },      
      value: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "value"
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
      tableName: "tb_order_paid",
      comment: "",
      timestamps: true,
      indexes: []
    };
    const TbOrderPaidModel = sequelize.define("tb_order_paid_model", attributes, options);
    return TbOrderPaidModel;
  };