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
    total_qtty: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "total_qtty"
    },
    sort_tag: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "sort_tag"
    },
    brand_tag: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "brand_tag"
    },
    gross_weight: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "gross_weight"
    },
    net_weight: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "net_weight"
    },
    volume_number: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "volume_number"
    },
    vehicle_plaque: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "vehicle_plaque"
    },
    state_plaque: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "state_plaque"
    },
    rntc_plaque: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "rntc_plaque"
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
    tableName: "tb_invoice_shipping",
    comment: "",
    timestamps: true,
    indexes: [{
      name: "tb_institution_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_institution_id"]
    }]
  };
  const InvoiceShippingModel = sequelize.define("tb_invoice_shipping_model", attributes, options);
  return InvoiceShippingModel;
};