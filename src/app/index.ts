import { AppSetupParamsType, AppParamsType, AppType} from './types'

export const createApp = (params: AppParamsType): AppType => {
  const hostElement = document.body
  const appConfig: AppSetupParamsType = {}

  const mount = (): void => {
    params.onMount(appConfig?.context || hostElement);
  }

  const unmount = (): void => {}

  const setup = (params: AppSetupParamsType): void => {
    Object.assign(appConfig, params);
  }

  return { mount, unmount, setup }

}