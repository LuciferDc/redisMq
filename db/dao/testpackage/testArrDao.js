const BaseDao = require('../dao.base')
class TestArrDao extends BaseDao {
  constructor() {
    super(BaseDao.getModelName(TestArrDao))
  }
}
module.exports = TestArrDao