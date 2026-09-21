import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'

// Maps a file extension to the Office "open in desktop app" protocol prefix.
// Requires the site to be served over a public https:// domain (Word/Excel
// need a fully-qualified, byte-range-capable URL) and the matching Office
// app installed on the visitor's device.
function officeSchemeFor(fileUrl) {
  const ext = fileUrl.split('.').pop().toLowerCase()
  if (ext === 'docx' || ext === 'doc') return 'ms-word:ofe|u|'
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return 'ms-excel:ofe|u|'
  return null
}

function openDemoFile(fileUrl) {
  const absoluteUrl = new URL(fileUrl, window.location.origin).href
  const scheme = officeSchemeFor(fileUrl)

  if (!scheme) {
    window.open(absoluteUrl, '_blank', 'noopener')
    return
  }

  // Try to hand off to the desktop app (Word/Excel). If the browser loses
  // focus shortly after, the app took over and we skip the browser fallback.
  let handedOff = false
  const onBlur = () => { handedOff = true }
  window.addEventListener('blur', onBlur)
  window.location.href = scheme + absoluteUrl

  setTimeout(() => {
    window.removeEventListener('blur', onBlur)
    if (!handedOff) {
      // No app picked it up (not installed, or not a supported browser) —
      // fall back to opening the raw file in a new browser tab.
      window.open(absoluteUrl, '_blank', 'noopener')
    }
  }, 1200)
}

export default function DemoViewer() {
  const location = useLocation()
  const { demoTitle } = useParams()
  const routeTitle = decodeURIComponent(demoTitle || '')
  const demo = location.state?.demo || ({
    'Excel Data Management Demo': { title: 'Excel Data Management Demo', type: 'Excel', preview: '/demos/previews/01-excel-data-management-demo-xlsx.html', file: '/demos/01_Excel_Data_Management/Excel_Data_Management_Demo.xlsx' },
    'Document Conversion Demo': { title: 'Document Conversion Demo', type: 'Document', preview: '/demos/previews/02-document-conversion-demo-docx.html', file: '/demos/02_Document_Conversion/Document_Conversion_Demo.docx' },
    'Product Catalog — Excel': { title: 'Product Catalog — Excel', type: 'Excel', preview: '/demos/previews/03-ecommerce-product-catalog-demo-xlsx.html', file: '/demos/03_Ecommerce_Product_Catalog/Product_Catalog_Demo.xlsx' },
    'Product Catalog — CSV': { title: 'Product Catalog — CSV', type: 'CSV', preview: '/demos/previews/03-ecommerce-product-catalog-demo-csv.html', file: '/demos/03_Ecommerce_Product_Catalog/Product_Catalog_Demo.csv' },
    'Product Catalog — Document': { title: 'Product Catalog — Document', type: 'Document', preview: '/demos/previews/03-ecommerce-product-catalog-demo-docx.html', file: '/demos/03_Ecommerce_Product_Catalog/Product_Catalog_Demo.docx' },
    'Social Media Content Demo': { title: 'Social Media Content Demo', type: 'Document', preview: '/demos/previews/04-social-media-content-demo-docx.html', file: '/demos/04_Social_Media_Content/Social_Media_Content_Demo.docx' },
    'Website Testing Demo': { title: 'Website Testing Demo', type: 'Document', preview: '/demos/previews/05-software-testing-demo-docx.html', file: '/demos/05_Software_Testing/Website_Testing_Demo.docx' },
    'Bug Report Demo': { title: 'Bug Report Demo', type: 'Document', preview: '/demos/previews/06-bug-report-demo-docx.html', file: '/demos/06_Bug_Report/Bug_Report_Demo.docx' },
    'Web Development Demo': { title: 'Web Development Demo', type: 'Document', preview: '/demos/previews/08-web-development-demo-docx.html', file: '/demos/08_Web_Development/Web_Development_Demo.docx' },
  })[routeTitle]

  if (!demo) {
    return (
      <div className="page">
        <section className="section empty-demo">
          <h1>Demo not found</h1>
          <p>Please open the demo from the Portfolio page.</p>
          <Link to="/portfolio" className="btn btn-primary">Back to Portfolio</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="page demo-viewer-page">
      <section className="section demo-viewer">
        <div className="demo-viewer-head">
          <div>
            <Link to="/portfolio" className="back-link"><ArrowLeft size={17} /> Back to Portfolio</Link>
            <span className="demo-type">{demo.type}</span>
            <h1>{routeTitle}</h1>
            <p>Demo preview shown directly inside the website.</p>
          </div>
          <div className="demo-viewer-actions">
            <button type="button" className="btn btn-outline" onClick={() => openDemoFile(demo.file)}>
              <ExternalLink size={16} /> Open file
            </button>
            <a className="btn btn-primary" href={demo.file} download>
              <Download size={16} /> Download
            </a>
          </div>
        </div>

        <div className="demo-frame-wrap">
          <iframe title={demo.title} src={demo.preview} className="demo-frame" />
        </div>
      </section>
    </div>
  )
}
