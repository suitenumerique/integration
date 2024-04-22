import { useTranslate } from "../../i18n/useTranslate"
import { ProconnectButton, type Props as ProconnectButtonProps } from "../ProconnectButton"

export type Props = ProconnectButtonProps

export const Proconnect = (proconnectButtonProps: Props) => {
  const { t } = useTranslate()
  return (
    <>
      <h2 className="fr-h4 fr-mb-4w fr-mb-md-8w lasuite-text-center">{t("proconnect.title")}</h2>
      <div className="lasuite-input-width">
        <ProconnectButton {...proconnectButtonProps} />
      </div>
    </>
  )
}
