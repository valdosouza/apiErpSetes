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
      field: "id",
      references: {
        key: "id",
        model: "tb_product_model"
      }
    },
    tb_institution_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_institution_id",
      references: {
        key: "tb_institution_id",
        model: "tb_product_model"
      }
    },
    id_internal: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "id_internal"
    },
    id_provider: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "id_provider"
    },
    ncm: {
      type: DataTypes.STRING(8),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "ncm"
    },
    cest: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cest"
    },
    kind_tributary: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "kind_tributary"
    },
    source: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "source"
    },
    kind: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "kind"
    },
    tb_brand_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_brand_id"
    },
    print: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "print"
    },
    controlseries: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "controlseries"
    },
    exclusive_dealer: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "exclusive_dealer"
    },
    application: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "application"
    },
    composition: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "composition"
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
    tableName: "tb_merchandise",
    comment: "",
    timestamps:true,
    indexes: [{
      name: "tb_brand_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_brand_id"]
    }, {
      name: "kind",
      unique: false,
      type: "BTREE",
      fields: ["kind"]
    }]
  };
  const MerchandiseModel = sequelize.define("tb_merchandise_model", attributes, options);
  return MerchandiseModel;
};