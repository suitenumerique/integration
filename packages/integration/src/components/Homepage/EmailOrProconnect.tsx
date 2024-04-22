import { ProconnectButton, type Props as ProconnectProps } from "../ProconnectButton"
import { EmailForm, type Props as EmailFormProps } from "../EmailForm"
import { useTranslate } from "../../i18n/useTranslate"

export type Props = {
  emailForm?: EmailFormProps
  proconnectUrl: ProconnectProps["url"]
}

export const EmailOrProconnect = ({ proconnectUrl, emailForm = {} }: Props) => {
  const { t } = useTranslate()

  return (
    <>
      <h2 className="fr-h4 fr-mb-4w fr-mb-md-8w lasuite-text-center">{t("email.title")}</h2>
      <div className="lasuite-input-width">
        <EmailForm {...emailForm} />

        <p className="fr-hr-or lasuite-hr-or fr-mb-6w">{t("proconnect.or")}</p>
        <h2 className="fr-sr-only">{t("proconnect.title")}</h2>
        <ProconnectButton url={proconnectUrl} />
      </div>
    </>
  )
}
