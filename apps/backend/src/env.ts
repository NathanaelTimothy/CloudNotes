import {validate, IsIn, IsNotEmpty, IsUrl} from 'class-validator'

import type {ValidationError} from 'class-validator'

class Environment {
  private validation: Promise<ValidationError[]>

  constructor() {
    this.validation = validate(this)
  }

  public validate() {
    return this.validation
  }

  /**
   * The current envionment name.
   */
  @IsIn(['development', 'production', 'test'])
  public ENVIRONMENT = process.env.NODE_ENV ?? 'production'

  /**
   * Server hostname
   */
  @IsNotEmpty()
  public HOST = process.env.HOST ?? 'localhost'

  /**
   * The port to listen to
   */
  public PORT = this.toNumber(`${process.env.PORT}`, 3000)

  /**
   * HTTP / HTTPS
   */
  public HTTPS = this.toBoolean(process.env.HTTPS, false)

  /**
   * Domain
   */
  @IsUrl({
    require_tld: process.env.NODE_ENV === 'production',
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  public DOMAIN = `${this.HTTPS ? 'https' : 'http'}://${this.HOST}:${
    this.PORT
  }`

  @IsNotEmpty()
  @IsUrl({
    require_tld: false,
    protocols: ['postgres'],
    require_protocol: true,
  })
  public DATABASE_URL = process.env.DATABASE_URL as string

  private toNumber(value: string | undefined, def: number) {
    let val = value ? parseInt(value, 10) : def

    if (isNaN(val)) {
      return def
    }

    return val
  }

  private toBoolean(value: string | undefined, def: boolean) {
    if (value === undefined) {
      return def
    }

    return value === 'true'
  }
}

const env = new Environment()

export {Environment, env}