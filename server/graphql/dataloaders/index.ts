import * as questionLoaders from './questionLoaders';
import * as specialtyLoaders from './specialtyLoaders';
import * as examSetLoaders from './examSetLoaders';

const generateLoaders = () => ({ questionLoaders, specialtyLoaders, examSetLoaders });

export default generateLoaders;
