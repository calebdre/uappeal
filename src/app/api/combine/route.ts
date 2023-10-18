import {NextResponse} from "next/server";
import PDFMerger from 'pdf-merger-js';

const PDF_CO_API_KEY = 'caleb.dre@gmail.com_cb34325a57aa6fe60da50c7899d96ac99cb4a56de650e6abb8309b2725975f41c3a7129f'

const checkIfStatusFinished = async (jobId: string) => {
	const checkStatusPayload = {
		jobId
	}

	const resp = await fetch('https://api.pdf.co/v1/job/check', {
		method: 'POST',
		headers: {
			'x-api-key': PDF_CO_API_KEY,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(checkStatusPayload)
	})

	const respJson = await resp.json()
	return respJson.status === 'success'

}
const combinePDFs = async (files: File[]) => {
	const merger = new PDFMerger();
	for (const fs of files) {
		const ab = await fs.arrayBuffer()
		await merger.add(Buffer.from(ab))
	}

	return merger.saveAsBuffer()
}

const uploadToPDFCo = async (buffer: Buffer) => {
	let base64 = buffer.toString('base64')
	base64 = `data:application/pdf;base64,${base64}`
	const fd = new FormData()
	fd.append('file', base64)
	fd.append('x-api-key', PDF_CO_API_KEY)

	const pdfUploadResponse = await fetch('https://api.pdf.co/v1/file/upload/base64', {
		method: 'POST',
		headers: {
			'x-api-key': PDF_CO_API_KEY,
		},
		body: fd
	})

	const pdfUploadJson = await pdfUploadResponse.json()
	console.log(pdfUploadJson)
	return pdfUploadJson.url
}


const addPageNumbers = async (pdfUrl: string) => {
	const addPageNumbersPayload = {
		url: pdfUrl,
		name: 'TOC-ified.pdf',
		async: true,
		inline: true,
		annotations: [
			{
				"text": "Page {{$$PageNumber}} of {{$$PageCount}}",
				"x": 500,
				"y": 10,
				"size": 12,
				"pages": "0-"
			}
		]
	}

	const addPageNumbersResponse = await fetch('https://api.pdf.co/v1/pdf/edit/add', {
		method: 'POST',
		headers: {
			'x-api-key': PDF_CO_API_KEY,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(addPageNumbersPayload)
	})

	const addPageNumbersJson = await addPageNumbersResponse.json()
	console.log(addPageNumbersJson)
	return { url: addPageNumbersJson.url, jobId: addPageNumbersJson.jobId }
}

const execute = async (files: File[]) => {
	// 1. Combine PDFs
	const combinedPDF = await combinePDFs(files)

	// 2. Upload to PDF.co
	const pdfUrl = await uploadToPDFCo(combinedPDF)
	console.log(pdfUrl)

	// 3. Add page numbers
	const { url: numberedPdfUrl, jobId: numberedJobId } = await addPageNumbers(pdfUrl)
	console.log(numberedPdfUrl, numberedJobId)

	// 4. Check if status is finished
	let isFinished = await checkIfStatusFinished(numberedJobId)
	while (!isFinished) {
		console.log('waiting')
		await new Promise(resolve => setTimeout(resolve, 5000))
		isFinished = await checkIfStatusFinished(numberedJobId)
	}

	// 5. Return URL for new PDF
	return numberedPdfUrl
}

export async function POST(req: Request) {
	const data = await req.formData()
	const fss = data.getAll('file') as File[]
	console.log(fss)
	const combinedPDF = await combinePDFs(fss)
	// Create a new response object
	return new NextResponse(combinedPDF, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename=combined.pdf`
		}
	})

}