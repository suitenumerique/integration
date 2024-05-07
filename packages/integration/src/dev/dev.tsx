// main file used for development, used by the default vite config when running npm run dev
import React, { type ReactNode } from "react"
import ReactDOM from "react-dom/client"
import { Link, Route, Switch } from "wouter"
import { navigate } from "wouter/use-browser-location"
import { Homepage } from "../components/Homepage"
import { Gaufre } from "../components/Gaufre"
import { EmailOrProconnect } from "../components/Homepage/EmailOrProconnect"
import { Email } from "../components/Homepage/Email"
import { Proconnect } from "../components/Homepage/Proconnect"
import { StylesFull } from "./StylesFull"
import { StylesStandalone } from "./StylesStandalone"
import { StylesGaufre } from "./StylesGaufre"
import { DsfrHeader } from "./DsfrHeader"
import services from "../../../../website/src/data/services.json"

const serviceHomepage = ({
  id,
  content,
  styles = "standalone",
}: {
  content?: ReactNode
  id: string
  styles: "standalone" | "full"
}) => {
  const service = services.find(({ id: itemId }) => itemId === id)
  if (!service) {
    console.log(`Service ${id} not found, exiting`)
    return null
  }
  const { name, tagline } = service

  const StylesProvider = styles === "standalone" ? StylesStandalone : StylesFull

  return {
    path: `/homepage-template-${id}`,
    label: `Homepage ${name}`,
    component: (
      <StylesProvider>
        <Homepage
          lasuiteApiUrl={import.meta.env.VITE_LASUITE_API_URL}
          entity="Gouvernement"
          tagline={tagline}
          serviceName={`${name} - styles ${styles}`}
          serviceId={id}
          logo={`/logos/${id}.svg`}
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
          {content || <Proconnect url="#" />}
        </Homepage>
      </StylesProvider>
    ),
  }
}

