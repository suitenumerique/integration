import { useTranslate } from "../i18n/useTranslate"

export type Props = {
  /**
   * URL de l'action du formulaire.
   *
   * @default "#"
   */
  action?: string

  /**
   * attribut `name` à définir sur le champ de saisie de l'email.
   *
   * @default "email"
   */
  inputName?: string

  /**
   * Méthode du formulaire.
   *
   * @default "post"
   */
  method?: "get" | "post"

  /**
   * Fonction appelée lors de la soumission du formulaire.
   *
   * L'envoi du formulaire n'est jamais intercepté par le composant.
   * À vous d'appeler `event.preventDefault()` si vous souhaitez empêcher l'envoi du formulaire.
   *
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void

  /**
   * Contenu du formulaire.
   *
   * À utiliser si vous voulez rajouter des champs supplémentaires.
   */
  children?: React.ReactNode
}

export const EmailForm = ({
  action = "#",
  method = "post",
  onSubmit,
  inputName = "email",
  children,
}: Props) => {
  const { t } = useTranslate()
  return (
    <form
      action={action}
      method={method}
      className="fr-mb-4w fr-mb-md-6w"
      onSubmit={(event) => {
        if (onSubmit) {
          onSubmit(event)
        }
      }}
    >
      <div className="fr-mb-4w fr-mb-md-6w">
        <input
          className="fr-input lasuite-input"
          name={inputName}
          type="email"
          aria-label={t("email.srLabel")}
          placeholder={t("email.placeholder")}
        />
      </div>
      {children}
      <div>
        <button className="fr-btn lasuite-btn">{t("email.submit")}</button>
      </div>
    </form>
  )
}
