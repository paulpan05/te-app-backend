import Custom from './error';
import BadRequest from './badrequest';
import Unauthorized from './unauthorized';
import Forbidden from './forbidden';
import NotFound from './notfound';
import Unprocessable from './unprocessable';
import InternalServer from './internalserver';
import NotImplemented from './notimplemented';

const errors = {
  Custom,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Unprocessable,
  InternalServer,
  NotImplemented,
};

export default errors;
