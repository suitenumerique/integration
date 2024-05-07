import { ReactNode } from "react"

/**
 * This component is there to test showing the Gaufre button in a classic DSFR header
 */
export const DsfrHeader = ({ actions }: { actions: Array<ReactNode> }) => {
  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    Intitulé <br />
                    officiel
                  </p>
                </div>
              </div>
              <div className="fr-header__service">
                <a
                  href="/"
                  title="Accueil - [À MODIFIER - Nom du site / service] - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)"
                >
                  <p className="fr-header__service-title"> Nom du site / service </p>
                </a>
                <p className="fr-header__service-tagline">
                  baseline - précisions sur l‘organisation
                </p>
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-btns-group">
                  <li>
                    <a className="fr-btn fr-icon-add-circle-line" href="[url - à modifier]">
                      Créer un espace
                    </a>
                  </li>
                  {actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
