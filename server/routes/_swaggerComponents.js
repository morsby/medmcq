/**
 * @swagger
 * components:
 *   schemas:
 *      Success:
 *        required:
 *          - type
 *          - message
 *        properties:
 *          message:
 *            type: string
 *          type:
 *            type: string
 *          data:
 *            type: object
 *      Error:
 *        required:
 *          - type
 *          - message
 *        properties:
 *          message:
 *            type: string
 *          type:
 *            type: string
 *          data:
 *            type: object
 *
 */

// TODO: Move into correct routes:
// Comments
/**
 * @swagger
 * components:
 *   schemas:
 *      Comment:
 *        required:
 *          - id
 *          - questionId
 *          - userId
 *          - text
 *        properties:
 *          id:
 *            type: integer
 *          questionId:
 *            type: integer
 *          userId:
 *            type: integer
 *          text:
 *            type: string
 *      Comments:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/Comment"
 */

// Tags
/**
 * @swagger
 * components:
 *   schemas:
 *      Tag:
 *        required:
 *          - id
 *          - name
 *          - semesterId
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          semesterId:
 *            type: integer
 *          questions:
 *            $ref: "#/components/schemas/ActiveTagVotes"
 *      Tags:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/Tag"
 */

// ActiveTagVotes
/**
 * @swagger
 * components:
 *   schemas:
 *      ActiveTagVote:
 *        required:
 *          - questionId
 *          - tagId
 *          - tagName
 *        properties:
 *          questionId:
 *            type: integer
 *          tagId:
 *            type: integer
 *          tagName:
 *            type: string
 *      ActiveTagVotes:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/ActiveTagVote"
 */

// UserTagVotes
/**
 * @swagger
 * components:
 *   schemas:
 *      UserTagVote:
 *        required:
 *          - id
 *          - userId
 *          - questionId
 *          - tagId
 *          - tagName
 *          - value
 *        properties:
 *          id:
 *            type: integer
 *          userId:
 *            type: integer
 *          questionId:
 *            type: integer
 *          tagId:
 *            type: integer
 *          tagName:
 *            type: string
 *          value:
 *            type: integer
 *            example: 1
 *      UserTagVotes:
 *        type: array
 *        items:
 *          $ref: "#/components/schemas/UserTagVote"
 */

/**
 * Function to create a reponse matching the API spec
 * @param  {string} type      A short description for the response, e.g. LoginSuccess
 * @param  {string} message   A longer description ...
 * @param  {Object} [data={}] Any additional data
 * @return {Object}           [description]
 */
const createResponse = (type, message, data = {}) => ({
  type,
  message,
  data
});
export default createResponse;
