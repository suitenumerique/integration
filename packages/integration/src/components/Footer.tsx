import { ReactNode } from "react"
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
   * Nom du service, utilisé dans des libellés accessibles de liens.
   */
  serviceName?: string

  /**
   * texte affiché sur la droite du footer, au dessus des liens du gouvernement.
   */
  description?: string

  /**
   * bloc de contenu indiquant la licence utilisée pour le site. Mentionne la licence etalab par défaut.
   */
  license?: ReactNode

  /**
   * URL de la page de plan du site.
   */
  sitemapUrl?: string

  /**
   * URL de la page d'accessibilité.
   */
  a11yUrl?: string

  /**
   * Niveau d'accessibilité du site.
   */
  a11yLevel?: "non compliant" | "partially compliant" | "fully compliant"

  /**
   * URL de la page de mentions légales.
   */
  termsUrl?: string

  /**
   * URL de la page de politique de confidentialité.
   */
  privacyUrl?: string

  /**
   * Liens à afficher en bas de page, en supplément du plan du site, de l'accessibilité, des mentions légales et de la politique de confidentialité.
   *
   * Par défaut, on affiche un lien vers le site vitrine de la suite numérique
   */
  links?: Array<{ label: string; url: string }>

  /**
   * Liens légaux à afficher en bas de page.
   *
   * Par défaut, on affiche les liens indiqués dans le système de design de l'État.
   */
  legalLinks?: Array<{ label: string; url: string }>
}

export const Footer = ({
  entity,
  homepageUrl = "/",
  serviceName,
  description,
  sitemapUrl,
  a11yUrl,
  a11yLevel,
  termsUrl,
  privacyUrl,
  links = [
    {
      label: "La Suite Numérique",
      url: "https://lasuite.numerique.gouv.fr/",
    },
  ],
  legalLinks = [
    {
      label: "legifrance.gouv.fr",
      url: "https://legifrance.gouv.fr",
    },
    {
      label: "info.gouv.fr",
      url: "https://info.gouv.fr",
    },
    {
      label: "service-public.fr",
      url: "https://service-public.fr",
    },
    {
      label: "data.gouv.fr",
      url: "https://data.gouv.fr",
    },
  ],
  license,
}: Props) => {
  const { t } = useTranslate()
  const a11yLevelLabel =
    a11yLevel === "fully compliant"
      ? t("footer.links.a11y.perfect")
      : a11yLevel === "partially compliant"
        ? t("footer.links.a11y.partial")
        : t("footer.links.a11y.bad")
  return (
    <footer className="fr-footer" role="contentinfo" id="footer-7127">
      <div className="fr-container lasuite-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <a
              id="footer-operator"
              href={homepageUrl}
              title={
                serviceName
                  ? t("footer.homepageLinkTitle.withService", { serviceName })
                  : t("footer.homepageLinkTitle.withoutService")
              }
            >
              <p className="fr-logo">{entity}</p>
            </a>
          </div>
          <div className="fr-footer__content">
            {!!description && <p className="fr-footer__content-desc">{description}</p>}
            <ul className="fr-footer__content-list">
              {legalLinks.map((link) => (
                <li key={link.url} className="fr-footer__content-item">
                  <a
                    target="_blank"
                    rel="noopener external"
                    title={t("links.newWindow", { title: link.label })}
                    className="fr-footer__content-link"
                    href={link.url}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            {!!sitemapUrl && (
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href={sitemapUrl}>
                  {t("footer.links.sitemap")}
                </a>
              </li>
            )}
            {!!a11yUrl && (
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href={a11yUrl}>
                  {a11yLevelLabel}
                </a>
              </li>
            )}
            {!!termsUrl && (
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href={termsUrl}>
                  {t("footer.links.terms")}
                </a>
              </li>
            )}
            {!!privacyUrl && (
              <li className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href={privacyUrl}>
                  {t("footer.links.privacy")}
                </a>
              </li>
            )}
            {links.map((link) => (
              <li key={link.url} className="fr-footer__bottom-item">
                <a className="fr-footer__bottom-link" href={link.url}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="fr-footer__bottom-copy">
            {(license === undefined && (
              <p>
                {t("footer.license", {
                  license: (
                    <a
                      href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                      target="_blank"
                      rel="noopener external"
                      title={t("links.newWindow", { title: "licence etalab-2.0" }) as string}
                    >
                      {t("footer.licenseEtalab")}
                    </a>
                  ),
                })}
              </p>
            )) ||
              license}
          </div>
        </div>
      </div>
    </footer>
  )
}
