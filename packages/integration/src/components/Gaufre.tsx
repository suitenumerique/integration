import { useTranslate } from "../i18n/useTranslate"

export const Gaufre = () => {
  const { t } = useTranslate()
  return (
    <button
      type="button"
      className="lasuite-gaufre-btn lasuite-gaufre-btn--vanilla js-lasuite-gaufre-btn"
      title={t("gaufre.label")}
    >
      {t("gaufre.label")}
    </button>
  )
}
