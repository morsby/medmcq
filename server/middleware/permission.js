import _ from 'lodash';
import User from '../models/user';
import { errorHandler, NotAuthorized } from './errorHandling';

/**
 * A middleware to limit access to certain routes.
 * Currently based on role names.
 * @param  {Array}    roles=[]   An array of role to permit access.
 * @param  {string}   owner=""   The express request path for the owner (excluding `req.`)
 * @return {function}            The middleware function
 */
export const permit = ({ roles = [], owner = '' } = {}) => {
  const isAllowed = async user => {
    let res = await User.query()
      .findById(user.id)
      .joinEager('role');

    return [...roles, 'admin', 'creator'].indexOf(res.role.name) > -1;
  };

  return async (req, res, next) => {
    try {
      if (req.user) {
        // If no roles are supplied, permit any logged in user
        if (roles.length === 0) next();
        // If the user's id matches that of the resource to edit
        else if (req.user.id === Number(_.get(req, owner))) next();
        // Otherwise, if the user's role is permitted access
        else if (await isAllowed(req.user)) next();
        else {
          throw new NotAuthorized({
            message: 'You do not have the required permissions for this route.'
          });
        }
      } else {
        throw new NotAuthorized({
          message: 'You must be logged in to access this route.'
        });
      }
    } catch (err) {
      errorHandler(err, res);
    }
  };
};
