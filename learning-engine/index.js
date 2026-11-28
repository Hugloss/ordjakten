'use strict';
// Domain-neutral contracts, no authored content or proprietary policy algorithms.
module.exports=Object.freeze({
  Assessment:require('./src/assessment-v1'),
  Decisions:require('./src/decision-v1'),
  PublicQuestion:require('./src/public-question-v1'),
  ProtectedDelivery:require('./src/protected-delivery-v1')
});
