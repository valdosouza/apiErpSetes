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
    tb_order_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_order_id"
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
    parcel: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "parcel"
    },
    tag_value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tag_value"
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
    tb_payment_types_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_payment_types_id"
    },
    number: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "number"
    },
    kind: {
      type: DataTypes.STRING(2),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "kind"
    },
    situation: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "situation"
    },
    operation: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "operation"
    },
    stage: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "stage"
    },
    tb_financial_plans_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_financial_plans_id"
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
    tableName: "tb_financial",
    comment: "",
    timestamps: true,
  };
  const TbFinancialModel = sequelize.define("tb_financial_model", attributes, options);
  return TbFinancialModel;
};