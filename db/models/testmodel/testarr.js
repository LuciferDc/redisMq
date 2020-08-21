

module.exports = (sequelize, DataTypes) => {
  console.log('model testarr ---')
  return sequelize.define('testarr', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    array: DataTypes.JSON
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'testayyay'
  });
};
