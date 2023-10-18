import {TOCItem} from "@/app/types";
import {jsPDF} from "jspdf";
import {PDFDocument, rgb, StandardFonts} from "pdf-lib";

export async function addPageNumbers(file: File) {
	const fileBuffer = await file.arrayBuffer();
	const pdfDoc = await PDFDocument.load(fileBuffer);
	const pages = pdfDoc.getPages();
	const helveticaFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

	for (let i = 0; i < pages.length; i++) {
		if (i === 0) continue
		const page = pages[i];
		const {width} = page.getSize();
		const text = `${i}`;
		const textSize = 15;
		const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
		page.drawText(text, {
			x: width / 2 - textWidth,
			y: 60,
			size: textSize,
			font: helveticaFont,
			color: rgb(0, 0, 0),
		});
	}

	const pdfBytes = await pdfDoc.save();
	return new File([pdfBytes], "output.pdf", {
		type: "application/pdf",
	});
}

/**
 * creates new pdfs from the original where chunksize if the max number of pages per pdf
 * @param file
 * @param chunkSize
 */
export const chunkPdf = async (file: File, chunkSize: number) => {
	const fileBuffer = await file.arrayBuffer();
	const pdfDoc = await PDFDocument.load(fileBuffer);
	const pages = pdfDoc.getPages();
	const numPages = pages.length;

	const pdfs: File[] = []
	for (let i = 0; i < numPages; i += chunkSize) {
		const newPdf = await PDFDocument.create();
		const copiedPages = await newPdf.copyPages(pdfDoc, [i, i + chunkSize - 1]);
		copiedPages.forEach((page) => newPdf.addPage(page));
		const pdfBytes = await newPdf.save();
		pdfs.push(new File([pdfBytes], "output.pdf", {
			type: "application/pdf",
		}))
	}
	return pdfs
}

export function createTableOfContents(tocItems: TOCItem[]) {
	const doc = new jsPDF();

	// Set the title
	doc.setFont('times')
	doc.setFontSize(20);
	const title = 'Table of Contents';
	const titleWidth = doc.getTextWidth(title);

// Calculate the position for the title to be centered
	const titleXPos = (doc.internal.pageSize.getWidth() / 2) - (titleWidth / 2);

	const yPageMargin = 30
	const xPageMargin = 20

// Add the title
	doc.text(title, titleXPos, yPageMargin);
	const titleBottomMargin = 17


	const textItemVerticalMargin = 10
	// Get the width of the document
	const docWidth = doc.internal.pageSize.getWidth() - xPageMargin;
	const dotsBuffer = 1
	const fontSize = 15;

	const pageHeight = doc.internal.pageSize.getHeight() - yPageMargin;
	const tocItemHeight = fontSize + textItemVerticalMargin;
	const maxItemsPerPage = Math.floor((pageHeight - titleBottomMargin - yPageMargin) / tocItemHeight);

	let currentPage = 1;
	let currentItemCount = 0;

	tocItems.forEach((item, index) => {
		if (currentItemCount >= maxItemsPerPage) {
			doc.addPage();
			currentPage++;
			currentItemCount = 0;
		}

		// Calculate the y position based on the index
		const yPos = titleBottomMargin + yPageMargin + (currentItemCount * textItemVerticalMargin);

		// Calculate indentation based on the level
		const xPos = xPageMargin + (item.level * 7);

		// Add the label
		doc.setFontSize(15);
		doc.text(item.label, xPos, yPos);

		// Calculate the width of the label
		const labelWidth = doc.getTextWidth(item.label);

		// Calculate the start position for the dots
		const dotsStartPos = xPos + labelWidth + dotsBuffer;  // +2 for a small space after the label

		const pageNumText = `${item.start}-${item.end}`
		// Calculate the width of the page number
		// set font size for the page number
		doc.setFontSize(10)
		const pageNumWidth = doc.getTextWidth(pageNumText)

		// Calculate the end position for the dots
		const dotsEndPos = docWidth - pageNumWidth - dotsBuffer - 3;  // -10 for a small space before the page number

		// Calculate the number of dots needed
		// set font size for the dots
		doc.setFontSize(10);
		const numberOfDots = Math.floor((dotsEndPos - dotsStartPos) / doc.getTextWidth('.'));

		// Create a string of dots
		const dots = '.'.repeat(numberOfDots);

		// Add the dots
		doc.setFontSize(10);
		doc.text(dots, dotsStartPos, yPos);

		// Add the start page number
		// set font size for the page number
		doc.setFontSize(12)
		doc.text(pageNumText, docWidth - pageNumWidth - 5, yPos);

		currentItemCount++
	});

	const pdfBlob = doc.output('blob');

	// Create a file from the blob
	const pdfFile = new File([pdfBlob], 'table-of-contents.pdf', {type: 'application/pdf'});

	return pdfFile;
}

export const downloadNewPdf = (pdf: File) => {
	// create an object url from the blob
	const url = URL.createObjectURL(pdf)

	// create a link element
	const link = document.createElement('a')
	link.href = url
	link.download = 'Table_of_Contents.pdf'

	// append the link to the body
	document.body.appendChild(link)

	// programmatically click the link to start the download
	link.click()

	// remove the link after downloading
	document.body.removeChild(link)
}
export const getTextFromPDF = async (file: File) => {
	const fileURL = URL.createObjectURL(file)
	const pdf = await pdfjsLib.getDocument(fileURL).promise
	let textContent = ''

	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i)
		const text = await page.getTextContent()
		textContent += text.items.map(item => item.str).join(' ')
	}

	return textContent.replaceAll('--', '').replaceAll("__", "")
}
export const getNumPagesFromPDF = async (file: File) => {
	const fileURL = URL.createObjectURL(file)
	const pdf = await pdfjsLib.getDocument(fileURL).promise
	return pdf.numPages as number
}
export const combineFiles = async (files: File[]) => {
	const formData = new FormData();
	const filesArray = Array.from(files);
	filesArray.forEach((file, i) => {
		formData.append(`file`, file);
	})
	try {
		const response = await fetch('/api/combine', {
			method: 'POST',
			body: formData,
		});
		if (!response.ok) {
			throw new Error('Response is not OK');
		}

		// Create a Blob from the PDF data
		const blob = await response.blob();

		return new File([blob], 'combined.pdf', {type: 'application/pdf'});
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};