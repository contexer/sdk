import pino from 'pino'

const logger = pino({ browser: { asObject: true } })

interface LogData {
  data: unknown
}

export function info(msg: string): void
export function info(obj: LogData, msg?: string): void
export function info(obj: unknown, msg?: string): void {
  logger.info(obj, msg)
}

export function debug(msg: string): void
export function debug(obj: LogData, msg?: string): void
export function debug(obj: unknown, msg?: string): void {
  logger.debug(obj, msg)
}

export function warn(msg: string): void
export function warn(obj: LogData, msg?: string): void
export function warn(obj: unknown, msg?: string): void {
  logger.debug(obj, msg)
}

export function error(msg: string): void
export function error(obj: LogData, msg?: string): void
export function error(obj: unknown, msg?: string): void {
  logger.error(obj, msg)
}
