import * as questionLoaders from './questionLoaders';
import * as metadataLoaders from './metadataLoaders';
import * as examSetLoaders from './examSetLoaders';
import * as commentLoaders from './commentLoaders';
import * as userLoaders from './userLoaders';
import * as likeLoaders from './likeLoaders';
import * as semesterLoaders from './semesterLoaders';

const generateLoaders = () => ({
  questionLoaders,
  metadataLoaders,
  examSetLoaders,
  commentLoaders,
  userLoaders,
  likeLoaders,
  semesterLoaders
});

export default generateLoaders;