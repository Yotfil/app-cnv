import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import { ALIAS_MAX_LENGTH, useProgress } from '@/features/progress'
import { appVersion } from '@/shared/lib/appVersion'
import styles from './HomeScreen.module.css'

type Props = {
  /** Where "Continue" leads: the map, or the face until the map exists. */
  studyPath: string
}

/** Entry screen: credit to the course, the caution notice from page 2, alias and version. */
export function HomeScreen({ studyPath }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { progress, start, clear } = useProgress()
  const [alias, setAlias] = useState(progress?.alias ?? '')
  const [confirming, setConfirming] = useState(false)

  const onContinue = (event: FormEvent) => {
    event.preventDefault()
    start(alias)
    navigate(studyPath)
  }

  const onClear = () => {
    clear()
    setAlias('')
    setConfirming(false)
  }

  return (
    <main className={styles.screen}>
      <h1 className={styles.wordmark}>{t('app.title')}</h1>
      <p className={styles.credit}>{t('home.credit')}</p>

      <section className={styles.notice} aria-labelledby="notice-title">
        <h2 id="notice-title" className={styles.noticeTitle}>
          {t('home.noticeTitle')}
        </h2>
        <p>{t('home.notice.reliable')}</p>
        <p>{t('home.notice.context')}</p>
      </section>

      <form className={styles.form} onSubmit={onContinue}>
        <label className={styles.label} htmlFor="alias">
          {t('home.aliasLabel')}
        </label>
        <input
          id="alias"
          className={styles.input}
          value={alias}
          maxLength={ALIAS_MAX_LENGTH}
          autoComplete="nickname"
          onChange={(event) => setAlias(event.target.value)}
        />
        <p className={styles.hint}>{t('home.aliasHint')}</p>
        <button type="submit" className={styles.primary}>
          {t('home.continue')}
        </button>
      </form>

      {progress && (
        <Link to="/progress" className={styles.progressLink}>
          {t('progressScreen.link')}
        </Link>
      )}

      {progress && (
        <div className={styles.clear}>
          {confirming ? (
            <>
              <p className={styles.hint}>{t('home.clearConfirm')}</p>
              <div className={styles.clearActions}>
                <button type="button" className={styles.secondary} onClick={onClear}>
                  {t('home.clearYes')}
                </button>
                <button type="button" className={styles.link} onClick={() => setConfirming(false)}>
                  {t('home.clearNo')}
                </button>
              </div>
            </>
          ) : (
            <button type="button" className={styles.link} onClick={() => setConfirming(true)}>
              {t('home.clear')}
            </button>
          )}
        </div>
      )}

      <p className={styles.version}>{t('app.version', { version: appVersion })}</p>
    </main>
  )
}
