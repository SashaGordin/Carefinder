import React, { useState } from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import FileUpload from './FileUpload';
import EditableField from '../menu/EditableField';
import { getStorage, ref, deleteObject } from "firebase/storage";

export default function Profile({ userData, handleUpdate }) {
	const folderPath = `users/${userData.LicenseNumber}`;
	const [error, setError] = useState('');
	const storage = getStorage();

	const handleNewProfilePic = (newFile) => {
		const oldFilePath = userData.profilePicPath;
		handleUpdate({ profilePicPath: newFile[0]?.path }).then(() => {
			deleteFile(oldFilePath);
		});
	}
	const handleNewProfileVid = (newFile) => {
		const oldFilePath = userData.profileVidPath;
		handleUpdate({ profileVidPath: newFile[0]?.path }).then(() => {
			deleteFile(oldFilePath);
		});
	}

	const deleteFile = (filePath) => {
		console.log('deleting file...');
		const storageRef = ref(storage, filePath);
		deleteObject(storageRef).then(() => {
		  console.log("file deleted");
		}).catch((error) => {
		  console.log(error);
		});
	}

	const validateLink = (newValue) => {
		if (!newValue || isValidUrl(newValue)) {
			handleUpdate({ CalendlyLink: newValue })
			setError('');
		}
		else
			setError('Please enter a valid URL')
	}
	const isValidUrl = urlString => {
		var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
			'(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
		return !!urlPattern.test(urlString);
	}


	return (

		<>

			<Card	>
				<Card.Body>
					<Card.Title><h2>Profile</h2></Card.Title>
					<FileUpload controlId="profilePhotoUpload" handleNewFiles={handleNewProfilePic} folderPath={folderPath} uploadLabel="Upload profile photo (Headshot)" uploadType="Photo" />
					{userData.profilePicPath && <Image style={{height: '150px'}} src={userData.profilePicPath} />}	
					<hr />
					<FileUpload controlId="profileVidUpload" handleNewFiles={handleNewProfileVid} uploadLabel="Upload introduction video" uploadType="Video" />
					{userData.profileVidPath &&
						<video style={{height: '150px'}} controls>
							<source src={userData.profileVidPath} />
						</video>}
					<EditableField title="Calendly Link" value={userData.CalendlyLink || ''} onChange={(newValue) => validateLink(newValue)} />
					<div className="text-danger">{error}</div>

				</Card.Body>
			</Card>
		</>

	);
}