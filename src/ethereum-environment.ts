import Ganache from 'ganache-core'
import NodeEnvironment from 'jest-environment-node'
import { AddressInfo } from 'node:net'
import Web3 from 'web3'

export default class EthereumEnvironment extends NodeEnvironment {
  #server: Ganache.Server | null = null

  async setup (): Promise<void> {
    await super.setup()

    const server = Ganache.server(this.context?.ganache)
    const web3 = new Web3(server.provider as any)

    await new Promise<void>((resolve, reject) => {
      server.on('listening', resolve).on('error', reject).listen(0, 'localhost')
    })

    const { port } = server.address() as AddressInfo

    this.#server = server

    this.global.ganacheUrl = `ws://localhost:${port}`
    this.global.web3 = web3
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
