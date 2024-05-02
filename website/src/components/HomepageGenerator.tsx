import { useEffect, useState } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import services from "@/data/services.json"
import Code from "./Code"
import {
  Homepage,
  HomepageEmail,
  HomepageEmailOrProconnect,
  HomepageProconnect,
} from "@gouvfr-lasuite/integration"
import * as prettier from "prettier/standalone"
import prettierHtml from "prettier/plugins/html"

const defaultFormData = {
  serviceId: "",
  serviceName: "Service",
  tagline: "**Service**, un outil sécurisé <br>pour les agents de l'État",
  entity: "Gouvernement",
  homepageType: "proconnect",
}

const homepageTypes = {
  proconnect: {
    label: "ProConnect uniquement",
    importCode: "HomepageProconnect",
    componentCode: `<HomepageProconnect url="~~replace~~" />`,
    Component: <HomepageProconnect url="~~replace~~" />,
  },
  "email-or-proconnect": {
    label: "E-mail + ProConnect",
    importCode: "HomepageEmailOrProconnect",
    componentCode: `<HomepageEmailOrProconnect proconnectUrl="~~replace~~" emailForm={{ action: "~~replace~~" }} />`,
    Component: (
      <HomepageEmailOrProconnect
        proconnectUrl="~~replace~~"
        emailForm={{ action: "~~replace~~" }}
      />
    ),
  },
  email: {
    label: "E-mail uniquement",
    importCode: "HomepageEmail",
    componentCode: `<HomepageEmail action="~~replace~~" />`,
    Component: <HomepageEmail action="~~replace~~" />,
  },
  custom: {
    label: "Autre",
    importCode: null,
    componentCode: `~~replace~~`,
    Component: null,
  },
}

export default function HomepageGenerator() {
  const [codeData, setCodeData] = useState<any>(defaultFormData)
  const [htmlMarkup, setHtmlMarkup] = useState<string>("")
  useEffect(() => {
    getHTMLMarkup(codeData).then((html) => {
      setHtmlMarkup(html)
    })
  }, [codeData])

  return (
    <div style={{ margin: "1.5rem 0" }}>
      <form
        className="react-form not-content"
        onChange={(e) => {
          const formData = new FormData(e.currentTarget)
          setCodeData({
            ...Object.fromEntries(formData),
            serviceId:
              formData.get("serviceId") && formData.get("serviceId") !== "other"
                ? formData.get("serviceId")
                : undefined,
          })
        }}
      >
        <div className="react-form-input">
          <label htmlFor="serviceId">Service</label>
          <select
            name="serviceId"
            id="serviceId"
            defaultValue={defaultFormData.serviceId}
            onChange={(e) => {
              const serviceId = e.currentTarget.value
              const service = services.find((service) => service.id === serviceId)
              ;(document.querySelector("#tagline") as HTMLInputElement).value = (
                service || defaultFormData
              ).tagline
              ;(document.querySelector("#entity") as HTMLInputElement).value = (
                service || defaultFormData
              ).entity
              ;(document.querySelector("#serviceName") as HTMLInputElement).value = service
                ? service.name
                : defaultFormData.serviceName
              ;(document.querySelector("#homepageType") as HTMLInputElement).value = (
                service || defaultFormData
              ).homepageType
            }}
          >
            <option value="">Choisir votre service pour pré-remplir les champs</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
            <option value="other">Autre…</option>
          </select>
        </div>

        <div className="react-form-input">
          <label htmlFor="serviceName">Nom du service</label>
          <input
            type="text"
            name="serviceName"
            id="serviceName"
            defaultValue={defaultFormData.serviceName}
          />
        </div>

        <input type="hidden" name="entity" id="entity" defaultValue={defaultFormData.entity} />

        <div className="react-form-input">
          <label htmlFor="tagline">
            Phrase d'accroche
            <span>
              Mettre le texte entre ** pour l'écrire en gras, usage de <code>&lt;br&gt;</code>{" "}
              possible
            </span>
          </label>
          <input type="text" name="tagline" id="tagline" defaultValue={defaultFormData.tagline} />
        </div>

        <div className="react-form-input">
          <label htmlFor="homepageType">Type de connexion</label>
          <select name="homepageType" id="homepageType">
            <option value="">Choisir…</option>
            {Object.keys(homepageTypes).map((key) => (
              <option key={key} value={key}>
                {homepageTypes[key].label}
              </option>
            ))}
          </select>
        </div>
      </form>

      {!!codeData && (
        <>
          <div>
            <h2 style={{ marginTop: "1.5em" }}>Code React correspondant</h2>
            <Code language="jsx">{getReactMarkup(codeData)}</Code>
          </div>

          <div>
            <h2 style={{ marginTop: "1.5em" }}>Code HTML correspondant</h2>
            <Code language="html" fixedHeight>
              {htmlMarkup}
            </Code>
          </div>
        </>
      )}
    </div>
  )
}

const getReactMarkup = (codeData: any) => {
  return `import { Homepage${
    codeData.homepageType && homepageTypes[codeData.homepageType].importCode
      ? `, ${homepageTypes[codeData.homepageType].importCode}`
      : ""
  } } from "@gouvfr-lasuite/integration"

export default function MyHomepage() {
  return (
    <Homepage
      lasuiteApiUrl="${import.meta.env.PUBLIC_LASUITE_API_URL}"
      entity="${codeData.entity}"
      tagline="${codeData.tagline}"
      serviceName="${codeData.serviceName}" ${
        !!codeData.serviceId
          ? `
      serviceId="${codeData.serviceId}"`
          : ""
      }
      logo="~~replace~~"
      homepageUrl="/"
      footerOptions={{
        description: "Un service de la Direction interministérielle du numérique",
        sitemapUrl: "~~replace~~",
        a11yUrl: "~~replace~~",
        a11yLevel: "~~replace~~",
        termsUrl: "~~replace~~",
        privacyUrl: "~~replace~~",
      }}
    >
      ${codeData.homepageType ? homepageTypes[codeData.homepageType].componentCode : ""}
    </Homepage>
  )
}`
}

const getHTMLMarkup = (codeData: any) => {
  const Component = (
    <Homepage
      lasuiteApiUrl={import.meta.env.PUBLIC_LASUITE_API_URL}
      entity={codeData.entity}
      tagline={codeData.tagline}
      serviceName={codeData.serviceName}
      serviceId={codeData.serviceId}
      logo={
        codeData.serviceId
          ? `${import.meta.env.PUBLIC_LASUITE_API_URL}/api/logos/v1/${codeData.serviceId}.svg`
          : "~~replace~~"
      }
      homepageUrl="/"
      footerOptions={{
        description: "Un service de la Direction interministérielle du numérique",
        sitemapUrl: "~~replace~~",
        a11yUrl: "~~replace~~",
        a11yLevel: "~~replace~~" as "non compliant",
        termsUrl: "~~replace~~",
        privacyUrl: "~~replace~~",
      }}
    >
      {codeData.homepageType ? homepageTypes[codeData.homepageType].Component : ""}
    </Homepage>
  )
  const markup = renderToStaticMarkup(Component)
  return prettier.format(markup, {
    parser: "html",
    plugins: [prettierHtml],
    printWidth: 100,
    tabWidth: 4,
    bracketSameLine: false,
    htmlWhitespaceSensitivity: "ignore",
  })
}
