import { useTranslate } from "../i18n/useTranslate"

export type Props = {
  /**
   * Variantes d'affichage :
   *
   * "responsive": Affiche un bouton plus petit sur écran mobile/tablette, plus grand sur écran plus large.
   * "small": Affiche un bouton plus petit.
   */
  variant?: "responsive" | "small"
}

const variantClasses = {
  responsive: "lasuite-gaufre-btn--responsive",
  small: "lasuite-gaufre-btn--small",
}

export const Gaufre = ({ variant }: Props) => {
  const { t } = useTranslate()
  const variantClass = !!variant ? variantClasses[variant] : ""
  return (
    <button
      type="button"
      className={`lasuite-gaufre-btn ${variantClass} lasuite-gaufre-btn--vanilla js-lasuite-gaufre-btn`}
      title={t("gaufre.label")}
      aria-expanded="false"
      aria-controls="lasuite-gaufre-popup"
    >
      {t("gaufre.label")}
    </button>
  )
}
