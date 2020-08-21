const Dao = require('../dao.base')
class TestArrDao extends Dao {
  constructor() {
    super(Dao.getModelName(TestArrDao))
  }
}
module.exports = TestArrDao