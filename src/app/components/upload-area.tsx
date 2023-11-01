import {AnimatePresence, motion} from "framer-motion"
import React from "react";


export type UploadAreaProps = {
	onClick: () => void
	isLoading: boolean
	status: 'disabled' | 'file' | 'exhibit'
}
export const UploadArea: React.FC<UploadAreaProps> = ({onClick, isLoading, status}) => {
	const enabledClasses = `cursor-pointer hover:bg-slate-100`
	const disabledClasses = `cursor-not-allowed bg-slate-300`
	const disabled = status !== 'file'
	const hoverProps = disabled ? {} : {
			scale: 1.05,
			backgroundColor: '#E2E8F0',
	}

	const text = status === 'disabled'
		? 'Click next to move on'
		: status === 'file'
			? 'Click to browse for a file'
			: 'Click on an exhibit below to upload it'

	return (
		<div className="flex justify-center relative">
			<AnimatePresence>
				{isLoading ? (
					<motion.span
						style={{ width: '50px' }}
						className="absolute bottom-1/2 loading loading-ring"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
				) : (
					<motion.div
						className={
						`px-12 py-12 
						border-slate-300 border-2 border-dotted 
						rounded-lg 
						text-center 
						${disabled ? disabledClasses : enabledClasses} 
						`}
						onClick={onClick}
						whileHover={hoverProps}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<p className={"text-slate-400"}>{text}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}