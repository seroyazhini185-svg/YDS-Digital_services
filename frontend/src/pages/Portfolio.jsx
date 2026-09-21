import { Link } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, ExternalLink, FileSpreadsheet, FileText, ShoppingBag, Share2, TestTube2, Code2 } from 'lucide-react'
import { BUSINESS } from '../config.js'

const portfolioServices = [
  {
    id: 'data-entry',
    icon: FileSpreadsheet,
    title: 'Data Entry & Excel',
    description: 'Accurate spreadsheet, data entry, cleaning and formatting support.',
    demos: [
      {
        title: 'Excel Data Management Demo',
        type: 'Excel',
        preview: '/demos/previews/01-excel-data-management-demo-xlsx.html',
        file: '/demos/01_Excel_Data_Management/Excel_Data_Management_Demo.xlsx',
      },
    ],
  },
  {
    id: 'document-conversion',
    icon: FileText,
    title: 'Typing & Documentation',
    description: 'Professional typing, document conversion and formatting support.',
    demos: [
      {
        title: 'Document Conversion Demo',
        type: 'Document',
        preview: '/demos/previews/02-document-conversion-demo-docx.html',
        file: '/demos/02_Document_Conversion/Document_Conversion_Demo.docx',
      },
    ],
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    title: 'E-commerce & Content',
    description: 'Product catalog preparation, listings, descriptions and content support.',
    demos: [
      {
        title: 'Product Catalog — Excel',
        type: 'Excel',
        preview: '/demos/previews/03-ecommerce-product-catalog-demo-xlsx.html',
        file: '/demos/03_Ecommerce_Product_Catalog/Product_Catalog_Demo.xlsx',
      },
      {
        title: 'Product Catalog — CSV',
        type: 'CSV',
        preview: '/demos/previews/03-ecommerce-product-catalog-demo-csv.html',
        file: '/demos/03_Ecommerce_Product_Catalog/Product_Catalog_Demo.csv',
      },
      {
        title: 'Product Catalog — Document',
        type: 'Document',
        preview: '/demos/previews/03-ecommerce-product-catalog-demo-docx.html',
        file: '/demos/03_Ecommerce_Product_Catalog/Product_Catalog_Demo.docx',
      },
    ],
  },
  {
    id: 'social-media',
    icon: Share2,
    title: 'Social Media',
    description: 'Social content, captions, calendars and customer communication support.',
    demos: [
      {
        title: 'Social Media Content Demo',
        type: 'Document',
        preview: '/demos/previews/04-social-media-content-demo-docx.html',
        file: '/demos/04_Social_Media_Content/Social_Media_Content_Demo.docx',
      },
    ],
  },
  {
    id: 'software-testing',
    icon: TestTube2,
    title: 'Software Testing',
    description: 'Manual website testing, functional checks and clear bug reporting.',
    demos: [
      {
        title: 'Website Testing Demo',
        type: 'Document',
        preview: '/demos/previews/05-software-testing-demo-docx.html',
        file: '/demos/05_Software_Testing/Website_Testing_Demo.docx',
      },
      {
        title: 'Bug Report Demo',
        type: 'Document',
        preview: '/demos/previews/06-bug-report-demo-docx.html',
        file: '/demos/06_Bug_Report/Bug_Report_Demo.docx',
      },
    ],
  },
  {
    id: 'web-development',
    icon: Code2,
    title: 'Web Development',
    description: 'Modern web applications and business websites using practical technologies.',
    demos: [
      {
        title: 'Web Development Demo',
        type: 'Document',
        preview: '/demos/previews/08-web-development-demo-docx.html',
        file: '/demos/08_Web_Development/Web_Development_Demo.docx',
      },
    ],
  },
]

export default function Portfolio() {
  return (
    <div className="page portfolio">
      <section className="section portfolio-intro">
        <h1>Myself</h1>
        <div className="intro-card">
          <div><span>Name</span><strong>{BUSINESS.name}</strong></div>
          <div><span>Business name</span><strong>{BUSINESS.brandFull}</strong></div>
          <div><span>Email</span><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></div>
          <div><span>Phone</span><a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a></div>
          <div><span>WhatsApp</span><a href={`https://wa.me/91${BUSINESS.whatsapp}`} target="_blank" rel="noreferrer">{BUSINESS.whatsapp}</a></div>
          <div><span>Location</span><strong>Madipakkam, Chennai</strong></div>
        </div>
      </section>

      <section className="section section-alt portfolio-services">
        <div className="section-heading">
          <div>
            <span className="portfolio-kicker">SERVICES</span>
            <h2>Services & Related Demo Works</h2>
          </div>
          <BriefcaseBusiness size={30} className="section-heading-icon" />
        </div>

        <div className="portfolio-service-list">
          {portfolioServices.map((service) => {
            const Icon = service.icon
            return (
              <article className="portfolio-service-card" key={service.id}>
                <div className="portfolio-service-top">
                  <div className="portfolio-service-icon"><Icon size={25} /></div>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>

                <div className="related-demos">
                  <div className="related-title">Related demo works</div>
                  <div className="demo-grid">
                    {service.demos.map((demo) => (
                      <div className="demo-card" key={demo.title}>
                        <div>
                          <span className="demo-type">{demo.type}</span>
                          <h4>{demo.title}</h4>
                        </div>
                        <Link to={`/portfolio/demo/${encodeURIComponent(demo.title)}`} state={{ demo }} className="btn btn-primary btn-small">
                          View <ArrowRight size={15} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
