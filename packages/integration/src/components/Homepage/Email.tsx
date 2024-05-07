import { EmailForm, type Props as EmailFormProps } from "../EmailForm"
import { useTranslate } from "../../i18n/useTranslate"
export type Props = EmailFormProps

export const Email = (emailFormProps: Props) => {
  const { t } = useTranslate()
  return (
    <>
      <h2 className="fr-h4 fr-mb-8w lasuite-text-center">
        {t("email.title", { linebreak: <br role="presentation" className="fr-hidden-sm" /> })}
      </h2>

      <div className="lasuite-input-width">
        <EmailForm {...emailFormProps} />
      </div>
    </>
  )
}
