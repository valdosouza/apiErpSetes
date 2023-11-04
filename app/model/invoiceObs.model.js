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
    tb_invoice_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_invoice_id"
    },
    kind: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "kind"
    },
    note: {
      type: DataTypes.BLOB,
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "note"
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
    tableName: "tb_invoice_obs",
    comment: "",
    timestamps: true,
    indexes: [{
      name: "tb_institution_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_institution_id"]
    }]
  };
  const InvoiceObsModel = sequelize.define("tb_invoice_obs_model", attributes, options);
  return InvoiceObsModel;
};