

module.exports = (sequelize, DataTypes) => {
  console.log('init model')
  return sequelize.define('ts', {
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
