

/**
 * Defines the interface for all environmental settings
 *
 * @export
 * @interface IEnvironmentMetadata
 */
export interface IEnvironmentMetadata {

  production: Boolean;
  isUseMockService: Boolean;
  baseServiceUri: string;
  name: String;
}
