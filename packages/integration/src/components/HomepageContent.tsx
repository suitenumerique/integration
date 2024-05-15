import { ReactNode, Fragment } from "react"

export type Props = {
  /**
   * Phrase d'accroche.
   *
   * Si vous passez une chaîne de caractères, vous pouvez facilement mettre du texte en gras en entourant le texte par `**`. Et vous pouvez ajouter des sauts de ligne en utilisant `<br>`.
   *
   * Sinon, vous pouvez passer directement un élément React.
   *
   * @example "**Tchap**, la messagerie <br>sécurisée de l'État"
   */
  tagline: ReactNode

  /**
   * Contenu de la page d'accueil affiché dans la partie droite de la page.
   *
   * Passez ici le formulaire de connexion au service. Vous pouvez utiliser pour vous aider les composants déjà existants 'HomepageEmail', 'HomepageProconnect' et 'HomepageEmailOrProconnect'.
   */
  children: ReactNode

  /**
   * Contenu de la page d'accueil affiché dans la partie gauche de la page,
   * en dessous de la tagline.
   *
   */
  description?: ReactNode

  /**
   * Identifiant du service sur l'API de la suite-integration.
   *
   * Utilisé pour afficher la photo d'arrière-plan correspondant au service, via l'API.
   */
  serviceId?: string

  /**
   * url de l'API de lasuite-integration. Nécessaire pour afficher la photo d'arrière-plan.
   */
  lasuiteApiUrl?: string
}

export const HomepageContent = ({
  tagline,
  lasuiteApiUrl,
  serviceId,
  description,
  children,
}: Props) => {
  const parsedTagline =
    typeof tagline === "string" ? (
      <>
        {tagline
          .replace(/<br\/>/g, "<br>")
          .replace(/<br \/>/g, "<br>")
          .split("<br>")
          .map((part) => {
            return part.split(/(\*\*.*?\*\*)/g).map((part, index) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong className="lasuite-homepage__tagline-strong" key={index}>
                    {part.slice(2, -2)}
                  </strong>
                )
              } else {
                return <Fragment key={index}>{part}</Fragment>
              }
            })
          })
          .map((part, index, arr) => (
            <Fragment key={index}>
              {part}
              {index !== arr.length - 1 ? <br /> : null}
            </Fragment>
          ))}
      </>
    ) : (
      tagline
    )
  return (
    <div className="lasuite-homepage__wrapper">
      <div className="fr-container fr-p-0 lasuite-container">
        <div className="lasuite-homepage__content">
          <div className="fr-container--fluid">
            <div className="fr-grid-row">
              <div className="lasuite-homepage__main-col">
                <div className="lasuite-homepage__tagline-container">
                  <h1 className="lasuite-homepage__tagline">{parsedTagline}</h1>
                </div>
                {!!description ? (
                  <div className="lasuite-homepage__desc-container">{description}</div>
                ) : null}
              </div>
              <div className="lasuite-homepage__secondary-col">
                <div className="lasuite-homepage__form-container">
                  <div className="lasuite-homepage__form">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!!lasuiteApiUrl && (
        <picture className="lasuite-homepage__bg">
          <source
            srcSet={`${lasuiteApiUrl}/api/backgrounds/v1/${serviceId || "default"}.avif`}
            type="image/avif"
          />
          <img
            src={`${lasuiteApiUrl}/api/backgrounds/v1/${serviceId || "default"}.jpg`}
            alt=""
            width="1920"
            height="1200"
          />
        </picture>
      )}
    </div>
  )
}
