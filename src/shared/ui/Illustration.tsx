import { useCallback, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { reportError } from '@/shared/lib/reportError'
import styles from './Illustration.module.css'

type Props = {
  src: string
  /** Image size in pixels; only its ratio is used, so the illustration keeps its shape at any width. */
  width: number
  height: number
  alt: string
  /** SVG content placed in percent: x and y from 0 to 100 over the image. Lines and polygons. */
  children?: ReactNode
  /** HTML layer on top, for elements that must keep their shape (markers), placed with left/top in percent. */
  overlay?: ReactNode
}

type Status = 'loading' | 'loaded' | 'failed'

/**
 * Image with a fixed aspect ratio and an SVG layer on top whose coordinates are
 * percentages of the image, so the same data points to the same place at any size.
 * Until the image has loaded, a placeholder keeps its shape and the layers stay out:
 * nothing can be touched over an empty frame. If it cannot be loaded, it says so and
 * offers to try again.
 */
export function Illustration({ src, width, height, alt, children, overlay }: Props) {
  const { t } = useTranslation()
  // Keyed by src so that switching images starts waiting again.
  const [result, setResult] = useState<{ src: string; status: Status } | null>(null)
  const status: Status = result?.src === src ? result.status : 'loading'
  // A new attempt mounts a new <img>, which requests the file again.
  const [attempt, setAttempt] = useState(0)

  // An image already in the browser cache may be complete before React listens to "load".
  const checkCached = useCallback(
    (image: HTMLImageElement | null) => {
      if (image?.complete && image.naturalWidth > 0) setResult({ src, status: 'loaded' })
    },
    [src],
  )

  return (
    <div
      className={styles.frame}
      data-status={status}
      style={{ aspectRatio: `${width} / ${height}` }}
      aria-busy={status === 'loading' || undefined}
    >
      <img
        key={attempt}
        ref={checkCached}
        className={styles.image}
        src={src}
        alt={alt}
        draggable={false}
        onLoad={() => setResult({ src, status: 'loaded' })}
        onError={() => {
          reportError(new Error('Illustration failed to load'), { src })
          setResult({ src, status: 'failed' })
        }}
      />
      {status === 'loaded' && (
        <>
          <svg
            className={styles.layer}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden={children ? undefined : true}
          >
            {children}
          </svg>
          {overlay && <div className={styles.overlay}>{overlay}</div>}
        </>
      )}
      {status === 'failed' && (
        <div className={styles.failed} role="alert">
          <p>{t('illustration.failed')}</p>
          <button
            type="button"
            onClick={() => {
              setResult(null)
              setAttempt((count) => count + 1)
            }}
          >
            {t('illustration.retry')}
          </button>
        </div>
      )}
    </div>
  )
}
