const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "id"
    },
    tb_institution_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
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
    dt_exit: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "dt_exit"
    },
    tm_exit: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tm_exit"
    },
    base_icms_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "base_icms_value"
    },
    icms_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "icms_value"
    },
    base_icms_st_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "base_icms_st_value"
    },
    icms_st_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "icms_st_value"
    },
    total_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "total_value"
    },
    freight_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "freight_value"
    },
    insurance_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "insurance_value"
    },
    expenses_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "expenses_value"
    },
    ipi_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ipi_value"
    },
    discount_value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "discount_value"
    },
    total_qtty: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "total_qtty"
    },
    indPres: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "indPres"
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
    tableName: "tb_invoice_merchandise",
    comment: "",
    timestamps: true,
    indexes: [{
      name: "tb_institution_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_institution_id"]
    }]
  };
  const InvoiceMerchandiseModel = sequelize.define("tb_invoice_merchandise_model", attributes, options);
  return InvoiceMerchandiseModel;
};