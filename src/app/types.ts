export type Exhibit = {
	id: string
	name: string
	file?: File
}
export type SectionFile = {
	id: string,
	file: File
}
export type TOCItem = {
	label: string
	level: number
	// start page
	start: number
	// end page
	end: number
}
export type SectionData = {
	title: string,
	description: string,
	optional?: boolean
	instruction?: string,
	tag?: string,
	hasExhibits?: boolean
}
export const uploadWizardDataFull: SectionData[] = [
	{
		title: 'Test uploading a document with exhibits',
		description: "Upload a document with exhibits to verify that this functionality works. After uploading, the" +
			" app will load and you should see all the exhibits listed below.",
		hasExhibits: true
	},
	{
		title: 'Copy of Notice of Appeal, with informational statement',
		description: "Notice of Appeal with Informational Statement: This document formally communicates the decision to appeal a court's ruling. It provides basic information about the case, the judgment being appealed, and the grounds for appeal."
	},
	{
		title: 'Copy of the paper appealed from and the underlying decision',
		description: "Copy of the Paper appealed from and the Underlying Decision: This includes a copy of the decision or order that is being appealed. It gives a comprehensive overview of the lower court's rulings and reasoning."
	},
	{
		title: 'Defendant\'s Notice of Motion',
		description: `Defendant Affirmation: This document is a sworn statement by the defendant, laying out their side of the story.`,
		tag: 'Defendant Papers'
	},
	{
		title: 'Defendant\s Affirmation',
		description: `Defendant Affirmation: This document is a sworn statement by the defendant, laying out their side of the story.`,
		tag: 'Defendant Papers'
	},
	{
		title: 'Defendant\'s Memorandum of Law',
		description: `Defendant Memorandum of Law: This document presents the legal arguments and authorities that support the defendant's position.`,
		tag: 'Defendant Papers',
		hasExhibits: true
	},
	{
		description: `Plaintiff Notice of Motion: This is a formal document in which the plaintiff requests the court to make a certain decision or take a certain action.`,
		title: 'Memorandum of Law',
		tag: 'Plaintiff Papers'
	},
	{
		description: `Plaintiff Affirmation: This document is a sworn statement by the plaintiff, laying out their side of the story.`,
		title: 'Notice of Motion',
		tag: 'Plaintiff Papers'
	},
	{
		description: `Plaintiff Memorandum of Law: This document presents the legal arguments and authorities that support the plaintiff's position.`,
		title: 'Affirmation',
		tag: 'Plaintiff Papers',
		hasExhibits: true
	},
	{
		title: 'Transcript of Proceedings',
		description: "Transcript of Argument or Hearing: This is a verbatim record of what was said during court" +
			" proceedings, including arguments made by legal counsel and any decisions or observations made by the judge.",
		optional: true
	},
	{
		title: 'Notice of Settlement of Transcript',
		description: "Notice of Settlement of Transcript: This is a document indicating that parties have agreed upon the accuracy and completeness of a transcript that will be used during an appeal."
	},
	{
		title: 'Affirmation of Compliance',
		description: "Affirmation of Compliance: This is a sworn statement by a party or attorney affirming that they have complied with all relevant procedural requirements in the preparation and filing of appeal documents."
	},
	{
		title: 'Certification Pursuant to CPLR 2105',
		description: "Certification Pursuant to 2105: This is a certification by an attorney, or a party if they're not represented by an attorney, assuring that the briefs, records, and appendixes submitted in an appeal are accurate and complete."
	}
]
export const uploadWizardData = uploadWizardDataFull.slice(0, 5)