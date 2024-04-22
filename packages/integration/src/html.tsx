// this tsx file is not actually exposed in dist/. It's used to generate the HTML templates from our React components
// dotenv is used instead of vite import.meta.env because this file is processed by import-single-ts
import "dotenv/config"

import { Homepage } from "./components/Homepage"
import { Email } from "./components/Homepage/Email"
import { EmailOrProconnect } from "./components/Homepage/EmailOrProconnect"
import { Proconnect } from "./components/Homepage/Proconnect"
import { Header } from "./components/Header"
import { Gaufre } from "./components/Gaufre"

const customContent = (
  <div className="fr-p-4w">
    <h2>~~replace~~</h2>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis beatae, quia eius
      voluptatem repudiandae quisquam a magnam obcaecati labore dolor ad vitae, omnis iusto deleniti
      error eveniet maxime! Consectetur, sint?
    </p>
  </div>
)

const templates = [
  {
    name: "homepage",
    render: (
      <Homepage
        lasuiteApiUrl={process.env.VITE_LASUITE_API_URL}
        entity="~~replace~~"
        tagline="**Service**, un outil sécurisé <br>pour les agents de l'État"
        serviceName="~~replace~~"
        logo="~~replace~~"
        homepageUrl="/"
        footerOptions={{
          description: "Un service de la Direction interministérielle du numérique",
          sitemapUrl: "/sitemap",
          a11yUrl: "/accessibilite",
          a11yLevel: "non compliant",
          termsUrl: "/mentions-legales",
          privacyUrl: "/donnees-personnelles",
        }}
      >
        {customContent}
      </Homepage>
    ),
  },
  {
    name: "gaufre",
    render: <Gaufre />,
  },
  {
    name: "email",
    render: <Email action="~~replace~~" />,
  },
  {
    name: "email-or-proconnect",
    render: <EmailOrProconnect proconnectUrl="~~replace~~" emailForm={{ action: "~~replace~~" }} />,
  },
  {
    name: "proconnect",
    render: <Proconnect url="~~replace~~" />,
  },
  {
    name: "header",
    render: <Header entity="~~replace~~" serviceName="~~replace~~" logo="~~replace~~" />,
  },
]

export { templates }
