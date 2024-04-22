import { ReactNode } from "react"
import { Gaufre } from "./Gaufre"
import { useTranslate } from "../i18n/useTranslate"

export type Props = {
  /**
   * Nom de l'entité, affiché au niveau du logo Marianne.
   *
   * @example "Gouvernement"
   * @example "<>Ministère de <br />l'Intérieur</>"
   */
  entity: ReactNode

  /**
   * L'url vers la page d'accueil de votre service.
   *
   * @default "/"
   */
  homepageUrl?: string

  /**
   * Nom du service, affiché dans le header et utilisé dans des libellés accessibles de liens.
   */
  serviceName: string

  /**
   * Logo du service.
   *
   * Peut être une chaine de caractère vers un fichier, ou un élément React.
   */
  logo: ReactNode

  /**
   * Afficher le nom du service à côté du logo ou non.
   *
   * Utile si votre logo à lui-seul est suffisamment explicite.
   *
   * @default true
   */
  showServiceName?: boolean

  /**
   * liste des actions à afficher à droite du header.
   *
   * Si ceci est passé, vous devez passer manuellement le composant <Gaufre /> dans les actions
   */
  actions?: ReactNode
}

export const Header = ({
  entity,
  serviceName,
  logo,
  homepageUrl = "/",
  showServiceName = true,
  actions,
}: Props) => {
  const { t } = useTranslate()
  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container lasuite-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand lasuite-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top lasuite-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">{entity}</p>
                </div>
              </div>
              <div className="fr-header__service lasuite-header__service">
                <a
                  className="lasuite-header__service-link"
                  href={homepageUrl}
                  title={t("header.homepageLinkTitle", { serviceName })}
                  aria-label={t("header.homepageLinkTitle", { serviceName })}
                >
                  {typeof logo === "string" ? (
                    <img
                      className="lasuite-header__service-logo fr-responsive-img"
                      src={logo}
                      alt={showServiceName ? "" : serviceName}
                    />
                  ) : (
                    logo
                  )}
                  {showServiceName && (
                    <p className="fr-header__service-title lasuite-header__service-title">
                      {serviceName}
                    </p>
                  )}
                </a>
              </div>
            </div>
            {typeof actions === "undefined" ? (
              <div className="fr-header__tools">
                <div
                  className="fr-header__tools-links lasuite-header__tools-links"
                  data-fr-js-header-links="true"
                >
                  <Gaufre />
                </div>
              </div>
            ) : (
              actions
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
