import PageHeader from "./PageHeader"

export default function Container({ heading, children, type="section" }) {
  return (
    <section className="my-14 container mx-auto">
      <PageHeader h2={type !== "page"}>
        {heading}
      </PageHeader>
      <hr className="h-px w-1/2 mx-auto bg-gray-300 dark:bg-gray-600 mt-3 mb-8" />
      {children}
    </section>
  )
}
