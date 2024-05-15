import { ReactNode } from "react"
import { Header, type Props as HeaderProps } from "./Header"
import { Footer, type Props as FooterProps } from "./Footer"
import { HomepageContent } from "./HomepageContent"

export type Props = {
  /**
   * Nom de l'entité, affiché au niveau du logo Marianne.
   *
   * @example "Gouvernement"
   * @example "<>Ministère de <br />l'Intérieur</>"
   */
  entity: ReactNode

  /**
   * Phrase d'accroche.
   *
   * Si vous passez une chaîne de caractères, vous pouvez facilement mettre du texte en gras en entourant le texte par `**`. Et vous pouvez ajouter des sauts de ligne en utilisant `<br>`.
   *
   * Sinon, vous pouvez passer directement un élément React.
   *
   * @example "**Tchap**, la messagerie <br>sécurisée de l'État"
   */
  tagline?: ReactNode

  /**
   * url de l'API de lasuite-integration. Nécessaire pour afficher la photo d'arrière-plan.
   */
  lasuiteApiUrl?: string

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
   * Identifiant du service sur l'API de la suite-integration.
   *
   * Utilisé pour afficher la photo d'arrière-plan correspondant au service, via l'API.
   */
  serviceId?: string

  /**
   * Logo du service.
   *
   * Peut être une chaine de caractère vers un fichier, ou un élément React.
   */
  logo?: ReactNode

  /**
   * options passées au composant Header.
   */
  headerOptions?: Omit<HeaderProps, "entity" | "serviceName" | "logo" | "homepageUrl">

  /**
   * options passées au composant Footer.
   */
  footerOptions?: Omit<FooterProps, "entity" | "serviceName" | "homepageUrl">

  /**
   * Contenu de la page d'accueil affiché dans la partie gauche de la page,
   * en dessous de la tagline.
   *
   */
  description?: ReactNode

  /**
   * Contenu de la page d'accueil affiché dans la partie droite de la page.
   *
   * Passez ici le formulaire de connexion au service. Vous pouvez utiliser pour vous aider les composants déjà existants 'HomepageEmail', 'HomepageProconnect' et 'HomepageEmailOrProconnect'.
   */
  children: ReactNode
}

export const Homepage = ({
  lasuiteApiUrl,
  entity,
  tagline,
  serviceName,
  serviceId,
  logo,
  homepageUrl,
  headerOptions,
  footerOptions,
  description,
  children,
}: Props) => {
  return (
    <div className="lasuite lasuite-homepage">
      <Header {...{ entity, serviceName, logo, homepageUrl, ...headerOptions }} />
      <HomepageContent {...{ serviceName, serviceId, tagline, description, lasuiteApiUrl }}>
        {children}
      </HomepageContent>
      <Footer {...{ entity, serviceName, homepageUrl, ...footerOptions }} />
    </div>
  )
}
