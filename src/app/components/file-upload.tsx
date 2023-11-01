'use client'
import React, {useCallback, useRef, useState} from 'react';

const FileUpload: React.FC = () => {
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [finalUrl, setFinalUrl] = useState<string>();

	const uploadFile = async (files: File[]) => {
		const formData = new FormData();
		const filesArray = Array.from(files);
		filesArray.forEach((file) => {
			formData.append(`file`, file);
		})

		formData.append('numFiles', filesArray.length.toString())

		try {
			const response = await fetch('/api', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				console.error('not okay', await response.text())
			}

			return await response.json();
		} catch (error) {
			console.error('Error:', error);
			throw error;
		}
	};

	const onFileUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(prev => ([
				...(prev || []),
				...Array.from(e.target.files)
			]))
		}
	};

	const onFileDelete = (objectURL: string) => {
		const newFiles = {...files};
		delete newFiles[objectURL];
		setFiles(newFiles);
	};

	const onSubmit = useCallback(async () => {
		alert(`Submitted Files:\n${JSON.stringify(files)}`);
		const combinedUrl = await uploadFile(files)
		setFinalUrl(combinedUrl)
	}, [files])

	const onCancel = () => {
		setFiles([]);
	};

	return (
		<div className="container mx-auto max-w-screen-lg h-full">
			<input
				ref={fileInputRef}
				type="file"
				multiple
				className="hidden"
				onChange={onFileChange}
			/>
			<button
				className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
				onClick={onFileUploadClick}>Upload a file
			</button>
			<ul id="gallery" className="flex flex-1 flex-wrap mt-6 ">
				{Object.entries(files).map(([objectURL, file]) => (
					<li key={objectURL} className="block p-1 w-1/2 h-24">
						<article
							className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative shadow-sm">
							{/*<img alt="upload preview" src={objectURL} className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />*/}
							<section
								className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
								<h1 className="flex-1">{file.name}</h1>
								<p className="p-1 size text-xs text-gray-700">
									{file.size > 1024
										? file.size > 1048576
											? Math.round(file.size / 1048576) + 'mb'
											: Math.round(file.size / 1024) + 'kb'
										: file.size + 'b'}
								</p>
								<button className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md"
								        onClick={() => onFileDelete(objectURL)}>Delete
								</button>
							</section>
						</article>
					</li>
				))}
			</ul>
			<button
				className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
				onClick={onSubmit}>Upload now
			</button>
			<button className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
			        onClick={onCancel}>Cancel
			</button>

			{finalUrl && (
				<a href={finalUrl.trim()} download={"combined.pdf"} className="block p-1 w-1/2 h-24">
					<article
						className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative shadow-sm">
						{/*<img alt="upload preview" src={objectURL} className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />*/}
						<section
							className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
							<h1 className="flex-1">Combined</h1>
							<p className="p-1 size text-xs text-gray-700">
								click to download
							</p>
						</section>
					</article>
				</a>
			)}
		</div>
	);
};

export default FileUpload;