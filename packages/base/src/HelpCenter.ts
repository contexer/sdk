import {
  ContexerDialogParams,
  ContexerMessage,
  ELEMENT_ID,
  MANIFEST_FILENAME,
} from '@contexer/common'
import is from '@sindresorhus/is'
import { logger } from '@contexer/logger'

export class ContexerDialogClass {
  constructor(private readonly params: ContexerDialogParams) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (window == null) {
      logger.warn('window is undefined')
    }
    // TODO: add blocking
    this.createElements().catch((e) => console.error(e))
  }

  private async createElements(): Promise<void> {
    const root = document.createElement('div')
    root.id = ELEMENT_ID
    document.body.appendChild(root)

    const manifestUrl = new URL(MANIFEST_FILENAME, this.params.assetOrigin)
    const res = await fetch(manifestUrl)

    if (!res.ok) {
      const error = await res.text()
      logger.error(
        {
          data: {
            error,
            status: res.statusText,
          },
        },
        `Unable to fetch manifest file at ${manifestUrl.href}`,
      )
      return
    }

    const manifest = (await res.json()) as unknown

    if (!is.plainObject(manifest)) {
      logger.error({ data: { manifest } }, 'Expected manifest to be an object')
      return
    }

    const html = Object.values(manifest).find((manifestEntry) => {
      if (!is.plainObject(manifestEntry)) {
        logger.error(
          { data: { manifestEntry } },
          'Expected manifest entry to be an object',
        )
        return
      }

      if ('isEntry' in manifestEntry) {
        return Boolean(manifestEntry.isEntry)
      } else {
        return false
      }
    })

    if (is.undefined(html)) {
      logger.error({ data: manifest }, 'Unable to find entry point in manifest')
      return
    }

    if (!is.plainObject(html)) {
      logger.error({ data: { html } }, 'Expected html to be an object')
      return
    }

    const scriptPath = html.file
    const cssPaths = html.css

    if (!is.string(scriptPath)) {
      logger.error({ data: html }, 'Expected script path to be a string')
      return
    }

    if (!is.array(cssPaths)) {
      logger.error({ data: html }, 'Expected css paths to be an array')
      return
    }

    const script = document.createElement('script')
    script.src = new URL(scriptPath, this.params.assetOrigin).href
    script.async = true
    script.type = 'module'
    script.onload = (): void => {
      this.postMessage({
        messageType: 'init',
        data: {
          publicKey: this.params.publicKey,
          className: this.params.className,
          apiOrigin: this.params.apiOrigin,
        },
      })
    }
    document.head.appendChild(script)

    cssPaths.forEach((cssPath) => {
      if (!is.string(cssPath)) {
        logger.error(
          { data: { html, cssPath } },
          'Expected css path to be a string',
        )
        return
      }
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = new URL(cssPath, this.params.assetOrigin).href
      document.head.appendChild(link)
    })
  }

  private postMessage(msg: ContexerMessage): void {
    window.postMessage(msg)
  }

  public open() {
    logger.debug('Opening modal')
    this.postMessage({ messageType: 'open' })
  }
}
