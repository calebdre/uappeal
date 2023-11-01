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
						<div className={""}>

							<p className={"text-slate-500"}>
								{files.file.name}

							</p>
							{fetchExhibitsStatus === 'loading' && (
								<div className={" flex"}>
									<span className={"text-sm text-grey-200"}>Getting exhibits...</span>
									<svg
										className="animate-spin ml-4 h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="3"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								</div>
							)}
						</div>

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
							<>
							<p className={"text-slate-500"}>{exhibit.file.name}</p>
								<span
									className="mt-4 btn-error btn btn-sm text-white"
									onClick={() => onExhibitDelete(exhibit.id)}
								>
							Delete
						</span>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	)
}