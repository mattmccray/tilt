import React from "react"
import { renderToStaticMarkup } from 'react-dom/server'
import { Content } from "./database"
import { getContext, setActiveContent } from "./context"


export function renderContent(content: Content, Layout = DefaultLayout) {
  setActiveContent(content)
  const html = renderToStaticMarkup(
    <Layout content={content}>
      <RawHtml html={content.html} />
    </Layout>
  )
  setActiveContent(null)
  return html
}

export function renderComponent<T>(Component: React.ComponentType<T>, props: T, Layout?: React.ComponentType<any>) {
  const ctx = getContext()
  return !!Layout
    ? renderToStaticMarkup(<Layout content={ctx.content}><Component {...ctx} {...props} /></Layout>)
    : renderToStaticMarkup(<Component {...ctx} {...props} />)
}


export const RawHtml = (props: { html: string }) => {
  return (
    <div className="rendered-markdown" dangerouslySetInnerHTML={{ __html: props.html }} />
  )
}

export const DefaultHtmlPage = (props: { children: React.ReactNode }) => {
  const { content, config } = getContext()
  return (
    <html lang="en-us">
      <head>
        <title>{config.title ?? "A Tilt Website"}</title>
      </head>
      <body>
        {props.children}
      </body>
    </html>
  )
}

export const DefaultLayout = (props: { content?: Content, children: React.ReactNode }) => {
  return (
    <DefaultHtmlPage>
      <article className="default-layout">
        {props.children}
      </article>
    </DefaultHtmlPage>
  )
}

export const RedirectPage = ({ to }: { to: string }) => {
  return (
    <main>
      <script dangerouslySetInnerHTML={{ __html: `location.href="${to}"` }}></script>
      <meta httpEquiv="refresh" content={`1; url=${to}`} />
    </main>
  )
}

export function forwardProps<T>(forwardedProps: any, Component: React.ComponentType<T>) {
  return (props: any) => <Component {...forwardedProps} {...props} />
}
