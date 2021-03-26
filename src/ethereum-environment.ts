import { Config } from '@jest/types'
import Ganache from 'ganache-core'
import NodeEnvironment from 'jest-environment-node'
import { validate } from 'jest-validate'
import { AddressInfo } from 'node:net'

export default class EthereumEnvironment extends NodeEnvironment {
  #server: Ganache.Server | null = null
  #options: {
    injectEthersProvider?: boolean
    injectWeb3Provider?: boolean
  }

  constructor (config: Config.ProjectConfig) {
    super(config)

    const options = config.testEnvironmentOptions as any

    validate(options, {
      exampleConfig: {
        injectEthersProvider: true,
        injectWeb3Provider: true
      }
    })

    this.#options = options
  }

  async setup (): Promise<void> {
    await super.setup()

    const server = Ganache.server(this.context?.ganache)

    await new Promise<void>((resolve, reject) => {
      server.on('listening', resolve).on('error', reject).listen(0, 'localhost')
    })

    const { port } = server.address() as AddressInfo

    this.#server = server

    this.global.ganacheUrl = `ws://localhost:${port}`

    if (this.#options.injectEthersProvider === true) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const ethers = require('ethers')

        this.global.ethersProvider = new ethers.providers.Web3Provider(server.provider as any)
      } catch (e) {
        throw new Error('The package `ethers` must be installed to inject Ethers provider')
      }
    }

    if (this.#options.injectWeb3Provider === true) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Web3 = require('web3')

        this.global.web3 = new Web3(server.provider as any)
      } catch (e) {
        throw new Error('The package `web3` must be installed to inject Web3 provider')
      }
    }
  }

  async teardown (): Promise<void> {
    if (this.#server !== null) {
      this.#server.close()
    }

    await super.teardown()
  }

  runScript<T> (script: any): T | null {
    return super.runScript(script)
  }
}
