import {createFormContext} from '@mantine/form';
import {ArnieDetailed} from './api';

export const [ArnieFormProvider, arnieFormContext, arnieForm] =
  createFormContext<ArnieDetailed>();
