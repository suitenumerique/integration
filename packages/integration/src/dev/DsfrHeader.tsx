import "@gouvfr/dsfr/dist/core/core.module"
import "@gouvfr/dsfr/dist/component/navigation/navigation.module"
import "@gouvfr/dsfr/dist/component/modal/modal.module"
import "@gouvfr/dsfr/dist/component/header/header.module"
import { Gaufre } from "../components/Gaufre"

/**
 * This component is there to test showing the Gaufre button in a classic DSFR header
 */
export const DsfrHeader = () => {
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
                <div className="fr-header__navbar">
                  <Gaufre variant="small" />
                  <button
                    className="fr-btn--menu fr-btn"
                    data-fr-opened="false"
                    aria-controls="modal-499"
                    aria-haspopup="menu"
                    id="button-500"
                    title="Menu"
                  >
                    Menu
                  </button>
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
                    <a className="fr-btn fr-icon-add-circle-line" href="#">
                      Créer un espace
                    </a>
                  </li>
                  <li>
                    <Gaufre variant="small" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fr-header__menu fr-modal" id="modal-499" aria-labelledby="button-500">
        <div className="fr-container">
          <button className="fr-btn--close fr-btn" aria-controls="modal-499" title="Fermer">
            Fermer
          </button>
          <div className="fr-header__menu-links"> </div>
        </div>
      </div>
    </header>
  )
}
