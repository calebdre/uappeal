import React from "react";
import {motion} from 'framer-motion'

export const ProgressBar: React.FC<{ progress: number, numSteps: number }> = ({progress, numSteps}) => {

	const width = ((progress / numSteps) * 100).toFixed(0) + '%'
	return (
		<div className="w-full overflow-hidden rounded-full bg-gray-200">
			<motion.div
				className=" h-3 rounded-full bg-indigo-600"
				initial={{ width: '100%' }}
				// exit={{ opacity: 0 }}
				animate={{ width }}
				transition={{ duration: 1, type: 'tween', ease: 'easeInOut' }}
			/>
		</div>
	)
}