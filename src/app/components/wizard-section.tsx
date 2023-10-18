import React from "react";
import {Exhibit, SectionData, SectionFile} from "@/app/types";

export type WizardSectionProps = {
	sectionData: SectionData
	files: SectionFile
	onFileDelete: () => void
	onTriggerExhibitUpload: (id: string) => void
	onExhibitDelete: (id: string) => void
	fetchExhibitsStatus?: string
	exhibits: Exhibit[]
}

export const WizardSection: React.FC<WizardSectionProps> = ({
    sectionData,
    files,
    onFileDelete,
    onExhibitDelete,
	onTriggerExhibitUpload,
	fetchExhibitsStatus,
	exhibits
}) => {
	return (
		<div
			className={
				`flex flex-col 
				 w-full
				 shrink-0`
			}
		>
			<div className="border-b border-gray-200 pb-5 mt-4">
				<h3 className="text-base font-semibold leading-6 text-gray-900">{sectionData.title}</h3>
				<p className="mt-2 max-w-4xl text-sm text-gray-500">
					{sectionData.description}
				</p>
				{fetchExhibitsStatus === 'loading' && (
					<p className={"text-sm text-gray-500"}>Loading exhibits...</p>
				)}
			</div>

			<div className={"mb-4 relative"}>
				{files && files.file && (
					<div
						className={"bg-slate-100 px-4 py-2"}
					>
						<p className={"text-slate-500"}>{files.file.name}</p>

						<span
							className="mt-4 btn-error btn btn-sm text-white"
							onClick={onFileDelete}
						>
							Delete
						</span>
					</div>
				)}

				{/* https://tailwindflex.com/anonymous/hierarchy-list */}
				{exhibits && exhibits.map(exhibit => (
					<div
						key={exhibit.id}
						className={
						`bg-slate-100 px-16 py-2 hover:bg-slate-200 
						${exhibit.file 
							? '' 
							: 'cursor-pointer'
						}`}
						onClick={() => !exhibit.file && onTriggerExhibitUpload(exhibit.id)}
					>
						<p className={"text-slate-500"}>{exhibit.name}</p>

						{exhibit.file && (
							<p className={"text-slate-500"}>{exhibit.file.name}</p>
						)}

						<span
							className="mt-4 btn-error btn btn-sm text-white"
							onClick={() => onExhibitDelete(exhibit.id)}
						>
							Delete
						</span>
					</div>
				))}
			</div>
		</div>
	)
}