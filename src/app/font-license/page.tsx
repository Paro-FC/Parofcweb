import { readFileSync } from 'fs'
import { join } from 'path'

export default function FontLicensePage() {
  // Read the FFL.txt file
  const filePath = join(process.cwd(), 'public', 'font-license', 'FFL.txt')
  let licenseText = ''
  
  try {
    licenseText = readFileSync(filePath, 'utf-8')
  } catch (error) {
    licenseText = 'Font license file not found.'
  }

  // Split text into lines for better formatting
  const lines = licenseText.split('\n')

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Font License</h1>
        <p className="text-gray-600 mb-8">Free Font - End User License Agreement (FF EULA)</p>
        
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap font-sans text-sm md:text-base text-gray-700 leading-relaxed">
              {lines.map((line, index) => {
                // Style headers and important sections
                if (line.trim().startsWith('---') || line.trim() === '') {
                  return <div key={index} className="my-4">{line}</div>
                }
                if (line.match(/^\d+\./)) {
                  // Section numbers (01., 02., etc.)
                  return (
                    <h2 key={index} className="text-lg font-bold text-gray-900 mt-8 mb-4">
                      {line}
                    </h2>
                  )
                }
                if (line.trim().endsWith(':') && line.length < 50) {
                  // Definitions and headers
                  return (
                    <h3 key={index} className="text-base font-semibold text-gray-900 mt-6 mb-2">
                      {line}
                    </h3>
                  )
                }
                return (
                  <p key={index} className="mb-3">
                    {line}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

