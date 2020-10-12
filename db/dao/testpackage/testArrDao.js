const BaseDao = require('../dao.base')
class TestArrDao extends BaseDao {
  constructor() {
    super(Dao.getModelName(TestArrDao))
  }
}
module.exports = TestArrDao