const routes = [
  serviceHomepage({
    id: "resana",
    content: <EmailOrProconnect proconnectUrl="#" />,
    styles: "full",
  }),
  serviceHomepage({
    id: "messagerie",
    content: <Email />,
    styles: "full",
  }),
  serviceHomepage({
    id: "tchap",
    content: <Email />,
    styles: "standalone",
  }),
  serviceHomepage({
    id: "france-transfert",
    content: (
      <div className="fr-p-4w">
        <h2>Contenu personnalisable</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis beatae, quia eius
          voluptatem repudiandae quisquam a magnam obcaecati labore dolor ad vitae, omnis iusto
          deleniti error eveniet maxime! Consectetur, sint?
        </p>
      </div>
    ),
    styles: "standalone",
  }),
  serviceHomepage({
    id: "equipes",
    styles: "standalone",
  }),
  {
    path: "/gaufre",
    label: "Gaufre (header DSFR)",
    component: (
      <StylesStandalone type="gaufre">
        <DsfrHeader actions={[<Gaufre />]} />
        <div className="fr-container fr-p-4w">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac diam a libero posuere
            ornare facilisis in mi. Nullam eu vulputate augue, in auctor nibh. Praesent ac tempus
            dui. Integer vel enim non purus facilisis mattis et vel dolor. Aliquam lacinia elit et
            massa faucibus, at dictum risus ornare. Vivamus ultricies magna et gravida consequat.
            Donec ac odio finibus, lobortis purus vel, consequat purus. Maecenas convallis vel enim
            eu malesuada. Vestibulum elementum maximus massa, a porta erat congue quis. Nunc neque
            quam, euismod et malesuada in, bibendum ac ex. Phasellus felis elit, egestas a convallis
            nec, malesuada a est. Donec ac urna venenatis lorem aliquet rhoncus in accumsan ipsum.
          </p>
          <p>
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi sed augue elementum,
            tempus diam in, euismod purus. Fusce interdum, leo nec blandit eleifend, sapien ligula
            egestas quam, quis aliquam ex turpis ut augue. Nullam a neque consectetur, feugiat eros
            a, lacinia tortor. Proin imperdiet vehicula justo, eget bibendum tortor gravida a.
            Pellentesque sit amet fermentum urna. Ut rutrum eros a ligula dapibus pharetra. In
            porttitor arcu in euismod dictum. Aenean vestibulum mi et dignissim rutrum. Phasellus
            ultrices ex justo, eu tincidunt metus efficitur non. Curabitur ac lorem ornare, aliquet
            neque et, tristique elit. Donec quis turpis sodales, interdum massa fermentum, dictum
            magna.
          </p>
          <p>
            Mauris elit risus, facilisis at magna quis, interdum tempor nulla. Ut ac erat eget
            tellus ultricies semper. Ut at dictum ante. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Nam placerat lacinia eros ac convallis. Sed ultricies lectus et
            pharetra aliquet. Vestibulum feugiat pulvinar fermentum. Vivamus imperdiet dapibus
            ornare. Donec venenatis, lectus id faucibus tempus, sapien urna molestie augue, at
            egestas enim lectus quis nisi.
          </p>
        </div>
      </StylesStandalone>
    ),
  },
  {
    path: "/gaufre-custom",
    label: "Gaufre (header custom)",
    component: (
      <StylesGaufre>
        <div
          style={{
            margin: "2rem auto",
            width: 800,
            border: "1px solid #999",
            padding: "2rem",
            borderRadius: "0.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>À droite</h1>
            <Gaufre />
          </div>
          <div style={{ display: "flex" }}>
            <h1>À gauche</h1>
            <Gaufre />
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac diam a libero posuere
            ornare facilisis in mi. Nullam eu vulputate augue, in auctor nibh. Praesent ac tempus
            dui. Integer vel enim non purus facilisis mattis et vel dolor. Aliquam lacinia elit et
            massa faucibus, at dictum risus ornare. Vivamus ultricies magna et gravida consequat.
            Donec ac odio finibus, lobortis purus vel, consequat purus. Maecenas convallis vel enim
            eu malesuada. Vestibulum elementum maximus massa, a porta erat congue quis. Nunc neque
            quam, euismod et malesuada in, bibendum ac ex. Phasellus felis elit, egestas a convallis
            nec, malesuada a est. Donec ac urna venenatis lorem aliquet rhoncus in accumsan ipsum.
          </p>
          <p>
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi sed augue elementum,
            tempus diam in, euismod purus. Fusce interdum, leo nec blandit eleifend, sapien ligula
            egestas quam, quis aliquam ex turpis ut augue. Nullam a neque consectetur, feugiat eros
            a, lacinia tortor. Proin imperdiet vehicula justo, eget bibendum tortor gravida a.
            Pellentesque sit amet fermentum urna. Ut rutrum eros a ligula dapibus pharetra. In
            porttitor arcu in euismod dictum. Aenean vestibulum mi et dignissim rutrum. Phasellus
            ultrices ex justo, eu tincidunt metus efficitur non. Curabitur ac lorem ornare, aliquet
            neque et, tristique elit. Donec quis turpis sodales, interdum massa fermentum, dictum
            magna.
          </p>
          <p>
            Mauris elit risus, facilisis at magna quis, interdum tempor nulla. Ut ac erat eget
            tellus ultricies semper. Ut at dictum ante. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Nam placerat lacinia eros ac convallis. Sed ultricies lectus et
            pharetra aliquet. Vestibulum feugiat pulvinar fermentum. Vivamus imperdiet dapibus
            ornare. Donec venenatis, lectus id faucibus tempus, sapien urna molestie augue, at
            egestas enim lectus quis nisi.
          </p>
        </div>
      </StylesGaufre>
    ),
  },
]

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <select
      style={{
        position: "fixed",
        opacity: "0.75",
        bottom: 5,
        left: 5,
        zIndex: 10000,
        fontSize: "0.75rem",
        backgroundColor: "pink",
      }}
      onChange={(e) => navigate(e.target.value)}
    >
      {routes.map(
        (route) =>
          route && (
            <option key={route.path} value={route.path}>
              {route.label}
            </option>
          ),
      )}
    </select>
    <Switch>
      <Route path="/">
        <style>{`
          body {
            font-family: sans;
            margin: 1rem auto;
            max-width: 800px;
          }
        `}</style>
        <h1>Appli de développement des templates de La Suite.</h1>
        <ul>
          {routes.map(
            (route) =>
              route && (
                <li key={route.path}>
                  <Link href={route.path}>{route.label}</Link>
                </li>
              ),
          )}
        </ul>
      </Route>
      {routes.map(
        (route) =>
          route && (
            <Route key={route.path} path={route.path}>
              {route.component}
            </Route>
          ),
      )}
      {/* Default route in a switch */}
      <Route>Page introuvable</Route>
    </Switch>
  </React.StrictMode>,
)
