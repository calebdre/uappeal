'use client'
import React, {useCallback, useEffect, useRef, useState} from "react"
import {UploadArea} from "@/app/components/upload-area"
import {WizardSection} from "@/app/components/wizard-section"
import {ProgressBar} from "@/app/components/progress-bar"
import {ArrowUturnLeftIcon} from '@heroicons/react/20/solid'
import {nanoid} from "nanoid"
import {Exhibit, SectionFile, TOCItem, uploadWizardData} from "@/app/types";
import {
	addPageNumbers,
	combineFiles,
	createTableOfContents,
	downloadNewPdf,
	getNumPagesFromPDF,
	getTextFromPDF
} from "@/app/pdf";

export type WizardProps = {}

const useFetchExhibits = () => {
	const [status, setStatus] = useState('idle')
	const [data, setData] = useState<string[]>()
	const fetcher = async (file: File) => {
		setStatus('loading')
		const text = await getTextFromPDF(file)
		const resp = await fetch('/api/exhibits', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text
			})
		})

		if (!resp.ok) {
			setStatus('error')
			return
		}

		const respData = await resp.json() as { exhibits: string[] }
		setData(respData.exhibits)
		setStatus('success')
	}

	return {
		status,
		data,
		fetch: fetcher
	}
}

export const Wizard: React.FC<WizardProps> = () => {
	const [currentStep, setCurrentStep] = useState(0)
	const [files, setFiles] = useState<SectionFile[]>([])
	const [exhibits, setExhibits] = useState<Exhibit[][]>([[]])
	const [fileInputExhibitId, setFileInputExhibitId] = useState<string>()

	const fileInputRef = useRef<HTMLInputElement>(null)

	const currentFile = files[currentStep]
	const currentSection = uploadWizardData[currentStep]
	const currentExhibits = exhibits[currentStep]

	const {
		status: fetchExhibitsStatus,
		data: exhibitNames,
		fetch: fetchExhibits,
	} = useFetchExhibits()


	const isSubmitButtonDisabled = currentSection.hasExhibits
		? currentExhibits?.every(exhibit => exhibit.file === undefined)
		: currentFile?.file === undefined

	useEffect(() => {
		if (exhibitNames && currentExhibits && currentExhibits.length === 0) {
			setExhibits(prev => {
				const newExhibits = [...prev]
				newExhibits[currentStep] = exhibitNames.map(name => ({
					id: nanoid(),
					name
				}))
				return newExhibits
			})
		}
	}, [currentExhibits, currentExhibits.length, currentStep, exhibitNames])

	const onFileUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const onFileDelete = useCallback((index: number) => {
		setFiles(prev => {
			const newFiles = [...prev]
			newFiles.splice(index, 1)
			return newFiles
		})


		setExhibits(prev => {
			const newExhibits = [...prev]
			console.log(prev, currentStep)
			// replace the current exhibits with an empty array
			newExhibits[currentStep] = []
			return newExhibits
		})
	}, [currentStep])

	const onExhibitFileDelete = (exhibitId: string) => {
		setExhibits(prev => {
			const newExhibits = [...prev]
			newExhibits[currentStep] = newExhibits[currentStep].map(exhibit => {
				if (exhibit.id === exhibitId) {
					return {
						...exhibit,
						file: undefined
					}
				}
				return exhibit
			})
			return newExhibits
		})
	}

	const onAddExhibit = useCallback((exhibitId: string) => {
		setFileInputExhibitId(exhibitId)
		onFileUploadClick()
	}, [])

	const onAddFile = useCallback(async (file: File) => {
		if (fileInputExhibitId) {
			// update the exhibit with the file
			const exhibit = currentExhibits.find(exhibit => exhibit.id === fileInputExhibitId)
			if (exhibit) {
				setExhibits(prev => {
					const newExhibits = [...prev]
					const newExhibit = {
						...exhibit,
						file
					}
					newExhibits[currentStep] = newExhibits[currentStep].map(exhibit => {
						if (exhibit.id === newExhibit.id) {
							return newExhibit
						}
						return exhibit
					})
					return newExhibits
				})
			}
			setFileInputExhibitId(undefined)
		} else {
			// add a new file to the regular files
			setFiles(prev => ([
				...(prev || []),
				{
					id: nanoid(),
					file,
				}
			]))

			if (currentSection.hasExhibits) {
				await fetchExhibits(file)
			}
		}
	}, [currentExhibits, currentSection.hasExhibits, currentStep, fetchExhibits, fileInputExhibitId])

	const onFinalSubmit = useCallback(async () => {
		// create a table of contents
		const toc: TOCItem[] = []
		let index = 0
		for (const file of files) {
			const start = toc.length === 0
				? 1
				: toc[toc.length - 1].end + 1
			const end = start + await getNumPagesFromPDF(file.file) - 1
			toc.push({
				label: file.file.name,
				level: 0,
				start,
				end
			})
			if (exhibits[index]) {
				let exhibitStart = end + 1
				for (const exhibit of exhibits[index]) {
					const numpages= await getNumPagesFromPDF(exhibit.file)
					toc.push({
						label: exhibit.name,
						level: 1,
						start: exhibitStart,
						end: exhibitStart + numpages - 1
					})
					exhibitStart += numpages
				}
			}

			index += 1
		}

		const tocFile = createTableOfContents(toc)

		// gather the files to combine
		const fileList: File[] = [tocFile]
		files.forEach(file => {
			fileList.push(file.file)
			exhibits.forEach(exhibits => {
				exhibits.forEach(exhibit => {
					if (exhibit.file) {
						fileList.push(exhibit.file)
					}
				})
			})
		})

		// combine the files
		const combined = await combineFiles(fileList)
		const withPagesNums = await addPageNumbers(combined)
		// const chunks = await chunkPdf(withPagesNums, 200)
		downloadNewPdf(withPagesNums)
	}, [files, exhibits])

	const onSubmit = useCallback(async () => {
		if (currentStep === uploadWizardData.length - 1) {
			onFinalSubmit()
			return
		}
		setCurrentStep(prev => prev + 1)
	}, [currentStep, onFinalSubmit])

	const onGoBack = useCallback(async () => {
		if (currentStep === 0) return
		setCurrentStep(prev => prev - 1)
	}, [currentStep])

	return (
		<div>
			<ProgressBar
				progress={currentStep}
				numSteps={uploadWizardData.length}
			/>

			<div className="divider"/>

			<input
				ref={fileInputRef}
				type="file"
				className="hidden"
				disabled={
					currentFile === undefined
					? false
					: !(currentSection.hasExhibits && currentExhibits.some(exhibit => exhibit.file === undefined))
				}
				onChange={e => {
					if (e.target.files) {
						onAddFile(e.target.files[0])
					}
				}}
			/>

			<UploadArea
				onClick={onFileUploadClick}
				status={
					currentFile === undefined
					? 'file'
					: currentSection.hasExhibits && currentExhibits.some(exhibit => exhibit.file === undefined)
						? 'exhibit'
						: 'disabled'

			}
				isLoading={false}
			/>

			<div
				className={"relative z-10"}
			>
				<WizardSection
					sectionData={uploadWizardData[currentStep]}
					files={currentFile}
					onFileDelete={() => onFileDelete(currentStep)}
					onExhibitDelete={(exhibitId) => onExhibitFileDelete(exhibitId)}
					onTriggerExhibitUpload={(exhibitId) => onAddExhibit(exhibitId)}
					fetchExhibitsStatus={fetchExhibitsStatus}
					exhibits={currentExhibits}
				/>
			</div>

			<div className={"flex items-center"}>

				<button
					className="btn mr-8"
					onClick={onGoBack}
					disabled={currentStep === 0}
				>
					<ArrowUturnLeftIcon className={"h-4"}/>
				</button>
				<button
					className="btn"
					disabled={isSubmitButtonDisabled}
					onClick={onSubmit}
				>
					{currentStep === uploadWizardData.length - 1
						? 'Submit'
						: 'Next'
					}
				</button>
			</div>
		</div>
	)
}


