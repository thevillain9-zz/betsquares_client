
import { IEnvironmentMetadata } from 'environments/environment.interface';


export const environment: IEnvironmentMetadata = {
  production: true,
  isUseMockService: false,
  baseServiceUri: 'http://localhost:3009',
  name: 'PROD'
};
